import Link from 'next/link';

const dishes = [
  { emoji: '🍗', name: 'Chicken Dum Biryani', desc: 'Slow-cooked dum biryani packed with bold spice.', price: '₹230', bg: 'linear-gradient(135deg,#b5451b,#f4a229)' },
  { emoji: '🍖', name: 'Mutton Dum Biryani', desc: 'Tender mutton layered in aromatic dum rice.', price: '₹400', bg: 'linear-gradient(135deg,#8b2252,#e87bb0)' },
  { emoji: '🦐', name: 'Prawns Pulav', desc: 'Fragrant prawn pulav with coastal-style masala.', price: '₹260', bg: 'linear-gradient(135deg,#1a6e7a,#5bc8d5)' },
  { emoji: '🧀', name: 'Paneer Biryani', desc: 'Paneer cubes cooked in rich biryani masala.', price: '₹220', bg: 'linear-gradient(135deg,#2d7a35,#a4d86e)' },
  { emoji: '🍗', name: 'Butter Chicken', desc: 'Creamy tomato gravy with juicy chicken.', price: '₹240', bg: 'linear-gradient(135deg,#c07530,#f9d05e)' },
  { emoji: '🍗', name: 'Chicken 65', desc: 'Crispy, spicy and always crowd-favorite.', price: '₹200', bg: 'linear-gradient(135deg,#7a2a0d,#d96f3f)' },
];

const features = [
  { icon: '🌶️', title: 'Authentic Flavours', desc: 'Every dish is crafted using traditional recipes, hand-ground spices and fresh local produce.' },
  { icon: '👨‍🍳', title: 'Expert Chefs', desc: 'Our chefs hail from Andhra Pradesh and bring decades of culinary heritage to every plate.' },
  { icon: '🏠', title: 'Warm Ambience', desc: 'Dine in a cozy, home-like setting inspired by traditional Telugu village hospitality.' },
  { icon: '🚚', title: 'Fast Delivery', desc: 'Enjoy the same restaurant-quality taste at home with our swift delivery service.' },
];

const reviews = [
  { stars: 5, text: '"Chicken Dum Biryani was perfectly cooked and full of flavor. One of the best in town."', name: 'Priya Reddy' },
  { stars: 5, text: '"The Mutton Dum Biryani and Butter Chicken combo was outstanding. Great food and service!"', name: 'Venkat Rao' },
  { stars: 4, text: '"Loved the Paneer Biryani and Veg Fried Rice. Delivery was quick and food arrived hot."', name: 'Aditi Sharma' },
];

export default function Home() {
  return (
    <>
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
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => (
            <div key={f.title} className="text-center p-10 rounded-xl bg-[#fdf6ec] shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-serif text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-[#777]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Signature Dishes ── */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <h2 className="section-title">Our Signature Dishes</h2>
        <p className="section-subtitle">A glimpse of the most-loved Andhra classics</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {dishes.map((d) => (
            <div key={d.name} className="rounded-xl overflow-hidden bg-white shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all">
              <div className="h-40 flex items-center justify-center text-6xl" style={{ background: d.bg }}>{d.emoji}</div>
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
