import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'SSR Restaurant Gallery';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '56px', background: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
        <div>
          <div style={{ display: 'inline-block', padding: '10px 18px', borderRadius: '999px', background: 'rgba(244,162,41,0.18)', color: '#ffd08a', fontSize: '26px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>SSR Restaurant</div>
          <h1 style={{ margin: '22px 0 12px', fontSize: '72px', lineHeight: 1.05, fontWeight: 800 }}>Gallery</h1>
          <p style={{ maxWidth: '780px', fontSize: '28px', lineHeight: 1.45, color: 'rgba(255,255,255,0.9)' }}>A visual showcase of our food, ambience, and special moments at SSR Restaurant.</p>
        </div>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          {['Food Photos', 'Dining Ambience', 'Events', 'Memories'].map((label) => (
            <div key={label} style={{ padding: '12px 18px', borderRadius: '999px', background: 'rgba(255,255,255,0.14)', fontSize: '24px', fontWeight: 700 }}>{label}</div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
