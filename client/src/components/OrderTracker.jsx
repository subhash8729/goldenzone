import React from 'react';
import { CheckCircle2, Clock, Truck, PackageCheck, AlertCircle } from 'lucide-react';

export default function OrderTracker({ order }) {
  if (!order) return null;

  const steps = [
    {
      id: 1,
      title: 'ORDERED',
      subtitle: 'Order Placed & Confirmed',
      isCompleted: true,
      timestamp: order.formatted_date || order.created_at,
      icon: CheckCircle2
    },
    {
      id: 2,
      title: 'SHIPPED',
      subtitle: order.is_shipped ? 'Handed to Delivery Partner' : 'In Packaging / Dispatch Queue',
      isCompleted: Boolean(order.is_shipped),
      timestamp: order.formatted_shipped_date || (order.is_shipped ? 'Shipped' : null),
      icon: Truck
    },
    {
      id: 3,
      title: 'DELIVERED',
      subtitle: order.is_delivered ? 'Delivered to Customer' : 'Estimated Delivery in 2-4 Days',
      isCompleted: Boolean(order.is_delivered),
      timestamp: order.formatted_delivered_date || (order.is_delivered ? 'Delivered' : null),
      icon: PackageCheck
    }
  ];

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      border: '1px solid #E8E2D9',
      padding: '20px 16px',
      boxShadow: '0 4px 16px rgba(82, 6, 18, 0.05)',
      marginBottom: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        borderBottom: '1px solid #F3ECE1',
        paddingBottom: '12px',
        marginBottom: '20px'
      }}>
        <div>
          <span style={{ fontSize: '0.72rem', color: '#8E857C', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Order Reference
          </span>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', color: '#520612', fontWeight: 700 }}>
            {order.order_number}
          </h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{
            display: 'inline-block',
            backgroundColor: order.is_delivered ? '#DCFCE7' : order.is_shipped ? '#FEF3C7' : '#F3ECE1',
            color: order.is_delivered ? '#166534' : order.is_shipped ? '#92400E' : '#520612',
            padding: '3px 10px',
            borderRadius: '9999px',
            fontSize: '0.74rem',
            fontWeight: 700
          }}>
            {order.is_delivered ? 'DELIVERED' : order.is_shipped ? 'SHIPPED' : 'ORDERED'}
          </span>
          <p style={{ fontSize: '0.72rem', color: '#8E857C', marginTop: '2px' }}>
            {order.relative_time}
          </p>
        </div>
      </div>

      {/* Flipkart-Style Milestone Stepper */}
      <div style={{ position: 'relative', paddingLeft: '28px', margin: '10px 0 20px' }}>
        {/* Continuous vertical line */}
        <div style={{
          position: 'absolute',
          left: '11px',
          top: '12px',
          bottom: '24px',
          width: '2px',
          backgroundColor: '#E8E2D9',
          zIndex: 1
        }} />

        {steps.map((st, idx) => {
          const isDone = st.isCompleted;
          const Icon = st.icon;

          return (
            <div
              key={st.id}
              style={{
                position: 'relative',
                marginBottom: idx === steps.length - 1 ? 0 : '24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              {/* Step indicator circle */}
              <div style={{
                position: 'absolute',
                left: '-28px',
                top: '0',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: isDone ? '#520612' : '#FAF7F2',
                border: isDone ? '2px solid #520612' : '2px solid #D4C9BC',
                color: isDone ? '#FFFFFF' : '#8E857C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                boxShadow: isDone ? '0 0 0 3px #F5E8C7' : 'none'
              }}>
                {isDone ? <CheckCircle2 size={15} /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D4C9BC' }} />}
              </div>

              {/* Step text */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h4 style={{
                    fontSize: '0.88rem',
                    fontWeight: isDone ? 700 : 500,
                    color: isDone ? '#520612' : '#8E857C'
                  }}>
                    {st.title} {isDone ? '✓' : '○'}
                  </h4>
                  {st.timestamp && (
                    <span style={{ fontSize: '0.72rem', color: '#8E857C' }}>
                      {st.timestamp}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.76rem', color: isDone ? '#1F1A17' : '#8E857C', marginTop: '2px' }}>
                  {st.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ordered Items Preview */}
      {order.items && order.items.length > 0 && (
        <div style={{ borderTop: '1px solid #F3ECE1', paddingTop: '16px', marginTop: '16px' }}>
          <h4 style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1F1A17', marginBottom: '10px' }}>
            Items in this parcel ({order.items.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {order.items.map((it) => (
              <div key={it.id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <img
                  src={it.product_image || 'https://pashupati.co/cdn/shop/files/B35A6888-45CE-4752-A4A2-7951A478EA61.jpg?v=1775994142&width=600'}
                  alt={it.product_name}
                  style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover', backgroundColor: '#F3ECE1' }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1F1A17', lineHeight: 1.2 }}>
                    {it.product_name}
                  </p>
                  <p style={{ fontSize: '0.72rem', color: '#8E857C' }}>
                    Qty: {it.quantity} × ₹{it.unit_price?.toLocaleString('en-IN')}
                  </p>
                </div>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#520612' }}>
                  ₹{(it.unit_price * it.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delivery Address Snapshot */}
      <div style={{
        marginTop: '16px',
        backgroundColor: '#FAF7F2',
        border: '1px solid #E8E2D9',
        borderRadius: '10px',
        padding: '12px 14px',
        fontSize: '0.78rem',
        color: '#1F1A17'
      }}>
        <strong style={{ color: '#520612', display: 'block', marginBottom: '4px' }}>
          Delivery Address
        </strong>
        <p>{order.full_name} (+91 {order.primary_mobile})</p>
        <p>{order.address}</p>
        <p>{order.city || order.village}, {order.district}, {order.state} - {order.pincode}</p>
      </div>
    </div>
  );
}
