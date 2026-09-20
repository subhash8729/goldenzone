import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminOrderService } from '../services/api';
import {
  Search,
  MapPin,
  Eye,
  Trash2,
  Save,
  Check,
  Calendar,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export default function OrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentStatus = searchParams.get('status') || 'all';
  const currentDateFilter = searchParams.get('date') || 'all';
  const currentSearch = searchParams.get('search') || '';

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const [selectedOrder, setSelectedOrder] = useState(null); // For View Items Modal
  const [remarksState, setRemarksState] = useState({});
  const [remarkSuccess, setRemarkSuccess] = useState({});

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminOrderService.getOrders({
        status: currentStatus,
        date_filter: currentDateFilter !== 'all' ? currentDateFilter : undefined,
        search: currentSearch || undefined,
        page: searchParams.get('page') || 1,
        limit: 25
      });

      const list = res.data?.data || [];
      setOrders(list);

      // Initialize remarks local state
      const initialRemarks = {};
      list.forEach((ord) => {
        initialRemarks[ord.id] = ord.admin_remark || '';
      });
      setRemarksState(initialRemarks);

      if (res.data?.pagination) {
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentStatus, currentDateFilter, currentSearch, searchParams.get('page')]);

  useEffect(() => {
    setSearchQuery(currentSearch);
  }, [currentSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      newParams.set('search', searchQuery.trim());
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  // Status Tab Switch
  const handleStatusChange = (status) => {
    const newParams = new URLSearchParams(searchParams);
    if (status === 'all') {
      newParams.delete('status');
    } else {
      newParams.set('status', status);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  // Date Filter Switch
  const handleDateChange = (date) => {
    const newParams = new URLSearchParams(searchParams);
    if (date === 'all') {
      newParams.delete('date');
    } else {
      newParams.set('date', date);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  // Shipped checkbox toggle
  const handleToggleShipped = async (ord) => {
    const nextShipped = !ord.is_shipped;
    try {
      await adminOrderService.updateStatus(ord.id, nextShipped, nextShipped ? ord.is_delivered : false);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update shipping status');
    }
  };

  // Delivered checkbox toggle (Delivered is disabled if Shipped is false)
  const handleToggleDelivered = async (ord) => {
    if (!ord.is_shipped) return;
    const nextDelivered = !ord.is_delivered;
    try {
      await adminOrderService.updateStatus(ord.id, true, nextDelivered);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update delivery status');
    }
  };

  // Save Remark
  const handleSaveRemark = async (orderId) => {
    const remark = remarksState[orderId] || '';
    try {
      await adminOrderService.updateRemark(orderId, remark);
      setRemarkSuccess((prev) => ({ ...prev, [orderId]: true }));
      setTimeout(() => {
        setRemarkSuccess((prev) => ({ ...prev, [orderId]: false }));
      }, 2500);
    } catch (err) {
      alert('Failed to save remark.');
    }
  };

  // Soft Delete Order
  const handleDeleteOrder = async (orderId, orderNumber) => {
    if (window.confirm(`Are you sure you want to move order ${orderNumber} to Deleted Orders?`)) {
      try {
        await adminOrderService.softDeleteOrder(orderId);
        fetchOrders();
      } catch (err) {
        alert('Failed to delete order');
      }
    }
  };

  // View Items Modal
  const handleViewItems = async (orderId) => {
    try {
      const res = await adminOrderService.getOrderDetail(orderId);
      if (res.data?.order) {
        setSelectedOrder(res.data.order);
      }
    } catch (err) {
      alert('Failed to load order items');
    }
  };

  return (
    <div>
      {/* Header Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '18px' }}>
        <div>
          <h1 style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', fontSize: '1.45rem', color: '#520612', fontWeight: 700 }}>
            Orders Management
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
            Process orders, coordinate courier dispatch, and record remarks
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '6px',
            padding: '4px 10px'
          }}>
            <Search size={15} color="#64748B" style={{ marginRight: '6px' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Order #, name, mobile..."
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem', width: '180px' }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.80rem' }}>
            Search
          </button>
        </form>
      </div>

      {/* Filter Tabs (Status & Date) */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '10px',
        padding: '10px 14px',
        marginBottom: '16px'
      }}>
        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }} className="no-scrollbar">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'ordered', label: 'Ordered' },
            { id: 'shipped', label: 'Shipped' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'deleted', label: 'Deleted' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => handleStatusChange(st.id)}
              style={{
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: currentStatus === st.id ? '#520612' : '#F1F5F9',
                color: currentStatus === st.id ? '#FFFFFF' : '#475569',
                transition: 'all 0.15s'
              }}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Date Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={15} color="#64748B" />
          <select
            value={currentDateFilter}
            onChange={(e) => handleDateChange(e.target.value)}
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #CBD5E1',
              borderRadius: '6px',
              padding: '5px 10px',
              fontSize: '0.76rem',
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <option value="all">Date: All Time</option>
            <option value="today">Date: Today</option>
            <option value="yesterday">Date: Yesterday</option>
            <option value="7days">Date: Last 7 Days</option>
            <option value="30days">Date: Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Orders Table Container */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748B' }}>
            <p>Loading order records...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
            <p style={{ fontWeight: 600, fontSize: '0.90rem', color: '#0F172A' }}>No orders found in this filter.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order Details</th>
                  <th>Customer Info</th>
                  <th>Delivery Address</th>
                  <th>Amount</th>
                  <th style={{ textAlign: 'center' }}>Lifecycle Checkboxes</th>
                  <th>Location</th>
                  <th>Remark</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord.id} style={{ backgroundColor: ord.deleted_at ? '#FFF5F5' : 'inherit' }}>
                    {/* 1. Order Details: Number + Date (Relative & Full formatted) */}
                    <td>
                      <div style={{ fontWeight: 700, color: '#520612', fontSize: '0.86rem' }}>
                        {ord.order_number}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#16A34A', fontWeight: 600 }}>
                        {ord.relative_time}
                      </div>
                      <div style={{ fontSize: '0.70rem', color: '#64748B' }}>
                        {ord.formatted_date}
                      </div>
                      {ord.deleted_at && (
                        <span className="badge-status deleted" style={{ marginTop: '4px' }}>
                          SOFT DELETED
                        </span>
                      )}
                    </td>

                    {/* 2. Customer Info: Name & Numbers */}
                    <td>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{ord.full_name}</div>
                      <div style={{ fontSize: '0.74rem', color: '#475569' }}>
                        📱 +91 {ord.primary_mobile}
                      </div>
                      {ord.secondary_mobile && (
                        <div style={{ fontSize: '0.70rem', color: '#64748B' }}>
                          Alt: +91 {ord.secondary_mobile}
                        </div>
                      )}
                    </td>

                    {/* 3. Delivery Address */}
                    <td style={{ maxWidth: '200px' }}>
                      <p style={{ fontSize: '0.76rem', color: '#1E293B', lineHeight: 1.3 }}>
                        {ord.address}
                      </p>
                      <p style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {ord.city || ord.village}, {ord.district}, {ord.state} - {ord.pincode}
                      </p>
                    </td>

                    {/* 4. Amount & Status */}
                    <td>
                      <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.88rem' }}>
                        ₹{ord.total_amount?.toLocaleString('en-IN')}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '3px' }}>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: ord.payment_mode === 'COD' ? '#FEF3C7' : '#DCFCE7',
                          color: ord.payment_mode === 'COD' ? '#92400E' : '#166534',
                          width: 'fit-content'
                        }}>
                          {ord.payment_mode === 'COD' ? 'COD (₹200 Adv)' : 'ONLINE PREPAID'}
                        </span>
                        {ord.payment_mode === 'COD' && (
                          <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#B45309' }}>
                            Collect: ₹{Number(ord.remaining_cod_amount || 0).toLocaleString('en-IN')}
                          </span>
                        )}
                        <span style={{
                          display: 'inline-block',
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: ord.payment_status === 'PAID' ? '#DCFCE7' : ord.payment_status === 'FAILED' ? '#FEE2E2' : '#FEF3C7',
                          color: ord.payment_status === 'PAID' ? '#166534' : ord.payment_status === 'FAILED' ? '#991B1B' : '#92400E',
                          width: 'fit-content'
                        }}>
                          {ord.payment_status === 'PAID' ? '● Razorpay Verified' : ord.payment_status || 'Pending'}
                        </span>
                      </div>
                      {ord.razorpay_order_id && (
                        <div style={{ fontSize: '0.66rem', color: '#64748B', marginTop: '2px', fontFamily: 'monospace' }}>
                          {ord.razorpay_order_id}
                        </div>
                      )}
                    </td>

                    {/* 5. Shipped & Delivered Checkboxes (Strictly Enforced Rules) */}
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                        {/* Shipped Checkbox */}
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          color: ord.is_shipped ? '#92400E' : '#64748B'
                        }}>
                          <input
                            type="checkbox"
                            checked={Boolean(ord.is_shipped)}
                            onChange={() => handleToggleShipped(ord)}
                            style={{ cursor: 'pointer' }}
                          />
                          SHIPPED
                        </label>

                        {/* Delivered Checkbox: DISABLED if Shipped is false! */}
                        <label
                          title={!ord.is_shipped ? 'Enable Shipped first to check Delivered' : ''}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: ord.is_shipped ? 'pointer' : 'not-allowed',
                            opacity: ord.is_shipped ? 1 : 0.45,
                            fontSize: '0.76rem',
                            fontWeight: 600,
                            color: ord.is_delivered ? '#166534' : '#64748B'
                          }}
                        >
                          <input
                            type="checkbox"
                            disabled={!ord.is_shipped}
                            checked={Boolean(ord.is_delivered)}
                            onChange={() => handleToggleDelivered(ord)}
                            style={{ cursor: ord.is_shipped ? 'pointer' : 'not-allowed' }}
                          />
                          DELIVERED
                        </label>
                      </div>
                    </td>

                    {/* 6. Geolocation & Google Maps Link */}
                    <td>
                      {ord.latitude && ord.longitude ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '0.70rem', color: '#475569', fontFamily: 'monospace' }}>
                            {parseFloat(ord.latitude).toFixed(4)}, {parseFloat(ord.longitude).toFixed(4)}
                          </span>
                          <a
                            href={ord.maps_url || `https://www.google.com/maps?q=${ord.latitude},${ord.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              backgroundColor: '#E0F2FE',
                              color: '#0369A1',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              textDecoration: 'none',
                              width: 'fit-content'
                            }}
                          >
                            <MapPin size={12} /> VIEW MAPS
                          </a>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontStyle: 'italic' }}>
                          Manual address
                        </span>
                      )}
                    </td>

                    {/* 7. Persistent Remark Textarea */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '150px' }}>
                        <textarea
                          rows={2}
                          value={remarksState[ord.id] || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRemarksState((prev) => ({ ...prev, [ord.id]: val }));
                          }}
                          placeholder="Delivery remark..."
                          style={{
                            width: '100%',
                            fontSize: '0.74rem',
                            padding: '4px 6px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '4px',
                            resize: 'none'
                          }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <button
                            onClick={() => handleSaveRemark(ord.id)}
                            style={{
                              backgroundColor: '#520612',
                              color: '#FFFFFF',
                              border: 'none',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '0.70rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px'
                            }}
                          >
                            <Save size={11} /> Save
                          </button>
                          {remarkSuccess[ord.id] && (
                            <span style={{ fontSize: '0.68rem', color: '#16A34A', fontWeight: 600 }}>
                              ✓ Saved
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 8. Action Buttons (View Items Modal, Delete) */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => handleViewItems(ord.id)}
                          title="View Items & Details"
                          style={{
                            backgroundColor: '#F1F5F9',
                            border: '1px solid #CBD5E1',
                            color: '#0F172A',
                            padding: '5px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Eye size={13} /> Items
                        </button>

                        {!ord.deleted_at && (
                          <button
                            onClick={() => handleDeleteOrder(ord.id, ord.order_number)}
                            title="Soft Delete"
                            style={{
                              backgroundColor: '#FEF2F2',
                              border: '1px solid #FCA5A5',
                              color: '#991B1B',
                              padding: '5px 7px',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VIEW ITEMS MODAL */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '85vh',
            overflowY: 'auto',
            border: '1px solid #CBD5E1',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
              <div>
                <h3 style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', fontSize: '1.2rem', color: '#520612', fontWeight: 700 }}>
                  Order {selectedOrder.order_number}
                </h3>
                <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                  Placed: {selectedOrder.formatted_date}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Customer & Location */}
            <div style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '0.80rem',
              marginBottom: '16px'
            }}>
              <p><strong>Customer:</strong> {selectedOrder.full_name} (+91 {selectedOrder.primary_mobile})</p>
              <p>
                <strong>Payment Mode:</strong>{' '}
                <span style={{ fontWeight: 700, color: selectedOrder.payment_mode === 'COD' ? '#B45309' : '#16A34A' }}>
                  {selectedOrder.payment_mode === 'COD' ? 'Cash on Delivery' : 'Online Prepaid'}
                </span>
                {selectedOrder.payment_mode === 'COD' && (
                  <span style={{ fontSize: '0.74rem', marginLeft: '6px', color: '#64748B' }}>
                    (Advance Paid: ₹{Number(selectedOrder.advance_amount || 0).toLocaleString('en-IN')} | Remaining to Collect: ₹{Number(selectedOrder.remaining_cod_amount || 0).toLocaleString('en-IN')})
                  </span>
                )}
              </p>
              <p><strong>Payment Status:</strong> <span style={{ fontWeight: 700, color: selectedOrder.payment_status === 'PAID' ? '#16A34A' : selectedOrder.payment_status === 'FAILED' ? '#DC2626' : '#D97706' }}>{selectedOrder.payment_status === 'PAID' ? '● Razorpay Verified' : selectedOrder.payment_status || 'PENDING'}</span> {selectedOrder.razorpay_order_id ? `(${selectedOrder.razorpay_order_id})` : ''}</p>
              <p><strong>Address:</strong> {selectedOrder.address}</p>
              <p><strong>Region:</strong> {selectedOrder.city || selectedOrder.village}, {selectedOrder.district}, {selectedOrder.state} - {selectedOrder.pincode}</p>
              {selectedOrder.directions_url && (
                <a
                  href={selectedOrder.directions_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0284C7', fontWeight: 600, marginTop: '4px' }}
                >
                  <ExternalLink size={12} /> Open in Google Maps Directions
                </a>
              )}
            </div>

            {/* Items List */}
            <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>
              Ordered Items ({selectedOrder.items?.length || 0})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              {selectedOrder.items?.map((it) => (
                <div key={it.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '8px', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                  <img
                    src={it.product_image || 'https://pashupati.co/cdn/shop/files/B35A6888-45CE-4752-A4A2-7951A478EA61.jpg?v=1775994142&width=600'}
                    alt={it.product_name}
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0F172A' }}>{it.product_name}</p>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>SKU: {it.product_sku}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#520612' }}>
                      ₹{it.subtotal_price?.toLocaleString('en-IN')}
                    </span>
                    <p style={{ fontSize: '0.72rem', color: '#64748B' }}>Qty: {it.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total and close button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
              <div>
                <span style={{ fontSize: '0.80rem', color: '#64748B' }}>Total Amount:</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#520612', marginLeft: '6px' }}>
                  ₹{selectedOrder.total_amount?.toLocaleString('en-IN')}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
