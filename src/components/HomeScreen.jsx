export default function HomeScreen({ onSelectMode, theme, onToggleTheme }) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--ctp-base)' }}
    >
      {/* Top bar */}
      <header
        className="flex items-center justify-between px-6 py-4 shrink-0"
        style={{ borderBottom: '1px solid var(--ctp-surface1)', background: 'var(--ctp-mantle)' }}
      >
        <div>
          <span className="text-base font-bold" style={{ color: 'var(--ctp-text)' }}>Data Engineer Drills</span>
          <span className="ml-3 text-xs" style={{ color: 'var(--ctp-overlay0)' }}>Practice for your interview</span>
        </div>
        <button
          onClick={onToggleTheme}
          className="text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
          style={{ background: 'var(--ctp-surface0)', color: 'var(--ctp-subtext1)', border: '1px solid var(--ctp-surface1)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--ctp-surface1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface0)'}
        >
          {theme === 'mocha' ? 'Latte' : 'Mocha'}
        </button>
      </header>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <h1
          className="text-3xl lg:text-4xl font-bold text-center m-0 mb-3"
          style={{ color: 'var(--ctp-text)' }}
        >
          What do you want to practice?
        </h1>
        <p
          className="text-sm text-center mb-12 max-w-md"
          style={{ color: 'var(--ctp-subtext0)' }}
        >
          Two tracks, both focused on the skills that come up in Data Engineer interviews.
        </p>

        {/* Mode cards */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">

          {/* SQL card */}
          <button
            onClick={() => onSelectMode('sql')}
            className="flex-1 text-left rounded-2xl p-6 cursor-pointer transition-all group"
            style={{
              background: 'var(--ctp-surface0)',
              border: '1px solid var(--ctp-surface1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.border = '1px solid var(--ctp-blue)';
              e.currentTarget.style.background = 'color-mix(in srgb, var(--ctp-blue) 6%, var(--ctp-surface0))';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = '1px solid var(--ctp-surface1)';
              e.currentTarget.style.background = 'var(--ctp-surface0)';
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-lg font-bold"
              style={{ background: 'color-mix(in srgb, var(--ctp-blue) 20%, transparent)', color: 'var(--ctp-blue)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"/>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold m-0 mb-2" style={{ color: 'var(--ctp-text)' }}>SQL Drills</h2>
            <p className="text-sm leading-relaxed m-0 mb-4" style={{ color: 'var(--ctp-subtext0)' }}>
              Write queries against a real SQLite database running in your browser. Covers SELECT, JOINs, GROUP BY, window functions, CTEs, and more.
            </p>
            <div className="flex flex-wrap gap-2">
              {['SELECT', 'JOIN', 'GROUP BY', 'CTEs', 'Window Functions'].map(tag => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded font-mono"
                  style={{
                    background: 'color-mix(in srgb, var(--ctp-blue) 15%, transparent)',
                    color: 'var(--ctp-blue)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>

          {/* Python card */}
          <button
            onClick={() => onSelectMode('python')}
            className="flex-1 text-left rounded-2xl p-6 cursor-pointer transition-all"
            style={{
              background: 'var(--ctp-surface0)',
              border: '1px solid var(--ctp-surface1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.border = '1px solid var(--ctp-green)';
              e.currentTarget.style.background = 'color-mix(in srgb, var(--ctp-green) 6%, var(--ctp-surface0))';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = '1px solid var(--ctp-surface1)';
              e.currentTarget.style.background = 'var(--ctp-surface0)';
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-lg"
              style={{ background: 'color-mix(in srgb, var(--ctp-green) 20%, transparent)', color: 'var(--ctp-green)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold m-0 mb-2" style={{ color: 'var(--ctp-text)' }}>Python Drills</h2>
            <p className="text-sm leading-relaxed m-0 mb-4" style={{ color: 'var(--ctp-subtext0)' }}>
              Run Python code in your browser with pandas. Practice ETL patterns, JSON parsing, DataFrame transforms, and Airflow task design.
            </p>
            <div className="flex flex-wrap gap-2">
              {['pandas', 'ETL', 'JSON', 'Airflow', 'data quality'].map(tag => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded font-mono"
                  style={{
                    background: 'color-mix(in srgb, var(--ctp-green) 15%, transparent)',
                    color: 'var(--ctp-green)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-[10px] mt-3 m-0" style={{ color: 'var(--ctp-overlay0)' }}>
              Loads Python engine on first visit (~30MB, cached after)
            </p>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="w-full flex flex-col items-center gap-2 py-5 text-xs"
        style={{
          borderTop: '1px solid var(--ctp-surface1)',
          background: 'var(--ctp-mantle)',
          color: 'var(--ctp-overlay0)',
        }}
      >
        <span>Developed by <span style={{ color: 'var(--ctp-subtext1)', fontWeight: 600 }}>David Rosales</span></span>
        <span style={{ color: 'var(--ctp-surface2)' }}>React · Vite · SQL.js · Pyodide · Tailwind CSS</span>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <a href="https://www.davidra.dev" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors" style={{ color: 'var(--ctp-overlay1)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--ctp-text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--ctp-overlay1)'}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            davidra.dev
          </a>
          <a href="https://github.com/davidradev" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors" style={{ color: 'var(--ctp-overlay1)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--ctp-text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--ctp-overlay1)'}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
            </svg>
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/davidradev" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors" style={{ color: 'var(--ctp-overlay1)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--ctp-text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--ctp-overlay1)'}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
          <a
            href="mailto:contact@davidra.dev"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: 'color-mix(in srgb, var(--ctp-blue) 15%, transparent)',
              border: '1px solid color-mix(in srgb, var(--ctp-blue) 35%, transparent)',
              color: 'var(--ctp-blue)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--ctp-blue) 25%, transparent)'}
            onMouseLeave={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--ctp-blue) 15%, transparent)'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Contact me
          </a>
        </div>
      </footer>
    </div>
  );
}
