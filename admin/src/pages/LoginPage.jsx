import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { adminAuthService } from '../services/api';
import { Lock, Smartphone, KeyRound, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const [mobile, setMobile] = useState('7976580806');
  const [password, setPassword] = useState('Subhash29');
  const [otp, setOtp] = useState('987654');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!mobile || !password || !otp) {
      setError('Please fill in Mobile, Password, and OTP.');
      return;
    }

    setLoading(true);
    try {
      const res = await adminAuthService.login(mobile.trim(), password.trim(), otp.trim());
      if (res.data?.success && res.data?.token) {
        login(res.data.token, res.data.admin);
        navigate('/');
      } else {
        setError(res.data?.message || 'Authentication failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials or OTP. Please check.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#38020A',
      backgroundImage: 'radial-gradient(circle at center, #520612 0%, #290107 100%)',
      padding: '16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden',
        border: '1px solid rgba(197, 160, 89, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#FAF7F2',
          padding: '24px 20px',
          textAlign: 'center',
          borderBottom: '1px solid #E2E8F0'
        }}>
          <img
            src="https://www.photo-pick.com/online/api/v1/albums/601cea76-66de-49d8-bf5f-9b3544d4f902.jpg"
            alt="Golden Zone Logo"
            style={{ height: '48px', width: '48px', margin: '0 auto 8px', borderRadius: '8px', objectFit: 'contain' }}
          />
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', color: '#520612', fontWeight: 700 }}>
            Golden Zone
          </h1>
          <p style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Administrative Control Panel
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} style={{ padding: '24px 20px' }}>
          {error && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              fontSize: '0.80rem',
              padding: '10px 12px',
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Credentials Info */}
          <div style={{
            backgroundColor: '#F5E8C7',
            border: '1px solid #C5A059',
            color: '#7D5C1E',
            fontSize: '0.74rem',
            padding: '8px 12px',
            borderRadius: '8px',
            marginBottom: '16px',
            lineHeight: 1.4
          }}>
            <strong>🔑 Demo Admin Credentials:</strong><br />
            Mobile: <strong>7976580806</strong> | Password: <strong>Subhash29</strong><br />
            OTP: <strong>987654</strong>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label className="form-label">Admin Mobile Number</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0 10px', backgroundColor: '#F8FAFC' }}>
              <Smartphone size={16} color="#64748B" style={{ marginRight: '8px' }} />
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="7976580806"
                className="form-input"
                style={{ border: 'none', background: 'transparent', padding: '10px 0' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label className="form-label">Password</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0 10px', backgroundColor: '#F8FAFC' }}>
              <Lock size={16} color="#64748B" style={{ marginRight: '8px' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="form-input"
                style={{ border: 'none', background: 'transparent', padding: '10px 0' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Security OTP</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0 10px', backgroundColor: '#F8FAFC' }}>
              <KeyRound size={16} color="#64748B" style={{ marginRight: '8px' }} />
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="987654"
                className="form-input"
                style={{ border: 'none', background: 'transparent', padding: '10px 0', letterSpacing: '0.15em', fontWeight: 700 }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '0.90rem',
              justifyContent: 'center',
              borderRadius: '8px'
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Admin Portal'}
          </button>
        </form>
      </div>
    </div>
  );
}
