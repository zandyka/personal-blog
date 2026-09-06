import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && this.props.locationKey !== prevProps.locationKey) {
      this.setState({ hasError: false, error: null, showDetails: false });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
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
            Terjadi Kendala Memuat Komponen
          </h2>
          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
              maxWidth: '460px',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Sistem mendeteksi kendala rendering pada modul ini. Anda dapat mencoba memuat ulang halaman atau kembali ke beranda.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={this.handleReload}
              style={{
                padding: '10px 22px',
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
            <button
              onClick={this.handleGoHome}
              style={{
                padding: '10px 22px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.06)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Kembali ke Beranda
            </button>
          </div>

          {this.state.error && (
            <div style={{ marginTop: '20px', maxWidth: '600px', width: '100%', textAlign: 'left' }}>
              <button
                onClick={() => this.setState((s) => ({ showDetails: !s.showDetails }))}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dim)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  display: 'block',
                  margin: '0 auto',
                }}
              >
                {this.state.showDetails ? 'Sembunyikan Detail Teknis' : 'Lihat Detail Teknis'}
              </button>
              {this.state.showDetails && (
                <pre
                  style={{
                    marginTop: '10px',
                    padding: '12px 16px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    color: '#f87171',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              )}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;