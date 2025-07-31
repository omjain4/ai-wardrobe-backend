import express from 'express';
const router = express.Router();
import {
  getWardrobeItems,
  addClothingItem,
  getClothingItemById,
  updateClothingItem,
  deleteClothingItem,
  getWardrobeStats // Import the new function
} from '../controllers/wardrobeController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../config/cloudinary.js';

router.route('/')
  .get(protect, getWardrobeItems)
  .post(protect, upload.single('image'), addClothingItem);

// Add the new stats route
router.route('/stats').get(protect, getWardrobeStats);

router.route('/:id')
  .get(protect, getClothingItemById)
  .put(protect, updateClothingItem)
  .delete(protect, deleteClothingItem);

export default router;
