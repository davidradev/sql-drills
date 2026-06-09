import { useState } from 'react';
import _CodeEditor from 'react-simple-code-editor';
const CodeEditor = _CodeEditor.default ?? _CodeEditor;
import Prism from '../lib/prismSql';
import ResultTable from './ResultTable';
import { validateResult } from '../hooks/useValidator';

function parseError(msg) {
  if (!msg) return { detail: String(msg), raw: String(msg) };

  const nearMatch = msg.match(/near "([^"]+)": syntax error/i);
  if (nearMatch) return { detail: `Syntax error near "${nearMatch[1]}"`, raw: msg };

  const tableMatch = msg.match(/no such table: (\S+)/i);
  if (tableMatch) return { detail: `Table "${tableMatch[1]}" does not exist`, raw: msg };

  const colMatch = msg.match(/no such column: (\S+)/i);
  if (colMatch) return { detail: `Column "${colMatch[1]}" does not exist`, raw: msg };

  const ambigMatch = msg.match(/ambiguous column name: (\S+)/i);
  if (ambigMatch) return { detail: `Ambiguous column "${ambigMatch[1]}" — use table.column`, raw: msg };

  const funcMatch = msg.match(/no such function: (\S+)/i);
  if (funcMatch) return { detail: `Unknown function "${funcMatch[1]}"`, raw: msg };

  const aggMatch = msg.match(/misuse of aggregate function (\S+)/i);
  if (aggMatch) return { detail: `Aggregate ${aggMatch[1]} used outside of a GROUP BY context`, raw: msg };

  const windowMatch = msg.match(/misuse of window function (\S+)/i);
  if (windowMatch) return { detail: `Window function ${windowMatch[1]} requires an OVER clause`, raw: msg };

  return { detail: msg, raw: msg };
}

export default function ExercisePanel({ exercise, runQuery, onNext, onPrev, current, total }) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [expected, setExpected] = useState(null);
  const [status, setStatus] = useState(null); // 'correct' | 'wrong' | 'error'
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showExpected, setShowExpected] = useState(false);

  function handleRun() {
    if (!query.trim()) return;
    const userResult = runQuery(query);
    if (userResult.error) {
      setResult(userResult);
      setExpected(null);
      setStatus('error');
      return;
    }
    const expectedResult = runQuery(exercise.solution);
    const ordered = /\bORDER\s+BY\b/i.test(exercise.solution);
    const { correct } = validateResult(userResult, expectedResult, { ordered });
    setResult(userResult);
    setExpected(expectedResult);
    setShowExpected(false);
    setStatus(correct ? 'correct' : 'wrong');
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
  }

  function reset() {
    setQuery('');
    setResult(null);
    setExpected(null);
    setStatus(null);
    setShowHint(false);
    setShowSolution(false);
    setShowExpected(false);
  }

  function goNext() { reset(); onNext(); }
  function goPrev() { reset(); onPrev(); }

  const parsedError = status === 'error' ? parseError(result?.error) : null;
  const colsMatch = expected && result
    ? JSON.stringify(result.columns) === JSON.stringify(expected.columns)
    : true;

  return (
    <div className="flex flex-col gap-4">

      {/* Progress dots */}
      <div className="flex items-center justify-between text-sm">
        <span style={{ color: 'var(--ctp-subtext0)' }}>Exercise {current} of {total}</span>
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-colors"
              style={{
                background: i < current - 1
                  ? 'var(--ctp-green)'
                  : i === current - 1
                  ? 'var(--ctp-blue)'
                  : 'var(--ctp-surface1)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Prompt */}
      <div
        className="rounded-xl p-5"
        style={{ background: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface1)' }}
      >
        <p className="text-base leading-relaxed m-0" style={{ color: 'var(--ctp-text)' }}>
          {exercise.prompt}
        </p>
      </div>

      {/* Editor */}
      <div className="relative">
        <div
          className="sql-editor-wrapper rounded-xl overflow-hidden transition-shadow"
          style={{ border: '1px solid var(--ctp-surface1)' }}
        >
          <CodeEditor
            value={query}
            onValueChange={setQuery}
            highlight={code => Prism.highlight(code, Prism.languages.sql, 'sql')}
            onKeyDown={handleKeyDown}
            padding={16}
            placeholder="Write your SQL query here..."
            style={{
              fontFamily: 'ui-monospace, Consolas, "Cascadia Code", monospace',
              fontSize: 13.5,
              lineHeight: 1.6,
              minHeight: 120,
              background: 'var(--ctp-base)',
              color: 'var(--ctp-text)',
              caretColor: 'var(--ctp-blue)',
            }}
          />
        </div>
        <span
          className="absolute bottom-3 right-3 text-xs pointer-events-none"
          style={{ color: 'var(--ctp-overlay0)' }}
        >
          Ctrl+Enter to run
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex gap-2">
          <button
            onClick={handleRun}
            disabled={!query.trim()}
            className="flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'var(--ctp-blue)', color: 'var(--ctp-btn-text)' }}
          >
            Run Query
          </button>
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
            style={{ background: 'var(--ctp-surface0)', color: 'var(--ctp-subtext1)', border: '1px solid var(--ctp-surface1)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--ctp-surface1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface0)'}
          >
            {showHint ? 'Hide Hint' : 'Hint'}
          </button>
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
            style={{ background: 'var(--ctp-surface0)', color: 'var(--ctp-subtext1)', border: '1px solid var(--ctp-surface1)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--ctp-surface1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface0)'}
          >
            {showSolution ? 'Hide Solution' : 'Solution'}
          </button>
        </div>
        <div className="flex gap-2 sm:ml-auto">
          <button
            onClick={goPrev}
            disabled={current <= 1}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-30"
            style={{ background: 'var(--ctp-surface0)', color: 'var(--ctp-subtext1)', border: '1px solid var(--ctp-surface1)' }}
            onMouseEnter={e => { if (current > 1) e.currentTarget.style.background = 'var(--ctp-surface1)'; }}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface0)'}
          >
            ← Prev
          </button>
          <button
            onClick={goNext}
            disabled={current >= total}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-30"
            style={{ background: 'var(--ctp-surface0)', color: 'var(--ctp-subtext1)', border: '1px solid var(--ctp-surface1)' }}
            onMouseEnter={e => { if (current < total) e.currentTarget.style.background = 'var(--ctp-surface1)'; }}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface0)'}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Hint */}
      {showHint && (
        <div
          className="rounded-lg px-4 py-3 text-sm"
          style={{
            background: 'color-mix(in srgb, var(--ctp-yellow) 12%, transparent)',
            border: '1px solid color-mix(in srgb, var(--ctp-yellow) 40%, transparent)',
            color: 'var(--ctp-yellow)',
          }}
        >
          {exercise.hint}
        </div>
      )}

      {/* Solution */}
      {showSolution && (
        <div
          className="rounded-lg px-4 py-3"
          style={{ background: 'var(--ctp-surface0)', border: '1px solid var(--ctp-surface1)' }}
        >
          <p className="text-xs uppercase tracking-wide mb-2 m-0" style={{ color: 'var(--ctp-overlay0)' }}>Solution</p>
          <code className="text-sm font-mono whitespace-pre-wrap" style={{ color: 'var(--ctp-green)' }}>
            {exercise.solution}
          </code>
        </div>
      )}

      {/* Status: correct */}
      {status === 'correct' && (
        <div
          className="rounded-lg px-4 py-3 text-sm font-medium"
          style={{
            background: 'color-mix(in srgb, var(--ctp-green) 12%, transparent)',
            border: '1px solid color-mix(in srgb, var(--ctp-green) 40%, transparent)',
            color: 'var(--ctp-green)',
          }}
        >
          Correct!
        </div>
      )}

      {/* Status: SQL error */}
      {status === 'error' && parsedError && (
        <div
          className="rounded-lg px-4 py-3 text-sm"
          style={{
            background: 'color-mix(in srgb, var(--ctp-red) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--ctp-red) 40%, transparent)',
          }}
        >
          <p className="font-semibold m-0 mb-1" style={{ color: 'var(--ctp-red)' }}>SQL Error</p>
          <p className="m-0" style={{ color: 'var(--ctp-red)' }}>{parsedError.detail}</p>
          {parsedError.detail !== parsedError.raw && (
            <p
              className="m-0 mt-2 font-mono text-xs"
              style={{ color: 'color-mix(in srgb, var(--ctp-red) 65%, transparent)' }}
            >
              {parsedError.raw}
            </p>
          )}
        </div>
      )}

      {/* Status: wrong result */}
      {status === 'wrong' && (
        <div
          className="rounded-lg px-4 py-3 text-sm"
          style={{
            background: 'color-mix(in srgb, var(--ctp-peach) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--ctp-peach) 40%, transparent)',
          }}
        >
          <p className="font-semibold m-0 mb-1" style={{ color: 'var(--ctp-peach)' }}>Wrong result</p>
          <p className="m-0" style={{ color: 'var(--ctp-peach)' }}>
            Your query returned {result.rows.length} row{result.rows.length !== 1 ? 's' : ''}, expected {expected?.rows.length}.
          </p>
          {!colsMatch && (
            <p className="m-0 mt-1 font-mono text-xs" style={{ color: 'var(--ctp-peach)' }}>
              Expected columns: {expected?.columns.join(', ')}
            </p>
          )}
          {expected && (
            <button
              onClick={() => setShowExpected(s => !s)}
              className="mt-2 text-xs px-3 py-1 rounded cursor-pointer transition-colors"
              style={{
                background: 'color-mix(in srgb, var(--ctp-peach) 20%, transparent)',
                border: '1px solid color-mix(in srgb, var(--ctp-peach) 40%, transparent)',
                color: 'var(--ctp-peach)',
              }}
            >
              {showExpected ? 'Hide expected output' : 'Show expected output'}
            </button>
          )}
        </div>
      )}

      {/* Expected output (revealed on demand) */}
      {status === 'wrong' && showExpected && expected && (
        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--ctp-overlay0)' }}>
            Expected ({expected.rows.length} row{expected.rows.length !== 1 ? 's' : ''})
          </p>
          <ResultTable columns={expected.columns} rows={expected.rows} />
        </div>
      )}

      {/* Result table — user output */}
      {result && !result.error && (
        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--ctp-overlay0)' }}>
            Your output ({result.rows.length} row{result.rows.length !== 1 ? 's' : ''} returned)
          </p>
          <ResultTable columns={result.columns} rows={result.rows} />
        </div>
      )}
    </div>
  );
}
