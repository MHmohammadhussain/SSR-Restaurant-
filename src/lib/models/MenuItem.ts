import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    emoji: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, enum: ['starters', 'tiffin', 'main_course', 'rice_biryani', 'desserts', 'drinks'], required: true },
    isVegetarian: { type: Boolean, default: false },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);
