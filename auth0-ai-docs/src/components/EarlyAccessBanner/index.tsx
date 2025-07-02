import React, { useState, useEffect } from 'react';
import { DOCUSAURUS_MOBILE_BREAKPOINT } from '../../../constants';

interface BannerProps {
  href: string;
}

export default function EarlyAccessBanner({ href }: BannerProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < DOCUSAURUS_MOBILE_BREAKPOINT);
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      id="early-access-banner"
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row', // Stack content when mobile
        width: '100%',
        maxWidth: '760px',
        padding: '4px',
        alignItems: 'center',
        borderRadius: '16px',
        border: '1px solid #383838',
        background: '#111111', // color_bg_layer
        boxShadow: `
          0px 4px 4px -2px rgba(0, 0, 0, 0.04),
          0px 2px 2px -1px rgba(0, 0, 0, 0.04),
          0px 1px 1px -0.5px rgba(0, 0, 0, 0.04),
          0px -1.5px 1.5px -1.5px rgba(0, 0, 0, 0.04) inset,
          0px 3px 3px -1.5px rgba(251, 251, 251, 0.20) inset
        `,
        position: 'relative',
        overflow: 'hidden',
        textAlign: isMobile ? 'center' : 'left',
        justifyContent: isMobile ? 'center' : 'space-between',
      }}
    >
      {/* Left Content */}
      <div
        style={{
          flex: '1 0 0',
          padding: isMobile ? '24px' : '40px',
          zIndex: 1,
          maxWidth: isMobile ? '100%' : '60%', // Full width when mobile
        }}
      >
        <h2
          style={{
            color: '#FBFBFB', // color_fg_bold
            fontFamily: 'Aeonik, sans-serif',
            fontSize: '32px',
            fontWeight: '500',
            lineHeight: '40px',
            letterSpacing: '0.64px',
            marginBottom: '12px',
          }}
        >
          Developer Preview Program
        </h2>
        <p
          style={{
            color: '#ABABAB',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: '400',
            lineHeight: '22px',
            letterSpacing: '0px',
            marginBottom: '24px',
          }}
        >
          Auth for GenAI is currently available in Developer Preview. Join today
          to start building secure GenAI applications and provide feedback to
          shape the platform's future.
        </p>

        {/* CTA Button */}
        <a href={href} style={{ textDecoration: 'none' }}>
          <button
            style={{
              display: 'flex',
              padding: '4px 12px',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '16px',
              background: '#FFFFFF', // color_bg_button
              color: '#191919',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
              lineHeight: '24px', // 171.429%
              border: 'none',
              cursor: 'pointer',
              margin: isMobile ? '0 auto' : '0', // Center button on mobile
            }}
          >
            Join Developer Preview Program
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M6 4L10 8L6 12"
                stroke="#191919"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </a>
      </div>

      {/* Right Background Image (Hides on Mobile) */}
      {!isMobile && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            flex: '1 0 0',
            alignSelf: 'stretch',
            minHeight: '200px',
            width: '288px', // Fixed width based on spec
            backgroundImage:
              "url('https://cdn.auth0.com/website/auth0ai/bannerimage.png')",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            borderRadius: '120px 12px 12px 4px',
            border: '1px solid rgba(0, 0, 0, 0.04)',
            backgroundColor: 'rgba(25, 25, 25, 0.08)', // Ensures fallback background
            boxShadow: '0px -2px 8px 0px rgba(0, 0, 0, 0.04) inset',
            zIndex: 0,
          }}
        />
      )}
    </div>
  );
}
