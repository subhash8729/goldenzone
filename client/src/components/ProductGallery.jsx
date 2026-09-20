import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

export default function ProductGallery({ images = [], productName = 'Jewellery' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const touchStartX = useRef(null);

  const displayImages = images.length > 0
    ? images
    : ['https://pashupati.co/cdn/shop/files/B35A6888-45CE-4752-A4A2-7951A478EA61.jpg?v=1775994142&width=600'];

  useEffect(() => {
    setActiveIndex(0);
    setIsZoomOpen(false);
  }, [images]);

  const handlePrev = (e) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Main Image View Area with Carousel Slider */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%', // Square main image
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #E8E2D9',
          boxShadow: '0 4px 16px rgba(82, 6, 18, 0.04)',
          cursor: 'zoom-in'
        }}
        onClick={() => setIsZoomOpen(true)}
      >
        {/* Sliding Carousel Track */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            transform: `translateX(-${activeIndex * 100}%)`,
            transition: 'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)',
            willChange: 'transform'
          }}
        >
          {displayImages.map((img, idx) => (
            <div
              key={idx}
              style={{
                width: '100%',
                height: '100%',
                flexShrink: 0,
                position: 'relative'
              }}
            >
              <img
                src={img}
                alt={`${productName} view ${idx + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {/* Image Counter Badge e.g. "1 / 5" */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          backgroundColor: 'rgba(31, 26, 23, 0.75)',
          color: '#FFFFFF',
          fontSize: '0.72rem',
          fontWeight: 600,
          padding: '4px 10px',
          borderRadius: '9999px',
          letterSpacing: '0.04em',
          backdropFilter: 'blur(4px)',
          zIndex: 2
        }}>
          {activeIndex + 1} / {displayImages.length}
        </div>

        {/* Zoom Icon Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomOpen(true);
          }}
          aria-label="Zoom image"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            color: '#520612',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            zIndex: 2,
            transition: 'transform 0.2s ease'
          }}
        >
          <Maximize2 size={16} />
        </button>

        {/* Left & Right Arrow Buttons */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#520612',
                border: 'none',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                zIndex: 2,
                transition: 'all 0.2s ease'
              }}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next image"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#520612',
                border: 'none',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                zIndex: 2,
                transition: 'all 0.2s ease'
              }}
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip with Smooth Transitions */}
      {displayImages.length > 1 && (
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: '10px',
            marginTop: '14px',
            overflowX: 'auto',
            padding: '2px 2px 6px'
          }}
        >
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '10px',
                overflow: 'hidden',
                flexShrink: 0,
                border: activeIndex === idx ? '2.5px solid #520612' : '1px solid #E8E2D9',
                boxShadow: activeIndex === idx ? '0 0 0 2px #C5A059, 0 4px 10px rgba(82, 6, 18, 0.15)' : 'none',
                transform: activeIndex === idx ? 'scale(1.04)' : 'scale(1)',
                padding: 0,
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
                opacity: activeIndex === idx ? 1 : 0.65,
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Zoom Lightbox Modal with Animated Entrance */}
      {isZoomOpen && (
        <div
          className="animate-fade-in"
          onClick={() => setIsZoomOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(15, 10, 8, 0.94)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <button
            onClick={() => setIsZoomOpen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            <X size={24} />
          </button>

          <img
            className="animate-modal-pop"
            src={displayImages[activeIndex]}
            alt={productName}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
          />
        </div>
      )}
    </div>
  );
}
