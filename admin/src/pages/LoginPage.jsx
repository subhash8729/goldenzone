import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { adminAuthService } from '../services/api';
import { Lock, Smartphone, KeyRound, ShieldAlert, CheckCircle2, Send } from 'lucide-react';

export default function LoginPage() {
  const [mobile, setMobile] = useState('7976580806');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const { login } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOtp = async () => {
    setError('');
    setInfoMessage('');
    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    if (cleanMobile.length !== 10) {
      setError('Please enter a valid 10-digit admin mobile number.');
      return;
    }

    setOtpLoading(true);
    try {
      const res = await adminAuthService.sendOtp(cleanMobile);
      setInfoMessage(res.data?.message || 'OTP sent successfully to admin phone via SMS.');
      setCountdown(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!mobile || !password || !otp) {
      setError('Please fill in Mobile, Password, and the 6-digit OTP.');
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
        maxWidth: '420px',
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
            src="https://res.cloudinary.com/dgxaol7mz/image/upload/v1789872272/ChatGPT_Image_Sep_19_2026_11_08_00_AM_nrqbem.png"
            alt="Golden Zone Logo"
            style={{ height: '48px', width: '48px', margin: '0 auto 8px', borderRadius: '8px', objectFit: 'contain' }}
          />
          <h1 style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', fontSize: '1.25rem', color: '#520612', fontWeight: 700 }}>
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

          {infoMessage && (
            <div style={{
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#065F46',
              fontSize: '0.80rem',
              padding: '10px 12px',
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} />
              <span>{infoMessage}</span>
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label className="form-label">Admin Mobile Number</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0 10px', backgroundColor: '#F8FAFC' }}>
              <Smartphone size={16} color="#64748B" style={{ marginRight: '8px' }} />
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter 10-digit mobile"
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
                placeholder="Enter admin password"
                className="form-input"
                style={{ border: 'none', background: 'transparent', padding: '10px 0' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="form-label" style={{ margin: 0 }}>Security OTP</label>
              {countdown > 0 ? (
                <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Resend in {countdown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpLoading || !mobile}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#520612',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  {otpLoading ? 'Sending...' : 'Send OTP via SMS'}
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0 10px', backgroundColor: '#F8FAFC' }}>
              <KeyRound size={16} color="#64748B" style={{ marginRight: '8px' }} />
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit OTP"
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
