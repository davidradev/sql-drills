export default function TopNav({ mode, onSetMode, theme, onToggleTheme, onToggleSidebar, sidebarOpen, onOpenSchema, lang, onToggleLang }) {
  const inApp = mode === 'sql' || mode === 'python' || mode === 'pandas';

  return (
    <header
      className="sticky top-0 z-20 flex items-center h-12 px-4 gap-3 shrink-0"
      style={{ background: 'var(--ctp-mantle)', borderBottom: '1px solid var(--ctp-surface1)' }}
    >
      {/* Sidebar toggle */}
      {inApp && (
        <button
          onClick={onToggleSidebar}
          className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer transition-colors"
          style={{
            background: sidebarOpen ? 'var(--ctp-surface0)' : 'color-mix(in srgb, var(--ctp-blue) 15%, transparent)',
            color: sidebarOpen ? 'var(--ctp-subtext1)' : 'var(--ctp-blue)',
            border: `1px solid ${sidebarOpen ? 'var(--ctp-surface1)' : 'color-mix(in srgb, var(--ctp-blue) 35%, transparent)'}`,
          }}
          onMouseEnter={e => {
            if (sidebarOpen) {
              e.currentTarget.style.background = 'var(--ctp-surface1)';
            } else {
              e.currentTarget.style.background = 'color-mix(in srgb, var(--ctp-blue) 25%, transparent)';
            }
          }}
          onMouseLeave={e => {
            if (sidebarOpen) {
              e.currentTarget.style.background = 'var(--ctp-surface0)';
            } else {
              e.currentTarget.style.background = 'color-mix(in srgb, var(--ctp-blue) 15%, transparent)';
            }
          }}
          title={sidebarOpen ? "Hide topics" : "Show topics"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
          </svg>
        </button>
      )}

      {/* Brand */}
      <button
        onClick={() => onSetMode('home')}
        className="text-sm font-bold cursor-pointer shrink-0 transition-colors"
        style={{ color: 'var(--ctp-text)', background: 'none', border: 'none', padding: 0 }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--ctp-subtext0)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--ctp-text)'}
      >
        DE Drills
      </button>

      {/* Desktop mode tabs — centered */}
      {inApp && (
        <div className="hidden lg:flex flex-1 justify-center">
          <div
            className="flex items-center gap-1 p-1 rounded-lg"
            style={{ background: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface1)' }}
          >
            {[
              { id: 'sql',    label: 'SQL Drills',    color: 'var(--ctp-blue)'  },
              { id: 'pandas', label: 'Pandas Drills', color: 'var(--ctp-yellow)' },
              { id: 'python', label: 'Python Drills', color: 'var(--ctp-green)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => onSetMode(tab.id)}
                className="px-4 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer"
                style={{
                  background: mode === tab.id ? 'var(--ctp-surface2)' : 'transparent',
                  color: mode === tab.id ? tab.color : 'var(--ctp-subtext0)',
                  border: 'none',
                }}
                onMouseEnter={e => { if (mode !== tab.id) e.currentTarget.style.color = 'var(--ctp-text)'; }}
                onMouseLeave={e => { if (mode !== tab.id) e.currentTarget.style.color = 'var(--ctp-subtext0)'; }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        {/* Schema button — mobile, SQL only */}
        {mode === 'sql' && onOpenSchema && (
          <button
            onClick={onOpenSchema}
            className="lg:hidden flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
            style={{ background: 'var(--ctp-surface0)', color: 'var(--ctp-subtext1)', border: '1px solid var(--ctp-surface1)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--ctp-surface1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface0)'}
          >
            Schema
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
          </button>
        )}

        {/* Mobile mode switcher */}
        {inApp && (
          <div
            className="lg:hidden flex items-center gap-0.5 p-0.5 rounded-lg"
            style={{ background: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface1)' }}
          >
            {[
              { id: 'sql',    label: 'SQL', color: 'var(--ctp-blue)'  },
              { id: 'pandas', label: 'Pd',  color: 'var(--ctp-yellow)' },
              { id: 'python', label: 'Py',  color: 'var(--ctp-green)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => onSetMode(tab.id)}
                className="px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer"
                style={{
                  background: mode === tab.id ? 'var(--ctp-surface1)' : 'transparent',
                  color: mode === tab.id ? tab.color : 'var(--ctp-overlay0)',
                  border: 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Language toggle (Pandas & SQL) */}
        {((mode === 'pandas' || mode === 'sql')) && onToggleLang && (
          <button
            onClick={onToggleLang}
            className="text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
            style={{
              background: lang === 'es' ? `color-mix(in srgb, var(--ctp-${mode === 'sql' ? 'blue' : 'yellow'}) 15%, transparent)` : 'var(--ctp-surface0)',
              color: lang === 'es' ? `var(--ctp-${mode === 'sql' ? 'blue' : 'yellow'})` : 'var(--ctp-subtext1)',
              border: `1px solid ${lang === 'es' ? `color-mix(in srgb, var(--ctp-${mode === 'sql' ? 'blue' : 'yellow'}) 45%, transparent)` : 'var(--ctp-surface1)'}`,
            }}
            onMouseEnter={e => {
              if (lang !== 'es') e.currentTarget.style.background = 'var(--ctp-surface1)';
            }}
            onMouseLeave={e => {
              if (lang !== 'es') e.currentTarget.style.background = 'var(--ctp-surface0)';
            }}
            title={lang === 'es' ? "Switch to English" : "Cambiar a Español"}
          >
            {lang === 'es' ? 'ES' : 'EN'}
          </button>
        )}

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
          style={{ background: 'var(--ctp-surface0)', color: 'var(--ctp-subtext1)', border: '1px solid var(--ctp-surface1)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--ctp-surface1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface0)'}
        >
          {theme === 'mocha' ? 'Latte' : 'Mocha'}
        </button>
      </div>
    </header>
  );
}
