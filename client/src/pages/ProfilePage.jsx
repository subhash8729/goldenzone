import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService, authService } from '../services/api';
import OrderTracker from '../components/OrderTracker';
import { User, LogOut, Package, MapPin, Edit2, Save, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, logout, openAuthModal, updateUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [secondaryMobile, setSecondaryMobile] = useState(user?.secondary_mobile || '');
  const [address, setAddress] = useState(user?.address || '');
  const [state, setState] = useState(user?.state || '');
  const [district, setDistrict] = useState(user?.district || '');
  const [cityVillage, setCityVillage] = useState(user?.city || user?.village || '');
  const [pincode, setPincode] = useState(user?.pincode || '');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setSecondaryMobile(user.secondary_mobile || '');
      setAddress(user.address || '');
      setState(user.state || '');
      setDistrict(user.district || '');
      setCityVillage(user.city || user.village || '');
      setPincode(user.pincode || '');
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      orderService.getMyOrders()
        .then((res) => {
          setOrders(res.data?.orders || []);
        })
        .catch((err) => console.error('Failed to load customer orders:', err))
        .finally(() => setLoadingOrders(false));
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '400px', margin: '60px auto', padding: '0 16px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', color: '#520612', marginBottom: '8px' }}>
          Customer Account
        </h2>
        <p style={{ color: '#6B635B', marginBottom: '20px', fontSize: '0.86rem' }}>
          Please log in with your mobile number to manage delivery details and view orders.
        </p>
        <button onClick={openAuthModal} className="btn-maroon">
          Login / Register
        </button>
      </div>
    );
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.updateProfile({
        full_name: fullName.trim() || 'Not Named',
        secondary_mobile: secondaryMobile.trim() || null,
        address: address.trim() || null,
        state: state.trim() || null,
        district: district.trim() || null,
        city: cityVillage.trim() || null,
        village: cityVillage.trim() || null,
        pincode: pincode.trim() || null
      });

      updateUser(res.data.customer);
      setIsEditing(false);
      setSaveMessage('Profile saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '20px 14px 48px' }}>
      {/* Profile Header Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E8E2D9',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(82, 6, 18, 0.04)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: '#520612',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.1rem'
            }}>
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', fontSize: '1.2rem', color: '#1F1A17', fontWeight: 700 }}>
                {user?.full_name || 'Not Named'}
              </h2>
              <p style={{ fontSize: '0.80rem', color: '#6B635B' }}>
                +91 {user?.mobile_number}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>

        {saveMessage && (
          <div style={{
            backgroundColor: '#DCFCE7',
            border: '1px solid #86EFAC',
            color: '#166534',
            fontSize: '0.78rem',
            padding: '6px 12px',
            borderRadius: '6px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <CheckCircle2 size={14} /> {saveMessage}
          </div>
        )}

        {/* Saved Delivery Address Info */}
        <div style={{
          backgroundColor: '#FAF7F2',
          border: '1px solid #E8E2D9',
          borderRadius: '12px',
          padding: '14px',
          fontSize: '0.82rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, color: '#520612', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={16} /> Saved Delivery Address
            </span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{
                background: 'none',
                border: 'none',
                color: '#C5A059',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Edit2 size={13} /> {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} style={{ display: 'grid', gap: '8px', marginTop: '10px' }}>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ padding: '6px 10px', border: '1px solid #D4C9BC', borderRadius: '6px', fontSize: '0.84rem' }}
              />
              <input
                type="text"
                placeholder="Secondary Mobile"
                value={secondaryMobile}
                onChange={(e) => setSecondaryMobile(e.target.value)}
                style={{ padding: '6px 10px', border: '1px solid #D4C9BC', borderRadius: '6px', fontSize: '0.84rem' }}
              />
              <textarea
                rows={2}
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ padding: '6px 10px', border: '1px solid #D4C9BC', borderRadius: '6px', fontSize: '0.84rem', resize: 'none' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="City/Village"
                  value={cityVillage}
                  onChange={(e) => setCityVillage(e.target.value)}
                  style={{ padding: '6px 10px', border: '1px solid #D4C9BC', borderRadius: '6px', fontSize: '0.84rem' }}
                />
                <input
                  type="text"
                  placeholder="District"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  style={{ padding: '6px 10px', border: '1px solid #D4C9BC', borderRadius: '6px', fontSize: '0.84rem' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  style={{ padding: '6px 10px', border: '1px solid #D4C9BC', borderRadius: '6px', fontSize: '0.84rem' }}
                />
                <input
                  type="text"
                  placeholder="PIN Code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  style={{ padding: '6px 10px', border: '1px solid #D4C9BC', borderRadius: '6px', fontSize: '0.84rem' }}
                />
              </div>
              <button
                type="submit"
                className="btn-maroon"
                style={{ padding: '8px 16px', fontSize: '0.80rem', marginTop: '6px', width: 'fit-content' }}
              >
                <Save size={13} /> Save Address
              </button>
            </form>
          ) : (
            <div>
              {user?.address ? (
                <div style={{ color: '#1F1A17', lineHeight: 1.5 }}>
                  <p>{user.address}</p>
                  <p>{user.city || user.village}, {user.district}, {user.state} - {user.pincode}</p>
                  {user.secondary_mobile && <p style={{ color: '#8E857C', fontSize: '0.76rem' }}>Alt Contact: +91 {user.secondary_mobile}</p>}
                </div>
              ) : (
                <p style={{ color: '#8E857C', fontStyle: 'italic' }}>
                  No saved address yet. It will automatically save when you place your first order.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order History Section */}
      <div>
        <h3 style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', fontSize: '1.25rem', color: '#520612', fontWeight: 700, marginBottom: '14px' }}>
          Order History ({orders.length})
        </h3>

        {loadingOrders ? (
          <p style={{ fontSize: '0.84rem', color: '#8E857C' }}>Loading your orders...</p>
        ) : orders.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E8E2D9',
            padding: '30px 16px',
            textAlign: 'center',
            color: '#8E857C'
          }}>
            <Package size={36} color="#C5A059" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1F1A17' }}>
              No orders placed yet
            </p>
            <p style={{ fontSize: '0.78rem', marginTop: '4px' }}>
              Explore our exquisite 1 gram gold-plated collection and place your first order.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((ord) => (
              <OrderTracker key={ord.id} order={ord} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
