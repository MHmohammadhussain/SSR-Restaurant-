'use client';

import { useState } from 'react';

const DISHES = [
  { emoji: '🍛', title: 'Andhra Chicken Curry', bg: 'linear-gradient(135deg,#b5451b,#f4a229)' },
  { emoji: '🥘', title: 'Pesarattu', bg: 'linear-gradient(135deg,#2d7a35,#a4d86e)' },
  { emoji: '🍲', title: 'Gongura Mutton', bg: 'linear-gradient(135deg,#8b2252,#e87bb0)' },
  { emoji: '🐟', title: 'Fish Pulusu', bg: 'linear-gradient(135deg,#1a6e7a,#5bc8d5)' },
  { emoji: '🍱', title: 'Andhra Thali', bg: 'linear-gradient(135deg,#c07530,#f9d05e)' },
  { emoji: '🍚', title: 'Pulihora', bg: 'linear-gradient(135deg,#5a4a10,#d4a017)' },
  { emoji: '🦐', title: 'Prawn Biryani', bg: 'linear-gradient(135deg,#c44b4b,#f7c59f)' },
  { emoji: '🥞', title: 'Masala Dosa', bg: 'linear-gradient(135deg,#4a306d,#af8fd1)' },
  { emoji: '🍮', title: 'Bobbatlu', bg: 'linear-gradient(135deg,#2e4a7a,#6b9fd4)' },
];

const AMBIENCE = [
  { emoji: '🏡', title: 'Dining Hall', bg: 'linear-gradient(135deg,#333,#666)' },
  { emoji: '🕯️', title: 'Evening Dining', bg: 'linear-gradient(135deg,#1a1a2e,#b5451b)' },
  { emoji: '🌿', title: 'Garden Seating', bg: 'linear-gradient(135deg,#1a4d2e,#52b788)' },
  { emoji: '👨‍🍳', title: 'Open Kitchen', bg: 'linear-gradient(135deg,#7a2a0d,#f4a229)' },
  { emoji: '🎉', title: 'Private Events', bg: 'linear-gradient(135deg,#4a1942,#c77dff)' },
  { emoji: '☕', title: 'Coffee Corner', bg: 'linear-gradient(135deg,#4e3620,#c2956c)' },
];

function GalleryGrid({ items }: { items: typeof DISHES }) {
  const [lightbox, setLightbox] = useState<{ emoji: string; title: string } | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <div
            key={item.title}
            className="relative rounded-xl h-56 flex items-center justify-center text-6xl cursor-pointer overflow-hidden shadow-md hover:scale-[1.02] hover:shadow-xl transition-all"
            style={{ background: item.bg }}
            onClick={() => setLightbox(item)}
          >
            {item.emoji}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
              <span className="text-white text-xl font-bold">{item.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <div
            className="bg-white rounded-xl p-10 text-center max-w-sm w-[90%] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-gray-800 cursor-pointer bg-transparent border-none"
              onClick={() => setLightbox(null)}
            >
              ✕
            </button>
            <div className="text-8xl mb-4">{lightbox.emoji}</div>
            <h3 className="font-serif text-2xl">{lightbox.title}</h3>
          </div>
        </div>
      )}
    </>
  );
}

export default function GalleryPage() {
  return (
    <>
      <div className="pt-32 pb-16 text-center" style={{ background: 'linear-gradient(135deg,#1a1a1a 60%,#b5451b)' }}>
        <h1 className="font-serif text-5xl text-white mb-2">Gallery</h1>
        <p className="text-white/70 text-lg">A visual feast of our dishes, ambience &amp; moments</p>
      </div>

      <section className="py-20 max-w-6xl mx-auto px-6">
        <h2 className="section-title">Our Dishes</h2>
        <p className="section-subtitle">Click any photo to explore</p>
        <GalleryGrid items={DISHES} />
      </section>

      <section className="py-10 pb-20 max-w-6xl mx-auto px-6">
        <h2 className="section-title">Dining Experience</h2>
        <p className="section-subtitle">Inside SSR Restaurant</p>
        <GalleryGrid items={AMBIENCE} />
      </section>
    </>
  );
}
