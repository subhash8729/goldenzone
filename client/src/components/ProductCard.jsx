import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Eye, Check } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const discountPercent = product.discount_percentage || 0;
  const isOutOfStock = Boolean(product.is_out_of_stock);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1600);
    }
  };

  return (
    <div
      className="product-card-wrap"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E8E2D9',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Clickable Image & Details Wrapper */}
      <Link
        to={`/product/${product.slug || product.id}`}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }}
      >
        {/* Product Image Area */}
        <div style={{
          position: 'relative',
          width: '100%',
          paddingTop: '108%', // Slightly portrait/square aspect ratio
          backgroundColor: '#F3ECE1',
          overflow: 'hidden'
        }}>
          <img
            src={product.primary_image || 'https://pashupati.co/cdn/shop/files/B35A6888-45CE-4752-A4A2-7951A478EA61.jpg?v=1775994142&width=600'}
            alt={product.name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            loading="lazy"
          />

          {/* Badges Overlay */}
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            zIndex: 2
          }}>
            {isOutOfStock ? (
              <span className="badge-stock-out">OUT OF STOCK</span>
            ) : (
              <>
                {discountPercent > 0 && (
                  <span style={{
                    backgroundColor: '#520612',
                    color: '#FFFFFF',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '3px 7px',
                    borderRadius: '4px',
                    letterSpacing: '0.03em'
                  }}>
                    {discountPercent}% OFF
                  </span>
                )}
                {product.is_bestseller && (
                  <span style={{
                    backgroundColor: '#C5A059',
                    color: '#1F1A17',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    BESTSELLER
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Product Information */}
        <div style={{ padding: '10px 10px 8px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Category Tag */}
          <span style={{
            fontSize: '0.68rem',
            color: '#8E857C',
            textTransform: 'uppercase',
            fontWeight: 600,
            letterSpacing: '0.04em',
            marginBottom: '2px'
          }}>
            {product.category_name || 'Jewellery'}
          </span>

          {/* Title */}
          <h3
            className="line-clamp-2"
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#1F1A17',
              lineHeight: 1.3,
              marginBottom: '6px',
              minHeight: '2.2em'
            }}
          >
            {product.name}
          </h3>

          {/* Price Row */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: 'auto', marginBottom: '8px' }}>
            <span style={{
              fontSize: '0.96rem',
              fontWeight: 700,
              color: '#520612'
            }}>
              ₹{product.discounted_price?.toLocaleString('en-IN')}
            </span>

            {product.regular_price > product.discounted_price && (
              <span style={{
                fontSize: '0.78rem',
                color: '#8E857C',
                textDecoration: 'line-through'
              }}>
                ₹{product.regular_price?.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Card Action Button */}
      <div style={{ padding: '0 10px 10px' }}>
        {isOutOfStock ? (
          <button
            disabled
            style={{
              width: '100%',
              padding: '8px 0',
              borderRadius: '9999px',
              border: '1px solid #D4C9BC',
              backgroundColor: '#F3ECE1',
              color: '#8E857C',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'not-allowed'
            }}
          >
            Out of Stock
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            style={{
              width: '100%',
              padding: '8px 0',
              borderRadius: '9999px',
              border: isAdded ? '1px solid #16A34A' : '1px solid #520612',
              backgroundColor: isAdded ? '#F0FDF4' : 'transparent',
              color: isAdded ? '#16A34A' : '#520612',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              if (!isAdded) {
                e.currentTarget.style.backgroundColor = '#520612';
                e.currentTarget.style.color = '#FFFFFF';
              }
            }}
            onMouseOut={(e) => {
              if (!isAdded) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#520612';
              }
            }}
          >
            {isAdded ? (
              <>
                <Check size={14} strokeWidth={2.5} /> Added
              </>
            ) : (
              <>
                <ShoppingBag size={14} /> Add to Cart
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
