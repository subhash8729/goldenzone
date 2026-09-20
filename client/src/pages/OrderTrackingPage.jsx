import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import OrderTracker from '../components/OrderTracker';
import { orderService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, ArrowRight, Package } from 'lucide-react';

export default function OrderTrackingPage() {
  const { orderNumber } = useParams();
  const { isAuthenticated, loading: authLoading, openAuthModal } = useAuth();
  const [inputOrderNum, setInputOrderNum] = useState(orderNumber || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderNumber));
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderNumber && isAuthenticated) {
      loadOrder(orderNumber);
    } else if (orderNumber && !authLoading) {
      setLoading(false);
      setError('Please log in to view your order tracking details.');
      openAuthModal();
    }
  }, [orderNumber, isAuthenticated, authLoading, openAuthModal]);

  const loadOrder = async (num) => {
    setLoading(true);
    setError('');
    try {
      const res = await orderService.trackOrder(num.trim());
      if (res.data?.order) {
        setOrder(res.data.order);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found. Please verify the order number.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please log in to view your order tracking details.');
      openAuthModal();
    } else if (inputOrderNum.trim()) {
      loadOrder(inputOrderNum.trim());
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '20px 14px 48px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', fontSize: '1.5rem', color: '#520612', fontWeight: 700 }}>
          Track Your Jewellery Parcel
        </h1>
        <p style={{ fontSize: '0.80rem', color: '#6B635B', marginTop: '4px' }}>
          Enter your order reference number to see real-time dispatch and delivery progress.
        </p>
      </div>

      {/* Lookup Form */}
      <form onSubmit={handleSearch} style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #D4C9BC',
          borderRadius: '9999px',
          padding: '6px 14px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <Search size={18} color="#8E857C" style={{ marginRight: '8px' }} />
          <input
            type="text"
            value={inputOrderNum}
            onChange={(e) => setInputOrderNum(e.target.value)}
            placeholder="e.g. KAL-1001"
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '0.90rem',
              color: '#1F1A17',
              outline: 'none',
              fontWeight: 600
            }}
          />
          <button
            type="submit"
            className="btn-maroon"
            style={{ padding: '7px 18px', fontSize: '0.80rem' }}
          >
            Track
          </button>
        </div>
      </form>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#520612' }}>
          <p style={{ fontSize: '0.88rem', fontWeight: 600 }}>Fetching parcel status...</p>
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: '#FEF2F2',
          border: '1px solid #FCA5A5',
          color: '#991B1B',
          fontSize: '0.84rem',
          padding: '12px 16px',
          borderRadius: '12px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {order && <OrderTracker order={order} />}

      {!order && !loading && !error && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E8E2D9'
        }}>
          <Package size={42} color="#C5A059" style={{ margin: '0 auto 10px' }} />
          <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1F1A17', marginBottom: '4px' }}>
            Looking for an order?
          </p>
          <p style={{ fontSize: '0.80rem', color: '#8E857C', marginBottom: '16px' }}>
            Check your SMS confirmation or view your past orders in your customer profile.
          </p>
          <Link to="/profile" className="btn-outline" style={{ padding: '8px 20px', fontSize: '0.82rem' }}>
            Go to My Profile
          </Link>
        </div>
      )}
    </div>
  );
}
