import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/db.js';
import { createTables } from './config/tables.js';
import authRouter from './routes/auth.js';
import quarterRouter from './routes/quarter.js';
import lessonRouter from './routes/lesson.js';
import gameRouter from './routes/game.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 image uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Mount routes
app.use('/api/auth', authRouter);
app.use('/api/quarters', quarterRouter);
app.use('/api/lessons', lessonRouter);
app.use('/api/game', gameRouter);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME
      ? 'configured'
      : 'not configured',
  });
});

// Define port
const PORT = process.env.PORT || 5000;

// Initialize database - for non-serverless environments
const initDatabase = async () => {
  try {
    // Test database connection and create tables
    const client = await pool.connect();
    console.log('Successfully connected to database');
    client.release();

    // Create tables in development or explicitly requested
    if (
      process.env.NODE_ENV !== 'production' ||
      process.env.INIT_DB === 'true'
    ) {
      await createTables();
      console.log('Database tables initialized');
    }
  } catch (err) {
    console.error('Error during database initialization:', err.stack);
  }
};

// Only run server.listen in non-Vercel environments
if (!process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await initDatabase();
  });
} else {
  // In Vercel, just test the database connection during cold start
  // Don't create tables automatically in production unless explicitly requested
  initDatabase().catch((err) => {
    console.error(
      'Database initialization error in serverless environment:',
      err
    );
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error:
      process.env.NODE_ENV === 'development' ? err.message : 'Server error',
  });
});

// For Vercel serverless deployment
export default app;
