import asyncHandler from 'express-async-handler';
import ClothingItem from '../models/clothingItemModel.js';
import Outfit from '../models/outfitModel.js';
import axios from 'axios';
import FormData from 'form-data';

// @desc    Fetch all wardrobe items for a user
// @route   GET /api/wardrobe
// @access  Private
const getWardrobeItems = asyncHandler(async (req, res) => {
  const items = await ClothingItem.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(items);
});

// @desc    Add a new clothing item
// @route   POST /api/wardrobe
// @access  Private
const addClothingItem = asyncHandler(async (req, res) => {
    // Note: Now we get category from AI, not req.body
    const { name, color, season } = req.body;
    
    if (!req.file) {
        res.status(400);
        throw new Error('No image file uploaded');
    }

    let predictedCategory;
    try {
        const form = new FormData();
        // req.file.buffer contains the image data in memory
        form.append('file', req.file.buffer, { filename: req.file.originalname });

        // Call the Python AI Service
        const aiResponse = await axios.post(
            'http://localhost:5002/predict-category', 
            form, 
            { headers: form.getHeaders() }
        );
        predictedCategory = aiResponse.data.category;

    } catch (error) {
        console.error("AI Service Error:", error.message);
        // Fallback if AI service fails - can be removed in production
        predictedCategory = "Tops"; // Or throw an error
    }

    const item = new ClothingItem({
        user: req.user._id,
        name,
        category: predictedCategory, // Use the AI's prediction
        color,
        season,
        imageUrl: req.file.path // This comes from Cloudinary
    });

    const createdItem = await item.save();
    res.status(201).json(createdItem);
});

// @desc    Get a single clothing item by ID
// @route   GET /api/wardrobe/:id
// @access  Private
const getClothingItemById = asyncHandler(async (req, res) => {
    const item = await ClothingItem.findById(req.params.id);

    if (item && item.user.toString() === req.user._id.toString()) {
        res.json(item);
    } else {
        res.status(404);
        throw new Error('Item not found');
    }
});

// @desc    Update a clothing item
// @route   PUT /api/wardrobe/:id
// @access  Private
const updateClothingItem = asyncHandler(async (req, res) => {
    const { name, category, color, season } = req.body;
    const item = await ClothingItem.findById(req.params.id);

    if (item && item.user.toString() === req.user._id.toString()) {
        item.name = name || item.name;
        item.category = category || item.category;
        item.color = color || item.color;
        item.season = season || item.season;
        
        const updatedItem = await item.save();
        res.json(updatedItem);
    } else {
        res.status(404);
        throw new Error('Item not found');
    }
});

// @desc    Delete a clothing item
// @route   DELETE /api/wardrobe/:id
// @access  Private
const deleteClothingItem = asyncHandler(async (req, res) => {
    const item = await ClothingItem.findById(req.params.id);

    if (item && item.user.toString() === req.user._id.toString()) {
        await item.deleteOne();
        res.json({ message: 'Item removed' });
    } else {
        res.status(404);
        throw new Error('Item not found');
    }
});

// @desc    Get dashboard stats for a user
// @route   GET /api/wardrobe/stats
// @access  Private
const getWardrobeStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const [totalItems, outfitsCreated, recentItems] = await Promise.all([
        ClothingItem.countDocuments({ user: userId }),
        Outfit.countDocuments({ user: userId }),
        ClothingItem.find({ user: userId }).sort({ createdAt: -1 }).limit(3)
    ]);

    const recentActivity = recentItems.map(item => ({
        type: 'item',
        description: `Added ${item.name}`,
        date: item.createdAt
    }));

    // Placeholders for more complex features
    const daysPlanned = 7; 
    const styleScore = "89%";

    res.json({
        totalItems,
        outfitsCreated,
        daysPlanned,
        styleScore,
        recentActivity
    });
});


export { 
    getWardrobeItems, 
    addClothingItem, 
    getClothingItemById, 
    updateClothingItem, 
    deleteClothingItem,
    getWardrobeStats // Export the new function
};
