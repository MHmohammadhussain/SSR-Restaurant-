'use client';

import { useState } from 'react';

type MenuItem = { cat: string; emoji: string; name: string; desc: string; price: string; veg: boolean };

const MENU: MenuItem[] = [
  // Starters
  { cat: 'starters', emoji: '🥚', name: 'Egg Bajji', desc: 'Boiled egg fritters with spiced chickpea batter.', price: '₹80', veg: false },
  { cat: 'starters', emoji: '🌶️', name: 'Mirchi Bajji', desc: 'Green chilli stuffed with spiced potato, deep fried.', price: '₹70', veg: true },
  { cat: 'starters', emoji: '🍗', name: 'Chicken 65', desc: 'Deep-fried chicken marinated in chilli & yoghurt batter.', price: '₹220', veg: false },
  { cat: 'starters', emoji: '🥬', name: 'Aloo Vada', desc: 'Crispy potato fritters with chutneys.', price: '₹90', veg: true },
  { cat: 'starters', emoji: '🦐', name: 'Prawn Fry', desc: 'Crispy coastal-style fried prawns with lime.', price: '₹280', veg: false },
  // Tiffin
  { cat: 'tiffin', emoji: '🫓', name: 'Pesarattu', desc: 'Crispy green moong dal crepe with ginger chutney.', price: '₹120', veg: true },
  { cat: 'tiffin', emoji: '🥞', name: 'Idly (4 pcs)', desc: 'Soft steamed rice cakes served with sambar & chutney.', price: '₹80', veg: true },
  { cat: 'tiffin', emoji: '🍳', name: 'Masala Dosa', desc: 'Crispy dosa with spiced potato filling.', price: '₹130', veg: true },
  { cat: 'tiffin', emoji: '🧇', name: 'Uttapam', desc: 'Thick rice pancake topped with onion & tomato.', price: '₹110', veg: true },
  { cat: 'tiffin', emoji: '🍜', name: 'Upma', desc: 'Semolina porridge with vegetables & tempering.', price: '₹90', veg: true },
  // Main Course
  { cat: 'main', emoji: '🍛', name: 'Andhra Chicken Curry', desc: 'Fiery coconut-based chicken curry.', price: '₹320', veg: false },
  { cat: 'main', emoji: '🍲', name: 'Gongura Mutton', desc: 'Tender mutton with tangy sorrel leaves.', price: '₹420', veg: false },
  { cat: 'main', emoji: '🐟', name: 'Fish Pulusu', desc: 'Tamarind-based fish stew with Andhra spices.', price: '₹350', veg: false },
  { cat: 'main', emoji: '🥘', name: 'Gutti Vankaya', desc: 'Stuffed baby brinjal curry — a classic Andhra dish.', price: '₹210', veg: true },
  { cat: 'main', emoji: '🫘', name: 'Dal Tadka', desc: 'Yellow lentils with mustard, garlic & dried chilli.', price: '₹180', veg: true },
  { cat: 'main', emoji: '🥬', name: 'Palak Paneer', desc: 'Cottage cheese in a silky spinach gravy.', price: '₹220', veg: true },
  // Rice & Biryani
  { cat: 'rice', emoji: '🍱', name: 'Andhra Meals Thali', desc: 'Rice, dal, sambar, rasam, 4 curries, papad & pickle.', price: '₹280', veg: false },
  { cat: 'rice', emoji: '🍚', name: 'Pulihora', desc: 'Tamarind rice with mustard, peanuts & curry leaves.', price: '₹150', veg: true },
  { cat: 'rice', emoji: '🍗', name: 'Chicken Biryani', desc: 'Fragrant basmati rice with spiced chicken.', price: '₹360', veg: false },
  { cat: 'rice', emoji: '🥦', name: 'Vegetable Biryani', desc: 'Aromatic basmati rice with mixed vegetables.', price: '₹260', veg: true },
  { cat: 'rice', emoji: '🦐', name: 'Prawn Biryani', desc: 'Succulent prawns layered in biryani masala rice.', price: '₹420', veg: false },
  { cat: 'rice', emoji: '🍳', name: 'Egg Fried Rice', desc: 'Wok-tossed rice with egg and vegetables.', price: '₹180', veg: false },
  // Desserts
  { cat: 'desserts', emoji: '🍮', name: 'Pala Munjalu', desc: 'Soft milk-dumplings in sugar syrup.', price: '₹120', veg: true },
  { cat: 'desserts', emoji: '🍡', name: 'Bobbatlu', desc: 'Sweet lentil-stuffed flatbread.', price: '₹100', veg: true },
  { cat: 'desserts', emoji: '🧁', name: 'Double Ka Meetha', desc: 'Hyderabadi bread pudding with rabri.', price: '₹130', veg: true },
  { cat: 'desserts', emoji: '🍨', name: 'Kulfi Falooda', desc: 'Dense Indian ice cream with rose falooda.', price: '₹110', veg: true },
  // Drinks
  { cat: 'drinks', emoji: '☕', name: 'Filter Coffee', desc: 'Traditional South Indian filter coffee.', price: '₹60', veg: true },
  { cat: 'drinks', emoji: '🍵', name: 'Masala Chai', desc: 'Spiced milk tea with ginger & cardamom.', price: '₹50', veg: true },
  { cat: 'drinks', emoji: '🥤', name: 'Mango Lassi', desc: 'Chilled yoghurt blended with Alphonso mango.', price: '₹90', veg: true },
  { cat: 'drinks', emoji: '🍋', name: 'Nimbu Pani', desc: 'Fresh lime water with salt and cumin.', price: '₹60', veg: true },
  { cat: 'drinks', emoji: '🥛', name: 'Buttermilk', desc: 'Chilled salted buttermilk with curry leaves.', price: '₹50', veg: true },
];

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'starters', label: 'Starters' },
  { key: 'tiffin', label: 'Tiffin' },
  { key: 'main', label: 'Main Course' },
  { key: 'rice', label: 'Rice & Biryani' },
  { key: 'desserts', label: 'Desserts' },
  { key: 'drinks', label: 'Drinks' },
];

export default function MenuPage() {
  const [active, setActive] = useState('all');
  const items = active === 'all' ? MENU : MENU.filter((i) => i.cat === active);

  return (
    <>
      <div className="pt-32 pb-16 text-center" style={{ background: 'linear-gradient(135deg,#1a1a1a 60%,#b5451b)' }}>
        <h1 className="font-serif text-5xl text-white mb-2">Our Menu</h1>
        <p className="text-white/70 text-lg">Authentic Andhra flavours for every taste</p>
      </div>

      <section className="py-20 max-w-6xl mx-auto px-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`px-5 py-2 rounded-full border-2 text-sm font-bold transition-all cursor-pointer ${
                active === t.key
                  ? 'text-white border-[#b5451b]'
                  : 'text-[#b5451b] border-[#b5451b] hover:bg-[#b5451b] hover:text-white'
              }`}
              style={active === t.key ? { background: '#b5451b' } : {}}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.name}
              className="bg-white rounded-xl p-5 flex gap-4 items-start shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <span className="text-4xl flex-shrink-0">{item.emoji}</span>
              <div>
                <h3 className="font-serif text-base mb-1 flex items-center gap-1">
                  <span className={item.veg ? 'veg-badge' : 'nonveg-badge'} />
                  {item.name}
                </h3>
                <p className="text-[#777] text-sm">{item.desc}</p>
                <span className="block mt-2 font-bold" style={{ color: '#b5451b' }}>{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
