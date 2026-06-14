import { useState } from 'react';
import Prism from '../lib/prismPython';

export default function PyLessonPanel({ lesson }) {
  const [open, setOpen] = useState(false);
  if (!lesson) return null;

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        style={{
          background: open
            ? 'color-mix(in srgb, var(--ctp-green) 15%, transparent)'
            : 'var(--ctp-surface0)',
          color: open ? 'var(--ctp-green)' : 'var(--ctp-subtext1)',
          border: `1px solid ${open ? 'color-mix(in srgb, var(--ctp-green) 40%, transparent)' : 'var(--ctp-surface1)'}`,
        }}
      >
        <span
          className="text-xs transition-transform inline-block"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          &#9658;
        </span>
        Lesson
      </button>

      {open && (
        <div
          className="mt-3 rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--ctp-surface1)' }}
        >
          <div
            className="px-5 py-4 text-sm leading-relaxed"
            style={{
              background: 'var(--ctp-surface0)',
              borderBottom: '1px solid var(--ctp-surface1)',
              color: 'var(--ctp-subtext1)',
            }}
          >
            {lesson.intro}
          </div>

          <div style={{ background: 'var(--ctp-mantle)' }}>
            {lesson.concepts.map((concept, i) => (
              <div
                key={i}
                className="px-5 py-4"
                style={{ borderTop: i > 0 ? '1px solid var(--ctp-surface1)' : undefined }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wide m-0 mb-2"
                  style={{ color: 'var(--ctp-green)' }}
                >
                  {concept.title}
                </p>
                <p
                  className="text-sm leading-relaxed m-0 mb-3"
                  style={{ color: 'var(--ctp-subtext1)' }}
                >
                  {concept.body}
                </p>
                <div className="rounded-lg overflow-x-auto" style={{ background: 'var(--ctp-base)' }}>
                  <pre
                    className="p-4 m-0 text-sm font-mono leading-relaxed"
                    style={{ color: 'var(--ctp-text)' }}
                    dangerouslySetInnerHTML={{
                      __html: Prism.highlight(concept.code, Prism.languages.python, 'python'),
                    }}
                  />
                </div>
                {concept.note && (
                  <p
                    className="text-xs leading-relaxed m-0 mt-2 px-3 py-2 rounded-lg"
                    style={{
                      background: 'color-mix(in srgb, var(--ctp-yellow) 10%, transparent)',
                      border: '1px solid color-mix(in srgb, var(--ctp-yellow) 30%, transparent)',
                      color: 'var(--ctp-yellow)',
                    }}
                  >
                    {concept.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
