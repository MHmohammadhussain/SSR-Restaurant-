import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { absoluteUrl } from '@/lib/seo';

const dishes = [
  { emoji: '🍗', name: 'Chicken Dum Biryani', desc: 'Slow-cooked dum biryani packed with bold spice.', price: '₹230', bg: 'linear-gradient(135deg,#b5451b,#f4a229)', image: '/images/menu/chicken-dum-biryani.jpg' },
  { emoji: '🍖', name: 'Mutton Dum Biryani', desc: 'Tender mutton layered in aromatic dum rice.', price: '₹400', bg: 'linear-gradient(135deg,#8b2252,#e87bb0)', image: '/images/menu/mutton-dum-biryani.jpg' },
  { emoji: '🦐', name: 'Prawns Pulav', desc: 'Fragrant prawn pulav with coastal-style masala.', price: '₹260', bg: 'linear-gradient(135deg,#1a6e7a,#5bc8d5)', image: '/images/menu/prawns-pulav.jpg' },
  { emoji: '🧀', name: 'Paneer Biryani', desc: 'Paneer cubes cooked in rich biryani masala.', price: '₹220', bg: 'linear-gradient(135deg,#2d7a35,#a4d86e)', image: '/images/menu/paneer-biryani.jpg' },
  { emoji: '🍗', name: 'Butter Chicken', desc: 'Creamy tomato gravy with juicy chicken.', price: '₹240', bg: 'linear-gradient(135deg,#c07530,#f9d05e)', image: '/images/menu/butter-chicken.jpg' },
  { emoji: '🍗', name: 'Chicken 65', desc: 'Crispy, spicy and always crowd-favorite.', price: '₹200', bg: 'linear-gradient(135deg,#7a2a0d,#d96f3f)', image: '/images/menu/chicken-65.jpg' },
];

const reviews = [
  { stars: 5, text: '"Chicken Dum Biryani was perfectly cooked and full of flavor. One of the best in town."', name: 'Priya Reddy' },
  { stars: 5, text: '"The Mutton Dum Biryani and Butter Chicken combo was outstanding. Great food and service!"', name: 'Venkat Rao' },
  { stars: 4, text: '"Loved the Paneer Biryani and Veg Fried Rice. Delivery was quick and food arrived hot."', name: 'Aditi Sharma' },
];

const restaurantSchema = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'SSR Restaurant',
  url: absoluteUrl('/'),
  image: absoluteUrl('/images/home/designer-6.png'),
  telephone: '+91 9491437799',
  priceRange: '₹₹',
  servesCuisine: ['Andhra', 'South Indian', 'Indian'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Opposite MRO Office, Beside Venkataramana Theatre, Main Road',
    addressLocality: 'Kaikalur',
    addressRegion: 'Andhra Pradesh',
    postalCode: '521333',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 16.5538119,
    longitude: 81.2157792,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '11:00',
      closes: '15:30',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '18:00',
      closes: '22:30',
    },
  ],
  menu: absoluteUrl('/menu'),
  acceptsReservations: true,
};

export const metadata: Metadata = {
  title: { absolute: 'SSR Restaurant — Authentic Andhra Cuisine' },
  description: 'Experience the bold, fiery flavours of authentic South Indian Andhra cuisine at SSR Restaurant, Hyderabad.',
  openGraph: {
    type: 'website',
    title: 'SSR Restaurant — Authentic Andhra Cuisine',
    description: 'Experience the bold, fiery flavours of authentic South Indian Andhra cuisine at SSR Restaurant, Hyderabad.',
    url: absoluteUrl('/'),
    images: [
      {
        url: absoluteUrl('/images/home/designer-6.png'),
        width: 1600,
        height: 1240,
        alt: 'SSR Restaurant signature dishes and ambience',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SSR Restaurant — Authentic Andhra Cuisine',
    description: 'Experience the bold, fiery flavours of authentic South Indian Andhra cuisine at SSR Restaurant, Hyderabad.',
    images: [absoluteUrl('/images/home/designer-6.png')],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
      />

      {/* ── Hero ── */}
      <section
        className="relative min-h-screen flex items-center"
        style={{
          background: 'url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&q=80) center/cover no-repeat',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(26,26,26,.82) 40%,rgba(181,69,27,.45))' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20">
          <p className="uppercase tracking-[3px] text-xs font-bold mb-4" style={{ color: '#f4a229' }}>
            South Indian · Andhra Style
          </p>
          <h1 className="text-5xl md:text-6xl font-serif text-white leading-tight mb-4">
            A Taste of<br /><span style={{ color: '#f4a229' }}>Andhra Pradesh</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-lg mb-8">
            Bold spices, rich gravies &amp; soul-warming recipes passed down through generations.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/menu" className="btn btn-primary">Explore Menu</Link>
            <Link href="/reservations" className="btn btn-outline">Book a Table</Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-14 bg-[#f4f4f4]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-2xl overflow-hidden shadow-md border border-black/5">
            <Image
              src="/images/home/designer-6.png"
              alt="SSR highlights: Authentic Flavours, Expert Chefs, Warm Ambience, and Fast Delivery"
              width={1600}
              height={1240}
              className="w-full h-auto block"
              sizes="(max-width: 1024px) 100vw, 1200px"
            />
          </div>
        </div>
      </section>

      {/* ── Signature Dishes ── */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <h2 className="section-title">Our Signature Dishes</h2>
        <p className="section-subtitle">A glimpse of the most-loved Andhra classics</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {dishes.map((d) => (
            <div key={d.name} className="rounded-xl overflow-hidden bg-white shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all">
              <div className="h-40 relative" style={!d.image ? { background: d.bg } : {}}>
                {d.image ? (
                  <Image src={d.image} alt={d.name} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
                ) : (
                  <div className="h-full flex items-center justify-center text-6xl">{d.emoji}</div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg mb-1">{d.name}</h3>
                <p className="text-sm text-[#777]">{d.desc}</p>
                <span className="block mt-3 font-bold text-lg" style={{ color: '#b5451b' }}>{d.price}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/menu" className="btn btn-primary">View Full Menu</Link>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20" style={{ background: '#1a1a1a' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="section-title" style={{ color: '#fff' }}>What Our Guests Say</h2>
          <p className="section-subtitle" style={{ color: '#aaa' }}>Real experiences from our valued customers</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {reviews.map((r) => (
              <div key={r.name} className="p-8 rounded-xl border-l-4" style={{ background: '#2c2c2c', borderColor: '#b5451b' }}>
                <div className="text-lg mb-3" style={{ color: '#f4a229' }}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
                <p className="text-[#ccc] italic text-sm">{r.text}</p>
                <p className="mt-4 font-bold" style={{ color: '#f4a229' }}>— {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg,#b5451b,#7a2a0d)' }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl text-white mb-3">Ready to Savour Andhra?</h2>
          <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,.85)' }}>Book your table today or order online for home delivery.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/reservations" className="btn btn-primary">Reserve a Table</Link>
            <Link href="/delivery" className="btn btn-outline">Order Online</Link>
          </div>
        </div>
      </section>
    </>
  );
}
