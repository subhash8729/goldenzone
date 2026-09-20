import React, { useState } from 'react';
import { Star, CheckCircle2, MessageSquarePlus } from 'lucide-react';
import { reviewService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ReviewsSection({ reviews = [], productId, onReviewSubmitted }) {
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setMessage('Please log in to write a verified review.');
      openAuthModal();
      return;
    }
    if (!reviewText.trim()) return;

    setLoading(true);
    setMessage('');
    try {
      await reviewService.submitReview({
        product_id: productId,
        rating,
        review_text: reviewText.trim()
      });
      setMessage('Thank you! Your verified review was submitted for approval.');
      setReviewText('');
      setShowAddForm(false);
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err) {
      setMessage('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #E8E2D9' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', fontSize: '1.25rem', color: '#520612', fontWeight: 700 }}>
            Customer Reviews
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#6B635B' }}>
            Genuine feedback from verified jewellery patrons
          </p>
        </div>
        <button
          onClick={() => {
            if (!isAuthenticated) {
              setMessage('Please log in to write a verified review.');
              openAuthModal();
              return;
            }
            setShowAddForm(!showAddForm);
          }}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #520612',
            color: '#520612',
            borderRadius: '9999px',
            padding: '6px 14px',
            fontSize: '0.76rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <MessageSquarePlus size={14} /> Write Review
        </button>
      </div>

      {message && (
        <div style={{
          backgroundColor: '#F0FDF4',
          border: '1px solid #BBF7D0',
          color: '#166534',
          fontSize: '0.80rem',
          padding: '8px 12px',
          borderRadius: '8px',
          marginBottom: '14px'
        }}>
          {message}
        </div>
      )}

      {/* Add Review Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E8E2D9',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <h4 style={{ fontSize: '0.90rem', fontWeight: 700, color: '#520612', marginBottom: '12px' }}>
            Share your experience
          </h4>

          <p style={{ fontSize: '0.76rem', color: '#6B635B', marginBottom: '10px' }}>
            Posting as <strong>{user?.full_name && user.full_name !== 'Not Named' ? user.full_name : 'Verified customer'}</strong>.
          </p>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '4px' }}>
              Rating
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: star <= rating ? '#EAB308' : '#D4C9BC'
                  }}
                >
                  <Star size={20} fill={star <= rating ? '#EAB308' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '4px' }}>
              Review Description
            </label>
            <textarea
              required
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell us about the 1 gram gold-plated finish, fitting and look..."
              style={{
                width: '100%',
                padding: '8px 10px',
                border: '1px solid #D4C9BC',
                borderRadius: '6px',
                fontSize: '0.86rem',
                resize: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-maroon"
            style={{ padding: '8px 20px', fontSize: '0.82rem' }}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Review List */}
      {reviews.length === 0 ? (
        <p style={{ fontSize: '0.82rem', color: '#8E857C', fontStyle: 'italic', padding: '10px 0' }}>
          No reviews yet for this piece. Be the first to review!
        </p>
      ) : (
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '8px'
          }}
        >
          {reviews.map((rev) => (
            <div
              key={rev.id}
              style={{
                minWidth: '240px',
                maxWidth: '280px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E8E2D9',
                borderRadius: '12px',
                padding: '14px',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Reviewer Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#520612',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {rev.customer_name?.charAt(0) || 'K'}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1F1A17', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {rev.customer_name}
                    <CheckCircle2 size={13} color="#22C55E" />
                  </h4>
                  <span style={{ fontSize: '0.68rem', color: '#8E857C' }}>
                    Verified Buyer
                  </span>
                </div>
              </div>

              {/* Stars */}
              <div style={{ display: 'flex', gap: '2px', color: '#EAB308', marginBottom: '8px' }}>
                {[...Array(rev.rating || 5)].map((_, i) => (
                  <Star key={i} size={14} fill="#EAB308" />
                ))}
              </div>

              {/* Review Text */}
              <p style={{ fontSize: '0.80rem', color: '#1F1A17', lineHeight: 1.4, flex: 1 }}>
                "{rev.review_text}"
              </p>

              {/* Image if attached */}
              {rev.image_url && (
                <img
                  src={rev.image_url}
                  alt="Customer upload"
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    marginTop: '10px',
                    border: '1px solid #E8E2D9'
                  }}
                  loading="lazy"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
