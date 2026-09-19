import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('goldenzone_customer_token');
    const storedUser = localStorage.getItem('goldenzone_customer_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Verify token with server in background
        authService.getProfile()
          .then((res) => {
            if (res.data && res.data.customer) {
              setUser(res.data.customer);
              localStorage.setItem('goldenzone_customer_user', JSON.stringify(res.data.customer));
            }
          })
          .catch(() => {
            // If token invalid, remove
            logout();
          })
          .finally(() => setLoading(false));
      } catch (e) {
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = (authToken, customerData) => {
    setToken(authToken);
    setUser(customerData);
    localStorage.setItem('goldenzone_customer_token', authToken);
    localStorage.setItem('goldenzone_customer_user', JSON.stringify(customerData));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('goldenzone_customer_token');
    localStorage.removeItem('goldenzone_customer_user');
  };

  const updateUser = (updatedCustomer) => {
    setUser(updatedCustomer);
    localStorage.setItem('goldenzone_customer_user', JSON.stringify(updatedCustomer));
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
        updateUser,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
