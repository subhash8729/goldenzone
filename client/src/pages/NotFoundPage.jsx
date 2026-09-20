import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ maxWidth: '500px', margin: '80px auto', padding: '0 16px', textAlign: 'center' }}>
      <h1 style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', fontSize: '3rem', color: '#520612', marginBottom: '8px' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.2rem', color: '#1F1A17', marginBottom: '8px' }}>
        Page Not Found
      </h2>
      <p style={{ color: '#6B635B', marginBottom: '24px', fontSize: '0.86rem' }}>
        The jewellery collection or page you were looking for doesn't exist or has moved.
      </p>
      <Link to="/" className="btn-maroon">
        Return to Home
      </Link>
    </div>
  );
}
