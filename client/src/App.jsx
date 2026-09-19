import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { categoryService, settingService } from './services/api';

import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import { Toast } from './components/LoadingSkeleton';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Inner App with Cart context for Toast display
function AppContent({ settings, categories }) {
  const { toast, closeToast, openCart } = useCart();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header categories={categories} />
      <CartDrawer />
      <AuthModal />
      <Toast toast={toast} onClose={closeToast} onOpenCart={openCart} />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage settings={settings} categories={categories} />} />
          <Route path="/shop" element={<ShopPage categories={categories} />} />
          <Route path="/product/:identifier" element={<ProductDetailPage settings={settings} />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrderTrackingPage />} />
          <Route path="/orders/:orderNumber" element={<OrderTrackingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage settings={settings} />} />
          <Route path="/contact" element={<ContactPage settings={settings} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer settings={settings} />
    </div>
  );
}

export default function App() {
  const [settings, setSettings] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Load public site settings
    settingService.getSettings()
      .then((res) => {
        if (res.data?.settings) setSettings(res.data.settings);
      })
      .catch((err) => console.log('Site settings load notice:', err.message));

    // Load active categories
    categoryService.getCategories()
      .then((res) => {
        if (res.data?.data) setCategories(res.data.data);
      })
      .catch((err) => console.log('Category load notice:', err.message));
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent settings={settings} categories={categories} />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
