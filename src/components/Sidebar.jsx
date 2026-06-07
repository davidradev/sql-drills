import { TOPICS } from '../data/exercises';

export default function Sidebar({ activeTopic, onSelectTopic, progress, theme, onToggleTheme }) {
  return (
    <aside
      className="w-64 shrink-0 h-screen sticky top-0 overflow-y-auto flex flex-col"
      style={{ background: 'var(--ctp-mantle)', borderRight: '1px solid var(--ctp-surface1)' }}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between gap-2" style={{ borderBottom: '1px solid var(--ctp-surface1)' }}>
        <div className="min-w-0">
          <h1 className="text-base font-bold m-0 truncate" style={{ color: 'var(--ctp-text)' }}>SQL Drills</h1>
          <p className="text-xs mt-0.5 m-0" style={{ color: 'var(--ctp-overlay0)' }}>Data Engineer Track</p>
        </div>
        <button
          onClick={onToggleTheme}
          className="text-xs px-2.5 py-1.5 rounded-lg font-medium shrink-0 transition-colors cursor-pointer"
          style={{ background: 'var(--ctp-surface0)', color: 'var(--ctp-subtext1)', border: '1px solid var(--ctp-surface1)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--ctp-surface1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface0)'}
        >
          {theme === 'mocha' ? 'Latte' : 'Mocha'}
        </button>
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
              onClick={() => onSelectTopic(topic.id)}
              className="w-full text-left px-5 py-3 transition-colors cursor-pointer border-r-2"
              style={{
                background: isActive ? `color-mix(in srgb, var(--ctp-blue) 12%, transparent)` : 'transparent',
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
