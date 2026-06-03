import type { Metadata } from 'next';
import Image from 'next/image';
import { absoluteUrl } from '@/lib/seo';

const team = [
  {
    emoji: '👨‍💼',
    name: 'SAI Naidu',
    role: 'Owner & Co-Founder',
    desc: 'Leads the vision of SSR Restaurant with a focus on authentic taste, guest experience, and long-term excellence.',
    bg: 'linear-gradient(135deg,#1a6e7a,#5bc8d5)',
    image: '/images/about/sai-naidu.jpeg',
  },
  {
    emoji: '👨‍💼',
    name: 'Shivaji Naidu',
    role: 'Restaurant Manager',
    desc: 'Ensures smooth day-to-day operations and a warm, reliable dining experience for every guest.',
    bg: 'linear-gradient(135deg,#2d7a35,#a4d86e)',
    image: '/gallery/shivaji-new.jpeg',
    imageFit: 'cover',
    imagePosition: 'center 42%',
  },
  {
    emoji: '👨‍🍳',
    name: 'Sadik Hussain',
    role: 'Legendary Supporter',
    desc: 'A trusted supporter of the restaurant who helps keep the team motivated and the experience exceptional.',
    bg: 'linear-gradient(135deg,#b5451b,#f4a229)',
    image: '/images/about/sadik-hussain.png',
  },
];

const stats = [
  { num: '15+', label: 'Years Serving' },
  { num: '50+', label: 'Dishes on Menu' },
  { num: '10k+', label: 'Happy Customers' },
  { num: '4.8★', label: 'Average Rating' },
];

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about SSR Restaurant\'s story, heritage and passion for authentic Andhra cuisine.',
  openGraph: {
    type: 'website',
    title: 'About Us — SSR Restaurant',
    description: 'Learn about SSR Restaurant\'s story, heritage and passion for authentic Andhra cuisine.',
    url: absoluteUrl('/about'),
    images: [
      {
        url: absoluteUrl('/images/about/designer-7.png'),
        width: 1600,
        height: 1120,
        alt: 'SSR Restaurant about and team highlights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us — SSR Restaurant',
    description: 'Learn about SSR Restaurant\'s story, heritage and passion for authentic Andhra cuisine.',
    images: [absoluteUrl('/images/about/designer-7.png')],
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <div className="pt-32 pb-16 text-center" style={{ background: 'linear-gradient(135deg,#1a1a1a 60%,#b5451b)' }}>
        <h1 className="font-serif text-5xl text-white mb-2">About Us</h1>
        <p className="text-white/70 text-lg">SSR Restaurant in Kaikalur — where tradition meets innovation</p>
      </div>

      {/* Our Story */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <div className="relative rounded-xl h-80 overflow-hidden shadow-xl">
            <Image
              src="/gallery/25.webp"
              alt="SSR Restaurant"
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className="left-title">SSR Restaurant in Kaikalur</h2>
            <p className="text-[#555] mb-4">
              Located in the vibrant heart of Kaikalur, SSR Restaurant is a cherished culinary haven where tradition meets innovation. Known for its commitment to quality ingredients, delightful flavors, and exceptional service, SSR Restaurant invites you to savor a dining experience like no other.
            </p>
            <p className="text-[#555] mb-4">
              The restaurant&apos;s interior is elegantly designed to provide a cozy yet refined ambiance, with warm lighting and tasteful decor that make every meal feel special. Whether you&apos;re here for a quick bite or a leisurely gathering, the inviting atmosphere at SSR Restaurant ensures a memorable dining experience.
            </p>
            <p className="text-[#555]">
              For those who appreciate quality food, a warm atmosphere, and attentive service, SSR Restaurant in Kaikalur is a must-visit destination. With its extensive menu, accessible location, and dedication to customer satisfaction, SSR Restaurant promises an unforgettable dining experience.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-[#f4f4f4]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-2xl overflow-hidden shadow-md border border-black/5">
            <Image
              src="/images/about/designer-7.png"
              alt="SSR core values: Fresh Ingredients, Genuine Hospitality, Our Specialties, and Amenities"
              width={1600}
              height={1120}
              className="w-full h-auto block"
              sizes="(max-width: 1024px) 100vw, 1200px"
            />
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
              {m.image ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-5 ring-2 ring-white shadow-md">
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    className={m.imageFit === 'contain' ? 'object-contain bg-black' : 'object-cover'}
                    style={m.imagePosition ? { objectPosition: m.imagePosition } : undefined}
                    sizes="96px"
                  />
                </div>
              ) : (
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mx-auto mb-5"
                  style={{ background: m.bg }}
                >
                  {m.emoji}
                </div>
              )}
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
