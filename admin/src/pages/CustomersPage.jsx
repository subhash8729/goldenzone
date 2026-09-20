import React, { useState, useEffect } from 'react';
import { adminCustomerService } from '../services/api';
import { Users, Search, ShoppingBag, Eye, X, Phone, MapPin } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await adminCustomerService.getCustomers({ search: search.trim() || undefined });
      setCustomers(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleOpenCustomer = async (cust) => {
    setSelectedCustomer(cust);
    setModalLoading(true);
    try {
      const res = await adminCustomerService.getCustomerDetail(cust.id);
      if (res.data?.orders) {
        setCustomerOrders(res.data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <h1 style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', fontSize: '1.45rem', color: '#520612', fontWeight: 700 }}>
            Customer Directory
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
            Registered mobile users and order history
          </p>
        </div>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '4px 10px' }}>
            <Search size={14} color="#64748B" style={{ marginRight: '6px' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, mobile, city..."
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.80rem', width: '180px' }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
            Search
          </button>
        </form>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Primary Mobile</th>
              <th>Secondary Contact</th>
              <th>Saved Location</th>
              <th>Total Orders</th>
              <th>Total Value</th>
              <th>Registered</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{c.full_name}</span>
                </td>
                <td>
                  <span style={{ fontSize: '0.80rem', color: '#334155' }}>+91 {c.mobile_number}</span>
                </td>
                <td>
                  <span style={{ fontSize: '0.76rem', color: '#64748B' }}>
                    {c.secondary_mobile ? `+91 ${c.secondary_mobile}` : '—'}
                  </span>
                </td>
                <td style={{ maxWidth: '180px' }}>
                  <span style={{ fontSize: '0.76rem', color: '#475569' }}>
                    {c.city || c.village ? `${c.city || c.village}, ${c.state || ''}` : 'Not provided yet'}
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: '#520612' }}>{c.total_orders || 0}</span> orders
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: '#16A34A' }}>
                    ₹{c.total_spent?.toLocaleString('en-IN') || 0}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '0.74rem', color: '#64748B' }}>{c.relative_registered}</span>
                </td>
                <td>
                  <button
                    onClick={() => handleOpenCustomer(c)}
                    style={{
                      background: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: '#0F172A',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Eye size={12} /> View Orders
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '560px', maxHeight: '85vh', overflowY: 'auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
              <div>
                <h3 style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', fontSize: '1.2rem', color: '#520612', fontWeight: 700 }}>
                  {selectedCustomer.full_name}
                </h3>
                <span style={{ fontSize: '0.76rem', color: '#64748B' }}>+91 {selectedCustomer.mobile_number}</span>
              </div>
              <button onClick={() => setSelectedCustomer(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '8px', padding: '12px', marginBottom: '16px', fontSize: '0.80rem' }}>
              <p><strong>Saved Address:</strong> {selectedCustomer.address || 'None'}</p>
              <p><strong>City/Village:</strong> {selectedCustomer.city || selectedCustomer.village || 'N/A'}</p>
              <p><strong>State & PIN:</strong> {selectedCustomer.state || ''} - {selectedCustomer.pincode || ''}</p>
            </div>

            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>
              Order History ({customerOrders.length})
            </h4>

            {modalLoading ? (
              <p style={{ fontSize: '0.80rem', color: '#64748B' }}>Loading customer orders...</p>
            ) : customerOrders.length === 0 ? (
              <p style={{ fontSize: '0.80rem', color: '#64748B', fontStyle: 'italic' }}>No orders placed yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {customerOrders.map((ord) => (
                  <div key={ord.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#520612', fontSize: '0.82rem' }}>{ord.order_number}</div>
                      <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {new Date(ord.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700 }}>₹{ord.total_amount?.toLocaleString('en-IN')}</div>
                      <span className={`badge-status ${ord.is_delivered ? 'delivered' : ord.is_shipped ? 'shipped' : 'ordered'}`}>
                        {ord.is_delivered ? 'DELIVERED' : ord.is_shipped ? 'SHIPPED' : 'ORDERED'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
