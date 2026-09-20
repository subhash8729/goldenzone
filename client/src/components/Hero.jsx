import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, UserCheck, ShoppingBag } from 'lucide-react';

export default function Hero({ settings = {} }) {
  const { isAuthenticated, openAuthModal, user } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const heroVideo = settings.hero_video_url || 'https://res.cloudinary.com/dgxaol7mz/video/upload/v1789876791/videoplayback_hwcfti.mp4';
  const heroPoster = settings.hero_image || 'https://res.cloudinary.com/dgxaol7mz/image/upload/v1789872269/ChatGPT_Image_Sep_19_2026_11_08_00_AM_1_xjiro4.png';
  const heroTitle = settings.hero_title || 'Golden Zone';
  const heroSubtitle = settings.hero_subtitle || 'Discover premium 1 gram gold-plated jewellery crafted for timeless everyday style.';

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Handled silently for browser auto-play policy nuances
      });
    }
  }, [heroVideo]);

  const handleCtaClick = () => {
    if (!isAuthenticated) {
      openAuthModal();
    } else {
      navigate('/shop');
    }
  };

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      backgroundColor: '#0F0B08',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '340px',
      maxHeight: '540px',
      aspectRatio: '16 / 9'
    }}>
      {/* Background HTML5 AutoPlay Video */}
      <video
        ref={videoRef}
        key={heroVideo}
        src={heroVideo}
        poster={heroPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center'
        }}
      />

      {/* Clean Subtle Dark Scrim (No pink/red overlay) for text legibility */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.25) 50%, rgba(0, 0, 0, 0.45) 100%)',
        pointerEvents: 'none'
      }} />

      {/* Minimal Brand & Action Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 20px',
        color: '#FFFFFF',
        maxWidth: '720px'
      }}>
        {/* Subtle Brand Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(197, 160, 89, 0.25)',
          border: '1px solid rgba(197, 160, 89, 0.65)',
          padding: '4px 14px',
          borderRadius: '9999px',
          fontSize: '0.74rem',
          fontWeight: 700,
          color: '#F5E8C7',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '12px',
          backdropFilter: 'blur(4px)'
        }}>
          <Sparkles size={13} color="#C5A059" /> 1 Gram Gold-Plated
        </div>

        {/* Hero Title using Plus Jakarta Sans */}
        <h1 style={{
          fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
          fontSize: 'clamp(2rem, 5.5vw, 3.25rem)',
          fontWeight: 800,
          lineHeight: 1.12,
          color: '#FFFFFF',
          textShadow: '0 2px 12px rgba(0, 0, 0, 0.6)',
          marginBottom: '8px',
          letterSpacing: '-0.01em'
        }}>
          {heroTitle}
        </h1>

        {/* Minimal Subtitle */}
        <p style={{
          fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
          maxWidth: '520px',
          fontSize: 'clamp(0.82rem, 2.2vw, 0.94rem)',
          color: '#F3ECE1',
          lineHeight: 1.45,
          marginBottom: '20px',
          fontWeight: 500,
          textShadow: '0 1px 6px rgba(0, 0, 0, 0.5)'
        }}>
          {heroSubtitle}
        </p>

        {/* Action Button */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={handleCtaClick}
            style={{
              fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
              backgroundColor: '#C5A059',
              color: '#1F1A17',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '9999px',
              fontSize: '0.90rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 18px rgba(0, 0, 0, 0.4)',
              transition: 'transform 0.15s ease, background-color 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#D4B36D';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#C5A059';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {isAuthenticated ? (
              <>
                <UserCheck size={16} /> Welcome, {user?.full_name?.split(' ')[0]} — Shop Now
              </>
            ) : (
              <>
                LOGIN / REGISTER <ArrowRight size={16} />
              </>
            )}
          </button>

          <button
            onClick={() => navigate('/shop')}
            style={{
              fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              border: '1.5px solid rgba(255, 255, 255, 0.5)',
              padding: '12px 24px',
              borderRadius: '9999px',
              fontSize: '0.90rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backdropFilter: 'blur(6px)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
            }}
          >
            <ShoppingBag size={16} /> EXPLORE DESIGNS
          </button>
        </div>
      </div>
    </section>
  );
}
