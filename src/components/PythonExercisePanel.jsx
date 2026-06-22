import { useState } from 'react';
import _CodeEditor from 'react-simple-code-editor';
const CodeEditor = _CodeEditor.default ?? _CodeEditor;
import Prism from '../lib/prismPython';

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

export default function PythonExercisePanel({ exercise, runExercise, onNext, onPrev, current, total }) {
  const [code, setCode]                 = useState(exercise.starterCode || '');
  const [output, setOutput]             = useState(null);
  const [status, setStatus]             = useState(null);
  const [showHint, setShowHint]         = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showSetup, setShowSetup]       = useState(true);

  const hasSetup = exercise.setupCode && exercise.setupCode.trim() && exercise.setupCode.trim() !== '# No setup needed';

  function handleRun() {
    if (!code.trim()) return;
    const result = runExercise(exercise.setupCode || '', code, exercise.testCode || '');
    setStatus(result.passed ? 'correct' : 'error');
    setOutput({ text: result.output || '', error: result.error || null });
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleRun(); }
  }

  function reset() {
    setCode(exercise.starterCode || '');
    setOutput(null);
    setStatus(null);
    setShowHint(false);
    setShowSolution(false);
  }

  function goNext() { reset(); onNext(); }
  function goPrev() { reset(); onPrev(); }

  return (
    <div className="flex flex-col gap-4">

      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span style={{ color: 'var(--ctp-subtext0)' }}>Exercise {current} of {total}</span>
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full transition-colors" style={{
              background: i < current - 1 ? 'var(--ctp-green)' : i === current - 1 ? 'var(--ctp-blue)' : 'var(--ctp-surface1)',
            }} />
          ))}
        </div>
      </div>

      {/* Prompt */}
      <div className="rounded-xl px-5 py-4" style={{ background: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface1)' }}>
        {renderPrompt(exercise.prompt)}
      </div>

      {/* Setup / Input data */}
      {hasSetup && (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--ctp-surface1)' }}>
          <button
            onClick={() => setShowSetup(s => !s)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold uppercase tracking-wide cursor-pointer transition-colors"
            style={{
              background: 'var(--ctp-surface1)',
              color: 'var(--ctp-overlay1)',
              border: 'none',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--ctp-surface2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface1)'}
          >
            <span>Input data</span>
            <span style={{ transform: showSetup ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block', transition: 'transform 0.15s' }}>▾</span>
          </button>
          {showSetup && (
            <div className="overflow-x-auto" style={{ background: 'var(--ctp-crust)' }}>
              <pre
                className="p-4 m-0 text-xs font-mono leading-relaxed"
                style={{ color: 'var(--ctp-text)' }}
                dangerouslySetInnerHTML={{
                  __html: Prism.highlight(exercise.setupCode, Prism.languages.python, 'python'),
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Editor */}
      <div className="relative">
        <div className="py-editor-wrapper rounded-xl overflow-hidden transition-shadow" style={{ border: '1px solid var(--ctp-surface1)' }}>
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
        <span className="absolute bottom-3 right-3 text-xs pointer-events-none" style={{ color: 'var(--ctp-overlay0)' }}>
          Ctrl+Enter to run
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex gap-2">
          <button
            onClick={handleRun}
            disabled={!code.trim()}
            className="flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'var(--ctp-green)', color: 'var(--ctp-crust)' }}
          >
            ▶ Run
          </button>
          <button
            onClick={() => setShowHint(h => !h)}
            className="px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
            style={{ background: 'var(--ctp-surface0)', color: 'var(--ctp-subtext1)', border: '1px solid var(--ctp-surface1)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--ctp-surface1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface0)'}
          >
            {showHint ? 'Hide Hint' : 'Hint'}
          </button>
          <button
            onClick={() => setShowSolution(s => !s)}
            className="px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
            style={{ background: 'var(--ctp-surface0)', color: 'var(--ctp-subtext1)', border: '1px solid var(--ctp-surface1)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--ctp-surface1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface0)'}
          >
            {showSolution ? 'Hide Solution' : 'Solution'}
          </button>
        </div>
        <div className="flex gap-2 sm:ml-auto">
          <button onClick={goPrev} disabled={current <= 1}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-30"
            style={{ background: 'var(--ctp-surface0)', color: 'var(--ctp-subtext1)', border: '1px solid var(--ctp-surface1)' }}
            onMouseEnter={e => { if (current > 1) e.currentTarget.style.background = 'var(--ctp-surface1)'; }}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface0)'}
          >← Prev</button>
          <button onClick={goNext} disabled={current >= total}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-30"
            style={{ background: 'var(--ctp-surface0)', color: 'var(--ctp-subtext1)', border: '1px solid var(--ctp-surface1)' }}
            onMouseEnter={e => { if (current < total) e.currentTarget.style.background = 'var(--ctp-surface1)'; }}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface0)'}
          >Next →</button>
        </div>
      </div>

      {/* Hint */}
      {showHint && (
        <div className="rounded-lg px-4 py-3 text-sm" style={{
          background: 'color-mix(in srgb, var(--ctp-yellow) 12%, transparent)',
          border: '1px solid color-mix(in srgb, var(--ctp-yellow) 40%, transparent)',
          color: 'var(--ctp-yellow)',
        }}>
          {exercise.hint}
        </div>
      )}

      {/* Solution */}
      {showSolution && (
        <div className="rounded-lg px-4 py-3" style={{ background: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface1)' }}>
          <p className="text-xs uppercase tracking-wide mb-2 m-0" style={{ color: 'var(--ctp-overlay0)' }}>Solution</p>
          <pre
            className="text-sm font-mono whitespace-pre-wrap m-0"
            style={{ color: 'var(--ctp-green)' }}
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(exercise.solution, Prism.languages.python, 'python'),
            }}
          />
        </div>
      )}

      {/* Correct */}
      {status === 'correct' && (
        <div className="rounded-lg px-4 py-3 text-sm font-medium" style={{
          background: 'color-mix(in srgb, var(--ctp-green) 12%, transparent)',
          border: '1px solid color-mix(in srgb, var(--ctp-green) 40%, transparent)',
          color: 'var(--ctp-green)',
        }}>
          All tests passed!
        </div>
      )}

      {/* Error / Wrong */}
      {status === 'error' && output?.error && (
        <div className="rounded-lg px-4 py-3 text-sm" style={{
          background: 'color-mix(in srgb, var(--ctp-red) 10%, transparent)',
          border: '1px solid color-mix(in srgb, var(--ctp-red) 40%, transparent)',
        }}>
          <p className="font-semibold m-0 mb-1" style={{ color: 'var(--ctp-red)' }}>Test failed</p>
          <p className="m-0 font-mono text-xs whitespace-pre-wrap" style={{ color: 'var(--ctp-red)' }}>{output.error}</p>
        </div>
      )}

      {/* Output */}
      {output?.text && (
        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--ctp-overlay0)' }}>Output</p>
          <div className="rounded-lg px-4 py-3 font-mono text-xs whitespace-pre-wrap overflow-x-auto"
            style={{ background: 'var(--ctp-crust)', color: 'var(--ctp-subtext1)', border: '1px solid var(--ctp-surface1)' }}>
            {output.text}
          </div>
        </div>
      )}
    </div>
  );
}
