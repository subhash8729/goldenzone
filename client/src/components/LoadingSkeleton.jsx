import React from 'react';

export function ProductSkeleton() {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      border: '1px solid #E8E2D9',
      overflow: 'hidden',
      padding: '8px'
    }}>
      <div className="skeleton" style={{ width: '100%', paddingTop: '100%', borderRadius: '8px', marginBottom: '10px' }} />
      <div className="skeleton" style={{ width: '40%', height: '10px', marginBottom: '6px' }} />
      <div className="skeleton" style={{ width: '85%', height: '14px', marginBottom: '8px' }} />
      <div className="skeleton" style={{ width: '50%', height: '16px', marginBottom: '10px' }} />
      <div className="skeleton" style={{ width: '100%', height: '32px', borderRadius: '9999px' }} />
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px'
    }}>
      {[...Array(count)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

import { Check, X } from 'lucide-react';
import { createPortal } from 'react-dom';

export function Toast({ toast, message, onClose, onOpenCart }) {
  const data = toast || (message ? (typeof message === 'object' ? message : { type: 'text', message }) : null);
  if (!data || typeof document === 'undefined') return null;

  const isCart = data.type === 'cart';

  const content = (
    <aside
      role="status"
      aria-live="polite"
      aria-label="Notification"
      className="animate-toast floating-cart-toast"
      style={{
        position: 'fixed',
        top: '76px',
        right: '20px',
        zIndex: 999999,
        backgroundColor: '#FFFFFF',
        color: '#1F1A17',
        padding: isCart ? '7px 12px 7px 10px' : '9px 16px',
        borderRadius: '9999px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
        border: '1px solid #E8E2D9',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        maxWidth: 'calc(100vw - 32px)',
        pointerEvents: 'auto'
      }}
    >
      {isCart ? (
        <>
          {data.image ? (
            <img
              src={data.image}
              alt=""
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid #E8E2D9',
                flexShrink: 0
              }}
            />
          ) : (
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#DCFCE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#16A34A',
              flexShrink: 0
            }}>
              <Check size={16} strokeWidth={2.5} />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontSize: '0.80rem', fontWeight: 700, color: '#1F1A17' }}>
              Added to Bag
            </span>
            {data.name && (
              <span style={{
                fontSize: '0.70rem',
                color: '#8E857C',
                maxWidth: '140px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {data.name}
              </span>
            )}
          </div>

          <button
            onClick={() => {
              if (onOpenCart) onOpenCart();
              if (onClose) onClose();
            }}
            style={{
              background: '#520612',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '9999px',
              padding: '5px 12px',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.02em',
              transition: 'opacity 0.15s ease',
              flexShrink: 0
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          >
            View Bag
          </button>

          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close notification"
              style={{
                background: 'none',
                border: 'none',
                color: '#8E857C',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={15} />
            </button>
          )}
        </>
      ) : (
        <>
          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{data.message}</span>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close notification"
              style={{
                background: 'none',
                border: 'none',
                color: '#8E857C',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={15} />
            </button>
          )}
        </>
      )}
    </aside>
  );

  return createPortal(content, document.body);
}
