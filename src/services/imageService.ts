import heicConvert from 'heic-convert';
import fs from 'fs/promises';

export const convertHEICtoPNG = async (
  inputPath: string,
  outputPath: string,
): Promise<boolean> => {
  try {
    const inputBuffer = await fs.readFile(inputPath);
    const outputBuffer = await heicConvert({
      buffer: inputBuffer,
      format: 'PNG',
      quality: 1,
    });

    await fs.writeFile(outputPath, Buffer.from(outputBuffer));
    return true;
  } catch (error) {
    console.error('Error converting HEIC to PNG:', error);
    return false;
  }
};
