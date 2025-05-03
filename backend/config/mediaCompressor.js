import imageCompressor from './imageCompressor.js';
import videoCompressor from './videoCompressor.js';

const mediaCompressor = async (req, res, next) => {
  try {
    // First apply image compression
    await new Promise((resolve) => {
      imageCompressor(req, res, () => {
        resolve();
      });
    });

    // Then apply video compression
    await new Promise((resolve) => {
      videoCompressor(req, res, () => {
        resolve();
      });
    });

    // Continue with the request
    next();
  } catch (error) {
    console.error('Media compression error:', error);
    next();
  }
};

export default mediaCompressor;
