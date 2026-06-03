import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    emoji: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: [
        'biryani_nonveg',
        'biryani_veg',
        'fried_rice_veg',
        'fried_rice_nonveg',
        'curries_nonveg',
        'curries_veg',
        'snacks',
      ],
      required: true,
    },
    isVegetarian: { type: Boolean, default: false },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);
