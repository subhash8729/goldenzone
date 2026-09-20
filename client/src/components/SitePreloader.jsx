import React, { useState, useEffect } from 'react';

/**
 * Premium Minimalist Site Preloader for Golden Zone
 * Displays a luxurious brand splash with subtle orbit, glowing emblem, and hairline progress bar.
 */
export default function SitePreloader({ onFinish }) {
  const [stage, setStage] = useState('active'); // 'active' -> 'fading' -> 'hidden'

  useEffect(() => {
    // 1. Progress line completes in ~1200ms, start silky fade-out
    const timer1 = setTimeout(() => {
      setStage('fading');
    }, 1250);

    // 2. Fade-out completes in ~1750ms, remove from DOM
    const timer2 = setTimeout(() => {
      setStage('hidden');
      if (onFinish) onFinish();
    }, 1750);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  if (stage === 'hidden') return null;

  return (
    <div
      className={`gz-preloader ${stage === 'fading' ? 'gz-preloader-fade-out' : ''}`}
      aria-hidden="true"
    >
      <div className="gz-preloader-glow" />

      <div className="gz-preloader-content">
        {/* Emblem with Orbit Accent */}
        <div className="gz-preloader-emblem-wrap">
          <div className="gz-preloader-orbit" />
          <img
            src="https://res.cloudinary.com/dgxaol7mz/image/upload/v1789872269/ChatGPT_Image_Sep_19_2026_11_08_00_AM_1_xjiro4.png"
            alt="Golden Zone"
            className="gz-preloader-logo"
          />
        </div>

        {/* Brand Name & Tagline */}
        <div className="gz-preloader-title-wrap">
          <h1 className="gz-preloader-title">GOLDEN ZONE</h1>
          <p className="gz-preloader-subtitle">1 GRAM GOLD-PLATED JEWELLERY</p>
        </div>

        {/* Minimalist Hairline Progress Bar */}
        <div className="gz-preloader-progress-track">
          <div className="gz-preloader-progress-bar" />
        </div>
      </div>
    </div>
  );
}
