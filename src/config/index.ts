import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  uploadDir: path.join(__dirname, '../../uploads'),
  compressedDir: path.join(__dirname, '../../compressed'),
  env: {
    WALLET_CREDS: process.env.WALLET_CREDS || '',
    CERE_BUCKET_ID: process.env.CERE_BUCKET_ID || '',
    CERE_CLUSTER_ID: process.env.CERE_CLUSTER_ID || '',
    CERE_FOLDER: process.env.CERE_FOLDER || '',
  },
};
