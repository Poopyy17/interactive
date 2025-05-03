import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

const videoCompressor = async (req, res, next) => {
  try {
    // Skip if no files uploaded
    if (!req.file && (!req.files || req.files.length === 0)) {
      return next();
    }

    // Handle array of files (from multer's upload.array())
    if (req.files && req.files.length > 0) {
      await Promise.all(
        req.files.map(async (file) => {
          // Only process video files
          if (file.mimetype.startsWith('video/')) {
            // Store original size for logging
            file.originalSize = file.size;
            const compressedFile = await compressVideo(file);
            Object.assign(file, compressedFile);
            console.log(
              `Video compressed: ${file.originalname} - Size reduced from ${file.originalSize} to ${file.size} bytes`
            );
          }
        })
      );
    }
    // Handle single file (from multer's upload.single())
    else if (req.file && req.file.mimetype.startsWith('video/')) {
      req.file.originalSize = req.file.size;
      const compressedFile = await compressVideo(req.file);
      Object.assign(req.file, compressedFile);
      console.log(
        `Video compressed: ${req.file.originalname} - Size reduced from ${req.file.originalSize} to ${req.file.size} bytes`
      );
    }

    next();
  } catch (error) {
    console.error('Video compression error:', error);
    // Don't fail the request on compression error, just log and continue
    next();
  }
};

const compressVideo = async (file) => {
  try {
    // Create temp files for input and output
    const tempDir = os.tmpdir();
    const inputPath = path.join(tempDir, `input-${Date.now()}.mp4`);
    const outputPath = path.join(tempDir, `output-${Date.now()}.mp4`);

    // Write buffer to input file
    await fs.writeFile(inputPath, file.buffer);

    // Compress video with ffmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          '-c:v libx264', // Use H.264 codec
          '-crf 28', // Constant Rate Factor (higher = lower quality)
          '-preset faster', // Encoding speed/compression ratio
          '-c:a aac', // Audio codec
          '-b:a 128k', // Audio bitrate
          '-movflags +faststart', // Optimize for web playback
        ])
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });

    // Read the compressed video back into a buffer
    const outputBuffer = await fs.readFile(outputPath);

    // Clean up temp files
    await fs
      .unlink(inputPath)
      .catch((err) => console.error('Error removing temp input file:', err));
    await fs
      .unlink(outputPath)
      .catch((err) => console.error('Error removing temp output file:', err));

    // Return updated file object
    return {
      ...file,
      buffer: outputBuffer,
      size: outputBuffer.length,
    };
  } catch (error) {
    console.error('Video compression error:', error);
    // Return original file if compression fails
    return file;
  }
};

export default videoCompressor;
