import { useState, useEffect } from 'react';
import PostComposer from './PostComposer';
import './App.css';

function App() {
  const [theme, setTheme] = useState('dark');
  const [publishedPosts, setPublishedPosts] = useState([
    {
      id: 1,
      platform: 'twitter',
      text: 'Exploring modern UI development with Vite & React 19. The instantaneous HMR and responsive state makes crafting components a delight! 🚀⚡ #Vite #React',
      timestamp: '10:42 AM',
    },
    {
      id: 2,
      platform: 'linkedin',
      text: 'Building robust validation directly into composers prevents accidental limit overflows before submission. Our team integrated real-time constraint feedback for Twitter (280) and LinkedIn (3000) with live mock previews.',
      timestamp: '09:15 AM',
    },
  ]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleNewPost = (newPost) => {
    setPublishedPosts((prev) => [newPost, ...prev]);
  };

  const handleDeletePost = (id) => {
    setPublishedPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
          <h2 className="brand-title">Social Studio</h2>
        </div>

        <div className="header-actions">
          <button 
            type="button"
            id="theme-toggle-btn"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle visual theme"
          >
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </header>

      {/* Main Content Hero */}
      <main>
        <section className="hero-intro">
          <div className="hero-badge">
            <span>⚡ Vite 6 + React 19 Engine</span>
          </div>
          <h1 className="main-heading">Multi-Platform Post Composer</h1>
          <p className="hero-subtitle">
            Write seamlessly with real-time character limit enforcement for Twitter (280) and LinkedIn (3000), complete with live social previews.
          </p>
        </section>

        {/* The Core Requested PostComposer Component */}
        <PostComposer onPost={handleNewPost} />

        {/* Live Published Stream */}
        <section className="live-stream-section" aria-label="Published Posts Feed">
          <div className="live-stream-header">
            <h2 className="live-stream-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Recently Published Posts ({publishedPosts.length})
            </h2>
            {publishedPosts.length > 0 && (
              <button 
                type="button"
                id="clear-feed-btn"
                className="clear-button"
                onClick={() => setPublishedPosts([])}
              >
                Clear History
              </button>
            )}
          </div>

          {publishedPosts.length === 0 ? (
            <div className="empty-feed-card">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <p>No published posts yet. Write something in the composer above and click "Post"!</p>
            </div>
          ) : (
            <div className="feed-items-grid">
              {publishedPosts.map((post) => (
                <article key={post.id} className="feed-card">
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <span className={`platform-pill-badge ${post.platform}`}>
                        {post.platform === 'twitter' ? 'Twitter / X' : 'LinkedIn'}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{post.timestamp}</span>
                    </div>
                    <p style={{ fontSize: '0.92rem', lineHeight: 1.5, color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
                      {post.text}
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      className="tool-icon-btn"
                      onClick={() => handleDeletePost(post.id)}
                      title="Delete post"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <span>PostComposer Studio • Vite + React</span>
        <span>Twitter limit: 280 chars • LinkedIn limit: 3000 chars</span>
      </footer>
    </div>
  );
}

export default App;
