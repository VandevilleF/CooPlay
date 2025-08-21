import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  dbUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL
};
