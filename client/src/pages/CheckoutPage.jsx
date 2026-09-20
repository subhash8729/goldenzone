import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService, paymentService } from '../services/api';
import SavedAddressModal from '../components/SavedAddressModal';
import {
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Lock,
  RefreshCw,
  CreditCard
} from 'lucide-react';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { cart, total, subtotal, clearCart } = useCart();
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [fullName, setFullName] = useState(user?.full_name !== 'Not Named' ? (user?.full_name || '') : '');
  const [primaryMobile, setPrimaryMobile] = useState(user?.mobile_number || '');
  const [secondaryMobile, setSecondaryMobile] = useState(user?.secondary_mobile || '');
  const [address, setAddress] = useState(user?.address || '');
  const [state, setState] = useState(user?.state || 'Rajasthan');
  const [district, setDistrict] = useState(user?.district || '');
  const [cityVillage, setCityVillage] = useState(user?.city || user?.village || '');
  const [pincode, setPincode] = useState(user?.pincode || '');

  // Geolocation states
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoSuccess, setGeoSuccess] = useState(false);
  const [geoError, setGeoError] = useState('');

  // Saved Address Modal states
  const [savedData, setSavedData] = useState(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Payment states
  const [paymentMode, setPaymentMode] = useState('ONLINE'); // 'ONLINE' | 'COD'
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [pendingOrderInfo, setPendingOrderInfo] = useState(null);
  const [orderError, setOrderError] = useState('');

  // 1. If not authenticated, prompt login
  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal();
    }
  }, [isAuthenticated]);

  // Populate a newly authenticated customer's known details without overwriting form edits.
  useEffect(() => {
    if (!user) return;
    if (!fullName && user.full_name && user.full_name !== 'Not Named') setFullName(user.full_name);
    if (!primaryMobile && user.mobile_number) setPrimaryMobile(user.mobile_number);
  }, [user, fullName, primaryMobile]);

  // 2. Fetch saved customer details in the background (Non-blocking)
  useEffect(() => {
    if (isAuthenticated) {
      orderService.getSavedAddress()
        .then((res) => {
          if (res.data?.hasSavedDetails && res.data?.details) {
            setSavedData(res.data.details);
            setIsSavedModalOpen(true);
          }
        })
        .catch((err) => {
          console.log('No previous address or background fetch error:', err.message);
        });
    }
  }, [isAuthenticated]);

  // User clicked "USE SAVED DETAILS"
  const handleUseSavedDetails = () => {
    if (savedData) {
      if (savedData.full_name && savedData.full_name !== 'Not Named') {
        setFullName(savedData.full_name);
      }
      if (savedData.secondary_mobile) setSecondaryMobile(savedData.secondary_mobile);
      if (savedData.address) setAddress(savedData.address);
      if (savedData.state) setState(savedData.state);
      if (savedData.district) setDistrict(savedData.district);
      if (savedData.city || savedData.village) setCityVillage(savedData.city || savedData.village);
      if (savedData.pincode) setPincode(savedData.pincode);
      // NOTE: We do NOT auto-fill coordinates as per Requirement 19
    }
    setIsSavedModalOpen(false);
  };

  // User clicked "ENTER NEW DETAILS"
  const handleEnterNewDetails = () => {
    setIsSavedModalOpen(false);
  };

  // 3. Browser Geolocation Button: "Get Current Location"
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    setGeoError('');
    setGeoSuccess(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setGeoSuccess(true);
        setGeoLoading(false);
      },
      (error) => {
        setGeoLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError('Location permission was denied. You can proceed with written address.');
        } else {
          setGeoError('Could not retrieve GPS coordinates. Proceeding with manual address.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Launch Razorpay Checkout Modal
  const launchRazorpayModal = (orderData) => {
    const payable = Number(orderData.payableAmount ?? orderData.totalAmount);
    const isCod = orderData.paymentMode === 'COD';
    const options = {
      key: orderData.razorpayKeyId,
      amount: Math.round(payable * 100),
      currency: orderData.currency || 'INR',
      name: 'Golden Zone',
      description: isCod
        ? `Order #${orderData.orderNumber} (₹${payable} COD Advance)`
        : `Order #${orderData.orderNumber} (Full Payment)`,
      image: 'https://res.cloudinary.com/dgxaol7mz/image/upload/v1789872272/ChatGPT_Image_Sep_19_2026_11_08_00_AM_nrqbem.png',
      order_id: orderData.razorpayOrderId,
      prefill: {
        name: fullName.trim(),
        contact: primaryMobile.replace(/\D/g, '').slice(-10)
      },
      theme: {
        color: '#520612' // Brand Deep Maroon
      },
      modal: {
        ondismiss: function () {
          setSubmitting(false);
          setPendingOrderInfo(orderData);
          setOrderError('Payment was not completed. Your jewellery bag and delivery details are preserved. You can click "Retry Payment" below.');
          paymentService.reportPaymentFailed({
            razorpay_order_id: orderData.razorpayOrderId,
            error_description: 'Checkout modal cancelled by customer'
          }).catch(() => {});
        }
      },
      handler: async function (response) {
        try {
          setVerifying(true);
          setOrderError('');
          const verifyRes = await paymentService.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });

          if (verifyRes.data?.success) {
            clearCart();
            const confirmedNumber = verifyRes.data?.orderNumber || orderData.orderNumber;
            navigate(`/orders/${confirmedNumber}`);
          } else {
            setOrderError(verifyRes.data?.message || 'Payment verification failed. Please contact customer care.');
          }
        } catch (vErr) {
          setOrderError(vErr.response?.data?.message || 'Payment verification error. If money was debited, it will be automatically confirmed.');
        } finally {
          setVerifying(false);
          setSubmitting(false);
        }
      }
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        setSubmitting(false);
        setPendingOrderInfo(orderData);
        const errMsg = resp.error?.description || 'Payment was declined by your bank/UPI app. Please retry with another payment method.';
        setOrderError(errMsg);
        paymentService.reportPaymentFailed({
          razorpay_order_id: orderData.razorpayOrderId,
          razorpay_payment_id: resp.error?.metadata?.payment_id,
          error_code: resp.error?.code,
          error_description: errMsg
        }).catch(() => {});
      });
      rzp.open();
    } else {
      setSubmitting(false);
      setOrderError('Unable to initialize Razorpay checkout script. Please refresh and check your internet connection.');
    }
  };

  // 4. Place Order & Open Razorpay
  const handleSubmitOrder = async (e) => {
    if (e) e.preventDefault();
    setOrderError('');

    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    if (cart.length === 0) {
      setOrderError('Your cart is empty. Please add products before checking out.');
      return;
    }

    if (!fullName.trim()) {
      setOrderError('Please enter your full name.');
      return;
    }
    if (!primaryMobile.trim() || primaryMobile.replace(/\D/g, '').length < 10) {
      setOrderError('Please enter a valid 10-digit primary mobile number.');
      return;
    }
    if (!address.trim()) {
      setOrderError('Please enter your complete delivery address.');
      return;
    }
    if (!district.trim() || !pincode.trim()) {
      setOrderError('Please fill in District and PIN Code.');
      return;
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      setOrderError('Please enter a valid 6-digit PIN Code.');
      return;
    }
    if (secondaryMobile && secondaryMobile.replace(/\D/g, '').length !== 10) {
      setOrderError('Please enter a valid 10-digit alternate mobile number, or leave it blank.');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Ensure Razorpay script is loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setOrderError('Could not load Razorpay SDK. Please check your internet connection and try again.');
        setSubmitting(false);
        return;
      }

      // 2. Initiate order on backend (strictly calculates prices from DB)
      const orderPayload = {
        payment_mode: paymentMode,
        full_name: fullName.trim(),
        primary_mobile: primaryMobile.replace(/\D/g, '').slice(-10),
        secondary_mobile: secondaryMobile ? secondaryMobile.replace(/\D/g, '').slice(-10) : null,
        address: address.trim(),
        state: state.trim(),
        district: district.trim(),
        city: cityVillage.trim(),
        village: cityVillage.trim(),
        pincode: pincode.trim(),
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        items: cart.map((c) => ({
          product_id: c.id,
          quantity: c.quantity
        }))
      };

      const res = await orderService.createOrder(orderPayload);

      if (res.data?.success && res.data?.order) {
        const orderData = res.data.order;
        setPendingOrderInfo(orderData);
        launchRazorpayModal(orderData);
      } else {
        setOrderError(res.data?.message || 'Failed to initiate order. Please try again.');
        setSubmitting(false);
      }
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Error processing checkout. Please check item availability.');
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 16px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', color: '#520612', marginBottom: '8px' }}>
          Your Bag is Empty
        </h2>
        <p style={{ color: '#6B635B', marginBottom: '20px', fontSize: '0.86rem' }}>
          Please add items to your cart before proceeding to checkout.
        </p>
        <button onClick={() => navigate('/shop')} className="btn-maroon">
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px 14px 48px' }}>
      {/* Saved Address Prompt Modal */}
      <SavedAddressModal
        isOpen={isSavedModalOpen}
        savedData={savedData}
        onUseSaved={handleUseSavedDetails}
        onEnterNew={handleEnterNewDetails}
      />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: '#520612', cursor: 'pointer' }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', fontSize: '1.4rem', color: '#520612', fontWeight: 700 }}>
          Checkout & Delivery
        </h1>
      </div>

      {orderError && (
        <div style={{
          backgroundColor: '#FEF2F2',
          border: '1px solid #FCA5A5',
          color: '#991B1B',
          fontSize: '0.84rem',
          padding: '10px 14px',
          borderRadius: '10px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={18} />
          <span>{orderError}</span>
        </div>
      )}

      {/* Checkout Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        {/* Delivery Address Form */}
        <form onSubmit={handleSubmitOrder} style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E8E2D9',
          padding: '20px 16px',
          boxShadow: '0 2px 10px rgba(82, 6, 18, 0.04)'
        }}>
          <h2 style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', fontSize: '1.15rem', color: '#520612', fontWeight: 700, marginBottom: '14px' }}>
            Delivery Information
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Receiver's full name"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  border: '1px solid #D4C9BC',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  backgroundColor: '#FAF7F2'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                  Primary Mobile *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={primaryMobile}
                  onChange={(e) => setPrimaryMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit number"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    border: '1px solid #D4C9BC',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                  Alternate Mobile (Opt)
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={secondaryMobile}
                  onChange={(e) => setSecondaryMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="Secondary contact"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    border: '1px solid #D4C9BC',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                Street Address / Colony / House No. *
              </label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Detailed address for courier delivery"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #D4C9BC',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  backgroundColor: '#FAF7F2',
                  resize: 'none'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                  City or Village *
                </label>
                <input
                  type="text"
                  required
                  value={cityVillage}
                  onChange={(e) => setCityVillage(e.target.value)}
                  placeholder="City / Village"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    border: '1px solid #D4C9BC',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="6-digit PIN"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    border: '1px solid #D4C9BC',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                  District *
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="District"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    border: '1px solid #D4C9BC',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    border: '1px solid #D4C9BC',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    backgroundColor: '#FAF7F2'
                  }}
                />
              </div>
            </div>

            {/* Geolocation Section */}
            <div style={{
              backgroundColor: '#FAF7F2',
              border: '1px dashed #C5A059',
              borderRadius: '10px',
              padding: '12px 14px',
              marginTop: '6px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.80rem', fontWeight: 700, color: '#520612', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} /> GPS Location for Courier Delivery
                  </span>
                  <p style={{ fontSize: '0.72rem', color: '#6B635B', marginTop: '2px' }}>
                    Helps delivery riders locate your doorstep accurately.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={geoLoading}
                  style={{
                    backgroundColor: geoSuccess ? '#DCFCE7' : '#520612',
                    color: geoSuccess ? '#166534' : '#FFFFFF',
                    border: geoSuccess ? '1px solid #86EFAC' : 'none',
                    padding: '7px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexShrink: 0
                  }}
                >
                  {geoLoading ? (
                    <>
                      <Loader2 size={12} className="animate-spin" /> Locating...
                    </>
                  ) : geoSuccess ? (
                    <>
                      <CheckCircle2 size={13} /> Location Saved
                    </>
                  ) : (
                    'Get Current Location'
                  )}
                </button>
              </div>

              {geoSuccess && (
                <p style={{ fontSize: '0.72rem', color: '#166534', marginTop: '6px', fontWeight: 600 }}>
                  ✓ Coordinates captured ({coordinates.latitude?.toFixed(4)}, {coordinates.longitude?.toFixed(4)}). A Google Maps location link will be attached to your parcel.
                </p>
              )}

              {geoError && (
                <p style={{ fontSize: '0.72rem', color: '#991B1B', marginTop: '6px' }}>
                  {geoError}
                </p>
              )}
            </div>

            {/* Payment Options Selection */}
            {(() => {
              const codAdvance = Math.min(total, 200);
              const codRemaining = Math.max(0, total - codAdvance);
              const payableNow = paymentMode === 'COD' ? codAdvance : total;

              return (
                <div style={{ marginTop: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#520612', marginBottom: '10px' }}>
                    Select Payment Method
                  </label>

                  {/* Option 1: Pay Full Amount Online */}
                  <div
                    onClick={() => setPaymentMode('ONLINE')}
                    style={{
                      backgroundColor: paymentMode === 'ONLINE' ? '#FFFDF8' : '#FAF7F2',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      border: paymentMode === 'ONLINE' ? '2px solid #520612' : '1px solid #D4C9BC',
                      cursor: 'pointer',
                      marginBottom: '10px',
                      transition: 'all 0.2s ease',
                      boxShadow: paymentMode === 'ONLINE' ? '0 2px 8px rgba(82,6,18,0.08)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: paymentMode === 'ONLINE' ? '5px solid #520612' : '2px solid #8E857C',
                          backgroundColor: '#FFFFFF'
                        }} />
                        <div>
                          <span style={{ fontSize: '0.90rem', fontWeight: 700, color: '#520612' }}>
                            Pay Full Amount Online
                          </span>
                          <span style={{ display: 'block', fontSize: '0.78rem', color: '#166534', fontWeight: 600 }}>
                            Pay ₹{total.toLocaleString('en-IN')} now
                          </span>
                        </div>
                      </div>
                      <span style={{
                        backgroundColor: '#DCFCE7',
                        color: '#166534',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        border: '1px solid #86EFAC'
                      }}>
                        FASTEST DELIVERY
                      </span>
                    </div>
                    <p style={{ fontSize: '0.74rem', color: '#6B635B', marginLeft: '28px', marginTop: '2px', lineHeight: 1.4 }}>
                      Instant confirmation via Razorpay. Pay with <strong>UPI (GPay / PhonePe / Paytm)</strong>, Cards, or NetBanking.
                    </p>
                  </div>

                  {/* Option 2: Cash on Delivery with ₹200 Advance */}
                  <div
                    onClick={() => setPaymentMode('COD')}
                    style={{
                      backgroundColor: paymentMode === 'COD' ? '#FFFDF8' : '#FAF7F2',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      border: paymentMode === 'COD' ? '2px solid #520612' : '1px solid #D4C9BC',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: paymentMode === 'COD' ? '0 2px 8px rgba(82,6,18,0.08)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: paymentMode === 'COD' ? '5px solid #520612' : '2px solid #8E857C',
                          backgroundColor: '#FFFFFF'
                        }} />
                        <div>
                          <span style={{ fontSize: '0.90rem', fontWeight: 700, color: '#520612' }}>
                            Cash on Delivery
                          </span>
                          <span style={{ display: 'block', fontSize: '0.78rem', color: '#7D5C1E', fontWeight: 700 }}>
                            Pay ₹{codAdvance} now + remaining ₹{codRemaining.toLocaleString('en-IN')} on delivery
                          </span>
                        </div>
                      </div>
                      <span style={{
                        backgroundColor: '#FEF3C7',
                        color: '#92400E',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        border: '1px solid #FCD34D'
                      }}>
                        COD AVAILABLE
                      </span>
                    </div>

                    <div style={{
                      backgroundColor: '#F5E8C7',
                      border: '1px solid #C5A059',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      marginLeft: '28px',
                      marginTop: '8px'
                    }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#520612', margin: 0 }}>
                        ⚠️ ₹200 advance payment required. Remaining amount payable on delivery.
                      </p>
                      <p style={{ fontSize: '0.72rem', color: '#6B635B', margin: '4px 0 0', lineHeight: 1.4 }}>
                        {total <= 200
                          ? `Since order total is ₹${total}, pay ₹${codAdvance} online to confirm.`
                          : `Pay ₹${codAdvance} online now via Razorpay to confirm order booking. The remaining ₹${codRemaining.toLocaleString('en-IN')} is to be paid to the courier agent in cash/UPI upon doorstep delivery.`}
                      </p>
                    </div>
                  </div>

                  {/* Order Summary & Place Button */}
                  <div style={{ marginTop: '18px', borderTop: '1px solid #E8E2D9', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#6B635B', marginBottom: '4px' }}>
                      <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items):</span>
                      <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#166534', fontWeight: 600, marginBottom: '8px' }}>
                      <span>Insured Express Shipping:</span>
                      <span>FREE</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 700, color: '#520612', marginBottom: '10px' }}>
                      <span>Total Order Value:</span>
                      <span>₹{total.toLocaleString('en-IN')}</span>
                    </div>

                    {/* Breakdown for COD */}
                    {paymentMode === 'COD' && (
                      <div style={{
                        backgroundColor: '#FAF7F2',
                        border: '1px dashed #C5A059',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        marginBottom: '16px',
                        fontSize: '0.80rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#520612', fontWeight: 700, marginBottom: '4px' }}>
                          <span>Online Advance Payable Now:</span>
                          <span>₹{codAdvance.toLocaleString('en-IN')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7D5C1E', fontWeight: 700 }}>
                          <span>Cash on Delivery (Pay at Doorstep):</span>
                          <span>₹{codRemaining.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    )}

                    {pendingOrderInfo && orderError ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => launchRazorpayModal(pendingOrderInfo)}
                          disabled={submitting || verifying}
                          className="btn-gold"
                          style={{
                            width: '100%',
                            padding: '14px',
                            fontSize: '0.94rem',
                            boxShadow: '0 4px 16px rgba(197, 160, 89, 0.35)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                          }}
                        >
                          <RefreshCw size={16} /> RETRY PAYMENT (₹{(pendingOrderInfo.payableAmount || payableNow).toLocaleString('en-IN')})
                        </button>
                        <button
                          type="submit"
                          disabled={submitting || verifying}
                          className="btn-outline"
                          style={{ width: '100%', padding: '10px', fontSize: '0.82rem' }}
                        >
                          Re-initiate Order & Pay
                        </button>
                      </div>
                    ) : (
                      <div>
                        <button
                          type="submit"
                          disabled={submitting || verifying}
                          className="btn-maroon"
                          style={{
                            width: '100%',
                            padding: '14px',
                            fontSize: '0.94rem',
                            boxShadow: '0 4px 16px rgba(82, 6, 18, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                          }}
                        >
                          {verifying ? (
                            <>
                              <Loader2 size={16} className="animate-spin" /> Verifying Razorpay Payment...
                            </>
                          ) : submitting ? (
                            <>
                              <Loader2 size={16} className="animate-spin" /> Opening Razorpay Gateway...
                            </>
                          ) : paymentMode === 'COD' ? (
                            <>
                              <Lock size={15} /> PAY ₹{codAdvance} ADVANCE VIA RAZORPAY
                            </>
                          ) : (
                            <>
                              <Lock size={15} /> PROCEED TO PAY ₹{total.toLocaleString('en-IN')}
                            </>
                          )}
                        </button>

                        {paymentMode === 'COD' && (
                          <p style={{ fontSize: '0.72rem', color: '#7D5C1E', textAlign: 'center', marginTop: '6px', fontWeight: 600 }}>
                            Remaining ₹{codRemaining.toLocaleString('en-IN')} to be collected on delivery in cash/UPI.
                          </p>
                        )}
                      </div>
                    )}

                    <p style={{ fontSize: '0.70rem', color: '#8E857C', textAlign: 'center', marginTop: '10px' }}>
                      🔒 256-Bit Bank-grade Encryption. 100% Insured Delivery with Transit Guarantee.
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </form>
      </div>
    </div>
  );
}
