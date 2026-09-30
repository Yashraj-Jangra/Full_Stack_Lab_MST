import { useState } from 'react';
import './PostComposer.css';

export default function PostComposer({ onPost } = {}) {
  const [text, setText] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const limits = { twitter: 280, linkedin: 3000 };
  const limit = limits[platform];
  const isError = text.length > limit;

  // Visual calculations
  const remaining = limit - text.length;
  const progressPercent = Math.min((text.length / limit) * 100, 100);
  const strokeDashoffset = 100 - progressPercent;

  const handlePost = (e) => {
    e?.preventDefault();
    if (isError || text.length === 0) return;

    const newPost = {
      id: Date.now(),
      platform,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (onPost) {
      onPost(newPost);
    }

    setToastMessage(`Successfully published to ${platform === 'twitter' ? 'Twitter / X' : 'LinkedIn'}! 🚀`);
    setText('');

    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const applyTemplate = (sampleText) => {
    setText(sampleText);
  };

  return (
    <div className="composer-root">
      <div className="composer-grid">
        {/* Left Side: Main Composer Card */}
        <section 
          className={`composer-card platform-${platform} ${isError ? 'has-error' : ''}`}
          aria-label="Social Post Composer"
        >
          {/* Header with Title and Platform Selectors */}
          <div className="composer-header">
            <div className="composer-title-group">
              <span className={`platform-pill-badge ${platform}`}>
                {platform === 'twitter' ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Twitter / X
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.59 1.59 0 1 0 0-3.18 1.59 1.59 0 0 0 0 3.18m1.4 9.74v-8.37H5.06v8.37h2.8z"/>
                    </svg>
                    LinkedIn
                  </>
                )}
              </span>
            </div>

            <div className="platform-controls">
              {/* Pill Tabs for Quick Switching */}
              <div className="platform-tab-group" role="tablist" aria-label="Target Platform">
                <button
                  type="button"
                  id="tab-twitter"
                  role="tab"
                  aria-selected={platform === 'twitter'}
                  className={`platform-tab ${platform === 'twitter' ? 'active twitter' : ''}`}
                  onClick={() => setPlatform('twitter')}
                >
                  Twitter
                </button>
                <button
                  type="button"
                  id="tab-linkedin"
                  role="tab"
                  aria-selected={platform === 'linkedin'}
                  className={`platform-tab ${platform === 'linkedin' ? 'active linkedin' : ''}`}
                  onClick={() => setPlatform('linkedin')}
                >
                  LinkedIn
                </button>
              </div>

              {/* Exact Required Select Element */}
              <div className="custom-select-wrapper">
                <select 
                  id="platform-select"
                  className="platform-select-styled"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  aria-label="Select Target Platform"
                >
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
                <span className="select-arrow" aria-hidden="true">▾</span>
              </div>
            </div>
          </div>

          {/* Quick Preset Prompts */}
          <div className="quick-prompts-bar">
            <span className="quick-prompt-label">Quick Prompts:</span>
            <button 
              type="button"
              id="prompt-product-launch"
              className="chip-btn"
              onClick={() => applyTemplate("Excited to unveil our new PostComposer built with Vite & React! Lightweight, lightning fast, and real-time character limit enforcement. 🚀✨ #Vite #React #WebDev")}
            >
              🚀 Launch Post
            </button>
            <button 
              type="button"
              id="prompt-linkedin-thought"
              className="chip-btn"
              onClick={() => applyTemplate("Key engineering principle: Never let validation be an afterthought.\n\nBy providing immediate feedback and platform-specific constraints right inside the composer, user confidence increases significantly.\n\nWhat are your favorite UI patterns for form validation? 👇")}
            >
              💡 Insight
            </button>
            <button 
              type="button"
              id="prompt-overflow-test"
              className="chip-btn"
              onClick={() => applyTemplate("This is an intentionally long post designed to test and trigger the character limit constraint error boundary. We want to ensure that whenever text exceeds the specified platform limit (e.g. 280 characters for Twitter), the error state activates cleanly, highlights the counter in red, displays the error message, and prevents submission until trimmed!")}
            >
              ⚠️ Test Limit
            </button>
          </div>

          {/* Textarea Field with Custom Wrapper */}
          <div className="textarea-wrapper">
            <textarea 
              id="post-textarea"
              className="composer-textarea"
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              placeholder="Write a post..."
              rows={6}
            />

            {/* In-Editor Toolbar */}
            <div className="composer-toolbar">
              <div className="toolbar-left">
                <button 
                  type="button"
                  id="insert-hashtag"
                  className="tool-icon-btn"
                  onClick={() => setText((prev) => prev ? `${prev} #trending` : '#trending')}
                  title="Add hashtag"
                >
                  # Tag
                </button>
                <button 
                  type="button"
                  id="insert-rocket"
                  className="tool-icon-btn"
                  onClick={() => setText((prev) => `${prev} 🚀`)}
                  title="Add rocket"
                >
                  🚀
                </button>
                <button 
                  type="button"
                  id="insert-sparkle"
                  className="tool-icon-btn"
                  onClick={() => setText((prev) => `${prev} ✨`)}
                  title="Add sparkles"
                >
                  ✨
                </button>
              </div>

              <div className="toolbar-right">
                <button 
                  type="button"
                  id="copy-text-btn"
                  className="tool-icon-btn"
                  onClick={handleCopy}
                  disabled={!text}
                  title="Copy text to clipboard"
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
                <button 
                  type="button"
                  id="clear-text-btn"
                  className="tool-icon-btn"
                  onClick={() => setText('')}
                  disabled={!text}
                  title="Clear text"
                >
                  ✕ Clear
                </button>
              </div>
            </div>
          </div>

          {/* Status, Circular Progress & Required Counter Element */}
          <div className="composer-status-bar">
            <div className="counter-container">
              {/* Circular Gauge Ring */}
              <div className="progress-ring-wrapper" aria-hidden="true">
                <svg className="progress-ring" width="36" height="36" viewBox="0 0 36 36">
                  <path
                    className="progress-ring-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="3.5"
                  />
                  <path
                    className={`progress-ring-circle ${isError ? 'danger' : progressPercent > 85 ? 'warning' : ''}`}
                    strokeDasharray="100, 100"
                    strokeDashoffset={strokeDashoffset}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="counter-details">
                {/* Required p character counter with exact style logic */}
                <p 
                  id="char-counter"
                  className="char-counter-text"
                  style={{ color: isError ? 'red' : 'black' }}
                >
                  <span>{text.length}</span>
                  <span style={{ opacity: 0.6 }}>/</span>
                  <span>{limit}</span>
                </p>
                <span className="char-remaining-text">
                  {isError 
                    ? `${Math.abs(remaining)} characters over limit` 
                    : `${remaining} characters remaining`}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons-group">
              <button 
                type="button"
                id="reset-btn"
                className="clear-button"
                onClick={() => setText('')}
                disabled={text.length === 0}
              >
                Reset
              </button>

              {/* Required button with disabled logic */}
              <button 
                type="button"
                id="post-button"
                className={`post-button-styled ${platform}-theme`}
                disabled={isError || text.length === 0}
                onClick={handlePost}
              >
                Post
              </button>
            </div>
          </div>

          {/* Exact Required Error Element */}
          {isError && (
            <div id="limit-error-banner" className="error-banner" role="alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <b>Error: Limit Exceeded!</b>
            </div>
          )}
        </section>

        {/* Right Side: Live Realistic Platform Preview Card */}
        <aside className="preview-container" aria-label="Live Post Preview">
          <div className="preview-header-bar">
            <span className="preview-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              Live Feed Preview
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {platform === 'twitter' ? 'Twitter / X format' : 'LinkedIn feed format'}
            </span>
          </div>

          <div className="preview-card-wrap">
            {platform === 'twitter' ? (
              /* Twitter/X Realistic Mock */
              <div className="mock-tweet" id="twitter-preview-card">
                <div className="mock-avatar">YR</div>
                <div className="mock-content">
                  <div className="mock-author-row">
                    <span className="mock-name">Yashraj</span>
                    <span className="mock-badge" title="Verified">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="m8.6 22.5-1.9-3.2-3.6-.8.4-3.7L1 12l2.5-2.8-.4-3.7 3.6-.8 1.9-3.2L12 3.2l3.4-1.7 1.9 3.2 3.6.8-.4 3.7L23 12l-2.5 2.8.4 3.7-3.6.8-1.9 3.2L12 20.8l-3.4 1.7zm2.4-6.4 5.7-5.7-1.4-1.4-4.3 4.3-2.1-2.1-1.4 1.4 3.5 3.5z"/>
                      </svg>
                    </span>
                    <span className="mock-handle">@yashraj</span>
                    <span className="mock-handle">· Just now</span>
                  </div>

                  <div className={`mock-text ${!text ? 'empty' : ''}`}>
                    {text || "Your post will preview here in real-time as you write..."}
                  </div>

                  <div className="mock-tweet-actions">
                    <span className="mock-action-item">💬 12</span>
                    <span className="mock-action-item">🔁 28</span>
                    <span className="mock-action-item">❤️ 95</span>
                    <span className="mock-action-item">📊 1.4K</span>
                    <span className="mock-action-item">🔖</span>
                  </div>
                </div>
              </div>
            ) : (
              /* LinkedIn Realistic Mock */
              <div className="mock-linkedin" id="linkedin-preview-card">
                <div className="mock-linkedin-header">
                  <div className="mock-avatar" style={{ background: 'linear-gradient(135deg, #0a66c2, #38bdf8)' }}>
                    YR
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className="mock-name">Yashraj</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• 1st</span>
                    </div>
                    <div className="mock-linkedin-headline">Full-Stack Engineer & Designer</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Just now • 🌐</div>
                  </div>
                </div>

                <div className={`mock-text ${!text ? 'empty' : ''}`} style={{ fontSize: '0.92rem' }}>
                  {text || "Your professional LinkedIn update will appear here in real-time..."}
                </div>

                <div className="mock-linkedin-actions">
                  <button type="button" className="mock-linkedin-action-btn">👍 Like</button>
                  <button type="button" className="mock-linkedin-action-btn">💬 Comment</button>
                  <button type="button" className="mock-linkedin-action-btn">🔁 Repost</button>
                  <button type="button" className="mock-linkedin-action-btn">✈️ Send</button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Floating Success Toast */}
      {toastMessage && (
        <div id="post-success-toast" className="toast-notification" role="status">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
