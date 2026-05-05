'use client';

import { useState } from 'react';
import Image from 'next/image';

const IMAGES = [
  '/gallery/1.jpg',
  '/gallery/2.jpg',
  '/gallery/3.webp',
  '/gallery/4.webp',
  '/gallery/5.webp',
  '/gallery/6.webp',
  '/gallery/7.webp',
  '/gallery/8.webp',
  '/gallery/9.webp',
  '/gallery/10.webp',
  '/gallery/11.webp',
  '/gallery/12.webp',
  '/gallery/13.webp',
  '/gallery/14.webp',
  '/gallery/15.webp',
  '/gallery/16.webp',
  '/gallery/17.webp',
  '/gallery/18.webp',
  '/gallery/19.webp',
  '/gallery/20.webp',
  '/gallery/21.webp',
  '/gallery/22.webp',
  '/gallery/23.webp',
  '/gallery/24.webp',
  '/gallery/25.webp',
  '/gallery/26.webp',
  '/gallery/27.webp',
];

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);

  function openLightbox(src: string) {
    setCurrent(IMAGES.indexOf(src));
    setLightbox(src);
  }

  function prev(e: React.MouseEvent) {
    e.stopPropagation();
    const idx = (current - 1 + IMAGES.length) % IMAGES.length;
    setCurrent(idx);
    setLightbox(IMAGES[idx]);
  }

  function next(e: React.MouseEvent) {
    e.stopPropagation();
    const idx = (current + 1) % IMAGES.length;
    setCurrent(idx);
    setLightbox(IMAGES[idx]);
  }

  return (
    <>
      <div className="pt-32 pb-16 text-center" style={{ background: 'linear-gradient(135deg,#1a1a1a 60%,#b5451b)' }}>
        <h1 className="font-serif text-5xl text-white mb-2">Gallery</h1>
        <p className="text-white/70 text-lg">A visual feast of our dishes, ambience &amp; moments</p>
      </div>

      <section className="py-20 max-w-6xl mx-auto px-6">
        <h2 className="section-title">Our Photos</h2>
        <p className="section-subtitle">Click any photo to enlarge</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {IMAGES.map((src) => (
            <div
              key={src}
              className="relative rounded-xl overflow-hidden h-52 cursor-pointer shadow-md hover:scale-[1.02] hover:shadow-xl transition-all group"
              onClick={() => openLightbox(src)}
            >
              <Image
                src={src}
                alt="SSR Restaurant"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-5 text-white text-3xl bg-transparent border-none cursor-pointer z-10"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          <button
            className="absolute left-4 text-white text-4xl bg-black/40 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer border-none hover:bg-black/70 z-10"
            onClick={prev}
          >
            ‹
          </button>
          <div
            className="relative w-[90vw] max-w-3xl h-[75vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox}
              alt="SSR Restaurant"
              fill
              className="object-contain rounded-xl"
              sizes="90vw"
            />
          </div>
          <button
            className="absolute right-4 text-white text-4xl bg-black/40 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer border-none hover:bg-black/70 z-10"
            onClick={next}
          >
            ›
          </button>
          <p className="absolute bottom-4 text-white/60 text-sm">{current + 1} / {IMAGES.length}</p>
        </div>
      )}
    </>
  );
}
