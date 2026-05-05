'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
  { href: '/',             label: 'Home' },
  { href: '/about',        label: 'About' },
  { href: '/menu',         label: 'Menu' },
  { href: '/gallery',      label: 'Gallery' },
  { href: '/reservations', label: 'Reservations' },
  { href: '/delivery',     label: 'Delivery' },
  { href: '/contact',      label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md"
      style={{ background: 'rgba(26,26,26,0.95)' }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-[68px]">
        {/* Logo */}
        <Link href="/" className="font-serif text-2xl tracking-wide" style={{ color: '#f4a229' }}>
          SSR <span style={{ color: '#b5451b' }}>Restaurant</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-7 list-none">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`text-sm font-bold tracking-wide transition-colors duration-200 relative group ${
                    active ? 'text-[#f4a229]' : 'text-[#e0e0e0] hover:text-[#f4a229]'
                  }`}
                >
                  {label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-[#f4a229] transition-all duration-200 ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          <span className="block w-[26px] h-[2px] bg-white rounded transition-all" />
          <span className="block w-[26px] h-[2px] bg-white rounded transition-all" />
          <span className="block w-[26px] h-[2px] bg-white rounded transition-all" />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-[500px]' : 'max-h-0'}`}
        style={{ background: 'rgba(26,26,26,0.97)' }}
      >
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`block px-6 py-4 border-b border-[#333] text-sm font-bold transition-colors ${
              pathname === href ? 'text-[#f4a229]' : 'text-[#e0e0e0] hover:text-[#f4a229]'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
