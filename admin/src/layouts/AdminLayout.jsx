import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  LayoutDashboard,
  ShoppingBag,
  CheckCircle2,
  Trash2,
  Boxes,
  Tags,
  Users,
  CreditCard,
  MessageSquare,
  Settings,
  StickyNote,
  UserCheck,
  LogOut,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Orders', path: '/orders', icon: ShoppingBag },
    { label: 'Delivered Orders', path: '/orders?status=delivered', icon: CheckCircle2 },
    { label: 'Deleted Orders', path: '/orders?status=deleted', icon: Trash2 },
    { label: 'Products', path: '/products', icon: Boxes },
    { label: 'Categories', path: '/categories', icon: Tags },
    { label: 'Customers', path: '/customers', icon: Users },
    { label: 'Payments', path: '/payments', icon: CreditCard },
    { label: 'Reviews', path: '/reviews', icon: MessageSquare },
    { label: 'Site Settings', path: '/settings', icon: Settings },
    { label: 'Remarks / Notes', path: '/notes', icon: StickyNote },
    { label: 'Admin Account', path: '/account', icon: UserCheck }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path.includes('?status=')) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path && !location.search;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Sidebar Overlay on mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            zIndex: 40
          }}
        />
      )}

      {/* Main Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: '#520612',
        color: '#F3ECE1',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 50,
        transform: isSidebarOpen || window.innerWidth > 900 ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
        boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
      }}>
        {/* Sidebar Brand Header */}
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid rgba(197, 160, 89, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="https://www.photo-pick.com/online/api/v1/albums/007b52cf-a71d-4c0e-b3cd-13d3e2d3f660.jpg"
              alt="Golden Zone"
              style={{ height: '34px', width: '34px', borderRadius: '8px', objectFit: 'contain' }}
            />
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1 }}>
                Golden Zone
              </h2>
              <span style={{ fontSize: '0.66rem', color: '#C5A059', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
                Admin Portal
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            style={{ display: window.innerWidth <= 900 ? 'block' : 'none', background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={idx}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? '#FFFFFF' : '#D4C9BC',
                  backgroundColor: active ? '#73111F' : 'transparent',
                  marginBottom: '3px',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseOut={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon size={17} color={active ? '#C5A059' : '#D4C9BC'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* View Storefront Link */}
        <div style={{ padding: '0 12px 10px' }}>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              backgroundColor: 'rgba(0,0,0,0.25)',
              color: '#F5E8C7',
              padding: '8px',
              borderRadius: '6px',
              fontSize: '0.74rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <ExternalLink size={13} /> View Live Storefront
          </a>
        </div>

        {/* Admin User Card & Logout */}
        <div style={{
          padding: '14px 16px',
          borderTop: '1px solid rgba(197, 160, 89, 0.2)',
          backgroundColor: '#3E030C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <p style={{ fontSize: '0.80rem', fontWeight: 700, color: '#FFFFFF' }}>
              {admin?.full_name || 'Administrator'}
            </p>
            <p style={{ fontSize: '0.68rem', color: '#D4C9BC' }}>
              +91 {admin?.mobile_number || '7976580806'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            style={{
              background: 'none',
              border: 'none',
              color: '#F87171',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '6px'
            }}
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        marginLeft: window.innerWidth > 900 ? '260px' : 0,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw'
      }}>
        {/* Top bar on Mobile */}
        <header style={{
          height: '56px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          <button
            onClick={() => setIsSidebarOpen(true)}
            style={{ background: 'none', border: 'none', color: '#0F172A', cursor: 'pointer' }}
          >
            <Menu size={22} />
          </button>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#520612', fontSize: '1rem' }}>
            Golden Zone Admin
          </span>
          <div style={{ width: '22px' }} />
        </header>

        {/* Content Outlet */}
        <main style={{ flex: 1, padding: '20px 16px 40px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
