import { TOPICS } from '../data/exercises';

const SQL_SECTIONS = [
  { label: 'Query Basics',  ids: ['select-basics', 'where', 'order-by'] },
  { label: 'Aggregations',  ids: ['aggregations', 'group-by', 'having'] },
  { label: 'Advanced SQL',  ids: ['joins', 'ctes', 'case-when', 'window-functions'] },
  { label: 'Applied',       ids: ['real-world', 'hospitality', 'glovo'] },
];

export default function Sidebar({ activeTopic, onSelectTopic, progress, onClose, onGoHome }) {
  const topicsById = Object.fromEntries(TOPICS.map(t => [t.id, t]));

  return (
    <aside
      className="w-64 h-full flex flex-col overflow-y-auto"
      style={{ background: 'var(--ctp-mantle)', borderRight: '1px solid var(--ctp-surface1)' }}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between gap-2 shrink-0" style={{ borderBottom: '1px solid var(--ctp-surface1)' }}>
        <div className="min-w-0">
          <button
            onClick={onGoHome}
            className="text-base font-bold m-0 truncate cursor-pointer text-left w-full"
            style={{ color: 'var(--ctp-text)', background: 'none', border: 'none', padding: 0 }}
            title="Back to home"
          >
            SQL Drills
          </button>
          <p className="text-xs mt-0.5 m-0" style={{ color: 'var(--ctp-overlay0)' }}>Data Engineer Track</p>
        </div>
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

      {/* Nav */}
      <nav className="py-2 flex-1">
        {SQL_SECTIONS.map((section, si) => {
          const prevCount = SQL_SECTIONS.slice(0, si).reduce((a, s) => a + s.ids.length, 0);
          return (
            <div key={section.label}>
              <p
                className="px-5 pt-4 pb-1 text-[10px] uppercase tracking-widest font-semibold m-0"
                style={{ color: 'var(--ctp-overlay0)' }}
              >
                {section.label}
              </p>
              {section.ids.map((id, i) => {
                const topic = topicsById[id];
                if (!topic) return null;
                const num = prevCount + i + 1;
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
                      <span className="text-sm font-medium">{num}. {topic.title}</span>
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
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
