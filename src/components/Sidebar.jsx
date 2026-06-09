import { TOPICS } from '../data/exercises';

export default function Sidebar({ activeTopic, onSelectTopic, progress, theme, onToggleTheme, onClose }) {
  return (
    <aside
      className="w-64 h-full flex flex-col overflow-y-auto"
      style={{ background: 'var(--ctp-mantle)', borderRight: '1px solid var(--ctp-surface1)' }}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between gap-2 shrink-0" style={{ borderBottom: '1px solid var(--ctp-surface1)' }}>
        <div className="min-w-0">
          <h1 className="text-base font-bold m-0 truncate" style={{ color: 'var(--ctp-text)' }}>SQL Drills</h1>
          <p className="text-xs mt-0.5 m-0" style={{ color: 'var(--ctp-overlay0)' }}>Data Engineer Track</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleTheme}
            className="text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
            style={{ background: 'var(--ctp-surface0)', color: 'var(--ctp-subtext1)', border: '1px solid var(--ctp-surface1)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--ctp-surface1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface0)'}
          >
            {theme === 'mocha' ? 'Latte' : 'Mocha'}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg text-sm cursor-pointer transition-colors"
              style={{ background: 'var(--ctp-surface0)', color: 'var(--ctp-subtext1)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--ctp-surface1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface0)'}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="py-2 flex-1">
        {TOPICS.map((topic, i) => {
          const done = progress[topic.id] || 0;
          const total = topic.exercises.length;
          const isActive = activeTopic === topic.id;

          return (
            <button
              key={topic.id}
              onClick={() => { onSelectTopic(topic.id); onClose?.(); }}
              className="w-full text-left px-5 py-3 transition-colors cursor-pointer border-r-2"
              style={{
                background: isActive ? 'color-mix(in srgb, var(--ctp-blue) 12%, transparent)' : 'transparent',
                borderRightColor: isActive ? 'var(--ctp-blue)' : 'transparent',
                color: isActive ? 'var(--ctp-text)' : 'var(--ctp-subtext0)',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--ctp-surface0)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{i + 1}. {topic.title}</span>
                <span
                  className="text-xs tabular-nums"
                  style={{ color: done === total ? 'var(--ctp-green)' : 'var(--ctp-overlay0)' }}
                >
                  {done}/{total}
                </span>
              </div>
              <p className="text-xs mt-0.5 leading-tight m-0" style={{ color: 'var(--ctp-overlay0)' }}>
                {topic.description}
              </p>
              {done > 0 && (
                <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'var(--ctp-surface1)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(done / total) * 100}%`, background: 'var(--ctp-green)' }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
