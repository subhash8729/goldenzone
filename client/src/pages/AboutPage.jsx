import React from 'react';
import { Phone, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { InstagramIcon, WhatsAppIcon } from '../components/Icons';

export default function AboutPage({ settings = {} }) {
  const phone = settings.contact_phone || '9286129921';
  const whatsappNumber = settings.whatsapp_number || '+91 92861 29921';
  const instagramUrl = settings.instagram_url || 'https://www.instagram.com/goldenzone.in';
  const email = settings.contact_email || 'goldenzone676@gmail.com';
  const supportEmail = settings.support_email || 'support@goldenzone.in';
  const companyAddress = settings.company_address || 'Jyoti Nagar, Sanchore, Rajasthan, Jalore';
  const companyPincode = settings.company_pincode || '343041';

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px 60px' }}>
      {/* Brand Emblem */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <img
          src="https://res.cloudinary.com/dgxaol7mz/image/upload/v1789872272/ChatGPT_Image_Sep_19_2026_11_08_00_AM_nrqbem.png"
          alt="Golden Zone Logo"
          style={{
            height: '74px',
            width: '74px',
            borderRadius: '8px',
            objectFit: 'contain',
            marginBottom: '12px'
          }}
        />
        <h1 style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', fontSize: '2rem', color: '#520612', fontWeight: 700 }}>
          Golden Zone
        </h1>
        <p style={{
          fontSize: '0.78rem',
          color: '#C5A059',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginTop: '4px'
        }}>
          1 Gram Gold-Plated Jewellery
        </p>
      </div>

      {/* Brand Story Box */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E8E2D9',
        padding: '28px 20px',
        boxShadow: '0 2px 12px rgba(82, 6, 18, 0.04)',
        lineHeight: 1.7,
        fontSize: '0.88rem',
        color: '#1F1A17',
        marginBottom: '28px'
      }}>
        <h2 style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', fontSize: '1.25rem', color: '#520612', fontWeight: 700, marginBottom: '12px' }}>
          Our Brand Philosophy
        </h2>
        <p style={{ marginBottom: '16px' }}>
          Golden Zone brings thoughtfully designed <strong>1 gram gold-plated jewellery</strong> for everyday and festive wear. We believe that fine personal styling should feel confident, elegant, and practical without the vulnerability and excessive expense of solid gold ornaments.
        </p>
        <p style={{ marginBottom: '16px' }}>
          Specializing in men's chains, balis, kadas, bracelets, and rings, our artisans combine timeless heritage motifs with modern lightweight alloys. Each piece receives an exquisite 1 gram gold plating that imparts a luminous, regal finish designed to accompany you through daily occasions and celebration milestones.
        </p>

        {/* Clear Brand Transparency Box */}
        <div style={{
          backgroundColor: '#FAF7F2',
          border: '1px solid #C5A059',
          borderRadius: '10px',
          padding: '14px 16px',
          marginTop: '20px'
        }}>
          <h3 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#520612', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <ShieldCheck size={16} color="#C5A059" /> Clear Category Transparency
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#6B635B', lineHeight: 1.5 }}>
            Our jewellery is strictly in the category of <strong>1 Gram Gold-Plated / Imitation Jewellery</strong>. We do not claim solid 22K/24K gold or bullion investment value. What we offer is honest craftsmanship, attractive styling, and trustworthy customer care.
          </p>
        </div>
      </div>

      {/* Contact & Social Section */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E8E2D9',
        padding: '24px 20px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', fontSize: '1.2rem', color: '#520612', fontWeight: 700, marginBottom: '6px' }}>
          Reach Out to Us
        </h2>
        <p style={{ fontSize: '0.80rem', color: '#6B635B', marginBottom: '20px' }}>
          We are always happy to help with product questions, sizing guidance, and order support.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '360px', margin: '0 auto' }}>
          <a
            href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=Hello,%20I%20want%20to%20know%20more%20about%20Golden%20Zone%20jewellery.`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              padding: '12px',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: '0.86rem',
              textDecoration: 'none'
            }}
          >
            <WhatsAppIcon size={20} /> Chat on WhatsApp ({settings.whatsapp_contact_name || 'Support'})
          </a>

          <a
            href={`tel:${phone}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#FAF7F2',
              border: '1px solid #D4C9BC',
              color: '#520612',
              padding: '11px',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: '0.86rem',
              textDecoration: 'none'
            }}
          >
            <Phone size={16} /> Direct Call: {phone}
          </a>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#FAF7F2',
              border: '1px solid #D4C9BC',
              color: '#520612',
              padding: '11px',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: '0.86rem',
              textDecoration: 'none'
            }}
          >
            <InstagramIcon size={16} color="#520612" /> Instagram: {settings.instagram_username || '@goldenzone.in'}
          </a>

          <a
            href={`mailto:${email}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#FAF7F2',
              border: '1px solid #D4C9BC',
              color: '#520612',
              padding: '11px',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: '0.86rem',
              textDecoration: 'none'
            }}
          >
            <Mail size={16} /> Email: {email}
          </a>

          {supportEmail && supportEmail !== email && (
            <a
              href={`mailto:${supportEmail}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: '#FAF7F2',
                border: '1px solid #D4C9BC',
                color: '#520612',
                padding: '11px',
                borderRadius: '9999px',
                fontWeight: 600,
                fontSize: '0.86rem',
                textDecoration: 'none'
              }}
            >
              <Mail size={16} /> Alt Support: {supportEmail}
            </a>
          )}

          <div style={{
            backgroundColor: '#FAF7F2',
            border: '1px solid #D4C9BC',
            borderRadius: '12px',
            padding: '12px',
            textAlign: 'center',
            fontSize: '0.82rem',
            color: '#6B635B',
            marginTop: '6px'
          }}>
            📍 <strong>Office:</strong> {companyAddress} • PIN: {companyPincode}
          </div>
        </div>
      </div>
    </div>
  );
}
