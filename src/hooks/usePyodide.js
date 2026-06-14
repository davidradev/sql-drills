import { useState, useRef } from 'react';

const RUNNER = `
import json as _json, sys as _sys, io as _io, traceback as _tb

def _run(setup, user, test):
    ns = {}
    buf = _io.StringIO()
    old = _sys.stdout
    _sys.stdout = buf
    result = {'passed': False, 'output': '', 'error': None}
    try:
        exec(compile(setup, '<setup>', 'exec'), ns)
        exec(compile(user, '<user>', 'exec'), ns)
        exec(compile(test, '<test>', 'exec'), ns)
        result['passed'] = True
    except AssertionError as e:
        result['error'] = str(e) if str(e) else 'Assertion failed — check your logic'
    except SyntaxError as e:
        result['error'] = f"SyntaxError on line {e.lineno}: {e.msg}"
    except Exception as e:
        result['error'] = f"{type(e).__name__}: {e}"
    finally:
        _sys.stdout = old
        result['output'] = buf.getvalue()
    return _json.dumps(result)
`;

export function usePyodide() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'ready' | 'error'
  const pyRef = useRef(null);

  async function load() {
    if (status !== 'idle') return;
    setStatus('loading');
    try {
      if (!window.loadPyodide) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      const py = await window.loadPyodide();
      await py.loadPackage(['pandas']);
      py.runPython(RUNNER);
      pyRef.current = py;
      setStatus('ready');
    } catch (e) {
      console.error('Pyodide load error:', e);
      setStatus('error');
    }
  }

  function runExercise(setupCode, userCode, testCode) {
    const py = pyRef.current;
    if (!py) return { passed: false, error: 'Python engine not ready', output: '' };
    try {
      py.globals.set('_s', setupCode || '');
      py.globals.set('_u', userCode || '');
      py.globals.set('_t', testCode || '');
      const raw = py.runPython('_run(_s, _u, _t)');
      return JSON.parse(raw);
    } catch (e) {
      return { passed: false, error: e.message, output: '' };
    }
  }

  return { status, load, runExercise };
}
