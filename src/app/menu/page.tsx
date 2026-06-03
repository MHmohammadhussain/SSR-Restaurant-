'use client';

import Image from 'next/image';
import Link from 'next/link';
import { readDeliveryCart, writeDeliveryCart } from '@/lib/deliveryCart';
import { absoluteUrl } from '@/lib/seo';
import { useState } from 'react';

type MenuItem = { cat: string; emoji: string; name: string; desc: string; price: string; veg: boolean; image?: string };

const MENU: MenuItem[] = [
  // Biryani - Non Veg
  { cat: 'biryani_nonveg', emoji: '🥚', name: 'Egg Biryani', desc: 'Classic spiced biryani with egg.', price: '₹180', veg: false, image: '/images/menu/egg-biryani.jpg' },
  { cat: 'biryani_nonveg', emoji: '🍗', name: 'Chicken Fry Biryani', desc: 'Aromatic biryani with spicy chicken fry.', price: '₹220', veg: false, image: '/images/menu/chicken-fry-biryani.jpg' },
  { cat: 'biryani_nonveg', emoji: '🍗', name: 'Chicken Liver Biryani', desc: 'Flavorful biryani with chicken liver masala.', price: '₹240', veg: false, image: '/images/menu/chicken-liver-biryani.jpg' },
  { cat: 'biryani_nonveg', emoji: '🍗', name: 'Chicken Dum Biryani', desc: 'Slow-cooked dum biryani with chicken.', price: '₹230', veg: false, image: '/images/menu/chicken-dum-biryani.jpg' },
  { cat: 'biryani_nonveg', emoji: '🍗', name: 'Chicken Mixed Biryani', desc: 'Hearty mixed-style chicken biryani.', price: '₹240', veg: false, image: '/images/menu/chicken-mixed-biryani.jpg' },
  { cat: 'biryani_nonveg', emoji: '🍚', name: 'S.P Chicken Pulav', desc: 'Special chicken pulav with signature spices.', price: '₹230', veg: false, image: '/images/menu/s-p-chicken-pulav.jpg' },
  { cat: 'biryani_nonveg', emoji: '🍛', name: 'Chicken Moghlai', desc: 'Rich Mughlai-style chicken rice preparation.', price: '₹250', veg: false, image: '/images/menu/chicken-moghlai.jpg' },
  { cat: 'biryani_nonveg', emoji: '🦐', name: 'Prawns Pulav', desc: 'Fragrant pulav loaded with prawns.', price: '₹260', veg: false, image: '/images/menu/prawns-pulav.jpg' },
  { cat: 'biryani_nonveg', emoji: '🦐', name: 'Prawns Mixed', desc: 'Mixed rice dish with prawns and spices.', price: '₹260', veg: false, image: '/images/menu/prawns-mixed.jpg' },
  { cat: 'biryani_nonveg', emoji: '🍗', name: 'Chicken Joint Pulav', desc: 'Pulav with juicy chicken joint cuts.', price: '₹280', veg: false, image: '/images/menu/chicken-joint-pulav.jpg' },
  { cat: 'biryani_nonveg', emoji: '🍗', name: 'Chicken Wings Pulav', desc: 'Spicy wings pulav cooked in aromatic rice.', price: '₹280', veg: false, image: '/images/menu/chicken-wings-pulav.jpg' },
  { cat: 'biryani_nonveg', emoji: '🍗', name: 'Chicken Lollipop Biryani', desc: 'Biryani topped with crispy chicken lollipops.', price: '₹280', veg: false, image: '/images/menu/chicken-lollipop-biryani.jpg' },
  { cat: 'biryani_nonveg', emoji: '🍖', name: 'All Mixed Biryani', desc: 'Loaded mixed biryani for a full feast.', price: '₹320', veg: false, image: '/images/menu/all-mixed-biryani.jpg' },
  { cat: 'biryani_nonveg', emoji: '🍖', name: 'Mutton Fry Biryani', desc: 'Spiced mutton fry layered with biryani rice.', price: '₹340', veg: false, image: '/images/menu/mutton-fry-biryani.jpg' },
  { cat: 'biryani_nonveg', emoji: '🍖', name: 'S.P Mutton Pulav', desc: 'Special mutton pulav with house masala.', price: '₹350', veg: false, image: '/images/menu/s-p-mutton-pulav.jpg' },
  { cat: 'biryani_nonveg', emoji: '🍖', name: 'Mutton Dum Biryani', desc: 'Traditional dum biryani with tender mutton.', price: '₹400', veg: false, image: '/images/menu/mutton-dum-biryani.jpg' },
  { cat: 'biryani_nonveg', emoji: '🍗', name: 'Gongura Chicken Biryani', desc: 'Tangy gongura chicken biryani.', price: '₹260', veg: false, image: '/images/menu/gongura-chicken-biryani.jpg' },
  { cat: 'biryani_nonveg', emoji: '🍗', name: 'Ulavacharu Chicken Biryani', desc: 'Chicken biryani infused with ulavacharu flavor.', price: '₹260', veg: false, image: '/images/menu/ulavacharu-chicken-biryani.jpg' },
  { cat: 'biryani_nonveg', emoji: '🍖', name: 'Gongura Mutton Biryani', desc: 'Mutton biryani with signature gongura tang.', price: '₹380', veg: false, image: '/images/menu/gongura-mutton-biryani.jpg' },

  // Biryani - Veg
  { cat: 'biryani_veg', emoji: '🥕', name: 'Veg Biryani', desc: 'Aromatic veg biryani with mixed vegetables.', price: '₹170', veg: true, image: '/images/menu/veg-biryani.jpg' },
  { cat: 'biryani_veg', emoji: '🥕', name: 'S.P Veg Biryani', desc: 'Special veg biryani with house spices.', price: '₹220', veg: true, image: '/images/menu/s-p-veg-biryani.jpg' },
  { cat: 'biryani_veg', emoji: '🥜', name: 'Kaju Biryani', desc: 'Rich biryani prepared with roasted kaju.', price: '₹250', veg: true, image: '/images/menu/kaju-biryani.jpg' },
  { cat: 'biryani_veg', emoji: '🍄', name: 'Mushroom Biryani', desc: 'Spiced dum biryani with mushrooms.', price: '₹220', veg: true, image: '/images/menu/mushroom-biryani.jpg' },
  { cat: 'biryani_veg', emoji: '🧀', name: 'Paneer Biryani', desc: 'Paneer cubes tossed in aromatic biryani masala.', price: '₹220', veg: true, image: '/images/menu/paneer-biryani.jpg' },
  { cat: 'biryani_veg', emoji: '🌽', name: 'Babycorn Biryani', desc: 'Flavorful biryani with baby corn.', price: '₹220', veg: true, image: '/images/menu/babycorn-biryani.jpg' },
  { cat: 'biryani_veg', emoji: '🥦', name: 'Veg Mixed Biryani', desc: 'Loaded mixed vegetable biryani.', price: '₹250', veg: true, image: '/images/menu/veg-mixed-biryani.jpg' },

  // Fried Rice - Veg
  { cat: 'fried_rice_veg', emoji: '🍚', name: 'Jeera Rice', desc: 'Simple and fragrant jeera rice.', price: '₹130', veg: true, image: '/images/menu/jeera-rice.jpg' },
  { cat: 'fried_rice_veg', emoji: '🥕', name: 'Veg Fried Rice', desc: 'Wok-tossed rice with fresh vegetables.', price: '₹120', veg: true, image: '/images/menu/veg-fried-rice.jpg' },
  { cat: 'fried_rice_veg', emoji: '🥜', name: 'Kaju Fried Rice', desc: 'Fried rice with rich kaju crunch.', price: '₹250', veg: true, image: '/images/menu/kaju-fried-rice.jpg' },
  { cat: 'fried_rice_veg', emoji: '🥦', name: 'Veg Mixed Fried Rice', desc: 'Mixed vegetable fried rice in Indo-Chinese style.', price: '₹250', veg: true, image: '/images/menu/veg-mixed-fried-rice.jpg' },

  // Fried Rice - Non Veg
  { cat: 'fried_rice_nonveg', emoji: '🥚', name: 'Egg Fried Rice', desc: 'Fried rice tossed with egg and spices.', price: '₹140', veg: false, image: '/images/menu/egg-fried-rice.jpg' },
  { cat: 'fried_rice_nonveg', emoji: '🍗', name: 'Chicken Fried Rice', desc: 'Wok-tossed chicken fried rice.', price: '₹220', veg: false, image: '/images/menu/chicken-fried-rice.jpg' },
  { cat: 'fried_rice_nonveg', emoji: '🦐', name: 'Prawns Fried Rice', desc: 'Seafood-style fried rice with prawns.', price: '₹260', veg: false, image: '/images/menu/prawns-fried-rice.jpg' },
  { cat: 'fried_rice_nonveg', emoji: '🍖', name: 'Mixed Fried Rice', desc: 'Mixed non-veg fried rice platter.', price: '₹320', veg: false, image: '/images/menu/mixed-fried-rice.jpg' },
  { cat: 'fried_rice_nonveg', emoji: '🍖', name: 'Mutton Fried Rice', desc: 'Spiced mutton fried rice.', price: '₹350', veg: false, image: '/images/menu/mutton-fried-rice.jpg' },

  // Curries - Non Veg
  { cat: 'curries_nonveg', emoji: '🥚', name: 'Egg Curry', desc: 'Home-style egg curry.', price: '₹120', veg: false, image: '/images/menu/egg-curry.jpg' },
  { cat: 'curries_nonveg', emoji: '🍗', name: 'Chicken Curry', desc: 'Classic spicy chicken curry.', price: '₹200', veg: false, image: '/images/menu/chicken-curry.jpg' },
  { cat: 'curries_nonveg', emoji: '🍗', name: 'Chicken Mughlai', desc: 'Rich and creamy Mughlai chicken curry.', price: '₹240', veg: false, image: '/images/menu/chicken-mughlai.jpg' },
  { cat: 'curries_nonveg', emoji: '🦐', name: 'Prawns Curry', desc: 'Prawns cooked in spiced curry gravy.', price: '₹260', veg: false, image: '/images/menu/prawns-curry.jpg' },
  { cat: 'curries_nonveg', emoji: '🍗', name: 'Butter Chicken', desc: 'Creamy tomato butter chicken.', price: '₹240', veg: false, image: '/images/menu/butter-chicken.jpg' },
  { cat: 'curries_nonveg', emoji: '🍗', name: 'Chicken Tikka Masala', desc: 'Smoky chicken tikka in masala gravy.', price: '₹250', veg: false, image: '/images/menu/chicken-tikka-masala.jpg' },
  { cat: 'curries_nonveg', emoji: '🍖', name: 'Mutton Curry', desc: 'Traditional mutton curry with bold spices.', price: '₹350', veg: false, image: '/images/menu/mutton-curry.jpg' },

  // Curries - Veg
  { cat: 'curries_veg', emoji: '🥬', name: 'Palak Dal', desc: 'Dal cooked with fresh spinach.', price: '₹120', veg: true, image: '/images/menu/palak-dal.jpg' },
  { cat: 'curries_veg', emoji: '🍅', name: 'Tomato Curry', desc: 'Tangy and mildly spiced tomato curry.', price: '₹100', veg: true, image: '/images/menu/tomato-curry.jpg' },
  { cat: 'curries_veg', emoji: '🌿', name: 'Green Masala', desc: 'Herb-forward green masala curry.', price: '₹150', veg: true, image: '/images/menu/green-masala.jpg' },
  { cat: 'curries_veg', emoji: '🥦', name: 'Veg Mixed', desc: 'Mixed vegetable curry in house masala.', price: '₹150', veg: true, image: '/images/menu/veg-mixed.jpg' },
  { cat: 'curries_veg', emoji: '🧀', name: 'Palak Paneer', desc: 'Paneer in creamy spinach gravy.', price: '₹220', veg: true, image: '/images/menu/palak-paneer.jpg' },
  { cat: 'curries_veg', emoji: '🧀', name: 'Paneer Butter Masala', desc: 'Paneer in rich butter masala gravy.', price: '₹200', veg: true, image: '/images/menu/paneer-butter-masala.jpg' },
  { cat: 'curries_veg', emoji: '🍄', name: 'Mushroom Curry', desc: 'Mushroom curry with aromatic spices.', price: '₹200', veg: true, image: '/images/menu/mushroom-curry.jpg' },

  // Snacks
  { cat: 'snacks', emoji: '🥚', name: 'Egg Manchurian', desc: 'Crispy egg manchurian in spicy sauce.', price: '₹180', veg: false, image: '/images/menu/egg-manchurian.jpg' },
  { cat: 'snacks', emoji: '🍗', name: 'Chilli Chicken', desc: 'Street-style chilli chicken.', price: '₹200', veg: false, image: '/images/menu/chilli-chicken.jpg' },
  { cat: 'snacks', emoji: '🍗', name: 'Chicken 65', desc: 'Crispy and spicy Chicken 65.', price: '₹200', veg: false, image: '/images/menu/chicken-65.jpg' },
  { cat: 'snacks', emoji: '🍗', name: 'Chicken Wings', desc: 'Fried chicken wings with spices.', price: '₹200', veg: false, image: '/images/menu/chicken-wings.jpg' },
  { cat: 'snacks', emoji: '🍗', name: 'Chicken Lollipop', desc: 'Crunchy chicken lollipop starter.', price: '₹200', veg: false, image: '/images/menu/chicken-lollipop.jpg' },
  { cat: 'snacks', emoji: '🦐', name: 'Prawns Fry', desc: 'Spicy prawns fry.', price: '₹260', veg: false, image: '/images/menu/prawns-fry.jpg' },
  { cat: 'snacks', emoji: '🍗', name: 'Pepper Chicken', desc: 'Pepper-forward chicken dry roast.', price: '₹270', veg: false, image: '/images/menu/pepper-chicken.jpg' },
];

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'biryani_nonveg', label: 'Biryani (Non-Veg)' },
  { key: 'biryani_veg', label: 'Biryani (Veg)' },
  { key: 'fried_rice_veg', label: 'Fried Rice (Veg)' },
  { key: 'fried_rice_nonveg', label: 'Fried Rice (Non-Veg)' },
  { key: 'curries_nonveg', label: 'Curries (Non-Veg)' },
  { key: 'curries_veg', label: 'Curries (Veg)' },
  { key: 'snacks', label: 'Snacks' },
];

const menuSchema = {
  '@context': 'https://schema.org',
  '@type': 'Menu',
  name: 'SSR Restaurant Menu',
  url: absoluteUrl('/menu'),
  hasMenuSection: TABS.filter((tab) => tab.key !== 'all').map((tab) => ({
    '@type': 'MenuSection',
    name: tab.label,
    hasMenuItem: MENU.filter((item) => item.cat === tab.key).map((item) => ({
      '@type': 'MenuItem',
      name: item.name,
      description: item.desc,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        price: parseInt(item.price.replace(/[^0-9]/g, ''), 10) || undefined,
      },
    })),
  })),
};

export default function MenuPage() {
  const [active, setActive] = useState('all');
  const [quantities, setQuantities] = useState<Record<string, number>>(() => (typeof window === 'undefined' ? {} : readDeliveryCart()));
  const items = active === 'all' ? MENU : MENU.filter((i) => i.cat === active);

  function changeQty(name: string, delta: number) {
    setQuantities((prev) => {
      const nextQty = Math.max(0, (prev[name] || 0) + delta);
      const next = { ...prev };
      if (nextQty === 0) delete next[name];
      else next[name] = nextQty;
      writeDeliveryCart(next);
      return next;
    });
  }

  const selectedCount = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuSchema) }}
      />

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
              {item.image ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                </div>
              ) : (
                <span className="text-4xl flex-shrink-0">{item.emoji}</span>
              )}
              <div className="flex-1">
                <h3 className="font-serif text-base mb-1 flex items-center gap-1">
                  <span className={item.veg ? 'veg-badge' : 'nonveg-badge'} />
                  {item.name}
                </h3>
                <p className="text-[#777] text-sm">{item.desc}</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="font-bold" style={{ color: '#b5451b' }}>{item.price}</span>
                  <div className="ml-auto flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => changeQty(item.name, -1)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#b5451b] text-lg leading-none text-[#b5451b]"
                      aria-label={`Decrease quantity for ${item.name}`}
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-bold">{quantities[item.name] || 0}</span>
                    <button
                      type="button"
                      onClick={() => changeQty(item.name, 1)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#b5451b] bg-[#b5451b] text-lg leading-none text-white"
                      aria-label={`Increase quantity for ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedCount > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
          <Link
            href="/delivery#order-form"
            className="inline-flex items-center gap-2 rounded-full bg-[#b5451b] text-white font-bold px-7 py-3 shadow-xl border-2 border-white"
          >
            Place Order ({selectedCount})
          </Link>
        </div>
      )}
    </>
  );
}
