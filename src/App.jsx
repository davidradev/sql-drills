import { useState, useEffect } from 'react';
import { useDatabase } from './hooks/useDatabase';
import { TOPICS } from './data/exercises';
import Sidebar from './components/Sidebar';
import ExercisePanel from './components/ExercisePanel';
import SchemaReferencePage from './components/SchemaReferencePage';
import PythonApp from './components/PythonApp';
import PandasApp from './components/PandasApp';
import HomeScreen from './components/HomeScreen';
import TopNav from './components/TopNav';

function SQLApp({ theme, onToggleTheme, onSetMode }) {
  const { ready, error, runQuery } = useDatabase();
  const [activeTopicId, setActiveTopicId] = useState(TOPICS[0].id);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sql-drills-progress')) ?? {}; }
    catch { return {}; }
  });
  const [showSchemaRef, setShowSchemaRef] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const topic = TOPICS.find(t => t.id === activeTopicId);
  const exercise = topic.exercises[exerciseIndex];

  useEffect(() => {
    setProgress(p => {
      const reached = exerciseIndex + 1;
      if ((p[activeTopicId] || 0) >= reached) return p;
      const updated = { ...p, [activeTopicId]: reached };
      localStorage.setItem('sql-drills-progress', JSON.stringify(updated));
      return updated;
    });
  }, [activeTopicId, exerciseIndex]);

  function handleSelectTopic(id) { setActiveTopicId(id); setExerciseIndex(0); }
  function handleNext() { if (exerciseIndex + 1 < topic.exercises.length) setExerciseIndex(exerciseIndex + 1); }
  function handlePrev() { if (exerciseIndex > 0) setExerciseIndex(exerciseIndex - 1); }
  function handleToggleSidebar() {
    if (window.innerWidth < 1024) {
      setNavOpen(!navOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  }

  if (error) return (
    <div className="flex items-center justify-center h-screen" style={{ color: 'var(--ctp-red)' }}>
      Failed to load database: {error}
    </div>
  );

  if (!ready) return (
    <div className="flex items-center justify-center h-screen gap-3" style={{ color: 'var(--ctp-subtext0)' }}>
      <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--ctp-blue)', borderTopColor: 'transparent' }} />
      Loading SQL engine...
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen lg:h-screen lg:overflow-hidden" style={{ background: 'var(--ctp-base)' }}>

      <TopNav
        mode="sql"
        onSetMode={onSetMode}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onToggleSidebar={handleToggleSidebar}
        sidebarOpen={sidebarOpen}
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
          className={`fixed inset-y-0 left-0 z-40 transition-transform duration-200 lg:relative lg:inset-auto lg:z-auto lg:shrink-0 ${
            navOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } ${sidebarOpen ? '' : 'lg:hidden'}`}
        >
          <Sidebar
            activeTopic={activeTopicId}
            onSelectTopic={handleSelectTopic}
            progress={progress}
            onClose={() => setNavOpen(false)}
            onGoHome={() => onSetMode('home')}
          />
        </div>

        {/* Main — overflow-hidden on desktop so each panel scrolls independently */}
        <main className="flex-1 overflow-y-auto lg:overflow-hidden">
          <ExercisePanel
            key={`${activeTopicId}-${exerciseIndex}`}
            exercise={exercise}
            runQuery={runQuery}
            onNext={handleNext}
            onPrev={handlePrev}
            current={exerciseIndex + 1}
            total={topic.exercises.length}
            lesson={topic.lesson}
            topicTitle={topic.title}
            topicDescription={topic.description}
            tables={topic.tables}
            theme={theme}
            onOpenSchemaRef={() => setShowSchemaRef(true)}
          />
        </main>
      </div>

      {showSchemaRef && (
        <SchemaReferencePage theme={theme} onClose={() => setShowSchemaRef(false)} />
      )}

      <footer
        className="w-full flex flex-col items-center gap-2 py-5 text-xs"
        style={{ borderTop: '1px solid var(--ctp-surface1)', background: 'var(--ctp-mantle)', color: 'var(--ctp-overlay0)' }}
      >
        <span>Developed by <span style={{ color: 'var(--ctp-subtext1)', fontWeight: 600 }}>David Rosales</span></span>
        <span style={{ color: 'var(--ctp-surface2)' }}>React · Vite · SQL.js · Tailwind CSS · Prism.js</span>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <a href="https://www.davidra.dev" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors" style={{ color: 'var(--ctp-overlay1)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--ctp-text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--ctp-overlay1)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
            </svg>
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/davidradev" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors" style={{ color: 'var(--ctp-overlay1)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--ctp-text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--ctp-overlay1)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
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
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

export default function App() {
  const [mode, setMode] = useState('home'); // 'home' | 'sql' | 'python' | 'pandas'
  const [theme, setTheme] = useState('mocha');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  function toggleTheme() { setTheme(t => t === 'mocha' ? 'latte' : 'mocha'); }

  if (mode === 'python') {
    return <PythonApp theme={theme} onToggleTheme={toggleTheme} onSetMode={setMode} />;
  }

  if (mode === 'pandas') {
    return <PandasApp theme={theme} onToggleTheme={toggleTheme} onSetMode={setMode} />;
  }

  if (mode === 'sql') {
    return <SQLApp theme={theme} onToggleTheme={toggleTheme} onSetMode={setMode} />;
  }

  return <HomeScreen onSetMode={setMode} theme={theme} onToggleTheme={toggleTheme} />;
}
