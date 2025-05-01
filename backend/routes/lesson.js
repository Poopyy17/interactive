import express from 'express';
import { pool } from '../config/db.js';
import multer from 'multer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from 'cloudinary';
import { promisify } from 'util';
import dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config();
const lessonRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Use memory storage for multer to get buffer
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = {
      'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        'powerpoint',
      'image/jpeg': 'image',
      'image/png': 'image',
      'video/mp4': 'video',
      'video/webm': 'video',
    };

    if (allowedTypes[file.mimetype]) {
      file.contentType = allowedTypes[file.mimetype];
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

const uploadToCloudinary = async (file) => {
  try {
    // Create a promise-based upload stream
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'interactive_lessons',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // Create a readable stream from buffer and pipe to uploadStream
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    });

    // Wait for upload to complete
    const uploadResult = await uploadPromise;

    // Return the Cloudinary URL and public ID
    return {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// fetch all lessons for a specific quarter
lessonRouter.get('/:quarterId/lessons', async (req, res) => {
  const { quarterId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM lessons WHERE quarter_id = $1 ORDER BY lesson_number ASC',
      [quarterId]
    );

    res.json({
      success: true,
      lessons: result.rows,
    });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lessons',
    });
  }
});

// fetch specific lesson details according to ID
lessonRouter.get('/:lessonId', async (req, res) => {
  const { lessonId } = req.params;

  try {
    const result = await pool.query('SELECT * FROM lessons WHERE id = $1', [
      lessonId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    res.json({
      success: true,
      lesson: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching lesson details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lesson details',
    });
  }
});

lessonRouter.get('/:lessonId/presentations', async (req, res) => {
  const { lessonId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM presentations WHERE lesson_id = $1 ORDER BY display_order ASC',
      [lessonId]
    );

    res.json({
      success: true,
      presentations: result.rows,
    });
  } catch (error) {
    console.error('Error fetching presentations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch presentations',
    });
  }
});

// POST create a new lesson for a specific quarter
lessonRouter.post('/:quarterId/lessons', async (req, res) => {
  const { quarterId } = req.params;
  const { title } = req.body;
  const userId = 1; // Hardcoded for now, should come from auth token

  try {
    const result = await pool.query(
      'INSERT INTO lessons (quarter_id, title, created_by) VALUES ($1, $2, $3) RETURNING *',
      [quarterId, title, userId]
    );

    res.json({
      success: true,
      lesson: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create lesson',
    });
  }
});

// POST upload presentations for a lesson
lessonRouter.post(
  '/:lessonId/presentations',
  upload.array('files'),
  async (req, res) => {
    const { lessonId } = req.params;
    const files = req.files;
    const { titles, descriptions } = req.body;
    const userId = 1; // Hardcoded for now, should come from auth token

    try {
      const presentations = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Get the next display order
        const orderResult = await pool.query(
          'SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM presentations WHERE lesson_id = $1',
          [lessonId]
        );
        const displayOrder = orderResult.rows[0].next_order;

        // Get title and description if available
        let title = null;
        let description = null;

        if (titles && Array.isArray(titles) && titles[i]) {
          title = titles[i];
        }

        if (descriptions && Array.isArray(descriptions) && descriptions[i]) {
          description = descriptions[i];
        }

        // Upload file to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(file);

        // Insert the presentation with Cloudinary URL
        const result = await pool.query(
          `INSERT INTO presentations 
           (lesson_id, content_type, file_url, cloudinary_id, title, description, display_order, created_by) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
           RETURNING *`,
          [
            lessonId,
            file.contentType,
            cloudinaryResult.url,
            cloudinaryResult.publicId,
            title,
            description,
            displayOrder,
            userId,
          ]
        );

        presentations.push(result.rows[0]);
      }

      res.json({
        success: true,
        presentations,
      });
    } catch (error) {
      console.error('Error uploading presentations:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to upload presentations',
      });
    }
  }
);

// POST upload link for a lesson
lessonRouter.post('/:lessonId/presentations/link', async (req, res) => {
  const { lessonId } = req.params;
  const { title, url, description } = req.body;
  const userId = 1; // Hardcoded for now, should come from auth token

  try {
    // Validate that URL is included
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required',
      });
    }

    // Get the next display order
    const orderResult = await pool.query(
      'SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM presentations WHERE lesson_id = $1',
      [lessonId]
    );
    const displayOrder = orderResult.rows[0].next_order;

    // Insert the link as a presentation
    const result = await pool.query(
      `INSERT INTO presentations 
       (lesson_id, content_type, file_url, title, description, display_order, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        lessonId,
        'link',
        url, // Store the URL directly in the file_url field
        title || 'Online Presentation',
        description,
        displayOrder,
        userId,
      ]
    );

    res.json({
      success: true,
      presentations: [result.rows[0]],
    });
  } catch (error) {
    console.error('Error adding presentation link:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add presentation link',
    });
  }
});

// Update lesson title
lessonRouter.put('/:lessonId', async (req, res) => {
  const { lessonId } = req.params;
  const { title } = req.body;

  try {
    const result = await pool.query(
      'UPDATE lessons SET title = $1 WHERE id = $2 RETURNING *',
      [title, lessonId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    res.json({
      success: true,
      lesson: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update lesson',
    });
  }
});

// Delete lesson and all its content
lessonRouter.delete('/:lessonId', async (req, res) => {
  const { lessonId } = req.params;

  try {
    // First get paths to all presentation files to delete them
    const presentationsResult = await pool.query(
      'SELECT file_url, cloudinary_id FROM presentations WHERE lesson_id = $1',
      [lessonId]
    );

    // Delete the lesson (cascade will delete presentations, games, etc.)
    const result = await pool.query(
      'DELETE FROM lessons WHERE id = $1 RETURNING *',
      [lessonId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    // Delete associated files from Cloudinary
    for (const presentation of presentationsResult.rows) {
      if (presentation.cloudinary_id) {
        try {
          await cloudinary.v2.uploader.destroy(presentation.cloudinary_id);
        } catch (err) {
          console.error(
            `Failed to delete file from Cloudinary: ${presentation.cloudinary_id}`,
            err
          );
        }
      }
    }

    res.json({
      success: true,
      message: 'Lesson and all associated content deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete lesson',
    });
  }
});

// DELETE a specific presentation/upload
lessonRouter.delete('/presentations/:presentationId', async (req, res) => {
  const { presentationId } = req.params;

  try {
    // First get the file info to delete from Cloudinary
    const fileResult = await pool.query(
      'SELECT file_url, cloudinary_id FROM presentations WHERE id = $1',
      [presentationId]
    );

    if (fileResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Presentation not found',
      });
    }

    const cloudinaryId = fileResult.rows[0].cloudinary_id;

    // Delete the presentation from the database
    const result = await pool.query(
      'DELETE FROM presentations WHERE id = $1 RETURNING *',
      [presentationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Presentation not found',
      });
    }

    // Delete the file from Cloudinary if it exists
    if (cloudinaryId) {
      try {
        await cloudinary.v2.uploader.destroy(cloudinaryId);
      } catch (err) {
        console.error(
          `Failed to delete file from Cloudinary: ${cloudinaryId}`,
          err
        );
      }
    }

    // Re-order remaining presentations if needed
    const presentationData = result.rows[0];
    await pool.query(
      `UPDATE presentations 
       SET display_order = display_order - 1 
       WHERE lesson_id = $1 
         AND display_order > $2`,
      [presentationData.lesson_id, presentationData.display_order]
    );

    res.json({
      success: true,
      message: 'Presentation deleted successfully',
      presentation: result.rows[0],
    });
  } catch (error) {
    console.error('Error deleting presentation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete presentation',
    });
  }
});

export default lessonRouter;
