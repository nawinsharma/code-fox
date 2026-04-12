import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Code Fox - AI-Powered Code Review Platform for GitHub'
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
          background: 'linear-gradient(135deg, #021a0f 0%, #0a2818 50%, #0f3d24 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
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
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(16, 185, 129, 0.1) 2px, transparent 0)',
            backgroundSize: '50px 50px',
            opacity: 0.3,
          }}
        />

        {/* Top badge */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#10b981',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            border: '1px solid rgba(16, 185, 129, 0.4)',
          }}
        >
          codefox.nawin.xyz
        </div>

        {/* Main content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            zIndex: 1,
            maxWidth: '1000px',
          }}
        >
          {/* Fox icon */}
          <div
            style={{
              width: '100px',
              height: '100px',
              background: 'rgba(16, 185, 129, 0.15)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              fontSize: '50px',
              border: '2px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            🦊
          </div>

          {/* Name with gradient */}
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #ffffff 0%, #10b981 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              margin: '0 0 16px 0',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            Code Fox
          </h1>

          {/* Subtitle */}
          <h2
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#10b981',
              margin: '0 0 24px 0',
              lineHeight: 1.2,
              textShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
            }}
          >
            AI-Powered Code Reviews
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: '20px',
              color: '#e5e7eb',
              margin: '0 0 32px 0',
              maxWidth: '700px',
              lineHeight: 1.5,
              opacity: 0.9,
            }}
          >
            Connect your GitHub repos and get instant, intelligent code review feedback on every pull request
          </p>

          {/* Feature badges */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {['AI Reviews', 'GitHub Integration', 'Custom Rules', 'PR Automation'].map((feature) => (
              <span
                key={feature}
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)',
                }}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #10b981 0%, #059669 50%, #047857 100%)',
            boxShadow: '0 -2px 10px rgba(16, 185, 129, 0.3)',
          }}
        />

        {/* Side decorative elements */}
        <div
          style={{
            position: 'absolute',
            left: '40px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '4px',
            height: '100px',
            background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
            borderRadius: '2px',
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '40px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '4px',
            height: '100px',
            background: 'linear-gradient(180deg, #059669 0%, #047857 100%)',
            borderRadius: '2px',
            opacity: 0.6,
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
