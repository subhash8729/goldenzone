import React from 'react';
import { MapPin, Check, X } from 'lucide-react';

export default function SavedAddressModal({ isOpen, savedData, onUseSaved, onEnterNew }) {
  if (!isOpen || !savedData) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 90,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      {/* Dim backdrop */}
      <div
        className="animate-fade-in"
        onClick={onEnterNew}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(31, 26, 23, 0.65)',
          backdropFilter: 'blur(2px)'
        }}
      />

      {/* Card Content */}
      <div className="animate-modal-pop" style={{
        position: 'relative',
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 16px 36px rgba(82, 6, 18, 0.18)',
        border: '1px solid #E8E2D9',
        overflow: 'hidden',
        zIndex: 91
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#FAF7F2',
          padding: '16px 20px',
          borderBottom: '1px solid #E8E2D9',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#F3ECE1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#520612'
          }}>
            <MapPin size={20} />
          </div>
          <div>
            <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontWeight: 700, color: '#520612' }}>
              Previous Delivery Details Found
            </h4>
            <p style={{ fontSize: '0.76rem', color: '#6B635B' }}>
              We found your saved address from a previous order.
            </p>
          </div>
        </div>

        {/* Saved Address Preview */}
        <div style={{ padding: '18px 20px' }}>
          <p style={{ fontSize: '0.85rem', color: '#1F1A17', marginBottom: '10px' }}>
            We found your previous delivery details. Use them?
          </p>

          <div style={{
            backgroundColor: '#FAF7F2',
            border: '1px solid #E8E2D9',
            borderRadius: '10px',
            padding: '12px 14px',
            fontSize: '0.82rem',
            color: '#1F1A17',
            lineHeight: 1.5,
            marginBottom: '18px'
          }}>
            <p><strong>Name:</strong> {savedData.full_name || 'Not Named'}</p>
            {savedData.secondary_mobile && <p><strong>Alt Mobile:</strong> {savedData.secondary_mobile}</p>}
            <p><strong>Address:</strong> {savedData.address}</p>
            <p><strong>City / Village:</strong> {savedData.city || savedData.village || 'N/A'}</p>
            <p><strong>District, State:</strong> {savedData.district}, {savedData.state} - {savedData.pincode}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={onUseSaved}
              style={{
                width: '100%',
                backgroundColor: '#520612',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px',
                borderRadius: '9999px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(82,6,18,0.2)'
              }}
            >
              <Check size={16} /> USE SAVED DETAILS
            </button>

            <button
              onClick={onEnterNew}
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                color: '#6B635B',
                border: '1px solid #D4C9BC',
                padding: '10px',
                borderRadius: '9999px',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ENTER NEW DETAILS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
