import { Router } from 'express';
import { uploadFile } from '../controllers/uploadController';

const uploadRouter = Router();

uploadRouter.post('/upload', uploadFile);

export { uploadRouter };
