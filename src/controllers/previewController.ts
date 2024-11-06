import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { config } from '../config';
import { convertHEICtoPNG } from '../services/imageService';
import multer from 'multer';

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: config.uploadDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

export const generatePreview = async (req: Request, res: Response) => {
  try {
    // Handle file upload using multer
    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({ error: 'File upload failed' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const previewId = crypto.randomBytes(16).toString('hex');
      const previewPath = path.join(
        config.compressedDir,
        `preview_${previewId}.png`
      );

      try {
        // Convert HEIC to PNG using our existing service
        const success = await convertHEICtoPNG(req.file.path, previewPath);

        // Clean up the uploaded file
        await fs.unlink(req.file.path).catch(console.error);

        if (!success) {
          return res.status(500).json({ error: 'Failed to convert image' });
        }

        // Return the preview URL
        res.json({
          url: `/compressed/preview_${previewId}.png`,
          previewId,
        });
      } catch (error) {
        console.error('Preview generation error:', error);
        // Clean up any files if they exist
        await Promise.all([
          fs.unlink(req.file.path).catch(() => {}),
          fs.unlink(previewPath).catch(() => {}),
        ]);

        res.status(500).json({
          error: 'Failed to generate preview',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });
  } catch (error) {
    console.error('Preview handler error:', error);
    res.status(500).json({
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
