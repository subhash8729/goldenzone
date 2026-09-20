import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { categoryService, settingService } from './services/api';
import { getMergedSettings } from './config/siteDetails';

import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import SitePreloader from './components/SitePreloader';
import ErrorBoundary from './components/ErrorBoundary';
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
      <Header categories={categories} settings={settings} />
      <CartDrawer />
      <AuthModal />
      <Toast toast={toast} onClose={closeToast} onOpenCart={openCart} />

      <main style={{ flex: 1 }}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage settings={settings} categories={categories} />} />
            <Route path="/shop" element={<ShopPage categories={categories} />} />
            <Route path="/product/:identifier" element={<ProductDetailPage settings={settings} />} />
            <Route path="/checkout" element={<CheckoutPage settings={settings} />} />
            <Route path="/orders" element={<OrderTrackingPage />} />
            <Route path="/orders/:orderNumber" element={<OrderTrackingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/about" element={<AboutPage settings={settings} />} />
            <Route path="/contact" element={<ContactPage settings={settings} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </main>

      <Footer settings={settings} />
    </div>
  );
}

export default function App() {
  const [settings, setSettings] = useState(() => getMergedSettings({}));
  const [categories, setCategories] = useState([]);
  const [preloaderActive, setPreloaderActive] = useState(true);

  useEffect(() => {
    // Load public site settings
    settingService.getSettings()
      .then((res) => {
        if (res.data?.settings) {
          setSettings(getMergedSettings(res.data.settings));
        }
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
          {preloaderActive && (
            <SitePreloader onFinish={() => setPreloaderActive(false)} />
          )}
          <div className={preloaderActive ? '' : 'gz-page-enter'} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <ErrorBoundary>
              <AppContent settings={settings} categories={categories} />
            </ErrorBoundary>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
