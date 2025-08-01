import asyncHandler from 'express-async-handler';
import ClothingItem from '../models/clothingItemModel.js';
import Outfit from '../models/outfitModel.js';
import axios from 'axios';

const AI_SERVICE_URL = 'https://aiservice-production-e3ee.up.railway.app';

const generateOutfit = asyncHandler(async (req, res) => {
  const userWardrobe = await ClothingItem.find({ user: req.user._id });
  const { style, height, weight, bodyColor } = req.body;

  if (!style || !height || !weight || !bodyColor) {
    res.status(400);
    throw new Error('Missing personalization details.');
  }

  const payload = {
    wardrobe: userWardrobe,
    style,
    height: parseInt(height, 10),
    weight: parseInt(weight, 10),
    body_color: bodyColor,
  };

  try {
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/generate-outfit`, payload);
    res.json(aiResponse.data);  // Returns userItems and suggestedItems
  } catch (error) {
    console.error("AI Outfit Generation Error:", error.response ? error.response.data : error.message);
    res.status(500);
    throw new Error('Error generating outfit.');
  }
});

const saveOutfit = asyncHandler(async (req, res) => {
  const { name, items } = req.body;
  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No items in outfit');
  }
  const outfit = new Outfit({ user: req.user._id, name, items });
  const createdOutfit = await outfit.save();
  res.status(201).json(createdOutfit);
});

const getSavedOutfits = asyncHandler(async (req, res) => {
  const outfits = await Outfit.find({ user: req.user._id }).populate('items');
  res.json(outfits);
});

export { generateOutfit, saveOutfit, getSavedOutfits };
