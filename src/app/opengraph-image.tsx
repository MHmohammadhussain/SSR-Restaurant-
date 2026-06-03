import { ImageResponse } from 'next/og';
import { absoluteUrl } from '@/lib/seo';

export const runtime = 'edge';
export const alt = 'SSR Restaurant — Authentic Andhra Cuisine';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 45%, #b5451b 100%)',
          color: '#fff',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div
            style={{
              alignSelf: 'flex-start',
              padding: '10px 18px',
              borderRadius: '999px',
              background: 'rgba(244,162,41,0.18)',
              color: '#ffd08a',
              fontSize: '28px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            SSR Restaurant
          </div>
          <div style={{ maxWidth: '820px', fontSize: '72px', lineHeight: 1.06, fontWeight: 800 }}>
            Authentic Andhra Cuisine
          </div>
          <div style={{ maxWidth: '760px', fontSize: '28px', lineHeight: 1.45, color: 'rgba(255,255,255,0.9)' }}>
            Bold biryani, rich curries, and fresh flavors served in Kaikalur, Andhra Pradesh.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '24px', color: 'rgba(255,255,255,0.92)' }}>
            <div>📍 Opposite MRO Office, Beside Venkataramana Theatre, Main Road, Kaikalur</div>
            <div>📞 +91 9491437799</div>
            <div>🌐 {absoluteUrl('/')}</div>
          </div>
          <div
            style={{
              width: '220px',
              height: '220px',
              borderRadius: '32px',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px',
              fontWeight: 800,
            }}
          >
            Andhra
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
