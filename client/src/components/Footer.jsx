import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Phone, Mail, MessageCircle, Sparkles } from 'lucide-react';
import { InstagramIcon } from './Icons';

export default function Footer({ settings = {} }) {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (sec) => {
    setOpenSection(openSection === sec ? null : sec);
  };

  const phone = settings.contact_phone || '+917976580806';
  const whatsappNumber = settings.whatsapp_number || '+917976580806';
  const whatsappGroup = settings.whatsapp_group_url || 'https://chat.whatsapp.com/invite/goldenzone';
  const instagramUrl = settings.instagram_url || 'https://instagram.com/goldenzone_official';
  const email = settings.contact_email || 'support@goldenzone.com';
  const brandDesc = settings.brand_description || 'Golden Zone brings thoughtfully designed 1 gram gold-plated jewellery for everyday and occasion wear. Timeless styling, rich aesthetics, and trustworthy craftsmanship.';

  return (
    <footer style={{
      backgroundColor: '#520612',
      color: '#F3ECE1',
      paddingTop: '36px',
      paddingBottom: '24px',
      borderTop: '3px solid #C5A059'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px' }}>
          <img
            src="https://www.photo-pick.com/online/api/v1/albums/601cea76-66de-49d8-bf5f-9b3544d4f902.jpg"
            alt="Golden Zone"
            style={{
              height: '52px',
              width: '52px',
              marginBottom: '10px',
              borderRadius: '8px',
              objectFit: 'contain',
              filter: 'brightness(1.05) drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
            }}
          />
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, letterSpacing: '0.04em' }}>
            Golden Zone
          </h3>
          <p style={{
            fontSize: '0.78rem',
            color: '#F5E8C7',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 600,
            margin: '4px 0 12px'
          }}>
            Specializing Exclusively in 1 Gram Gold-Plated Jewellery
          </p>
          <p style={{ fontSize: '0.82rem', color: '#D4C9BC', lineHeight: 1.5 }}>
            {brandDesc}
          </p>
        </div>

        {/* Links Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          borderTop: '1px solid rgba(197, 160, 89, 0.25)',
          paddingTop: '24px',
          marginBottom: '28px'
        }}>
          {/* Section: Shop */}
          <div>
            <div
              onClick={() => toggleSection('shop')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: '12px'
              }}
            >
              <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: '#FFFFFF', fontWeight: 600 }}>
                SHOP COLLECTIONS
              </h4>
              <ChevronDown
                size={18}
                color="#C5A059"
                style={{
                  transform: openSection === 'shop' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }}
              />
            </div>
            <div style={{
              display: openSection === 'shop' || window.innerWidth > 640 ? 'flex' : 'none',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '0.84rem'
            }}>
              <Link to="/shop" style={{ color: '#D4C9BC' }}>Shop All Jewellery</Link>
              <Link to="/shop?category=chain" style={{ color: '#D4C9BC' }}>Men's Chains</Link>
              <Link to="/shop?category=bali" style={{ color: '#D4C9BC' }}>Men's Balis</Link>
              <Link to="/shop?category=ring" style={{ color: '#D4C9BC' }}>Men's Rings</Link>
              <Link to="/shop?category=kada" style={{ color: '#D4C9BC' }}>Men's Kadas</Link>
              <Link to="/shop?category=bracelet" style={{ color: '#D4C9BC' }}>Men's Bracelets</Link>
            </div>
          </div>

          {/* Section: Quick Links & Trust */}
          <div>
            <div
              onClick={() => toggleSection('about')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: '12px'
              }}
            >
              <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: '#FFFFFF', fontWeight: 600 }}>
                ABOUT & POLICY
              </h4>
              <ChevronDown
                size={18}
                color="#C5A059"
                style={{
                  transform: openSection === 'about' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }}
              />
            </div>
            <div style={{
              display: openSection === 'about' || window.innerWidth > 640 ? 'flex' : 'none',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '0.84rem'
            }}>
              <Link to="/about" style={{ color: '#D4C9BC' }}>About Golden Zone</Link>
              <Link to="/contact" style={{ color: '#D4C9BC' }}>Contact & Help</Link>
              <Link to="/profile" style={{ color: '#D4C9BC' }}>Track Your Order</Link>
              <div style={{
                backgroundColor: 'rgba(0,0,0,0.25)',
                padding: '10px',
                borderRadius: '8px',
                marginTop: '6px',
                fontSize: '0.74rem',
                color: '#F5E8C7',
                lineHeight: 1.4
              }}>
                ℹ️ <strong>Transparency Note:</strong> All our pieces are crafted with 1 gram gold plating on premium base alloys. Not solid gold.
              </div>
            </div>
          </div>

          {/* Section: Contact & Social */}
          <div>
            <div
              onClick={() => toggleSection('contact')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: '12px'
              }}
            >
              <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: '#FFFFFF', fontWeight: 600 }}>
                CONNECT & SUPPORT
              </h4>
              <ChevronDown
                size={18}
                color="#C5A059"
                style={{
                  transform: openSection === 'contact' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }}
              />
            </div>
            <div style={{
              display: openSection === 'contact' || window.innerWidth > 640 ? 'flex' : 'none',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '0.84rem'
            }}>
              <a href={`tel:${phone}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D4C9BC' }}>
                <Phone size={15} color="#C5A059" /> {phone}
              </a>
              <a
                href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=Hello,%20I%20want%20to%20know%20more%20about%20Golden%20Zone%20jewellery.`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#25D366', fontWeight: 600 }}
              >
                <MessageCircle size={15} /> WhatsApp Chat
              </a>
              <a
                href={whatsappGroup}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  width: 'fit-content'
                }}
              >
                <MessageCircle size={13} /> Join WhatsApp VIP Group
              </a>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D4C9BC' }}>
                <InstagramIcon size={15} color="#C5A059" /> {settings.instagram_username || '@goldenzone_official'}
              </a>
              <a href={`mailto:${email}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D4C9BC' }}>
                <Mail size={15} color="#C5A059" /> {email}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div style={{
          borderTop: '1px solid rgba(197, 160, 89, 0.2)',
          paddingTop: '16px',
          textAlign: 'center',
          fontSize: '0.74rem',
          color: '#8E857C'
        }}>
          {settings.footer_text || '© 2026 Golden Zone. All rights reserved. 1 Gram Gold-Plated Jewellery.'}
        </div>
      </div>
    </footer>
  );
}
