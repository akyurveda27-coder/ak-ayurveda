import { ImageResponse } from 'next/og'

// The card shown when the site is shared on WhatsApp, Facebook, LinkedIn.
export const runtime = 'edge'
export const alt = 'AK Ayurveda — Authentic Ayurvedic Clinic in London'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', background: '#0F3D34',
          fontFamily: 'Georgia, serif', textAlign: 'center', padding: '0 80px',
        }}
      >
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 92, height: 92, borderRadius: 999, background: '#D4A853',
            color: '#0F3D34', fontSize: 40, fontWeight: 700, marginBottom: 36,
          }}
        >
          AK
        </div>
        <div style={{ fontSize: 68, color: '#FFFFFF', fontWeight: 600, lineHeight: 1.15 }}>
          AK Ayurveda
        </div>
        <div style={{ fontSize: 30, color: '#D4A853', letterSpacing: 4, marginTop: 18 }}>
          AUTHENTIC AYURVEDIC CLINIC · LONDON
        </div>
      </div>
    ),
    size
  )
}
