import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, UserCheck } from 'lucide-react';

export default function Hero({ settings = {} }) {
  const { isAuthenticated, openAuthModal, user } = useAuth();
  const navigate = useNavigate();

  const heroImage = settings.hero_image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1600&auto=format&fit=crop';
  const heroTitle = settings.hero_title || 'Golden Zone';
  const heroSubtitle = settings.hero_subtitle || 'Discover premium 1 gram gold-plated jewellery crafted to complement your style with timeless elegance.';

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
      // Approximately half the vertical height of full viewport reference video:
      height: '340px',
      minHeight: '280px',
      maxHeight: '440px',
      overflow: 'hidden',
      backgroundColor: '#3E030C'
    }}>
      {/* Background Static Image */}
      <img
        src={heroImage}
        alt="Golden Zone 1 Gram Gold-Plated Jewellery"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 35%',
          filter: 'brightness(0.65)'
        }}
        loading="eager"
      />

      {/* Warm Gradient Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(62,3,12,0.88) 0%, rgba(62,3,12,0.45) 60%, rgba(0,0,0,0.3) 100%)'
      }} />

      {/* Content Container */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 20px',
        color: '#FFFFFF'
      }}>
        {/* Subtle Brand Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(197, 160, 89, 0.25)',
          border: '1px solid rgba(197, 160, 89, 0.6)',
          padding: '4px 12px',
          borderRadius: '9999px',
          fontSize: '0.72rem',
          fontWeight: 600,
          color: '#F5E8C7',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '10px'
        }}>
          <Sparkles size={12} color="#C5A059" /> 1 Gram Gold-Plated
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
          fontWeight: 700,
          lineHeight: 1.15,
          color: '#FFFFFF',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          marginBottom: '8px'
        }}>
          {heroTitle}
        </h1>

        {/* Subtitle */}
        <p style={{
          maxWidth: '540px',
          fontSize: 'clamp(0.82rem, 2.5vw, 0.95rem)',
          color: '#F3ECE1',
          lineHeight: 1.45,
          marginBottom: '18px',
          fontWeight: 400
        }}>
          {heroSubtitle}
        </p>

        {/* CTA Button: Specifically LOGIN / REGISTER as instructed */}
        <button
          onClick={handleCtaClick}
          style={{
            backgroundColor: '#C5A059',
            color: '#1F1A17',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '9999px',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.25)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#d8b56d')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#C5A059')}
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
      </div>
    </section>
  );
}
