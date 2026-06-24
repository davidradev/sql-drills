import { useState, useEffect } from 'react';
import { usePyodide } from '../hooks/usePyodide';
import { PYTHON_TOPICS } from '../data/pythonExercises';
import PythonExercisePanel from './PythonExercisePanel';
import TopNav from './TopNav';

const PY_SECTIONS = [
  { label: 'Foundations',     ids: ['py-core', 'py-oop'] },
  { label: 'Data Tools',      ids: ['py-json', 'py-pandas'] },
  { label: 'ETL & Pipelines', ids: ['py-etl', 'py-quality', 'py-airflow'] },
  { label: 'Interview Prep',  ids: ['py-rm', 'py-glovo'] },
];

function PythonSidebar({ activeTopic, onSelectTopic, onClose }) {
  const topicsById = Object.fromEntries(PYTHON_TOPICS.map(t => [t.id, t]));

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
          <h1 className="text-base font-bold m-0 truncate" style={{ color: 'var(--ctp-text)' }}>Python Drills</h1>
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

      <nav className="py-2 flex-1">
        {PY_SECTIONS.map((section, si) => {
          const prevCount = PY_SECTIONS.slice(0, si).reduce((a, s) => a + s.ids.length, 0);
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
                const isActive = activeTopic === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => { onSelectTopic(topic.id); onClose?.(); }}
                    className="w-full text-left px-5 py-3 transition-colors cursor-pointer border-r-2"
                    style={{
                      background: isActive ? 'color-mix(in srgb, var(--ctp-green) 12%, transparent)' : 'transparent',
                      borderRightColor: isActive ? 'var(--ctp-green)' : 'transparent',
                      color: isActive ? 'var(--ctp-text)' : 'var(--ctp-subtext0)',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--ctp-surface0)'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{num}. {topic.title}</span>
                      <span className="text-xs tabular-nums" style={{ color: 'var(--ctp-overlay0)' }}>
                        {topic.exercises.length} ex
                      </span>
                    </div>
                    <p className="text-xs mt-0.5 leading-tight m-0" style={{ color: 'var(--ctp-overlay0)' }}>
                      {topic.description}
                    </p>
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

export default function PythonApp({ theme, onToggleTheme, onSetMode }) {
  const { status, load, runExercise } = usePyodide();
  const [activeTopicId, setActiveTopicId] = useState(PYTHON_TOPICS[0].id);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => { load(); }, []);

  const topic = PYTHON_TOPICS.find(t => t.id === activeTopicId);
  const exercise = topic.exercises[exerciseIndex];

  function handleSelectTopic(id) {
    setActiveTopicId(id);
    setExerciseIndex(0);
  }

  function handleNext() {
    if (exerciseIndex + 1 < topic.exercises.length) setExerciseIndex(exerciseIndex + 1);
  }

  function handlePrev() {
    if (exerciseIndex > 0) setExerciseIndex(exerciseIndex - 1);
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--ctp-base)' }}>

      <TopNav
        mode="python"
        onSetMode={onSetMode}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onOpenNav={() => setNavOpen(true)}
      />

      {/* Backdrop */}
      {navOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setNavOpen(false)}
        />
      )}

      <div className="flex flex-1 min-h-0">

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 transition-transform duration-200 lg:relative lg:inset-auto lg:z-auto lg:shrink-0 lg:translate-x-0 ${navOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <PythonSidebar
            activeTopic={activeTopicId}
            onSelectTopic={handleSelectTopic}
            onClose={() => setNavOpen(false)}
          />
        </div>

        {/* Main — overflow-hidden on desktop so each panel scrolls independently */}
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
