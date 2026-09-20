import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Attach JWT token if customer is logged in
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('goldenzone_customer_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle session expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if unauthorized / expired
      localStorage.removeItem('goldenzone_customer_token');
      localStorage.removeItem('goldenzone_customer_user');
    }
    return Promise.reject(error);
  }
);

// ======================================================
// API Services
// ======================================================

export const authService = {
  sendOtp: (mobile_number) => api.post('/auth/customer/send-otp', { mobile_number }),
  verifyOtp: (mobile_number, otp) => api.post('/auth/customer/verify-otp', { mobile_number, otp }),
  getProfile: () => api.get('/auth/customer/profile'),
  updateProfile: (profileData) => api.put('/auth/customer/profile', profileData)
};

export const productService = {
  getProducts: (params) => api.get('/products', { params }),
  getProductDetail: (identifier) => api.get(`/products/${identifier}`)
};

export const categoryService = {
  getCategories: () => api.get('/categories')
};

export const orderService = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getSavedAddress: () => api.get('/orders/customer/saved-address'),
  getMyOrders: () => api.get('/orders/customer/my-orders'),
  trackOrder: (orderNumber) => api.get(`/orders/track/${orderNumber}`)
};

export const paymentService = {
  verifyPayment: (paymentData) => api.post('/payments/verify', paymentData),
  reportPaymentFailed: (failureData) => api.post('/payments/failed', failureData)
};

export const settingService = {
  getSettings: () => api.get('/settings'),
  submitContact: (contactData) => api.post('/settings/contact', contactData)
};

export const reviewService = {
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
  submitReview: (reviewData) => api.post('/reviews', reviewData)
};

export default api;
