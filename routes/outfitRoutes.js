import express from 'express';
const router = express.Router();
import { generateOutfit, saveOutfit, getSavedOutfits } from '../controllers/outfitController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/generate').post(protect, generateOutfit);
router.route('/').post(protect, saveOutfit).get(protect, getSavedOutfits);

export default router;