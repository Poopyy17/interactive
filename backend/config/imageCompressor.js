import sharp from 'sharp';

const imageCompressor = async (req, res, next) => {
  try {
    // Skip if no files uploaded
    if (!req.file && (!req.files || req.files.length === 0)) {
      return next();
    }

    // Handle array of files (from multer's upload.array())
    if (req.files && req.files.length > 0) {
      await Promise.all(
        req.files.map(async (file) => {
          // Only process image files
          if (file.mimetype.startsWith('image/')) {
            const compressedFile = await compressImage(file);
            Object.assign(file, compressedFile);
          }
        })
      );
    }
    // Handle single file (from multer's upload.single())
    else if (req.file && req.file.mimetype.startsWith('image/')) {
      const compressedFile = await compressImage(req.file);
      Object.assign(req.file, compressedFile);
    }

    next();
  } catch (error) {
    console.error('Image compression error:', error);
    next(error);
  }
};

const compressImage = async (file) => {
  try {
    let sharpInstance = sharp(file.buffer);

    // Get image metadata
    const metadata = await sharpInstance.metadata();

    // Define compression settings based on image size
    const width = metadata.width;
    let quality = 80; // Default quality
    let resizeOptions = {};

    // Larger compression for larger images
    if (width > 2000) {
      quality = 70;
      resizeOptions = { width: 2000 };
    } else if (width > 1000) {
      quality = 75;
      // No resize needed
    }

    // Apply resize if needed
    if (resizeOptions.width) {
      sharpInstance = sharpInstance.resize(resizeOptions);
    }

    // Apply appropriate compression based on format
    let outputBuffer;
    if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
      outputBuffer = await sharpInstance.jpeg({ quality }).toBuffer();
    } else if (metadata.format === 'png') {
      outputBuffer = await sharpInstance.png({ quality }).toBuffer();
    } else if (metadata.format === 'gif') {
      // For GIFs we just pass through as sharp doesn't handle animated GIFs well
      outputBuffer = file.buffer;
    } else {
      // For other formats, convert to JPEG
      outputBuffer = await sharpInstance.jpeg({ quality }).toBuffer();
    }

    console.log(
      `Compressed image: ${file.originalname} - Size reduced from ${file.size} to ${outputBuffer.length} bytes`
    );

    // Create a new file object with the compressed buffer
    return {
      ...file,
      buffer: outputBuffer,
      size: outputBuffer.length,
    };
  } catch (error) {
    console.error(`Error compressing image ${file.originalname}:`, error);
    // Return original file if compression fails
    return file;
  }
};

export default imageCompressor;
