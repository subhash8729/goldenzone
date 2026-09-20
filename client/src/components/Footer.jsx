import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Phone, Mail, Sparkles } from 'lucide-react';
import { InstagramIcon, WhatsAppIcon } from './Icons';

export default function Footer({ settings = {} }) {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (sec) => {
    setOpenSection(openSection === sec ? null : sec);
  };

  const phone = settings.contact_phone || '9286129921';
  const whatsappNumber = settings.whatsapp_number || '+91 92861 29921';
  const whatsappGroup = settings.whatsapp_group_url || 'https://chat.whatsapp.com/invite/goldenzone';
  const instagramUrl = settings.instagram_url || 'https://www.instagram.com/goldenzone.in';
  const email = settings.contact_email || 'goldenzone676@gmail.com';
  const supportEmail = settings.support_email || 'support@goldenzone.in';
  const companyAddress = settings.company_address || 'Jyoti Nagar, Sanchore, Rajasthan, Jalore';
  const companyPincode = settings.company_pincode || '343041';
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
            src="https://res.cloudinary.com/dgxaol7mz/image/upload/v1789872272/ChatGPT_Image_Sep_19_2026_11_08_00_AM_nrqbem.png"
            alt="Golden Zone"
            style={{
              height: '52px',
              width: '52px',
              margin: '0 auto 8px',
              borderRadius: '10px',
              objectFit: 'contain'
            }}
          />
          <h2 style={{
            fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
            fontSize: '1.4rem',
            color: '#C5A059',
            fontWeight: 700,
            letterSpacing: '0.04em'
          }}>
            Golden Zone
          </h2>
          <p style={{
            fontSize: '0.80rem',
            color: '#D4C9BC',
            lineHeight: 1.5,
            marginTop: '6px'
          }}>
            {brandDesc}
          </p>
          <p style={{
            fontSize: '0.76rem',
            color: '#C5A059',
            marginTop: '8px',
            fontWeight: 500
          }}>
            📍 {companyAddress} • PIN: {companyPincode}
          </p>
        </div>

        {/* Accordion / Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          paddingBottom: '28px'
        }}>
          {/* Section 1: Quick Links */}
          <div>
            <button
              onClick={() => toggleSection('links')}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'none',
                border: 'none',
                color: '#C5A059',
                fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
                fontSize: '0.98rem',
                fontWeight: 700,
                textAlign: 'left',
                padding: '8px 0',
                cursor: 'pointer'
              }}
            >
              <span>Quick Links</span>
              <span className="sm:hidden">{openSection === 'links' ? '−' : '+'}</span>
            </button>
            <ul style={{
              display: openSection === 'links' || window.innerWidth > 640 ? 'flex' : 'none',
              flexDirection: 'column',
              gap: '8px',
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontSize: '0.84rem'
            }}>
              <li><Link to="/shop" style={{ color: '#D4C9BC' }}>All Jewellery</Link></li>
              <li><Link to="/orders" style={{ color: '#D4C9BC' }}>Track Parcel Status</Link></li>
              <li><Link to="/about" style={{ color: '#D4C9BC' }}>About Golden Zone</Link></li>
              <li><Link to="/contact" style={{ color: '#D4C9BC' }}>Contact & Helpdesk</Link></li>
              <li><Link to="/profile" style={{ color: '#D4C9BC' }}>Customer Account</Link></li>
            </ul>
          </div>

          {/* Section 2: Customer Care & Policies */}
          <div>
            <button
              onClick={() => toggleSection('service')}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'none',
                border: 'none',
                color: '#C5A059',
                fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
                fontSize: '0.98rem',
                fontWeight: 700,
                textAlign: 'left',
                padding: '8px 0',
                cursor: 'pointer'
              }}
            >
              <span>Trust & Assurance</span>
              <span className="sm:hidden">{openSection === 'service' ? '−' : '+'}</span>
            </button>
            <ul style={{
              display: openSection === 'service' || window.innerWidth > 640 ? 'flex' : 'none',
              flexDirection: 'column',
              gap: '8px',
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontSize: '0.84rem',
              color: '#D4C9BC'
            }}>
              <li>✓ Authentic 1 Gram Micro Gold Plating</li>
              <li>✓ High Skin Comfort & Anti-Tarnish</li>
              <li>✓ Free Shipping Across All India</li>
              <li>✓ Insured Transit with Tamper-Evident Seal</li>
              <li>✓ Razorpay 256-Bit Bank Grade Encryption</li>
            </ul>
          </div>

          {/* Section 3: Contact & Support */}
          <div>
            <button
              onClick={() => toggleSection('contact')}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'none',
                border: 'none',
                color: '#C5A059',
                fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
                fontSize: '0.98rem',
                fontWeight: 700,
                textAlign: 'left',
                padding: '8px 0',
                cursor: 'pointer'
              }}
            >
              <span>Get In Touch</span>
              <span className="sm:hidden">{openSection === 'contact' ? '−' : '+'}</span>
            </button>
            <div style={{
              display: openSection === 'contact' || window.innerWidth > 640 ? 'flex' : 'none',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '0.84rem'
            }}>
              <a href={`tel:${phone}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D4C9BC', textDecoration: 'none' }}>
                <Phone size={15} color="#C5A059" /> {phone}
              </a>
              <a
                href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=Hello,%20I%20want%20to%20know%20more%20about%20Golden%20Zone%20jewellery.`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#25D366', fontWeight: 600, textDecoration: 'none' }}
              >
                <WhatsAppIcon size={16} /> WhatsApp: {whatsappNumber}
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
                  width: 'fit-content',
                  textDecoration: 'none'
                }}
              >
                <WhatsAppIcon size={15} /> Join WhatsApp VIP Group
              </a>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D4C9BC', textDecoration: 'none' }}>
                <InstagramIcon size={15} color="#C5A059" /> {settings.instagram_username || '@goldenzone.in'}
              </a>
              <a href={`mailto:${email}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D4C9BC', textDecoration: 'none' }}>
                <Mail size={15} color="#C5A059" /> {email}
              </a>
              {supportEmail && supportEmail !== email && (
                <a href={`mailto:${supportEmail}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D4C9BC', textDecoration: 'none' }}>
                  <Mail size={15} color="#C5A059" /> {supportEmail}
                </a>
              )}
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
