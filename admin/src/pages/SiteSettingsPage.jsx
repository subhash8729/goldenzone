import React, { useState, useEffect } from 'react';
import { adminSettingService } from '../services/api';
import { Save, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    adminSettingService.getSettings()
      .then((res) => {
        if (res.data?.settings) {
          setSettings(res.data.settings);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await adminSettingService.updateSettings(settings);
      setSuccessMsg('Settings updated successfully! Changes reflect across the storefront.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', color: '#64748B' }}>Loading settings...</div>;
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.45rem', color: '#520612', fontWeight: 700 }}>
          Site Settings & Brand Configuration
        </h1>
        <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
          Update homepage hero, announcement bar, social links, and contact channels without modifying code
        </p>
      </div>

      {successMsg && (
        <div style={{
          backgroundColor: '#DCFCE7',
          border: '1px solid #86EFAC',
          color: '#166534',
          fontSize: '0.82rem',
          padding: '10px 14px',
          borderRadius: '8px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'grid', gap: '20px' }}>
        {/* HERO BANNER SECTION */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '18px' }}>
          <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#520612', marginBottom: '12px' }}>
            1. Hero Banner Settings
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label className="form-label">Static Hero Image URL</label>
              <input
                type="url"
                value={settings.hero_image || ''}
                onChange={(e) => handleChange('hero_image', e.target.value)}
                placeholder="https://..."
                className="form-input"
              />
              {settings.hero_image && (
                <img
                  src={settings.hero_image}
                  alt="Hero Preview"
                  style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px', marginTop: '8px', border: '1px solid #CBD5E1' }}
                  onError={(e) => (e.target.style.display = 'none')}
                />
              )}
            </div>
            <div>
              <label className="form-label">Hero Main Title</label>
              <input
                type="text"
                value={settings.hero_title || ''}
                onChange={(e) => handleChange('hero_title', e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Hero Subtitle</label>
              <textarea
                rows={2}
                value={settings.hero_subtitle || ''}
                onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                className="form-input"
                style={{ resize: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* ANNOUNCEMENT STRIP */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '18px' }}>
          <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#520612', marginBottom: '12px' }}>
            2. Header Announcement Strip
          </h3>
          <div>
            <label className="form-label">Announcement Text</label>
            <input
              type="text"
              value={settings.announcement_bar || ''}
              onChange={(e) => handleChange('announcement_bar', e.target.value)}
              placeholder="PREMIUM 1 GRAM GOLD-PLATED JEWELLERY | SAME DAY DISPATCH"
              className="form-input"
            />
          </div>
        </div>

        {/* WHATSAPP & CONTACT DETAILS */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '18px' }}>
          <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#520612', marginBottom: '12px' }}>
            3. WhatsApp & Social Contacts
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label">WhatsApp Number</label>
              <input
                type="text"
                value={settings.whatsapp_number || ''}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                placeholder="+917976580806"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">WhatsApp Contact Person</label>
              <input
                type="text"
                value={settings.whatsapp_contact_name || ''}
                onChange={(e) => handleChange('whatsapp_contact_name', e.target.value)}
                placeholder="Rakesh Kumar"
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
            <div>
              <label className="form-label">Call Support Telephone</label>
              <input
                type="text"
                value={settings.contact_phone || ''}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Official Support Email</label>
              <input
                type="email"
                value={settings.contact_email || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
            <div>
              <label className="form-label">WhatsApp VIP Group Link</label>
              <input
                type="url"
                value={settings.whatsapp_group_url || ''}
                onChange={(e) => handleChange('whatsapp_group_url', e.target.value)}
                placeholder="https://chat.whatsapp.com/..."
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Instagram Profile URL</label>
              <input
                type="url"
                value={settings.instagram_url || ''}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* FOOTER & BRAND DESCRIPTION */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '18px' }}>
          <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#520612', marginBottom: '12px' }}>
            4. Brand Story & Footer Text
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label className="form-label">Brand Description (Footer & About page)</label>
              <textarea
                rows={3}
                value={settings.brand_description || ''}
                onChange={(e) => handleChange('brand_description', e.target.value)}
                className="form-input"
                style={{ resize: 'none' }}
              />
            </div>
            <div>
              <label className="form-label">Footer Copyright Line</label>
              <input
                type="text"
                value={settings.footer_text || ''}
                onChange={(e) => handleChange('footer_text', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary"
          style={{ padding: '12px 24px', fontSize: '0.90rem', justifySelf: 'start' }}
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save Site Settings'}
        </button>
      </form>
    </div>
  );
}
