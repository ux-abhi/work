import { useState } from 'react';
import './LinkManager.css';

/**
 * Manages the list of URLs the user wants to aggregate.
 * Supports adding, editing, reordering (drag), and removing links.
 */

// Common emoji icons users can pick for their links
const ICON_OPTIONS = ['🔗', '🌐', '📱', '💼', '🎵', '📸', '🎬', '📝', '🛒', '📧', '💬', '🐦'];

export default function LinkManager({ links, onChange }) {
  const [dragIndex, setDragIndex] = useState(null);

  function updateLink(index, field, value) {
    const updated = links.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    );
    onChange(updated);
  }

  function addLink() {
    onChange([...links, { url: '', title: '', icon: '' }]);
  }

  function removeLink(index) {
    if (links.length <= 1) return;
    onChange(links.filter((_, i) => i !== index));
  }

  function handleDragStart(index) {
    setDragIndex(index);
  }

  function handleDragOver(e, index) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const reordered = [...links];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, moved);
    onChange(reordered);
    setDragIndex(index);
  }

  function handleDragEnd() {
    setDragIndex(null);
  }

  return (
    <div className="link-manager">
      {links.map((link, index) => (
        <div
          key={index}
          className={`link-row ${dragIndex === index ? 'dragging' : ''}`}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
        >
          <div className="link-row-handle" title="Drag to reorder">⠿</div>

          {/* Icon picker */}
          <IconPicker
            value={link.icon}
            onChange={(icon) => updateLink(index, 'icon', icon)}
          />

          <div className="link-row-inputs">
            <input
              className="link-url-input"
              type="url"
              placeholder="https://example.com"
              value={link.url}
              onChange={(e) => updateLink(index, 'url', e.target.value)}
            />
            <input
              className="link-title-input"
              type="text"
              placeholder="Link title (optional)"
              value={link.title}
              onChange={(e) => updateLink(index, 'title', e.target.value)}
              maxLength={60}
            />
          </div>

          <button
            className="link-row-remove"
            onClick={() => removeLink(index)}
            disabled={links.length <= 1}
            title="Remove link"
          >
            ×
          </button>
        </div>
      ))}

      <button className="add-link-btn" onClick={addLink}>
        + Add Link
      </button>
    </div>
  );
}

/** Small dropdown for picking a link icon */
function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="icon-picker">
      <button
        className="icon-picker-btn"
        onClick={() => setOpen(!open)}
        type="button"
      >
        {value || '🔗'}
      </button>
      {open && (
        <div className="icon-picker-dropdown">
          {ICON_OPTIONS.map((icon) => (
            <button
              key={icon}
              className={`icon-option ${value === icon ? 'selected' : ''}`}
              onClick={() => {
                onChange(icon);
                setOpen(false);
              }}
              type="button"
            >
              {icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
