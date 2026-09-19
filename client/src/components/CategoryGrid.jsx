import React from 'react';
import { Link } from 'react-router-dom';

export default function CategoryGrid({ categories = [] }) {
  return (
    <section style={{ padding: '24px 12px 16px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '1.45rem',
          color: '#520612',
          fontWeight: 700,
          marginBottom: '4px'
        }}>
          Shop by Category
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#6B635B' }}>
          Explore handcrafted 1 gram gold-plated collections for men
        </p>
      </div>

      {/* Horizontal scroll on mobile, flex-wrap centered on desktop */}
      <div
        className="no-scrollbar"
        style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          paddingBottom: '8px',
          justifyContent: categories.length > 5 ? 'flex-start' : 'center',
          alignItems: 'center'
        }}
      >
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/shop?category=${cat.slug}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              flexShrink: 0,
              width: '74px',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {/* Circular Category Thumbnail with gold border */}
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid #C5A059',
              padding: '2px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(82, 6, 18, 0.08)'
            }}>
              <img
                src={cat.image_url || 'https://pashupati.co/cdn/shop/files/B35A6888-45CE-4752-A4A2-7951A478EA61.jpg?v=1775994142&width=600'}
                alt={cat.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
                loading="lazy"
              />
            </div>
            <span style={{
              marginTop: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#1F1A17',
              textAlign: 'center'
            }}>
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
