import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Code Fox - AI-Powered Code Reviews | codefox.nawin.xyz'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1da1f2 0%, #0d8bd9 40%, #0a7bc4 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '50px',
          position: 'relative',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 30px 30px, rgba(255,255,255,0.12) 2px, transparent 0)',
            backgroundSize: '60px 60px',
            opacity: 0.5,
          }}
        />

        {/* Twitter handle badge */}
        <div
          style={{
            position: 'absolute',
            top: '30px',
            right: '40px',
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: '700',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          @codefox
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            zIndex: 1,
            maxWidth: '900px',
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: '120px',
              height: '120px',
              background: 'white',
              borderRadius: '25px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              fontSize: '60px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              border: '4px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            🦊
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 12px 0',
              lineHeight: 1,
              letterSpacing: '-0.01em',
              textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            Code Fox
          </h1>

          {/* Subtitle with verification style */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <h2
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: 'rgba(255, 255, 255, 0.95)',
                margin: '0',
                lineHeight: 1.2,
              }}
            >
              AI-Powered Code Reviews
            </h2>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: '22px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0 0 32px 0',
              maxWidth: '650px',
              lineHeight: 1.4,
              fontWeight: '500',
            }}
          >
            Connect GitHub repos. Get instant AI feedback on every PR. Ship better code, faster.
          </p>

          {/* Feature badges */}
          <div
            style={{
              display: 'flex',
              gap: '14px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {[
              { name: 'AI Reviews', icon: '🤖' },
              { name: 'GitHub', icon: '🔗' },
              { name: 'Custom Rules', icon: '📋' },
              { name: 'Fast', icon: '⚡' },
            ].map((feature) => (
              <span
                key={feature.name}
                style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  color: 'white',
                  padding: '10px 18px',
                  borderRadius: '25px',
                  fontSize: '18px',
                  fontWeight: '700',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>{feature.icon}</span>
                {feature.name}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div
            style={{
              marginTop: '32px',
              background: 'white',
              color: '#1da1f2',
              padding: '12px 24px',
              borderRadius: '30px',
              fontSize: '18px',
              fontWeight: '700',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
            }}
          >
            codefox.nawin.xyz
          </div>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: 'white',
            opacity: 0.8,
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
