import express from 'express';

import { protect } from '../middleware/authMiddleware.js';
import { uploadArtwork, getArtworkList, getArtworkById} from '../controllers/artworkController.js';

import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'artworkImages', maxCount: 10 }]), uploadArtwork);
router.get('/getArtworkList', getArtworkList);
router.get('/getArtworkById/:id', getArtworkById);


export default router;