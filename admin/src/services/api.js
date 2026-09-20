import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Attach Admin token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('goldenzone_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('goldenzone_admin_token');
      localStorage.removeItem('goldenzone_admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const adminAuthService = {
  sendOtp: (mobile_number) =>
    api.post('/auth/admin/send-otp', { mobile_number }),
  login: (mobile_number, password, otp) =>
    api.post('/auth/admin/login', { mobile_number, password, otp }),
  getProfile: () => api.get('/auth/admin/profile'),
  changePassword: (current_password, new_password) =>
    api.put('/auth/admin/change-password', { current_password, new_password })
};

export const adminDashboardService = {
  getStats: (params) => api.get('/dashboard/stats', { params })
};

export const adminProductService = {
  getProducts: (params) => api.get('/products/admin/all', { params }),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  toggleFlag: (id, field, value) => api.patch(`/products/${id}/toggle`, { field, value })
};

export const adminOrderService = {
  getOrders: (params) => api.get('/orders/admin/all', { params }),
  getOrderDetail: (id) => api.get(`/orders/admin/${id}`),
  updateStatus: (id, is_shipped, is_delivered) =>
    api.patch(`/orders/admin/${id}/status`, { is_shipped, is_delivered }),
  updateRemark: (id, remark) => api.patch(`/orders/admin/${id}/remark`, { remark }),
  softDeleteOrder: (id) => api.delete(`/orders/admin/${id}`)
};

export const adminCategoryService = {
  getCategories: () => api.get('/categories/admin/all'),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`)
};

export const adminCustomerService = {
  getCustomers: (params) => api.get('/customers/admin/all', { params }),
  getCustomerDetail: (id) => api.get(`/customers/admin/${id}`)
};

export const adminPaymentService = {
  getPayments: (params) => api.get('/payments/admin/all', { params })
};

export const adminSettingService = {
  getSettings: () => api.get('/settings'),
  updateSettings: (settings) => api.put('/settings', { settings })
};

export const adminReviewService = {
  getReviews: () => api.get('/reviews/admin/all'),
  toggleApproval: (id, is_approved) => api.patch(`/reviews/admin/${id}/approval`, { is_approved }),
  deleteReview: (id) => api.delete(`/reviews/admin/${id}`)
};

export const adminNoteService = {
  getNotes: () => api.get('/notes/admin/all'),
  createNote: (data) => api.post('/notes/admin', data),
  updateNote: (id, data) => api.put(`/notes/admin/${id}`, data),
  deleteNote: (id) => api.delete(`/notes/admin/${id}`)
};

export default api;
