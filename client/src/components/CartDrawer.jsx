import React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    total,
    totalItems
  } = useCart();

  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  if (typeof document === 'undefined') return null;

  const drawerContent = (
    <>
      {/* Backdrop with smooth fade */}
      <div
        className={`drawer-backdrop ${isCartOpen ? 'open' : ''}`}
        style={{ zIndex: 99990 }}
        onClick={closeCart}
      />

      {/* Drawer panel with smooth GPU slide */}
      <div
        className={`drawer-panel-right ${isCartOpen ? 'open' : ''}`}
        style={{ zIndex: 99991 }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E8E2D9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h3 style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', fontSize: '1.15rem', fontWeight: 700, color: '#520612' }}>
              Your Jewellery Bag
            </h3>
            <span style={{ fontSize: '0.80rem', color: '#8E857C' }}>
              ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </span>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            style={{ background: 'none', border: 'none', color: '#6B635B', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Free Shipping Strip */}
        <div style={{
          backgroundColor: '#F5E8C7',
          color: '#7D5C1E',
          padding: '8px 16px',
          fontSize: '0.74rem',
          fontWeight: 600,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          <ShieldCheck size={14} color="#C5A059" /> Free Insured Delivery on this order
        </div>

        {/* Cart Item List - content-based height without pushing Proceed to Pay to the bottom */}
        <div style={{ maxHeight: '46vh', overflowY: 'auto', padding: '14px 16px', flexShrink: 1, flexGrow: 0 }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8E857C' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🛍️</div>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1F1A17', marginBottom: '4px' }}>
                Your cart is empty
              </p>
              <p style={{ fontSize: '0.80rem', marginBottom: '20px' }}>
                Explore our 1 gram gold-plated chains, rings, kadas, and balis.
              </p>
              <button
                onClick={() => {
                  closeCart();
                  navigate('/shop');
                }}
                className="btn-maroon"
                style={{ padding: '8px 20px', fontSize: '0.84rem' }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid #E8E2D9',
                    padding: '10px',
                    display: 'flex',
                    gap: '12px'
                  }}
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '68px',
                      height: '68px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      backgroundColor: '#F3ECE1'
                    }}
                  />

                  {/* Details */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1F1A17', lineHeight: 1.25 }}>
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                        style={{ background: 'none', border: 'none', color: '#8E857C', cursor: 'pointer', padding: '2px' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <span style={{ fontSize: '0.70rem', color: '#8E857C', marginBottom: '6px' }}>
                      SKU: {item.sku || 'KAL-001'}
                    </span>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#520612' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>

                      {/* Quantity Controller */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #D4C9BC',
                        borderRadius: '9999px',
                        overflow: 'hidden',
                        backgroundColor: '#FAF7F2'
                      }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            padding: '3px 8px',
                            cursor: 'pointer',
                            color: '#520612',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '0 4px', minWidth: '18px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            padding: '3px 8px',
                            cursor: 'pointer',
                            color: '#520612',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div style={{
            padding: '16px 20px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E8E2D9'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.84rem', color: '#6B635B' }}>
              <span>Subtotal:</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.84rem', color: '#22C55E', fontWeight: 600 }}>
              <span>Delivery:</span>
              <span>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '1.05rem', fontWeight: 700, color: '#520612', borderTop: '1px dashed #E8E2D9', paddingTop: '10px' }}>
              <span>Total:</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="btn-maroon"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '0.92rem',
                letterSpacing: '0.03em'
              }}
            >
              PROCEED TO PAY <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );

  return createPortal(drawerContent, document.body);
}
