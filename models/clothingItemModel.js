
import mongoose from 'mongoose';

const clothingItemSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Tops', 'Bottoms', 'Outerwear', 'Dresses', 'Shoes', 'Accessories'],
  },
  color: {
    type: String,
    required: true,
  },
  season: {
    type: String,
    required: true,
    enum: ['All Seasons', 'Spring', 'Summer', 'Fall', 'Winter'],
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

const ClothingItem = mongoose.model('ClothingItem', clothingItemSchema);
export default ClothingItem;