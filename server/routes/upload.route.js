import { Router } from 'express';
import auth from '../middlewares/auth.middleware.js';
import { uploadImageController } from '../controllers/upload.controller.js';
import upload from '../middlewares/multer.middleware.js';

const uploadRoute = Router()

uploadRoute.post("/upload", auth, upload.single("image"), uploadImageController)

export default uploadRoute