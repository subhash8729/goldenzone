import React from 'react';

/**
 * Premium Golden Zone Error Boundary
 * Catches runtime React rendering errors and displays an elegant luxury fallback
 * instead of an unexplained blank white screen.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('🔥 [Golden Zone ErrorBoundary caught an error]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV;

      return (
        <div style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
          backgroundColor: '#FAF7F2'
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '36px 28px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(82, 6, 18, 0.08)',
            border: '1px solid #E8E2D9'
          }}>
            {/* Logo Emblem */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              margin: '0 auto 18px',
              border: '1.5px solid #C5A059',
              padding: '4px',
              backgroundColor: '#FAF7F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src="https://res.cloudinary.com/dgxaol7mz/image/upload/v1789872269/ChatGPT_Image_Sep_19_2026_11_08_00_AM_1_xjiro4.png"
                alt="Golden Zone"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>

            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#8E857C',
              display: 'block',
              marginBottom: '6px'
            }}>
              Notice
            </span>

            <h2 style={{
              fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
              fontSize: '1.4rem',
              fontWeight: 700,
              color: '#520612',
              marginBottom: '10px'
            }}>
              Something Went Wrong
            </h2>

            <p style={{
              fontSize: '0.88rem',
              color: '#6B635B',
              lineHeight: 1.6,
              marginBottom: '24px'
            }}>
              We encountered an unexpected issue while loading this page. Please try refreshing or return to the main collection.
            </p>

            {isDev && this.state.error && (
              <div style={{
                textAlign: 'left',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: '8px',
                padding: '12px 14px',
                marginBottom: '24px',
                fontSize: '0.75rem',
                color: '#991B1B',
                overflowX: 'auto',
                fontFamily: 'monospace'
              }}>
                <strong>Debug Info:</strong> {this.state.error.toString()}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReset}
                style={{
                  backgroundColor: '#FAF7F2',
                  border: '1px solid #D4C9BC',
                  color: '#520612',
                  padding: '11px 22px',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                style={{
                  backgroundColor: '#520612',
                  border: '1px solid #520612',
                  color: '#FFFFFF',
                  padding: '11px 24px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(82, 6, 18, 0.2)',
                  transition: 'all 0.15s ease'
                }}
              >
                Return to Storefront
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
