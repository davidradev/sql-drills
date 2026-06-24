import { useState, useEffect } from 'react';
import { usePyodide } from '../hooks/usePyodide';
import { PANDAS_TOPICS } from '../data/pandasExercises';
import PythonExercisePanel from './PythonExercisePanel';
import TopNav from './TopNav';

const PD_SECTIONS = [
  { label: 'Core Operations',        ids: ['pd-create', 'pd-select', 'pd-transform'] },
  { label: 'Aggregation & Analysis', ids: ['pd-groupby', 'pd-sort'] },
  { label: 'Data Cleaning',          ids: ['pd-missing', 'pd-strings'] },
  { label: 'Combining Data',         ids: ['pd-merge'] },
];

function PandasSidebar({ activeTopic, onSelectTopic, onClose, progress }) {
  const topicsById = Object.fromEntries(PANDAS_TOPICS.map(t => [t.id, t]));

  let globalNum = 0;

  return (
    <aside
      className="w-64 h-full flex flex-col overflow-y-auto"
      style={{ background: 'var(--ctp-mantle)', borderRight: '1px solid var(--ctp-surface1)' }}
    >
      <div
        className="px-5 py-4 flex items-center justify-between gap-2 shrink-0"
        style={{ borderBottom: '1px solid var(--ctp-surface1)' }}
      >
        <div className="min-w-0">
          <h1 className="text-base font-bold m-0 truncate" style={{ color: 'var(--ctp-text)' }}>Pandas Drills</h1>
          <p className="text-xs mt-0.5 m-0" style={{ color: 'var(--ctp-overlay0)' }}>Zero to Hero</p>
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

      <nav className="py-2 flex-1">
        {PD_SECTIONS.map(section => (
          <div key={section.label}>
            <p
              className="px-5 pt-4 pb-1 text-[10px] uppercase tracking-widest font-semibold m-0"
              style={{ color: 'var(--ctp-overlay0)' }}
            >
              {section.label}
            </p>
            {section.ids.map(id => {
              const topic = topicsById[id];
              if (!topic) return null;
              globalNum++;
              const num = globalNum;
              const isActive = activeTopic === id;
              const reached = progress[id] ?? 0;
              return (
                <button
                  key={id}
                  onClick={() => { onSelectTopic(id); onClose?.(); }}
                  className="w-full text-left px-5 py-3 transition-colors cursor-pointer border-r-2"
                  style={{
                    background: isActive ? 'color-mix(in srgb, var(--ctp-yellow) 12%, transparent)' : 'transparent',
                    borderRightColor: isActive ? 'var(--ctp-yellow)' : 'transparent',
                    color: isActive ? 'var(--ctp-text)' : 'var(--ctp-subtext0)',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--ctp-surface0)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{num}. {topic.title}</span>
                    <span className="text-xs tabular-nums" style={{ color: 'var(--ctp-overlay0)' }}>
                      {reached}/{topic.exercises.length}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5 leading-tight m-0" style={{ color: 'var(--ctp-overlay0)' }}>
                    {topic.description.slice(0, 55)}…
                  </p>
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default function PandasApp({ theme, onToggleTheme, onSetMode }) {
  const { status, load, runExercise } = usePyodide();
  const [activeTopicId, setActiveTopicId] = useState(PANDAS_TOPICS[0].id);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pandas-drills-progress')) ?? {}; }
    catch { return {}; }
  });

  useEffect(() => { load(); }, []);

  const topic = PANDAS_TOPICS.find(t => t.id === activeTopicId);
  const exercise = topic.exercises[exerciseIndex];

  useEffect(() => {
    setProgress(p => {
      const reached = exerciseIndex + 1;
      if ((p[activeTopicId] ?? 0) >= reached) return p;
      const updated = { ...p, [activeTopicId]: reached };
      localStorage.setItem('pandas-drills-progress', JSON.stringify(updated));
      return updated;
    });
  }, [activeTopicId, exerciseIndex]);

  function handleSelectTopic(id) { setActiveTopicId(id); setExerciseIndex(0); }
  function handleNext() { if (exerciseIndex + 1 < topic.exercises.length) setExerciseIndex(exerciseIndex + 1); }
  function handlePrev() { if (exerciseIndex > 0) setExerciseIndex(exerciseIndex - 1); }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--ctp-base)' }}>
      <TopNav
        mode="pandas"
        onSetMode={onSetMode}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onOpenNav={() => setNavOpen(true)}
      />

      {navOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setNavOpen(false)}
        />
      )}

      <div className="flex flex-1 min-h-0">
        <div className={`fixed inset-y-0 left-0 z-40 transition-transform duration-200 lg:relative lg:inset-auto lg:z-auto lg:shrink-0 lg:translate-x-0 ${navOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <PandasSidebar
            activeTopic={activeTopicId}
            onSelectTopic={handleSelectTopic}
            onClose={() => setNavOpen(false)}
            progress={progress}
          />
        </div>

        <main className="flex-1 overflow-y-auto lg:overflow-hidden">
          <PythonExercisePanel
            key={`${activeTopicId}-${exerciseIndex}`}
            exercise={exercise}
            runExercise={status === 'ready' ? runExercise : () => ({ passed: false, error: 'Python engine still loading…', output: '' })}
            onNext={handleNext}
            onPrev={handlePrev}
            current={exerciseIndex + 1}
            total={topic.exercises.length}
            lesson={topic.lesson}
            topicTitle={topic.title}
            topicDescription={topic.description}
            pyodideStatus={status}
          />
        </main>
      </div>
    </div>
  );
}
