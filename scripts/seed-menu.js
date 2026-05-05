const { loadEnvConfig } = require('@next/env');
const mongoose = require('mongoose');

loadEnvConfig(process.cwd());

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI in environment (.env.local)');
}

const menuItemSchema = new mongoose.Schema(
  {
    emoji: { type: String, required: true },
    name: { type: String, required: true },
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

const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);

const MENU = [
  { category: 'biryani_nonveg', emoji: '🥚', name: 'Egg Biryani', description: 'Classic spiced biryani with egg.', price: 180, isVegetarian: false },
  { category: 'biryani_nonveg', emoji: '🍗', name: 'Chicken Fry Biryani', description: 'Aromatic biryani with spicy chicken fry.', price: 220, isVegetarian: false },
  { category: 'biryani_nonveg', emoji: '🍗', name: 'Chicken Liver Biryani', description: 'Flavorful biryani with chicken liver masala.', price: 240, isVegetarian: false },
  { category: 'biryani_nonveg', emoji: '🍗', name: 'Chicken Dum Biryani', description: 'Slow-cooked dum biryani with chicken.', price: 230, isVegetarian: false },
  { category: 'biryani_nonveg', emoji: '🍗', name: 'Chicken Mixed Biryani', description: 'Hearty mixed-style chicken biryani.', price: 240, isVegetarian: false },
  { category: 'biryani_nonveg', emoji: '🍚', name: 'S.P Chicken Pulav', description: 'Special chicken pulav with signature spices.', price: 230, isVegetarian: false },
  { category: 'biryani_nonveg', emoji: '🍛', name: 'Chicken Moghlai', description: 'Rich Mughlai-style chicken rice preparation.', price: 250, isVegetarian: false },
  { category: 'biryani_nonveg', emoji: '🦐', name: 'Prawns Pulav', description: 'Fragrant pulav loaded with prawns.', price: 260, isVegetarian: false },
  { category: 'biryani_nonveg', emoji: '🦐', name: 'Prawns Mixed', description: 'Mixed rice dish with prawns and spices.', price: 260, isVegetarian: false },
  { category: 'biryani_nonveg', emoji: '🍗', name: 'Chicken Joint Pulav', description: 'Pulav with juicy chicken joint cuts.', price: 280, isVegetarian: false },
  { category: 'biryani_nonveg', emoji: '🍗', name: 'Chicken Wings Pulav', description: 'Spicy wings pulav cooked in aromatic rice.', price: 280, isVegetarian: false },
  { category: 'biryani_nonveg', emoji: '🍗', name: 'Chicken Lollipop Biryani', description: 'Biryani topped with crispy chicken lollipops.', price: 280, isVegetarian: false },
  { category: 'biryani_nonveg', emoji: '🍖', name: 'All Mixed Biryani', description: 'Loaded mixed biryani for a full feast.', price: 320, isVegetarian: false },
  { category: 'biryani_nonveg', emoji: '🍖', name: 'Mutton Fry Biryani', description: 'Spiced mutton fry layered with biryani rice.', price: 340, isVegetarian: false },
  { category: 'biryani_nonveg', emoji: '🍖', name: 'S.P Mutton Pulav', description: 'Special mutton pulav with house masala.', price: 350, isVegetarian: false },
  { category: 'biryani_nonveg', emoji: '🍖', name: 'Mutton Dum Biryani', description: 'Traditional dum biryani with tender mutton.', price: 400, isVegetarian: false },
  { category: 'biryani_nonveg', emoji: '🍗', name: 'Gongura Chicken Biryani', description: 'Tangy gongura chicken biryani.', price: 260, isVegetarian: false },
  { category: 'biryani_nonveg', emoji: '🍗', name: 'Ulavacharu Chicken Biryani', description: 'Chicken biryani infused with ulavacharu flavor.', price: 260, isVegetarian: false },
  { category: 'biryani_nonveg', emoji: '🍖', name: 'Gongura Mutton Biryani', description: 'Mutton biryani with signature gongura tang.', price: 380, isVegetarian: false },

  { category: 'biryani_veg', emoji: '🥕', name: 'Veg Biryani', description: 'Aromatic veg biryani with mixed vegetables.', price: 170, isVegetarian: true },
  { category: 'biryani_veg', emoji: '🥕', name: 'S.P Veg Biryani', description: 'Special veg biryani with house spices.', price: 220, isVegetarian: true },
  { category: 'biryani_veg', emoji: '🥜', name: 'Kaju Biryani', description: 'Rich biryani prepared with roasted kaju.', price: 250, isVegetarian: true },
  { category: 'biryani_veg', emoji: '🍄', name: 'Mushroom Biryani', description: 'Spiced dum biryani with mushrooms.', price: 220, isVegetarian: true },
  { category: 'biryani_veg', emoji: '🧀', name: 'Paneer Biryani', description: 'Paneer cubes tossed in aromatic biryani masala.', price: 220, isVegetarian: true },
  { category: 'biryani_veg', emoji: '🌽', name: 'Babycorn Biryani', description: 'Flavorful biryani with baby corn.', price: 220, isVegetarian: true },
  { category: 'biryani_veg', emoji: '🥦', name: 'Veg Mixed Biryani', description: 'Loaded mixed vegetable biryani.', price: 250, isVegetarian: true },

  { category: 'fried_rice_veg', emoji: '🍚', name: 'Jeera Rice', description: 'Simple and fragrant jeera rice.', price: 130, isVegetarian: true },
  { category: 'fried_rice_veg', emoji: '🥕', name: 'Veg Fried Rice', description: 'Wok-tossed rice with fresh vegetables.', price: 120, isVegetarian: true },
  { category: 'fried_rice_veg', emoji: '🥜', name: 'Kaju Fried Rice', description: 'Fried rice with rich kaju crunch.', price: 250, isVegetarian: true },
  { category: 'fried_rice_veg', emoji: '🥦', name: 'Veg Mixed Fried Rice', description: 'Mixed vegetable fried rice in Indo-Chinese style.', price: 250, isVegetarian: true },

  { category: 'fried_rice_nonveg', emoji: '🥚', name: 'Egg Fried Rice', description: 'Fried rice tossed with egg and spices.', price: 140, isVegetarian: false },
  { category: 'fried_rice_nonveg', emoji: '🍗', name: 'Chicken Fried Rice', description: 'Wok-tossed chicken fried rice.', price: 220, isVegetarian: false },
  { category: 'fried_rice_nonveg', emoji: '🦐', name: 'Prawns Fried Rice', description: 'Seafood-style fried rice with prawns.', price: 260, isVegetarian: false },
  { category: 'fried_rice_nonveg', emoji: '🍖', name: 'Mixed Fried Rice', description: 'Mixed non-veg fried rice platter.', price: 320, isVegetarian: false },
  { category: 'fried_rice_nonveg', emoji: '🍖', name: 'Mutton Fried Rice', description: 'Spiced mutton fried rice.', price: 350, isVegetarian: false },

  { category: 'curries_nonveg', emoji: '🥚', name: 'Egg Curry', description: 'Home-style egg curry.', price: 120, isVegetarian: false },
  { category: 'curries_nonveg', emoji: '🍗', name: 'Chicken Curry', description: 'Classic spicy chicken curry.', price: 200, isVegetarian: false },
  { category: 'curries_nonveg', emoji: '🍗', name: 'Chicken Mughlai', description: 'Rich and creamy Mughlai chicken curry.', price: 240, isVegetarian: false },
  { category: 'curries_nonveg', emoji: '🦐', name: 'Prawns Curry', description: 'Prawns cooked in spiced curry gravy.', price: 260, isVegetarian: false },
  { category: 'curries_nonveg', emoji: '🍗', name: 'Butter Chicken', description: 'Creamy tomato butter chicken.', price: 240, isVegetarian: false },
  { category: 'curries_nonveg', emoji: '🍗', name: 'Chicken Tikka Masala', description: 'Smoky chicken tikka in masala gravy.', price: 250, isVegetarian: false },
  { category: 'curries_nonveg', emoji: '🍖', name: 'Mutton Curry', description: 'Traditional mutton curry with bold spices.', price: 350, isVegetarian: false },

  { category: 'curries_veg', emoji: '🥬', name: 'Palak Dal', description: 'Dal cooked with fresh spinach.', price: 120, isVegetarian: true },
  { category: 'curries_veg', emoji: '🍅', name: 'Tomato Curry', description: 'Tangy and mildly spiced tomato curry.', price: 100, isVegetarian: true },
  { category: 'curries_veg', emoji: '🌿', name: 'Green Masala', description: 'Herb-forward green masala curry.', price: 150, isVegetarian: true },
  { category: 'curries_veg', emoji: '🥦', name: 'Veg Mixed', description: 'Mixed vegetable curry in house masala.', price: 150, isVegetarian: true },
  { category: 'curries_veg', emoji: '🧀', name: 'Palak Paneer', description: 'Paneer in creamy spinach gravy.', price: 220, isVegetarian: true },
  { category: 'curries_veg', emoji: '🧀', name: 'Paneer Butter Masala', description: 'Paneer in rich butter masala gravy.', price: 200, isVegetarian: true },
  { category: 'curries_veg', emoji: '🍄', name: 'Mushroom Curry', description: 'Mushroom curry with aromatic spices.', price: 200, isVegetarian: true },

  { category: 'snacks', emoji: '🥚', name: 'Egg Manchurian', description: 'Crispy egg manchurian in spicy sauce.', price: 180, isVegetarian: false },
  { category: 'snacks', emoji: '🍗', name: 'Chilli Chicken', description: 'Street-style chilli chicken.', price: 200, isVegetarian: false },
  { category: 'snacks', emoji: '🍗', name: 'Chicken 65', description: 'Crispy and spicy Chicken 65.', price: 200, isVegetarian: false },
  { category: 'snacks', emoji: '🍗', name: 'Chicken Wings', description: 'Fried chicken wings with spices.', price: 200, isVegetarian: false },
  { category: 'snacks', emoji: '🍗', name: 'Chicken Lollipop', description: 'Crunchy chicken lollipop starter.', price: 200, isVegetarian: false },
  { category: 'snacks', emoji: '🦐', name: 'Prawns Fry', description: 'Spicy prawns fry.', price: 260, isVegetarian: false },
  { category: 'snacks', emoji: '🍗', name: 'Pepper Chicken', description: 'Pepper-forward chicken dry roast.', price: 270, isVegetarian: false },
];

async function run() {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  const deleted = await MenuItem.deleteMany({});
  const inserted = await MenuItem.insertMany(MENU);
  console.log(`Deleted existing menu items: ${deleted.deletedCount}`);
  console.log(`Inserted menu items: ${inserted.length}`);
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error('Menu seed failed:', error);
  await mongoose.disconnect();
  process.exit(1);
});
