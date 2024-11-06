import { Router } from 'express';
import { uploadFile } from '../controllers/uploadController';
import { generatePreview } from '../controllers/previewController';

const uploadRouter = Router();

uploadRouter.post('/upload', uploadFile);
uploadRouter.post('/preview', generatePreview);

export { uploadRouter };
