import React from 'react';
import { Truck, ShieldCheck, Sparkles } from 'lucide-react';

export default function AnnouncementBar({ text }) {
  const defaultText = 'PREMIUM 1 GRAM GOLD-PLATED JEWELLERY | SAME DAY DISPATCH | FREE SHIPPING ON PREPAID';
  const displayText = text || defaultText;

  return (
    <div style={{
      backgroundColor: '#520612',
      color: '#F5E8C7',
      padding: '8px 12px',
      fontSize: '0.74rem',
      fontWeight: 600,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      overflow: 'hidden'
    }}>
      <Sparkles size={13} color="#C5A059" style={{ flexShrink: 0 }} />
      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {displayText}
      </span>
      <Sparkles size={13} color="#C5A059" style={{ flexShrink: 0 }} />
    </div>
  );
}
