import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import AnnouncementBar from '../components/AnnouncementBar';
import CategoryGrid from '../components/CategoryGrid';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';
import { productService } from '../services/api';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw, Phone } from 'lucide-react';
import { WhatsAppIcon } from '../components/Icons';

export default function HomePage({ settings = {}, categories = [] }) {
  const [bestsellers, setBestsellers] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeProducts() {
      try {
        const [bestRes, recRes] = await Promise.all([
          productService.getProducts({ is_bestseller: '1', limit: 8 }),
          productService.getProducts({ is_recommended: '1', limit: 8 })
        ]);

        setBestsellers(bestRes.data?.data || []);
        setRecommended(recRes.data?.data || []);
      } catch (err) {
        console.error('Failed to load products for homepage:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeProducts();
  }, []);

  return (
    <div>
      {/* 1. Hero Section (Static image with LOGIN / REGISTER button) */}
      <Hero settings={settings} />

      {/* 2. Announcement Strip */}
      <AnnouncementBar text={settings.announcement_bar} />

      {/* 3. Shop by Category (Circular Icons) */}
      <CategoryGrid categories={categories} />

      {/* 4. Trust Badges Strip */}
      <section style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E8E2D9',
        borderBottom: '1px solid #E8E2D9',
        padding: '16px 12px',
        margin: '12px 0 24px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Sparkles size={20} color="#C5A059" style={{ marginBottom: '4px' }} />
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#520612' }}>1 Gram Gold-Plated</span>
            <span style={{ fontSize: '0.68rem', color: '#6B635B' }}>Premium Handcrafted Finish</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Truck size={20} color="#C5A059" style={{ marginBottom: '4px' }} />
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#520612' }}>Fast Dispatch</span>
            <span style={{ fontSize: '0.68rem', color: '#6B635B' }}>Delivered Safely in India</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ShieldCheck size={20} color="#C5A059" style={{ marginBottom: '4px' }} />
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#520612' }}>Secure Razorpay</span>
            <span style={{ fontSize: '0.68rem', color: '#6B635B' }}>100% Protected Payments</span>
          </div>
        </div>
      </section>

      {/* 5. Bestsellers Section (2-column mobile layout) */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 12px 28px' }}>
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <h2 style={{
            fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
            fontSize: '1.5rem',
            color: '#520612',
            fontWeight: 700,
            marginBottom: '4px'
          }}>
            Bestselling Jewellery
          </h2>
          <p style={{ fontSize: '0.80rem', color: '#6B635B' }}>
            Our most popular 1 gram gold-plated chains, balis & kadas
          </p>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            {bestsellers.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link
            to="/shop"
            className="btn-outline"
            style={{
              padding: '10px 28px',
              fontSize: '0.86rem',
              letterSpacing: '0.04em'
            }}
          >
            SHOP ALL BESTSELLERS <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 6. Brand Story / Showroom Banner */}
      <section style={{
        backgroundColor: '#520612',
        color: '#FFFFFF',
        margin: '20px 0 32px',
        padding: '36px 16px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <span style={{
            color: '#F5E8C7',
            fontSize: '0.74rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '8px'
          }}>
            Craftsmanship & Everyday Luxury
          </span>
          <h2 style={{
            fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
            fontSize: 'clamp(1.4rem, 4vw, 1.85rem)',
            fontWeight: 700,
            lineHeight: 1.3,
            marginBottom: '12px'
          }}>
            Authentic 1 Gram Gold-Plated Designs
          </h2>
          <p style={{
            fontSize: '0.84rem',
            color: '#D4C9BC',
            lineHeight: 1.6,
            marginBottom: '20px'
          }}>
            At Golden Zone, we take pride in curating thoughtfully designed 1 gram gold-plated pieces tailored for modern men. Enjoy the rich, lustrous aesthetic of royal gold jewellery made practical, lightweight, and versatile for everyday wear and festive occasions.
          </p>
          <Link
            to="/about"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#C5A059',
              color: '#1F1A17',
              padding: '9px 22px',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            Read Our Story <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* 7. Recommended For You */}
      {recommended.length > 0 && (
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 12px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '18px' }}>
            <h2 style={{
              fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
              fontSize: '1.5rem',
              color: '#520612',
              fontWeight: 700,
              marginBottom: '4px'
            }}>
              Curated Recommendations
            </h2>
            <p style={{ fontSize: '0.80rem', color: '#6B635B' }}>
              Handpicked pieces suited for traditional & casual styling
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            {recommended.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link
              to="/shop"
              className="btn-maroon"
              style={{
                padding: '11px 32px',
                fontSize: '0.88rem'
              }}
            >
              EXPLORE FULL COLLECTION
            </Link>
          </div>
        </section>
      )}

      {/* 8. Contact & Social Community Connect */}
      <section style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E8E2D9',
        padding: '30px 16px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', fontSize: '1.3rem', color: '#520612', fontWeight: 700, marginBottom: '6px' }}>
            Connect With Golden Zone
          </h3>
          <p style={{ fontSize: '0.80rem', color: '#6B635B', marginBottom: '20px' }}>
            Have questions about jewellery styling or urgent orders? Our support team is here to assist.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            <a
              href={`https://wa.me/${(settings.whatsapp_number || '919286129921').replace(/\D/g, '')}?text=Hello,%20I%20want%20to%20know%20more%20about%20Golden%20Zone%20jewellery.`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#25D366',
                color: '#FFFFFF',
                padding: '10px 18px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <WhatsAppIcon size={18} /> WhatsApp: {settings.whatsapp_contact_name || 'Golden Zone Support'}
            </a>

            <a
              href={`tel:${settings.contact_phone || '+919286129921'}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FAF7F2',
                color: '#520612',
                border: '1px solid #D4C9BC',
                padding: '10px 18px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <Phone size={16} /> Call Support
            </a>

            <a
              href={settings.whatsapp_group_url || 'https://chat.whatsapp.com/invite/goldenzone'}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#520612',
                color: '#FFFFFF',
                padding: '10px 18px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <WhatsAppIcon size={18} /> Join WhatsApp VIP Group
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
