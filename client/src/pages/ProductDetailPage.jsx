import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProductGallery from '../components/ProductGallery';
import ProductCard from '../components/ProductCard';
import ReviewsSection from '../components/ReviewsSection';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import {
  Star,
  Share2,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  ArrowLeft,
  Sparkles,
  Check
} from 'lucide-react';

export default function ProductDetailPage({ settings = {} }) {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [copyNotification, setCopyNotification] = useState('');

  const fetchProduct = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await productService.getProductDetail(identifier);
      if (res.data?.product) {
        setProduct(res.data.product);
      }
    } catch (err) {
      setError('Product not found or has been removed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [identifier]);

  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (product && !product.is_out_of_stock) {
      addToCart(product, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1800);
    }
  };

  const handleBuyNow = () => {
    if (product && !product.is_out_of_stock) {
      addToCart(product, quantity);
      navigate('/checkout');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.name} | Golden Zone`,
        text: `Check out this 1 gram gold-plated ${product.name} at Golden Zone!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopyNotification('Product link copied to clipboard!');
      setTimeout(() => setCopyNotification(''), 2500);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px', textAlign: 'center' }}>
        <div className="skeleton" style={{ width: '100%', paddingTop: '100%', borderRadius: '16px', marginBottom: '20px' }} />
        <div className="skeleton" style={{ width: '70%', height: '24px', margin: '0 auto 12px' }} />
        <div className="skeleton" style={{ width: '40%', height: '20px', margin: '0 auto' }} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 16px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#520612', marginBottom: '8px' }}>
          Product Not Found
        </h2>
        <p style={{ color: '#6B635B', marginBottom: '20px', fontSize: '0.88rem' }}>
          {error || 'This jewellery piece is unavailable.'}
        </p>
        <Link to="/shop" className="btn-maroon">
          Back to Collection
        </Link>
      </div>
    );
  }

  const isOutOfStock = Boolean(product.is_out_of_stock);
  const discountPercent = product.discount_percentage || 0;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '12px 14px 48px' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none',
          border: 'none',
          color: '#520612',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.80rem',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '12px',
          padding: '4px 0'
        }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* 1. Product Image Carousel with Thumbnails & Swipe */}
      <ProductGallery images={product.images} productName={product.name} />

      {/* 2. Title & Ratings Bar */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div>
            <span style={{
              fontSize: '0.70rem',
              fontWeight: 700,
              color: '#C5A059',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              1 Gram Gold-Plated {product.category_name}
            </span>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
              color: '#1F1A17',
              fontWeight: 700,
              lineHeight: 1.25,
              marginTop: '2px'
            }}>
              {product.name}
            </h1>
          </div>

          <button
            onClick={handleShare}
            aria-label="Share product"
            style={{
              background: '#FAF7F2',
              border: '1px solid #D4C9BC',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#520612',
              flexShrink: 0
            }}
          >
            <Share2 size={16} />
          </button>
        </div>

        {copyNotification && (
          <p style={{ fontSize: '0.74rem', color: '#166534', fontWeight: 600, marginTop: '4px' }}>
            ✓ {copyNotification}
          </p>
        )}

        {/* Stars and Reviews count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
          <div style={{ display: 'flex', color: '#EAB308', gap: '2px' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="#EAB308" />
            ))}
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1F1A17' }}>
            {product.average_rating || '4.9'}
          </span>
          <span style={{ fontSize: '0.76rem', color: '#8E857C' }}>
            ({product.review_count || 120}+ reviews)
          </span>
        </div>
      </div>

      {/* 3. Price & Discount Presentation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        margin: '14px 0 16px',
        padding: '10px 14px',
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        border: '1px solid #E8E2D9'
      }}>
        <span style={{ fontSize: '1.35rem', fontWeight: 700, color: '#520612' }}>
          ₹{product.discounted_price?.toLocaleString('en-IN')}
        </span>

        {product.regular_price > product.discounted_price && (
          <span style={{ fontSize: '0.90rem', color: '#8E857C', textDecoration: 'line-through' }}>
            ₹{product.regular_price?.toLocaleString('en-IN')}
          </span>
        )}

        {discountPercent > 0 && (
          <span style={{
            backgroundColor: '#520612',
            color: '#FFFFFF',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '4px'
          }}>
            {discountPercent}% OFF
          </span>
        )}

        <div style={{ marginLeft: 'auto' }}>
          {isOutOfStock ? (
            <span className="badge-stock-out">OUT OF STOCK</span>
          ) : (
            <span style={{
              backgroundColor: '#DCFCE7',
              color: '#166534',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '4px'
            }}>
              IN STOCK
            </span>
          )}
        </div>
      </div>

      {/* 4. Quantity Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1F1A17' }}>
          Quantity:
        </span>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          border: '1px solid #D4C9BC',
          borderRadius: '9999px',
          overflow: 'hidden'
        }}>
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={isOutOfStock}
            style={{
              border: 'none',
              background: 'transparent',
              padding: '6px 12px',
              cursor: 'pointer',
              color: '#520612',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Minus size={14} />
          </button>
          <span style={{
            minWidth: '28px',
            textAlign: 'center',
            fontSize: '0.86rem',
            fontWeight: 700,
            color: '#1F1A17'
          }}>
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            disabled={isOutOfStock}
            style={{
              border: 'none',
              background: 'transparent',
              padding: '6px 12px',
              cursor: 'pointer',
              color: '#520612',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* 5. CTA Buttons: ADD TO CART & BUY NOW COD */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          style={{
            width: '100%',
            backgroundColor: isAdded ? '#F0FDF4' : 'transparent',
            border: isAdded ? '1.5px solid #16A34A' : '1.5px solid #520612',
            color: isOutOfStock ? '#8E857C' : (isAdded ? '#16A34A' : '#520612'),
            padding: '13px',
            borderRadius: '9999px',
            fontSize: '0.90rem',
            fontWeight: 700,
            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          {isAdded ? (
            <>
              <Check size={18} strokeWidth={2.5} /> ADDED TO BAG
            </>
          ) : (
            <>
              <ShoppingBag size={18} /> ADD TO CART
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          style={{
            width: '100%',
            backgroundColor: isOutOfStock ? '#D4C9BC' : '#520612',
            color: '#FFFFFF',
            border: 'none',
            padding: '14px',
            borderRadius: '9999px',
            fontSize: '0.92rem',
            fontWeight: 700,
            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(82, 6, 18, 0.25)'
          }}
        >
          <span>INSTANT BUY NOW</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* 6. Delivery Information Strip */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E8E2D9',
        borderRadius: '12px',
        padding: '14px 16px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Truck size={18} color="#C5A059" />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1F1A17' }}>
            Fast Insured Delivery Across India
          </span>
        </div>
        <p style={{ fontSize: '0.76rem', color: '#6B635B', marginLeft: '28px' }}>
          Orders are dispatched within 24 hours. 100% secure online payment via Razorpay.
        </p>
      </div>

      {/* 7. Product Description Accordion */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E8E2D9',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '24px'
      }}>
        <button
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          style={{
            width: '100%',
            padding: '14px 16px',
            background: 'none',
            border: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.98rem', fontWeight: 700, color: '#520612' }}>
            PRODUCT DETAILS & SPECIFICATIONS
          </span>
          <ChevronDown
            size={18}
            color="#520612"
            style={{
              transform: isDetailsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}
          />
        </button>

        {isDetailsOpen && (
          <div style={{
            padding: '0 16px 16px',
            fontSize: '0.82rem',
            color: '#1F1A17',
            lineHeight: 1.6,
            borderTop: '1px solid #F3ECE1',
            paddingTop: '12px'
          }}>
            <p style={{ marginBottom: '12px' }}>
              {product.description ||
                'Designed for everyday styling, this 1 gram gold-plated piece combines a classic look with a lightweight and versatile design.'}
            </p>

            <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', color: '#4B433E' }}>
              <li><strong>Category:</strong> {product.category_name}</li>
              <li><strong>Plating:</strong> 1 Gram Gold Plating (High-Polish Gloss)</li>
              <li><strong>SKU:</strong> {product.sku}</li>
              <li><strong>Styling:</strong> Daily Wear, Festivals & Family Functions</li>
              <li><strong>Care Advice:</strong> Keep away from direct perfumes, chlorinated water, and harsh chemicals to maintain shine.</li>
            </ul>

            <div style={{
              backgroundColor: '#FAF7F2',
              border: '1px solid #E8E2D9',
              borderRadius: '8px',
              padding: '10px 12px',
              marginTop: '14px',
              fontSize: '0.74rem',
              color: '#6B635B'
            }}>
              🛡️ <strong>Note on Gold Category:</strong> This product is imitation jewellery with 1 gram gold plating. It is not solid 22K/24K gold.
            </div>
          </div>
        )}
      </div>

      {/* 8. WhatsApp Quick Enquiry */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <a
          href={`https://wa.me/${(settings.whatsapp_number || '917976580806').replace(/\D/g, '')}?text=${encodeURIComponent(`Hello, I want to inquire about "${product.name}" (SKU: ${product.sku}) on Golden Zone.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#25D366',
            color: '#FFFFFF',
            padding: '10px 20px',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          <MessageCircle size={16} /> Have a Question? Chat on WhatsApp
        </a>
      </div>

      {/* 9. "You May Also Like" Recommended Slider */}
      {product.related && product.related.length > 0 && (
        <div style={{ marginTop: '24px', marginBottom: '32px' }}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', color: '#520612', fontWeight: 700, marginBottom: '14px' }}>
            You May Also Like
          </h3>
          <div
            className="no-scrollbar"
            style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              paddingBottom: '8px'
            }}
          >
            {product.related.map((rel) => (
              <div key={rel.id} style={{ width: '160px', flexShrink: 0 }}>
                <ProductCard product={rel} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. Customer Reviews Section */}
      <ReviewsSection
        reviews={product.reviews}
        productId={product.id}
        onReviewSubmitted={fetchProduct}
      />
    </div>
  );
}
