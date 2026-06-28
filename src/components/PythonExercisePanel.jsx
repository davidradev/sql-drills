import { useState } from 'react';
import _CodeEditor from 'react-simple-code-editor';
const CodeEditor = _CodeEditor.default ?? _CodeEditor;
import Prism from '../lib/prismPython';
import PyLessonPanel from './PyLessonPanel';

const UI_TEXT = {
  en: {
    engineLoading: "Loading Python engine (~30MB, cached after first load)…",
    engineError: "Failed to load Python engine. Check your connection and reload.",
    exerciseOf: "Exercise",
    of: "of",
    hint: "Hint",
    hideHint: "Hide Hint",
    prev: "← Prev",
    next: "Next →",
    editorInfo: "Editor · Ctrl+Enter to run",
    reset: "↺ Reset",
    run: "▶ Run",
    solution: "Solution",
    hideSolution: "Hide Solution",
    output: "Output",
    printHint: "add print() calls to see results here",
    noOutput: "(no output)",
    testsPassed: "All tests passed!",
    testFailed: "Test failed"
  },
  es: {
    engineLoading: "Cargando el motor de Python (~30MB, guardado en caché tras la primera carga)…",
    engineError: "Error al cargar el motor de Python. Revisa tu conexión y recarga la página.",
    exerciseOf: "Ejercicio",
    of: "de",
    hint: "Pista",
    hideHint: "Ocultar Pista",
    prev: "← Anterior",
    next: "Siguiente →",
    editorInfo: "Editor · Ctrl+Enter para ejecutar",
    reset: "↺ Reiniciar",
    run: "▶ Ejecutar",
    solution: "Solución",
    hideSolution: "Ocultar Solución",
    output: "Consola",
    printHint: "añade llamadas a print() para ver los resultados aquí",
    noOutput: "(sin salida)",
    testsPassed: "¡Todas las pruebas pasaron!",
    testFailed: "Prueba fallida"
  }
};

function parseInline(text) {
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0, match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push({ type: 'text', content: text.slice(last, match.index) });
    const raw = match[0];
    if (raw.startsWith('**')) parts.push({ type: 'bold', content: raw.slice(2, -2) });
    else parts.push({ type: 'code', content: raw.slice(1, -1) });
    last = match.index + raw.length;
  }
  if (last < text.length) parts.push({ type: 'text', content: text.slice(last) });
  return parts;
}

function renderInline(text) {
  return parseInline(text).map((part, i) => {
    if (part.type === 'bold') return <strong key={i} style={{ color: 'var(--ctp-text)', fontWeight: 600 }}>{part.content}</strong>;
    if (part.type === 'code') return (
      <code key={i} className="font-mono text-xs px-1 py-0.5 rounded"
        style={{ background: 'var(--ctp-surface1)', color: 'var(--ctp-blue)' }}>
        {part.content}
      </code>
    );
    return <span key={i}>{part.content}</span>;
  });
}

function renderPrompt(prompt) {
  const lines = prompt.split('\n');
  const out = [];
  let listBuf = [];

  const flushList = () => {
    if (!listBuf.length) return;
    out.push(
      <ul key={out.length} className="my-2 space-y-1.5 list-none p-0 m-0">
        {listBuf.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed"
            style={{ paddingLeft: item.indent * 14, color: 'var(--ctp-subtext1)' }}>
            <span className="shrink-0 mt-0.5" style={{ color: 'var(--ctp-overlay1)' }}>–</span>
            <span>{renderInline(item.text)}</span>
          </li>
        ))}
      </ul>
    );
    listBuf = [];
  };

  lines.forEach((line) => {
    if (/^  +- /.test(line)) {
      listBuf.push({ indent: 1, text: line.replace(/^  +- /, '') });
    } else if (/^- /.test(line)) {
      listBuf.push({ indent: 0, text: line.slice(2) });
    } else if (line.trim() === '') {
      flushList();
    } else {
      flushList();
      out.push(
        <p key={out.length} className="text-sm leading-relaxed m-0 mb-2"
          style={{ color: 'var(--ctp-subtext1)' }}>
          {renderInline(line)}
        </p>
      );
    }
  });
  flushList();
  return out;
}

function buildInitialCode(exercise) {
  const hasSetup = exercise.setupCode &&
                   exercise.setupCode.trim() &&
                   exercise.setupCode.trim() !== '# No setup needed';
  if (!hasSetup) return exercise.starterCode || '';
  return `# ── Input data ──────────────────────────────────────────\n${exercise.setupCode}\n\n# ── Your solution ───────────────────────────────────────\n${exercise.starterCode || ''}`;
}

export default function PythonExercisePanel({
  exercise, runExercise, onNext, onPrev, current, total,
  lesson, topicTitle, topicDescription, pyodideStatus, lang = 'en'
}) {
  const initial = buildInitialCode(exercise);
  const [code, setCode]                 = useState(initial);
  const [output, setOutput]             = useState(null);
  const [status, setStatus]             = useState(null);
  const [showHint, setShowHint]         = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const t = UI_TEXT[lang] || UI_TEXT.en;

  function handleRun() {
    if (!code.trim()) return;
    const result = runExercise('', code, exercise.testCode || '');
    setStatus(result.passed ? 'correct' : 'error');
    setOutput({ text: result.output || '', error: result.error || null });
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleRun(); }
  }

  function reset() {
    setCode(initial);
    setOutput(null);
    setStatus(null);
    setShowHint(false);
    setShowSolution(false);
  }

  function goNext() { reset(); onNext(); }
  function goPrev() { reset(); onPrev(); }

  return (
    <div className="flex flex-col lg:flex-row lg:h-full lg:min-h-0 lg:overflow-hidden">

      {/* ── LEFT PANEL — info ──────────────────────────────── */}
      <div
        className="lg:w-[42%] lg:shrink-0 lg:overflow-y-auto p-4 lg:p-6 flex flex-col gap-5"
      >
        {/* Topic header */}
        {topicTitle && (
          <div className="shrink-0">
            <h2 className="text-xl lg:text-2xl font-bold m-0" style={{ color: 'var(--ctp-text)' }}>
              {topicTitle}
            </h2>
            {topicDescription && (
              <p className="text-sm mt-1 m-0" style={{ color: 'var(--ctp-subtext0)' }}>
                {topicDescription}
              </p>
            )}
          </div>
        )}

        {/* Pyodide status */}
        {pyodideStatus === 'loading' && (
          <div className="rounded-xl px-4 py-3 flex items-center gap-3 text-sm shrink-0" style={{
            background: 'color-mix(in srgb, var(--ctp-blue) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--ctp-blue) 30%, transparent)',
            color: 'var(--ctp-blue)',
          }}>
            <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin shrink-0"
              style={{ borderColor: 'var(--ctp-blue)', borderTopColor: 'transparent' }} />
            {t.engineLoading}
          </div>
        )}
        {pyodideStatus === 'error' && (
          <div className="rounded-xl px-4 py-3 text-sm shrink-0" style={{
            background: 'color-mix(in srgb, var(--ctp-red) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--ctp-red) 30%, transparent)',
            color: 'var(--ctp-red)',
          }}>
            {t.engineError}
          </div>
        )}

        {/* Lesson — show only the concept relevant to this exercise */}
        {lesson && (
          <div className="shrink-0">
            <PyLessonPanel
              lesson={lesson}
              conceptIndex={exercise.concept ?? null}
              initialOpen={exercise.concept == null}
              lang={lang}
            />
          </div>
        )}

        {/* Progress */}
        <div className="flex items-center justify-between text-sm shrink-0">
          <span style={{ color: 'var(--ctp-subtext0)' }}>{t.exerciseOf} {current} {t.of} {total}</span>
          <div className="flex gap-1">
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full transition-colors" style={{
                background: i < current - 1 ? 'var(--ctp-green)' : i === current - 1 ? 'var(--ctp-blue)' : 'var(--ctp-surface1)',
              }} />
            ))}
          </div>
        </div>

        {/* Prompt */}
        <div className="rounded-xl px-5 py-4 shrink-0" style={{ background: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface1)' }}>
          {renderPrompt(exercise.prompt)}
        </div>

        {/* Hint */}
        <div className="shrink-0">
          <button
            onClick={() => setShowHint(h => !h)}
            className="px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer"
            style={{
              background: showHint ? 'color-mix(in srgb, var(--ctp-yellow) 15%, transparent)' : 'var(--ctp-surface0)',
              color: showHint ? 'var(--ctp-yellow)' : 'var(--ctp-subtext1)',
              border: `1px solid ${showHint ? 'color-mix(in srgb, var(--ctp-yellow) 40%, transparent)' : 'var(--ctp-surface1)'}`,
            }}
            onMouseEnter={e => { if (!showHint) e.currentTarget.style.background = 'var(--ctp-surface1)'; }}
            onMouseLeave={e => { if (!showHint) e.currentTarget.style.background = 'var(--ctp-surface0)'; }}
          >
            {showHint ? t.hideHint : t.hint}
          </button>
          {showHint && (
            <div className="mt-2 rounded-lg px-4 py-3 text-sm" style={{
              background: 'color-mix(in srgb, var(--ctp-yellow) 12%, transparent)',
              border: '1px solid color-mix(in srgb, var(--ctp-yellow) 40%, transparent)',
              color: 'var(--ctp-yellow)',
            }}>
              {exercise.hint}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-2 shrink-0">
          <button onClick={goPrev} disabled={current <= 1}
            className="flex-1 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-30"
            style={{ background: 'var(--ctp-surface0)', color: 'var(--ctp-subtext1)', border: '1px solid var(--ctp-surface1)' }}
            onMouseEnter={e => { if (current > 1) e.currentTarget.style.background = 'var(--ctp-surface1)'; }}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface0)'}
          >{t.prev}</button>
          <button onClick={goNext} disabled={current >= total}
            className="flex-1 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-30"
            style={{ background: 'var(--ctp-surface0)', color: 'var(--ctp-subtext1)', border: '1px solid var(--ctp-surface1)' }}
            onMouseEnter={e => { if (current < total) e.currentTarget.style.background = 'var(--ctp-surface1)'; }}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface0)'}
          >{t.next}</button>
        </div>
      </div>

      {/* ── DIVIDER ────────────────────────────────────────── */}
      <div
        className="shrink-0 h-px w-full lg:h-auto lg:w-px lg:self-stretch"
        style={{ background: 'var(--ctp-surface1)' }}
      />

      {/* ── RIGHT PANEL — code ─────────────────────────────── */}
      <div className="flex-1 lg:overflow-y-auto p-4 lg:p-6 flex flex-col gap-4">

        {/* Editor */}
        <div className="rounded-xl overflow-hidden shrink-0" style={{ border: '1px solid var(--ctp-surface1)' }}>
          <div className="flex items-center justify-between px-3 py-1.5" style={{ background: 'var(--ctp-surface1)' }}>
            <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--ctp-overlay0)' }}>
              {t.editorInfo}
            </span>
            <button
              onClick={reset}
              className="text-[10px] px-2 py-0.5 rounded cursor-pointer transition-colors"
              style={{ background: 'transparent', color: 'var(--ctp-overlay0)', border: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--ctp-subtext1)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--ctp-overlay0)'}
              title="Reset to starter code"
            >
              {t.reset}
            </button>
          </div>
          <div className="py-editor-wrapper">
            <CodeEditor
              value={code}
              onValueChange={setCode}
              highlight={c => Prism.highlight(c, Prism.languages.python, 'python')}
              onKeyDown={handleKeyDown}
              padding={16}
              placeholder="Write your Python code here..."
              style={{
                fontFamily: 'ui-monospace, Consolas, "Cascadia Code", monospace',
                fontSize: 13.5,
                lineHeight: 1.6,
                minHeight: 160,
                background: 'var(--ctp-base)',
                color: 'var(--ctp-text)',
                caretColor: 'var(--ctp-blue)',
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleRun}
            disabled={!code.trim()}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'var(--ctp-green)', color: 'var(--ctp-crust)' }}
          >
            {t.run}
          </button>
          <button
            onClick={() => setShowSolution(s => !s)}
            className="px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
            style={{ background: 'var(--ctp-surface0)', color: 'var(--ctp-subtext1)', border: '1px solid var(--ctp-surface1)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--ctp-surface1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface0)'}
          >
            {showSolution ? t.hideSolution : t.solution}
          </button>
        </div>

        {/* Output */}
        {output !== null && (
          <div className="rounded-xl overflow-hidden shrink-0" style={{ border: '1px solid var(--ctp-surface1)' }}>
            <div className="flex items-center justify-between px-3 py-1.5" style={{ background: 'var(--ctp-surface1)' }}>
              <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--ctp-overlay0)' }}>{t.output}</span>
              {!output.text && (
                <span className="text-[10px] italic" style={{ color: 'var(--ctp-overlay0)' }}>
                  {t.printHint}
                </span>
              )}
            </div>
            {output.text ? (
              <pre className="px-4 py-3 m-0 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto"
                style={{ background: 'var(--ctp-crust)', color: 'var(--ctp-subtext1)' }}>
                {output.text}
              </pre>
            ) : (
              <div className="px-4 py-3 text-xs italic"
                style={{ background: 'var(--ctp-crust)', color: 'var(--ctp-overlay0)' }}>
                {t.noOutput}
              </div>
            )}
          </div>
        )}

        {/* Test result */}
        {status === 'correct' && (
          <div className="rounded-lg px-4 py-3 text-sm font-medium shrink-0" style={{
            background: 'color-mix(in srgb, var(--ctp-green) 12%, transparent)',
            border: '1px solid color-mix(in srgb, var(--ctp-green) 40%, transparent)',
            color: 'var(--ctp-green)',
          }}>
            {t.testsPassed}
          </div>
        )}
        {status === 'error' && output?.error && (
          <div className="rounded-lg px-4 py-3 text-sm shrink-0" style={{
            background: 'color-mix(in srgb, var(--ctp-red) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--ctp-red) 40%, transparent)',
          }}>
            <p className="font-semibold m-0 mb-1" style={{ color: 'var(--ctp-red)' }}>{t.testFailed}</p>
            <p className="m-0 font-mono text-xs whitespace-pre-wrap" style={{ color: 'var(--ctp-red)' }}>{output.error}</p>
          </div>
        )}

        {/* Solution */}
        {showSolution && (
          <div className="rounded-lg px-4 py-3 shrink-0" style={{ background: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface1)' }}>
            <p className="text-xs uppercase tracking-wide mb-2 m-0" style={{ color: 'var(--ctp-overlay0)' }}>{t.solution}</p>
            <pre
              className="text-sm font-mono whitespace-pre-wrap m-0"
              style={{ color: 'var(--ctp-green)' }}
              dangerouslySetInnerHTML={{
                __html: Prism.highlight(exercise.solution, Prism.languages.python, 'python'),
              }}
            />
          </div>
        )}

      </div>
    </div>
  );
}
