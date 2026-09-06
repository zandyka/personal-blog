import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 20px',
            textAlign: 'center',
            color: 'var(--text)',
            gap: '16px',
          }}
        >
          <div style={{ fontSize: '2.5rem' }}>⚡</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
            Memuat Versi Terbaru
          </h2>
          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
              maxWidth: '440px',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Halaman sedang dimutakhirkan dengan aset terbaru. Silakan tekan tombol di bawah untuk memuat ulang aplikasi.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              marginTop: '8px',
              padding: '10px 24px',
              borderRadius: '999px',
              background: 'var(--accent)',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 16px var(--accent-glow)',
            }}
          >
            Muat Ulang Halaman
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;