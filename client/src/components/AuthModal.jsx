import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  if (!isAuthModalOpen || typeof document === 'undefined') return null;

  const resetModal = () => {
    setStep('mobile');
    setMobile('');
    setOtp('');
    setFullName('');
    setAddress('');
    setError('');
    setCountdown(0);
    closeAuthModal();
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');
    const cleanNumber = mobile.replace(/\D/g, '').slice(-10);
    if (cleanNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      await authService.sendOtp(cleanNumber);
      setStep('otp');
      setCountdown(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');
    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6) {
      setError('Please enter the 6-digit OTP received via SMS.');
      return;
    }

    setLoading(true);
    try {
      const cleanNumber = mobile.replace(/\D/g, '').slice(-10);
      const res = await authService.verifyOtp(cleanNumber, cleanOtp);

      if (res.data?.success && res.data?.token) {
        login(res.data.token, res.data.customer);

        // If profile is already complete, close modal
        if (res.data.customer?.full_name && res.data.customer?.address) {
          resetModal();
        } else {
          // Prompt to fill full name and address for smoother 1-click checkout
          setStep('profile');
        }
      } else {
        setError(res.data?.message || 'Invalid OTP. Please check the code.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect OTP. Please enter the valid SMS code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Save Name & Address
  const handleCompleteProfile = async (skip = false) => {
    setError('');
    if (!skip && !fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);
    try {
      const res = skip
        ? null
        : await authService.updateProfile({
            full_name: fullName.trim(),
            address: address.trim()
          });
      if (res?.data?.customer) {
        updateUser(res.data.customer);
      }
      resetModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 999990,
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
              src="https://res.cloudinary.com/dgxaol7mz/image/upload/v1789872272/ChatGPT_Image_Sep_19_2026_11_08_00_AM_nrqbem.png"
              alt="Golden Zone"
              style={{ height: '28px', width: '28px', borderRadius: '7px', objectFit: 'contain' }}
            />
            <span style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', fontWeight: 700, color: '#520612', fontSize: '0.96rem' }}>
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
              <p style={{ fontSize: '0.82rem', color: '#6B635B', marginBottom: '18px' }}>
                Enter the 6-digit code sent via SMS to <strong>+91 {mobile}</strong>
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
                  marginBottom: '14px'
                }}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.80rem' }}>
                <button
                  type="button"
                  onClick={() => setStep('mobile')}
                  style={{ background: 'none', border: 'none', color: '#520612', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Change number
                </button>

                {countdown > 0 ? (
                  <span style={{ color: '#8E857C' }}>Resend OTP in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    style={{ background: 'none', border: 'none', color: '#520612', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Resend OTP
                  </button>
                )}
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

  return createPortal(modalContent, document.body);
}
