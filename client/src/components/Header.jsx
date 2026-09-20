import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, ShoppingBag, Phone, ChevronRight } from 'lucide-react';
import { WhatsAppIcon } from './Icons';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header({ categories = [], settings = {} }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const { totalItems, openCart } = useCart();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleUserClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      openAuthModal();
    }
  };

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: '#FAF7F2',
        borderBottom: '1px solid #E8E2D9'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Left: Mobile Hamburger & Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#520612',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Menu size={24} />
            </button>

            {/* Desktop Navigation Links */}
            <nav style={{ display: 'none' }} className="desktop-nav">
              <Link to="/" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1F1A17' }}>Home</Link>
              <Link to="/shop" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1F1A17' }}>All Jewellery</Link>
              <Link to="/shop?category=chain" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1F1A17' }}>Chains</Link>
              <Link to="/shop?category=bali" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1F1A17' }}>Balis</Link>
              <Link to="/shop?category=kada" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1F1A17' }}>Kadas</Link>
              <Link to="/about" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1F1A17' }}>About Us</Link>
              <Link to="/contact" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1F1A17' }}>Contact Us</Link>
            </nav>
          </div>

          {/* Center: Golden Zone Brand Logo */}
          <Link to="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
            <img
              src="https://res.cloudinary.com/dgxaol7mz/image/upload/v1789872272/ChatGPT_Image_Sep_19_2026_11_08_00_AM_nrqbem.png"
              alt="Golden Zone"
              style={{
                height: '46px',
                width: 'auto',
                borderRadius: '8px',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span
              style={{
                display: 'none',
                fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#520612',
                letterSpacing: '0.05em'
              }}
            >
              GOLDEN ZONE
            </span>
          </Link>

          {/* Right: Actions (Search, Account, Cart) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#520612',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Search size={22} />
            </button>

            <button
              onClick={handleUserClick}
              aria-label="Account"
              title={isAuthenticated ? `Logged in: ${user?.full_name}` : 'Login / Register'}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#520612',
                display: 'flex',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              <User size={22} />
              {isAuthenticated && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#22C55E',
                  borderRadius: '50%',
                  border: '1.5px solid #FAF7F2'
                }} />
              )}
            </button>

            <button
              onClick={openCart}
              aria-label="Shopping Cart"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#520612',
                display: 'flex',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-8px',
                  backgroundColor: '#520612',
                  color: '#FFFFFF',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #FAF7F2'
                }}>
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Dropdown / Search Input Bar */}
        {isSearchOpen && (
          <div className="animate-dropdown" style={{
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E8E2D9',
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <form
              onSubmit={handleSearchSubmit}
              style={{
                maxWidth: '600px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FAF7F2',
                borderRadius: '9999px',
                border: '1px solid #D4C9BC',
                padding: '4px 14px'
              }}
            >
              <Search size={18} color="#8E857C" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chains, balis, rings, kadas..."
                autoFocus
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  padding: '8px 10px',
                  fontSize: '0.88rem',
                  outline: 'none',
                  color: '#1F1A17'
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#520612',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer Slide-out with smooth CSS animation */}
      <div
        className={`drawer-backdrop ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div className={`drawer-panel-left ${isMobileMenuOpen ? 'open' : ''}`}>
        {/* Drawer Header */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #E8E2D9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src="https://res.cloudinary.com/dgxaol7mz/image/upload/v1789872272/ChatGPT_Image_Sep_19_2026_11_08_00_AM_nrqbem.png"
              alt="Golden Zone Logo"
              style={{ height: '32px', width: '32px', borderRadius: '7px', objectFit: 'contain' }}
            />
            <span style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', fontWeight: 700, color: '#520612', fontSize: '1rem' }}>
              Golden Zone
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B635B' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation Links */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
          <div style={{ padding: '0 16px 8px', fontSize: '0.75rem', fontWeight: 600, color: '#8E857C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Categories
          </div>
          <Link
            to="/shop"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              color: '#520612',
              fontWeight: 600,
              fontSize: '0.92rem',
              borderBottom: '1px solid #F3ECE1'
            }}
          >
            <span>Shop All Jewellery</span>
            <ChevronRight size={18} color="#C5A059" />
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                color: '#1F1A17',
                fontSize: '0.90rem',
                borderBottom: '1px solid #F3ECE1'
              }}
            >
              <span>{cat.name}</span>
              <ChevronRight size={16} color="#8E857C" />
            </Link>
          ))}

          <div style={{ padding: '20px 16px 8px', fontSize: '0.75rem', fontWeight: 600, color: '#8E857C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Customer Care
          </div>
          <Link
            to="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ display: 'block', padding: '10px 16px', color: '#520612', fontSize: '0.90rem', fontWeight: 600 }}
          >
            Contact & Support
          </Link>
          <Link
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ display: 'block', padding: '10px 16px', color: '#1F1A17', fontSize: '0.90rem' }}
          >
            About Golden Zone
          </Link>
          <Link
            to={isAuthenticated ? '/profile' : '#'}
            onClick={() => {
              setIsMobileMenuOpen(false);
              if (!isAuthenticated) openAuthModal();
            }}
            style={{ display: 'block', padding: '10px 16px', color: '#1F1A17', fontSize: '0.90rem' }}
          >
            {isAuthenticated ? 'My Orders & Account' : 'Login / Register'}
          </Link>
        </div>

        {/* Drawer Footer Contact */}
        <div style={{
          padding: '16px',
          backgroundColor: '#F3ECE1',
          borderTop: '1px solid #E8E2D9'
        }}>
          <p style={{ fontSize: '0.75rem', color: '#6B635B', marginBottom: '8px' }}>
            Need Assistance? Chat with us:
          </p>
          <a
            href={settings.whatsapp_chat_url || `https://wa.me/${(settings.whatsapp_number || '919286129921').replace(/\D/g, '')}?text=Hello,%20I%20want%20to%20know%20more%20about%20Golden%20Zone%20jewellery.`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#25D366',
              color: '#FFF',
              padding: '8px 14px',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 600,
              justifyContent: 'center',
              textDecoration: 'none'
            }}
          >
            <WhatsAppIcon size={16} /> WhatsApp Support
          </a>
        </div>
      </div>
    </>
  );
}
