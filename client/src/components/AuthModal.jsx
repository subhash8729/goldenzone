import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { X, Smartphone, KeyRound, User, CheckCircle2 } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, updateUser } = useAuth();
  const [step, setStep] = useState('mobile'); // 'mobile' | 'otp' | 'profile'
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoNote, setDemoNote] = useState('');

  if (!isAuthModalOpen) return null;

  const resetModal = () => {
    setStep('mobile');
    setMobile('');
    setOtp('');
    setFullName('');
    setAddress('');
    setError('');
    setDemoNote('');
    closeAuthModal();
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    const cleanNumber = mobile.replace(/\D/g, '').slice(-10);
    if (cleanNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.sendOtp(cleanNumber);
      setDemoNote(res.data.demoNote || 'DEMO OTP: 987654');
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp.trim()) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const cleanNumber = mobile.replace(/\D/g, '').slice(-10);
      const res = await authService.verifyOtp(cleanNumber, otp.trim());

      login(res.data.token, res.data.customer);

      if (res.data.isNewUser) {
        setStep('profile');
      } else {
        resetModal();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please check and retry.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Complete Profile (New User)
  const handleCompleteProfile = async (skip = false) => {
    setLoading(true);
    setError('');
    try {
      const nameToSave = skip || !fullName.trim() ? 'Not Named' : fullName.trim();
      const res = await authService.updateProfile({
        full_name: nameToSave,
        address: address.trim() || null
      });

      updateUser(res.data.customer);
      resetModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      {/* Backdrop */}
      <div
        className="animate-fade-in"
        onClick={resetModal}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(31, 26, 23, 0.7)',
          backdropFilter: 'blur(3px)'
        }}
      />

      {/* Modal Box */}
      <div className="animate-modal-pop" style={{
        position: 'relative',
        width: '100%',
        maxWidth: '380px',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        zIndex: 101,
        border: '1px solid #E8E2D9'
      }}>
        {/* Modal Header */}
        <div style={{
          backgroundColor: '#FAF7F2',
          padding: '16px 20px',
          borderBottom: '1px solid #E8E2D9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src="https://www.photo-pick.com/online/api/v1/albums/007b52cf-a71d-4c0e-b3cd-13d3e2d3f660.jpg"
              alt="Golden Zone"
              style={{ height: '28px', width: '28px', borderRadius: '7px', objectFit: 'contain' }}
            />
            <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#520612', fontSize: '0.96rem' }}>
              Golden Zone
            </span>
          </div>
          <button
            onClick={resetModal}
            style={{ background: 'none', border: 'none', color: '#8E857C', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 20px' }}>
          {error && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              fontSize: '0.80rem',
              padding: '8px 12px',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          {/* STEP 1: MOBILE NUMBER */}
          {step === 'mobile' && (
            <form onSubmit={handleSendOtp}>
              <h3 style={{ fontSize: '1.15rem', color: '#520612', fontWeight: 700, marginBottom: '6px' }}>
                Login or Register
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#6B635B', marginBottom: '18px' }}>
                Enter your 10-digit mobile number to receive an instant verification code.
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #D4C9BC',
                borderRadius: '8px',
                padding: '10px 12px',
                marginBottom: '18px',
                backgroundColor: '#FAF7F2'
              }}>
                <span style={{ fontSize: '0.90rem', fontWeight: 600, color: '#520612', marginRight: '8px' }}>
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit mobile"
                  autoFocus
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    fontSize: '0.92rem',
                    color: '#1F1A17',
                    outline: 'none',
                    fontWeight: 500
                  }}
                />
                <Smartphone size={18} color="#8E857C" />
              </div>

              <button
                type="submit"
                disabled={loading || mobile.length !== 10}
                style={{
                  width: '100%',
                  backgroundColor: mobile.length === 10 ? '#520612' : '#D4C9BC',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '9999px',
                  fontSize: '0.90rem',
                  fontWeight: 600,
                  cursor: mobile.length === 10 ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.2s'
                }}
              >
                {loading ? 'Sending OTP...' : 'Continue with Mobile'}
              </button>
            </form>
          )}

          {/* STEP 2: ENTER OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp}>
              <h3 style={{ fontSize: '1.15rem', color: '#520612', fontWeight: 700, marginBottom: '6px' }}>
                Verify Mobile Number
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#6B635B', marginBottom: '14px' }}>
                Enter the 6-digit code sent to <strong>+91 {mobile}</strong>
              </p>

              {/* Demo OTP Helper Banner */}
              <div style={{
                backgroundColor: '#F5E8C7',
                border: '1px solid #C5A059',
                color: '#7D5C1E',
                fontSize: '0.80rem',
                padding: '8px 12px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontWeight: 600,
                textAlign: 'center'
              }}>
                🔑 {demoNote || 'DEMO OTP: 987654'}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #D4C9BC',
                borderRadius: '8px',
                padding: '10px 12px',
                marginBottom: '18px',
                backgroundColor: '#FAF7F2'
              }}>
                <KeyRound size={18} color="#8E857C" style={{ marginRight: '8px' }} />
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit OTP"
                  autoFocus
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    fontSize: '1rem',
                    letterSpacing: '0.2em',
                    color: '#1F1A17',
                    outline: 'none',
                    fontWeight: 700
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                style={{
                  width: '100%',
                  backgroundColor: otp.length === 6 ? '#520612' : '#D4C9BC',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '9999px',
                  fontSize: '0.90rem',
                  fontWeight: 600,
                  cursor: otp.length === 6 ? 'pointer' : 'not-allowed',
                  marginBottom: '12px'
                }}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => setStep('mobile')}
                  style={{ background: 'none', border: 'none', color: '#520612', fontSize: '0.80rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Change mobile number
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: NEW USER PROFILE (Full Name & Address) */}
          {step === 'profile' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                <CheckCircle2 size={36} color="#22C55E" style={{ margin: '0 auto 8px' }} />
                <h3 style={{ fontSize: '1.15rem', color: '#520612', fontWeight: 700 }}>
                  Almost Done!
                </h3>
                <p style={{ fontSize: '0.80rem', color: '#6B635B' }}>
                  Provide your name so we can address your orders properly.
                </p>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#1F1A17', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Verma"
                  style={{
                    width: '100%',
                    border: '1.5px solid #D4C9BC',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '0.90rem',
                    outline: 'none',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#1F1A17', marginBottom: '4px' }}>
                  Delivery Address <span style={{ color: '#8E857C', fontWeight: 400 }}>(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, Landmark, City..."
                  style={{
                    width: '100%',
                    border: '1.5px solid #D4C9BC',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.88rem',
                    outline: 'none',
                    backgroundColor: '#FAF7F2',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleCompleteProfile(true)}
                  disabled={loading}
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    border: '1px solid #D4C9BC',
                    color: '#6B635B',
                    padding: '10px',
                    borderRadius: '9999px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  SKIP
                </button>
                <button
                  type="button"
                  onClick={() => handleCompleteProfile(false)}
                  disabled={loading}
                  style={{
                    flex: 1,
                    backgroundColor: '#520612',
                    border: 'none',
                    color: '#FFFFFF',
                    padding: '10px',
                    borderRadius: '9999px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {loading ? 'Saving...' : 'CONTINUE'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
