import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('goldenzone_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimerRef = React.useRef(null);

  useEffect(() => {
    localStorage.setItem('goldenzone_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (content) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    if (typeof content === 'string') {
      setToast({ type: 'text', message: content });
    } else {
      setToast(content);
    }
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  const closeToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(null);
  };

  const addToCart = (product, quantity = 1, openDrawer = false) => {
    if (product.is_out_of_stock) {
      showToast('⚠️ This item is currently out of stock.');
      return false;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            sku: product.sku,
            price: parseFloat(product.discounted_price),
            regular_price: parseFloat(product.regular_price),
            image: product.primary_image || (product.images && product.images[0]) || '',
            category_name: product.category_name,
            quantity
          }
        ];
      }
    });

    // Minimalist non-blocking added toast
    showToast({
      type: 'cart',
      name: product.name,
      image: product.primary_image || (product.images && product.images[0]) || '',
      price: product.discounted_price,
      quantity
    });

    if (openDrawer) {
      setIsCartOpen(true);
    }
    return true;
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; // Free Shipping on Prepaid / Promo orders
  const total = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shipping,
        total,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toast,
        toastMessage: toast?.message || (toast?.type === 'cart' ? `Added "${toast.name}"` : null),
        showToast,
        closeToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
