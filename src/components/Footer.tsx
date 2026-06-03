'use client';

import Link from 'next/link';

const quickLinks = [
  { href: '/',             label: 'Home' },
  { href: '/about',        label: 'About Us' },
  { href: '/menu',         label: 'Menu' },
  { href: '/gallery',      label: 'Gallery' },
  { href: '/reservations', label: 'Reservations' },
  { href: '/delivery',     label: 'Delivery' },
  { href: '/contact',      label: 'Contact' },
];

export default function Footer() {
  return (
    <footer style={{ background: '#2c2c2c', color: '#ccc', padding: '50px 0 20px' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="font-serif text-2xl mb-3" style={{ color: '#f4a229' }}>
              SSR <span style={{ color: '#b5451b' }}>Restaurant</span>
            </div>
            <p className="text-sm">Authentic South Indian Andhra cuisine crafted with love and tradition.</p>
            <div className="flex gap-3 mt-4">
              {['f', 'ig', 'tw'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold transition-colors"
                  style={{ background: '#444' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#b5451b')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#444')}
                >
                  {s.toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-[#f4a229] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white font-bold mb-4">Opening Hours</h4>
            <ul className="space-y-2 text-sm">
              <li>Daily: 11 AM – 3:30 PM, 6 – 10:30 PM</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>📍 Opposite MRO Office, Beside Venkataramana Theatre, Main Road, Kaikalur, Andhra Pradesh, 521333</li>
              <li>📞 +91 9491437799</li>
              <li>✉️ ssrrestaurant007@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#444] pt-5 text-center text-sm text-[#888]">
          <p>&copy; {new Date().getFullYear()} SSR Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
