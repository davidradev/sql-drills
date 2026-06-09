import Prism from '../lib/prismSql';

export default function LessonPanel({ lesson }) {
  if (!lesson) return null;

  return (
    <div className="space-y-3 min-w-0">
      <h3
        className="text-xs uppercase tracking-widest font-semibold m-0"
        style={{ color: 'var(--ctp-overlay1)' }}
      >
        Lesson
      </h3>

      {/* Intro */}
      <p className="text-xs leading-relaxed m-0" style={{ color: 'var(--ctp-subtext0)' }}>
        {lesson.intro}
      </p>

      {/* Concept cards */}
      {lesson.concepts.map((concept, i) => (
        <div
          key={i}
          className="rounded-lg overflow-hidden"
          style={{ border: '1px solid var(--ctp-surface1)', background: 'var(--ctp-surface0)' }}
        >
          {/* Title */}
          <div
            className="px-3 py-1.5 font-mono text-xs font-semibold"
            style={{ background: 'var(--ctp-surface1)', color: 'var(--ctp-mauve)' }}
          >
            {concept.title}
          </div>

          {/* Body */}
          <div className="px-3 pt-2 pb-1 text-[11px] leading-relaxed" style={{ color: 'var(--ctp-subtext1)' }}>
            {concept.body}
          </div>

          {/* Code */}
          <div
            className="mx-3 mb-2 rounded overflow-x-auto"
            style={{ background: 'var(--ctp-base)' }}
          >
            <pre
              className="p-2 m-0 text-[11px] font-mono leading-relaxed"
              style={{ color: 'var(--ctp-text)' }}
              dangerouslySetInnerHTML={{
                __html: Prism.highlight(concept.code, Prism.languages.sql, 'sql'),
              }}
            />
          </div>

          {/* Note */}
          {concept.note && (
            <div
              className="mx-3 mb-2 px-2 py-1.5 rounded text-[10px] leading-relaxed"
              style={{
                background: 'color-mix(in srgb, var(--ctp-yellow) 10%, transparent)',
                border: '1px solid color-mix(in srgb, var(--ctp-yellow) 30%, transparent)',
                color: 'var(--ctp-yellow)',
              }}
            >
              {concept.note}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
