import mongoose from 'mongoose';

const outfitSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
        default: 'My Saved Outfit'
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ClothingItem'
    }]
}, {
    timestamps: true
});

const Outfit = mongoose.model('Outfit', outfitSchema);
export default Outfit;