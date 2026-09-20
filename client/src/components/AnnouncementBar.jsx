import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AnnouncementBar({ text }) {
  const defaultText = 'PREMIUM 1 GRAM GOLD-PLATED JEWELLERY • SAME DAY DISPATCH • 100% INSURED TRANSIT • VERIFIED COD AVAILABLE';
  const rawText = text || defaultText;

  // Split by bullet or pipe if present to create rich items
  const items = rawText
    .split(/[•|]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const marqueeItems = items.length > 0 ? items : [rawText];

  const renderGroup = (keyPrefix) => (
    <div className="marquee-group" key={keyPrefix}>
      {marqueeItems.map((item, idx) => (
        <span className="marquee-item" key={`${keyPrefix}-${idx}`}>
          <Sparkles size={12} color="#C5A059" style={{ flexShrink: 0 }} />
          <span>{item}</span>
          <span className="marquee-bullet">•</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee-container" aria-label="Announcement ticker">
      <div className="marquee-track">
        {/* Render 2 identical groups to create a seamless infinite loop with 0 jump */}
        {renderGroup('grp-1')}
        {renderGroup('grp-2')}
      </div>
    </div>
  );
}
