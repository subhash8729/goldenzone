import React, { useState } from 'react';
import { settingService } from '../services/api';
import { InstagramIcon, WhatsAppIcon } from '../components/Icons';
import {
  Phone,
  MessageCircle,
  Mail,
  Users,
  Send,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  Loader2
} from 'lucide-react';

export default function ContactPage({ settings = {} }) {
  const [formData, setFormData] = useState({
    name: '',
    mobile_number: '',
    email: '',
    subject: 'Jewellery Enquiry',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Values configured dynamically from admin/site settings with sensible brand fallbacks
  const phone = settings.contact_phone || '+917976580806';
  const whatsappNumber = settings.whatsapp_number || '+917976580806';
  const whatsappName = settings.whatsapp_contact_name || 'Rakesh Kumar';
  const whatsappUrl =
    settings.whatsapp_chat_url ||
    `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
      'Hello Golden Zone, I would like to inquire about your 1 gram gold-plated jewellery collection.'
    )}`;
  const instagramUrl = settings.instagram_url || 'https://instagram.com/goldenzone_official';
  const instagramUsername = settings.instagram_username || '@goldenzone_official';
  const email = settings.contact_email || 'support@goldenzone.com';
  const whatsappGroupUrl = settings.whatsapp_group_url || 'https://chat.whatsapp.com/invite/goldenzone';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.mobile_number.trim() || formData.mobile_number.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMsg('Please write your enquiry message.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await settingService.submitContact({
        name: formData.name.trim(),
        mobile_number: formData.mobile_number.replace(/\D/g, '').slice(-10),
        email: formData.email.trim() || null,
        subject: formData.subject.trim(),
        message: formData.message.trim()
      });

      if (res.data?.success) {
        setSuccessMsg('Thank you for reaching out! Your message has been received. Our team will contact you shortly.');
        setFormData({
          name: '',
          mobile_number: '',
          email: '',
          subject: 'Jewellery Enquiry',
          message: ''
        });
      } else {
        setErrorMsg(res.data?.message || 'Failed to submit enquiry. Please try again or WhatsApp us.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error sending message. You can also contact us directly on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px 56px' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span className="badge-gold" style={{ marginBottom: '8px' }}>
          <Sparkles size={12} /> WE ARE HERE TO HELP
        </span>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '2rem',
          color: '#520612',
          fontWeight: 700,
          marginTop: '6px',
          marginBottom: '8px'
        }}>
          Contact Golden Zone
        </h1>
        <p style={{
          fontSize: '0.88rem',
          color: '#6B635B',
          maxWidth: '560px',
          margin: '0 auto',
          lineHeight: 1.5
        }}>
          Have questions about sizing, designs, custom orders or existing deliveries? Connect with our dedicated jewellery specialists through any of the channels below.
        </p>
      </div>

      {/* Grid: Channels on Left, Enquiry Form on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left Column: Direct Communication Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* WhatsApp Support Card */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="product-card-wrap"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1.5px solid #25D366',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none',
              boxShadow: '0 2px 10px rgba(37, 211, 102, 0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                backgroundColor: '#DCFCE7',
                color: '#166534',
                borderRadius: '12px',
                width: '46px',
                height: '46px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MessageCircle size={24} color="#166534" />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Instant Support
                </span>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#1F1A17', marginTop: '1px' }}>
                  WhatsApp Chat
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#6B635B' }}>
                  Chat with {whatsappName} ({whatsappNumber})
                </p>
              </div>
            </div>
            <span style={{
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              fontSize: '0.76rem',
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: '9999px'
            }}>
              Chat Now
            </span>
          </a>

          {/* WhatsApp VIP Community Group Card */}
          <a
            href={whatsappGroupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="product-card-wrap"
            style={{
              backgroundColor: '#FAF7F2',
              borderRadius: '14px',
              border: '1.5px solid #C5A059',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                backgroundColor: '#F7EEDB',
                color: '#7D5C1E',
                borderRadius: '12px',
                width: '46px',
                height: '46px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Users size={24} color="#C5A059" />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#7D5C1E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  VIP Community
                </span>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#520612', marginTop: '1px' }}>
                  WhatsApp Members Group
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#6B635B' }}>
                  Early new arrivals, festival offers & VIP drops
                </p>
              </div>
            </div>
            <span style={{
              backgroundColor: '#520612',
              color: '#FFFFFF',
              fontSize: '0.76rem',
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: '9999px'
            }}>
              Join Group
            </span>
          </a>

          {/* Telephone Call Support Card */}
          <a
            href={`tel:${phone}`}
            className="product-card-wrap"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #E8E2D9',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                backgroundColor: '#F3ECE1',
                borderRadius: '12px',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Phone size={22} color="#520612" />
              </div>
              <div>
                <span style={{ fontSize: '0.70rem', color: '#8E857C', fontWeight: 600, textTransform: 'uppercase' }}>
                  Direct Calling
                </span>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1F1A17' }}>
                  {phone}
                </h3>
                <p style={{ fontSize: '0.74rem', color: '#6B635B' }}>
                  Mon - Sat, 10:00 AM to 8:00 PM IST
                </p>
              </div>
            </div>
            <span className="btn-outline" style={{ padding: '5px 12px', fontSize: '0.74rem' }}>
              Call
            </span>
          </a>

          {/* Instagram Official Card */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="product-card-wrap"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #E8E2D9',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                backgroundColor: '#FCE7F3',
                borderRadius: '12px',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <InstagramIcon size={22} color="#BE185D" />
              </div>
              <div>
                <span style={{ fontSize: '0.70rem', color: '#BE185D', fontWeight: 600, textTransform: 'uppercase' }}>
                  Social Gallery
                </span>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1F1A17' }}>
                  {instagramUsername}
                </h3>
                <p style={{ fontSize: '0.74rem', color: '#6B635B' }}>
                  Follow for real jewellery video unboxings
                </p>
              </div>
            </div>
            <span className="btn-outline" style={{ padding: '5px 12px', fontSize: '0.74rem' }}>
              Follow
            </span>
          </a>

          {/* Support Email Card */}
          <a
            href={`mailto:${email}`}
            className="product-card-wrap"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #E8E2D9',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                backgroundColor: '#F3ECE1',
                borderRadius: '12px',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Mail size={22} color="#520612" />
              </div>
              <div>
                <span style={{ fontSize: '0.70rem', color: '#8E857C', fontWeight: 600, textTransform: 'uppercase' }}>
                  Email Support
                </span>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1F1A17' }}>
                  {email}
                </h3>
                <p style={{ fontSize: '0.74rem', color: '#6B635B' }}>
                  Official inquiries & custom orders
                </p>
              </div>
            </div>
            <span className="btn-outline" style={{ padding: '5px 12px', fontSize: '0.74rem' }}>
              Email
            </span>
          </a>

          {/* Assurance info pill */}
          <div style={{
            backgroundColor: '#F3ECE1',
            borderRadius: '12px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <ShieldCheck size={20} color="#520612" />
            <p style={{ fontSize: '0.74rem', color: '#520612', fontWeight: 600 }}>
              Golden Zone Assurance: Free insured delivery across India with same-day dispatch for prepaid Razorpay orders.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Enquiry Form */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E8E2D9',
          padding: '24px 20px',
          boxShadow: '0 4px 20px rgba(82, 6, 18, 0.05)'
        }}>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.25rem',
            color: '#520612',
            fontWeight: 700,
            marginBottom: '4px'
          }}>
            Send Us an Enquiry
          </h2>
          <p style={{ fontSize: '0.78rem', color: '#6B635B', marginBottom: '16px' }}>
            Leave your contact details and query. Our jewellery team will review and reply within a few hours.
          </p>

          {successMsg && (
            <div style={{
              backgroundColor: '#DCFCE7',
              border: '1px solid #86EFAC',
              color: '#166534',
              fontSize: '0.82rem',
              padding: '12px 14px',
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              fontSize: '0.82rem',
              padding: '12px 14px',
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#1F1A17', marginBottom: '4px' }}>
                Your Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Subhash Dhaka"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D4C9BC',
                  fontSize: '0.85rem',
                  outline: 'none',
                  backgroundColor: '#FAF7F2'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#1F1A17', marginBottom: '4px' }}>
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  placeholder="10-digit mobile"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D4C9BC',
                    fontSize: '0.85rem',
                    outline: 'none',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#1F1A17', marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D4C9BC',
                    fontSize: '0.85rem',
                    outline: 'none',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#1F1A17', marginBottom: '4px' }}>
                Enquiry Subject
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D4C9BC',
                  fontSize: '0.85rem',
                  outline: 'none',
                  backgroundColor: '#FAF7F2'
                }}
              >
                <option value="Jewellery Enquiry">Product & Design Enquiry</option>
                <option value="Size & Fitting">Ring / Kada / Chain Sizing Help</option>
                <option value="Order Tracking">Order & Dispatch Status</option>
                <option value="Payment Inquiry">Razorpay Payment Inquiry</option>
                <option value="Custom Bulk Order">Custom / Festive Bulk Order</option>
                <option value="Other">Other Query</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#1F1A17', marginBottom: '4px' }}>
                Your Message / Query *
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we assist you today? Please mention design name or SKU if inquiring about a specific piece."
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D4C9BC',
                  fontSize: '0.85rem',
                  outline: 'none',
                  backgroundColor: '#FAF7F2',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-maroon"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.90rem',
                marginTop: '4px',
                boxShadow: '0 4px 14px rgba(82, 6, 18, 0.2)'
              }}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending Message...
                </>
              ) : (
                <>
                  <Send size={15} /> SUBMIT ENQUIRY
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
