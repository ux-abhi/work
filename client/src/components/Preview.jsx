import './Preview.css';

/**
 * Live preview of the smart link page.
 * Rendered in a phone-shaped frame to simulate the final output.
 */
export default function Preview({ title, description, links, template }) {
  const css = template?.css || {
    background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%)',
    cardBackground: '#ffffff',
    cardBorder: '1px solid rgba(0,0,0,0.06)',
    cardShadow: '0 1px 3px rgba(0,0,0,0.04)',
    textColor: '#1d1d1f',
    subtextColor: '#86868b',
    accentColor: '#0071e3',
    borderRadius: '14px',
  };

  return (
    <div className="preview-frame">
      <div className="preview-notch" />
      <div
        className="preview-screen"
        style={{ background: css.background }}
      >
        {/* Avatar */}
        <div
          className="preview-avatar"
          style={{
            background: css.accentColor,
            color: css.background?.includes('#fff') ? '#1d1d1f' : '#fff',
          }}
        >
          {title.charAt(0).toUpperCase()}
        </div>

        <h2 className="preview-title" style={{ color: css.textColor }}>
          {title}
        </h2>

        {description && (
          <p className="preview-desc" style={{ color: css.subtextColor }}>
            {description}
          </p>
        )}

        <div className="preview-links">
          {links.length === 0 && (
            <div className="preview-empty" style={{ color: css.subtextColor }}>
              Add links to see preview
            </div>
          )}
          {links.map((link, i) => (
            <div
              key={i}
              className="preview-link-card"
              style={{
                background: css.cardBackground,
                border: css.cardBorder,
                borderRadius: css.borderRadius,
                boxShadow: css.cardShadow,
                backdropFilter: css.backdropFilter || 'none',
              }}
            >
              <span className="preview-link-icon">{link.icon || '🔗'}</span>
              <span
                className="preview-link-title"
                style={{ color: css.textColor }}
              >
                {link.title || extractDomain(link.url) || 'Link'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function extractDomain(url) {
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', '');
  } catch {
    return '';
  }
}
