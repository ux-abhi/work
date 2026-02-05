import './TemplateSelector.css';

/**
 * Grid of predefined visual templates.
 * Each template shows a color preview and name.
 */
export default function TemplateSelector({ templates, selected, onSelect }) {
  return (
    <div className="template-grid">
      {templates.map((t) => (
        <button
          key={t.id}
          className={`template-card ${selected === t.id ? 'selected' : ''}`}
          onClick={() => onSelect(t.id)}
        >
          <div
            className="template-preview"
            style={{
              background: t.css.background,
            }}
          >
            {/* Mini link card previews */}
            <div
              className="template-mini-card"
              style={{
                background: t.css.cardBackground,
                border: t.css.cardBorder,
                borderRadius: '4px',
              }}
            />
            <div
              className="template-mini-card"
              style={{
                background: t.css.cardBackground,
                border: t.css.cardBorder,
                borderRadius: '4px',
              }}
            />
            <div
              className="template-mini-card short"
              style={{
                background: t.css.cardBackground,
                border: t.css.cardBorder,
                borderRadius: '4px',
              }}
            />
          </div>
          <div className="template-info">
            <span className="template-name">{t.name}</span>
            <span className="template-desc">{t.description}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
