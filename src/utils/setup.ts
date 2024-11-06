import fs from 'fs';
import path from 'path';
import { config } from '../config';

export const setupFolders = () => {
  const folders = [
    config.uploadDir,
    config.compressedDir
  ];

  folders.forEach(folder => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
      console.log(`Created directory: ${folder}`);
    }
  });
}; 