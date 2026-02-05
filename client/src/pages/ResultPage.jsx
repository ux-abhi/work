import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSmartLink, getQRDataUrl, getWalletPass } from '../api';
import './ResultPage.css';

/**
 * Shows the generated smart link with:
 * - Shareable URL
 * - QR code card
 * - Apple Wallet pass download
 * - Copy-to-clipboard
 */
export default function ResultPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [qr, setQr] = useState(null);
  const [copied, setCopied] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('link');

  const smartLinkUrl = `${window.location.origin}/s/${slug}`;

  useEffect(() => {
    getSmartLink(slug).then(setData).catch(() => {});
    getQRDataUrl(slug).then(setQr).catch(() => {});
  }, [slug]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(smartLinkUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = smartLinkUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleWalletDownload() {
    setWalletLoading(true);
    try {
      const pass = await getWalletPass(slug);
      // Download the manifest as JSON (real implementation would download .pkpass)
      const blob = new Blob([JSON.stringify(pass.manifest, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smartlink-${slug}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silently fail
    } finally {
      setWalletLoading(false);
    }
  }

  if (!data) {
    return (
      <div className="result-page">
        <div className="result-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="result-page">
      <header className="result-header">
        <Link to="/" className="back-link">
          ← New Link
        </Link>
        <div className="logo-small">
          <span className="logo-icon">◆</span> SmartLink
        </div>
      </header>

      <div className="result-content">
        <div className="success-badge">✓ Created</div>
        <h1 className="result-title">{data.title}</h1>
        <p className="result-meta">
          {data.links.length} link{data.links.length !== 1 ? 's' : ''} · {data.template} template
        </p>

        {/* Tab switcher */}
        <div className="result-tabs">
          <button
            className={`tab ${activeTab === 'link' ? 'active' : ''}`}
            onClick={() => setActiveTab('link')}
          >
            Smart Link
          </button>
          <button
            className={`tab ${activeTab === 'qr' ? 'active' : ''}`}
            onClick={() => setActiveTab('qr')}
          >
            QR Code
          </button>
          <button
            className={`tab ${activeTab === 'wallet' ? 'active' : ''}`}
            onClick={() => setActiveTab('wallet')}
          >
            Wallet Pass
          </button>
        </div>

        {/* Tab content */}
        <div className="tab-content">
          {activeTab === 'link' && (
            <div className="tab-panel">
              <div className="url-display">
                <span className="url-text">{smartLinkUrl}</span>
                <button className="copy-btn" onClick={handleCopy}>
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <a
                href={smartLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="open-link-btn"
              >
                Open Smart Link →
              </a>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="tab-panel qr-panel">
              <div className="qr-card">
                {qr ? (
                  <img src={qr.dataUrl} alt="QR Code" className="qr-image" />
                ) : (
                  <div className="qr-placeholder">Generating...</div>
                )}
                <div className="qr-card-info">
                  <p className="qr-card-title">{data.title}</p>
                  <p className="qr-card-url">{smartLinkUrl}</p>
                </div>
              </div>
              <p className="qr-hint">
                Scan to open all {data.links.length} links
              </p>
              {qr && (
                <a
                  href={`/api/qr/${slug}?size=800`}
                  download={`smartlink-${slug}-qr.png`}
                  className="download-btn"
                >
                  Download QR Code
                </a>
              )}
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="tab-panel wallet-panel">
              <div className="wallet-card">
                <div className="wallet-card-header">
                  <span className="wallet-logo">◆</span>
                  <span>SmartLink</span>
                </div>
                <div className="wallet-card-body">
                  <p className="wallet-card-title">{data.title}</p>
                  <p className="wallet-card-count">
                    {data.links.length} link{data.links.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="wallet-card-qr">
                  {qr && <img src={qr.dataUrl} alt="QR" />}
                </div>
              </div>
              <button
                className="download-btn"
                onClick={handleWalletDownload}
                disabled={walletLoading}
              >
                {walletLoading ? 'Generating...' : 'Download Wallet Pass'}
              </button>
              <p className="wallet-note">
                Apple Wallet pass requires signing with an Apple Developer certificate.
                The download provides the pass manifest for integration.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
