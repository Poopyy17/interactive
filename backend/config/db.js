import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Use DATABASE_URL if available (for production/Vercel), otherwise use individual params
export const pool = new pg.Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false, // Required for some Postgres providers
        },
      }
    : {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
      }
);
