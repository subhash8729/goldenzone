import React, { useState, useEffect } from 'react';
import { adminReviewService } from '../services/api';
import { Star, Eye, EyeOff, Trash2, CheckCircle2 } from 'lucide-react';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await adminReviewService.getReviews();
      setReviews(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggle = async (rev) => {
    const nextVal = !rev.is_approved;
    try {
      await adminReviewService.toggleApproval(rev.id, nextVal);
      fetchReviews();
    } catch (err) {
      alert('Failed to update review status');
    }
  };

  const handleDelete = async (rev) => {
    if (window.confirm(`Delete review from "${rev.customer_name}"?`)) {
      try {
        await adminReviewService.deleteReview(rev.id);
        fetchReviews();
      } catch (err) {
        alert('Failed to delete review');
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '18px' }}>
        <h1 style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', fontSize: '1.45rem', color: '#520612', fontWeight: 700 }}>
          Customer Reviews Moderation
        </h1>
        <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
          Approve, hide, or remove reviews submitted by patrons
        </p>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th>Rating</th>
              <th>Review Text</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((rev) => (
              <tr key={rev.id}>
                <td>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{rev.customer_name}</span>
                </td>
                <td>
                  <span style={{ fontSize: '0.80rem', color: '#520612', fontWeight: 600 }}>{rev.product_name}</span>
                  <p style={{ fontSize: '0.70rem', color: '#64748B' }}>SKU: {rev.product_sku}</p>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '2px', color: '#EAB308' }}>
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} size={13} fill="#EAB308" />
                    ))}
                  </div>
                </td>
                <td style={{ maxWidth: '280px' }}>
                  <p style={{ fontSize: '0.78rem', color: '#334155', lineHeight: 1.4 }}>"{rev.review_text}"</p>
                </td>
                <td>
                  <span style={{
                    backgroundColor: rev.is_approved ? '#DCFCE7' : '#FEF2F2',
                    color: rev.is_approved ? '#166534' : '#991B1B',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.70rem',
                    fontWeight: 700
                  }}>
                    {rev.is_approved ? 'APPROVED' : 'HIDDEN'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleToggle(rev)}
                      title={rev.is_approved ? 'Hide Review' : 'Approve Review'}
                      style={{
                        background: '#F1F5F9',
                        border: '1px solid #CBD5E1',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.72rem'
                      }}
                    >
                      {rev.is_approved ? <EyeOff size={13} /> : <Eye size={13} />}
                      {rev.is_approved ? 'Hide' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleDelete(rev)}
                      title="Delete Review"
                      style={{
                        background: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        padding: '4px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: '#991B1B'
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
