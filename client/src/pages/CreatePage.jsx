import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LinkManager from '../components/LinkManager';
import TemplateSelector from '../components/TemplateSelector';
import Preview from '../components/Preview';
import { getTemplates, createSmartLink } from '../api';
import './CreatePage.css';

/**
 * Main page where users configure their smart link:
 * 1. Add a title and description
 * 2. Add multiple URLs
 * 3. Pick a visual template
 * 4. Preview and generate
 */
export default function CreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [links, setLinks] = useState([{ url: '', title: '', icon: '' }]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('minimal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getTemplates().then(setTemplates).catch(() => {});
  }, []);

  const canSubmit =
    links.some((l) => l.url.trim()) && !loading;

  async function handleCreate() {
    // Filter out empty links and validate URLs
    const validLinks = links
      .filter((l) => l.url.trim())
      .map((l) => ({
        ...l,
        url: l.url.startsWith('http') ? l.url : `https://${l.url}`,
      }));

    if (validLinks.length === 0) {
      setError('Add at least one link');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await createSmartLink({
        title: title.trim() || 'My Links',
        description: description.trim(),
        template: selectedTemplate,
        links: validLinks,
      });
      navigate(`/result/${result.slug}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const currentTemplate = templates.find((t) => t.id === selectedTemplate);

  return (
    <div className="create-page">
      <header className="create-header">
        <div className="logo">
          <span className="logo-icon">◆</span>
          SmartLink
        </div>
        <p className="tagline">One link for everything</p>
      </header>

      <div className="create-layout">
        <div className="create-form">
          {/* Title & Description */}
          <section className="form-section">
            <label className="form-label">Title</label>
            <input
              className="form-input"
              type="text"
              placeholder="My Links"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={60}
            />
            <label className="form-label" style={{ marginTop: 12 }}>
              Description <span className="optional">optional</span>
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="A short description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={120}
            />
          </section>

          {/* Link Manager */}
          <section className="form-section">
            <label className="form-label">Links</label>
            <LinkManager links={links} onChange={setLinks} />
          </section>

          {/* Template Selector */}
          <section className="form-section">
            <label className="form-label">Template</label>
            <TemplateSelector
              templates={templates}
              selected={selectedTemplate}
              onSelect={setSelectedTemplate}
            />
          </section>

          {/* Error + Submit */}
          {error && <p className="form-error">{error}</p>}
          <button
            className="create-btn"
            disabled={!canSubmit}
            onClick={handleCreate}
          >
            {loading ? 'Creating...' : 'Generate Smart Link'}
          </button>
        </div>

        {/* Live Preview */}
        <div className="create-preview">
          <div className="preview-label">Preview</div>
          <Preview
            title={title || 'My Links'}
            description={description}
            links={links.filter((l) => l.url.trim())}
            template={currentTemplate}
          />
        </div>
      </div>
    </div>
  );
}
