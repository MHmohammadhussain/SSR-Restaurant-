import type { Metadata } from 'next';
import { Lato, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingContactActions from '@/components/FloatingContactActions';
import { absoluteUrl } from '@/lib/seo';

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'SSR Restaurant — Authentic Andhra Cuisine',
    template: '%s — SSR Restaurant',
  },
  description:
    'Experience the bold, fiery flavours of authentic South Indian Andhra cuisine at SSR Restaurant, Hyderabad.',
  openGraph: {
    type: 'website',
    siteName: 'SSR Restaurant',
    title: 'SSR Restaurant — Authentic Andhra Cuisine',
    description:
      'Experience the bold, fiery flavours of authentic South Indian Andhra cuisine at SSR Restaurant, Hyderabad.',
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
    description:
      'Experience the bold, fiery flavours of authentic South Indian Andhra cuisine at SSR Restaurant, Hyderabad.',
    images: [absoluteUrl('/images/home/designer-6.png')],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${lato.variable} ${playfair.variable} antialiased`}>
        <Navbar />
        <main className="pb-16 md:pb-0">{children}</main>
        <FloatingContactActions />
        <Footer />
      </body>
    </html>
  );
}
