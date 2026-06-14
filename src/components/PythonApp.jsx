import { useState, useEffect } from 'react';
import { usePyodide } from '../hooks/usePyodide';
import { PYTHON_TOPICS } from '../data/pythonExercises';
import PythonExercisePanel from './PythonExercisePanel';
import PyLessonPanel from './PyLessonPanel';

function PythonSidebar({ activeTopic, onSelectTopic, theme, onToggleTheme, onClose }) {
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

      <nav className="py-2 flex-1">
        {PYTHON_TOPICS.map((topic, i) => {
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
                <span className="text-sm font-medium">{i + 1}. {topic.title}</span>
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
      </nav>
    </aside>
  );
}

export default function PythonApp({ theme, onToggleTheme, onGoHome }) {
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

      {/* Mobile top bar */}
      <header
        className="lg:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3 shrink-0"
        style={{ background: 'var(--ctp-mantle)', borderBottom: '1px solid var(--ctp-surface1)' }}
      >
        <button
          onClick={() => setNavOpen(true)}
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
          style={{ background: 'var(--ctp-surface0)', color: 'var(--ctp-subtext1)', border: '1px solid var(--ctp-surface1)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
          Topics
        </button>
        <span className="text-sm font-bold" style={{ color: 'var(--ctp-text)' }}>Python Drills</span>
        <button
          onClick={onGoHome}
          className="text-sm px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
          style={{ background: 'var(--ctp-surface0)', color: 'var(--ctp-subtext1)', border: '1px solid var(--ctp-surface1)' }}
        >
          ← Home
        </button>
      </header>

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
            theme={theme}
            onToggleTheme={onToggleTheme}
            onClose={() => setNavOpen(false)}
          />
        </div>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-3xl mx-auto">

            {/* Desktop back button + header */}
            <div className="hidden lg:flex items-center gap-4 mb-2">
              <button
                onClick={onGoHome}
                className="text-sm px-3 py-1.5 rounded-lg cursor-pointer transition-colors shrink-0"
                style={{ background: 'var(--ctp-surface0)', color: 'var(--ctp-subtext1)', border: '1px solid var(--ctp-surface1)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--ctp-surface1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface0)'}
              >
                ← Home
              </button>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold m-0" style={{ color: 'var(--ctp-text)' }}>
                  {topic.title}
                </h2>
                <p className="text-sm mt-1 mb-0" style={{ color: 'var(--ctp-subtext0)' }}>{topic.description}</p>
              </div>
            </div>

            {/* Mobile header */}
            <div className="lg:hidden mb-2">
              <h2 className="text-xl font-bold m-0" style={{ color: 'var(--ctp-text)' }}>{topic.title}</h2>
              <p className="text-sm mt-1 mb-0" style={{ color: 'var(--ctp-subtext0)' }}>{topic.description}</p>
            </div>

            {/* Pyodide loading state */}
            {status === 'loading' && (
              <div
                className="rounded-xl px-5 py-4 mb-6 flex items-center gap-3 text-sm"
                style={{
                  background: 'color-mix(in srgb, var(--ctp-blue) 10%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--ctp-blue) 30%, transparent)',
                  color: 'var(--ctp-blue)',
                }}
              >
                <div
                  className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin shrink-0"
                  style={{ borderColor: 'var(--ctp-blue)', borderTopColor: 'transparent' }}
                />
                Loading Python engine + pandas (~30MB, cached after first load)…
              </div>
            )}

            {status === 'error' && (
              <div
                className="rounded-xl px-5 py-4 mb-6 text-sm"
                style={{
                  background: 'color-mix(in srgb, var(--ctp-red) 10%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--ctp-red) 30%, transparent)',
                  color: 'var(--ctp-red)',
                }}
              >
                Failed to load Python engine. Check your internet connection and reload the page.
              </div>
            )}

            <PyLessonPanel lesson={topic.lesson} />

            <PythonExercisePanel
              key={`${activeTopicId}-${exerciseIndex}`}
              exercise={exercise}
              runExercise={status === 'ready' ? runExercise : () => ({ passed: false, error: 'Python engine still loading…', output: '' })}
              onNext={handleNext}
              onPrev={handlePrev}
              current={exerciseIndex + 1}
              total={topic.exercises.length}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
