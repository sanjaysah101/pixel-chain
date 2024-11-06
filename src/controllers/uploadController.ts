import { Request, Response } from 'express';
import { convertHEICtoPNG } from '../services/imageService';
import { initStorageClient } from '../services/storageService';
import path from 'path';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import { File, FileUri } from '@cere-ddc-sdk/ddc-client';
import { config } from '../config';
import { error } from 'console';

export const uploadFile = async (req: Request, res: Response) => {
  try {
    let fileName = req.headers['file-name'] as string;
    if (!fileName) {
      return res.status(400).send('No file name provided.');
    }

    const fileExt = path.extname(fileName).toLowerCase();
    if (fileExt !== '.heic') {
      return res.status(400).send('Must be heic file.');
    }

    fileName = `${+new Date()}-${fileName}`;
    const uploadedFilePath = path.join(config.uploadDir, fileName);
    const writeStream = createWriteStream(uploadedFilePath);

    writeStream.write(req.body);
    writeStream.end();

    writeStream.on('finish', async () => {
      const pngOutputPath = path.format({
        dir: config.compressedDir,
        name: path.basename(uploadedFilePath, fileExt),
        ext: '.png',
      });

      try {
        const compressed = await convertHEICtoPNG(
          uploadedFilePath,
          pngOutputPath
        );
        if (!compressed) {
          return res.status(500).json({
            error: 'Error converting HEIC to PNG',
          });
        }

        const fileBuffer = await fs.readFile(pngOutputPath);
        const image = new File(fileBuffer, {
          size: fileBuffer.byteLength,
        });

        const clientInstance = await initStorageClient();

        if (!clientInstance) {
          throw new Error('Storage client not initialized');
        }

        const bucketId = BigInt(config.env.CERE_BUCKET_ID);

        try {
          await clientInstance.getBucket(bucketId);
        } catch (error) {
          throw new Error(`Bucket access denied: ${(error as Error).message}`);
        }

        const result = await clientInstance.store(bucketId, image);

        await fs.rm(uploadedFilePath);
        await fs.rm(pngOutputPath);

        console.log('object');

        return res.json({
          message: 'File uploaded successfully!',
          filePath: result.name,
          cid: result.cid,
          url: `https://cdn.dragon.cere.network/${result.bucketId}/${result.cid}`,
        });
      } catch (e) {
        console.error('Storage error:', e);
        return res.status(403).json({
          error: (e as Error).message || 'Storage permission denied',
          details: 'Please verify your bucket ID and wallet credentials',
        });
      }
    });

    writeStream.on('error', () => {
      console.log({ error });
      return res.status(500).send('File upload failed.');
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send('Server error during file upload.');
  }
};
