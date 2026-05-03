import Link from 'next/link';

const values = [
  { icon: '🌿', title: 'Fresh Ingredients', desc: 'We source vegetables, spices and meats fresh daily from trusted local farmers and suppliers.' },
  { icon: '🤝', title: 'Genuine Hospitality', desc: 'Every guest is treated like family. We believe a warm welcome is as important as great food.' },
  { icon: '📜', title: 'Authentic Recipes', desc: 'Our kitchen follows traditional Andhra cooking techniques — no shortcuts, no compromises.' },
  { icon: '♻️', title: 'Sustainability', desc: 'We minimise waste, use eco-friendly packaging and support local communities wherever possible.' },
];

const team = [
  { emoji: '👨‍🍳', name: 'Ravi Kumar', role: 'Head Chef', desc: '25 years of Andhra culinary expertise. Trained in Vijayawada and Hyderabad\'s top kitchens.', bg: 'linear-gradient(135deg,#b5451b,#f4a229)' },
  { emoji: '👩‍🍳', name: 'Lakshmi Devi', role: 'Sous Chef', desc: 'Specialist in vegetarian Andhra dishes and traditional tiffin items like idly, dosa and uttapam.', bg: 'linear-gradient(135deg,#2d7a35,#a4d86e)' },
  { emoji: '👨‍💼', name: 'Suresh Naidu', role: 'Restaurant Manager', desc: 'Ensures every guest experience is warm, memorable and worthy of a second visit.', bg: 'linear-gradient(135deg,#1a6e7a,#5bc8d5)' },
];

const stats = [
  { num: '15+', label: 'Years Serving' },
  { num: '50+', label: 'Dishes on Menu' },
  { num: '10k+', label: 'Happy Customers' },
  { num: '4.8★', label: 'Average Rating' },
];

export const metadata = {
  title: 'About Us — SSR Restaurant',
  description: 'Learn about SSR Restaurant\'s story, heritage and passion for authentic Andhra cuisine.',
};

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <div className="pt-32 pb-16 text-center" style={{ background: 'linear-gradient(135deg,#1a1a1a 60%,#b5451b)' }}>
        <h1 className="font-serif text-5xl text-white mb-2">About Us</h1>
        <p className="text-white/70 text-lg">Our story, our passion, our heritage</p>
      </div>

      {/* Our Story */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <div
            className="rounded-xl h-80 flex items-center justify-center text-8xl shadow-xl"
            style={{ background: 'linear-gradient(135deg,#b5451b,#f4a229)' }}
          >
            🏡
          </div>
          <div>
            <h2 className="left-title">Our Story</h2>
            <p className="text-[#555] mb-4">
              SSR Restaurant was founded in 2010 with a simple yet powerful mission — to bring the bold, fiery and soulful flavours of Andhra Pradesh to every plate we serve. What began as a small family kitchen has grown into a beloved dining destination, cherished by locals and visitors alike.
            </p>
            <p className="text-[#555]">
              The name <strong>SSR</strong> honours our founder&apos;s grandmother, <em>Smt. Saraswathi Reddy</em>, whose age-old recipes form the very heart of our menu. Every dish we serve is a tribute to her legacy.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="section-title">Our Core Values</h2>
          <p className="section-subtitle">The principles that guide every meal we prepare</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div key={v.title} className="text-center p-8 rounded-xl bg-[#fdf6ec] shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all">
                <div className="text-4xl mb-3">{v.icon}</div>
                <h3 className="font-serif text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-[#777]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <h2 className="section-title">Meet Our Team</h2>
        <p className="section-subtitle">The talented people behind every dish</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {team.map((m) => (
            <div key={m.name} className="text-center bg-white rounded-xl p-10 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mx-auto mb-5"
                style={{ background: m.bg }}
              >
                {m.emoji}
              </div>
              <h3 className="font-serif text-xl mb-1">{m.name}</h3>
              <span className="text-xs font-bold uppercase tracking-wider block mb-3" style={{ color: '#b5451b' }}>{m.role}</span>
              <p className="text-sm text-[#777]">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg,#b5451b,#7a2a0d)' }}>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-serif text-4xl text-white font-bold mb-1">{s.num}</div>
              <div className="text-white/80 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
