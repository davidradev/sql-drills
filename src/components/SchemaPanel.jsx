import { useState } from 'react';
import SchemaDiagram from './SchemaDiagram';
import { TABLES } from '../data/schema';

export default function SchemaPanel({ theme, tables, onOpenReference, onClose }) {
  const [showDiagram, setShowDiagram] = useState(false);

  const visibleTables = tables
    ? TABLES.filter(t => tables.includes(t.name))
    : TABLES;

  return (
    <>
      <div className="space-y-3 min-w-0">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2">
          <h3
            className="text-xs uppercase tracking-widest font-semibold m-0"
            style={{ color: 'var(--ctp-overlay1)' }}
          >
            Schema
          </h3>
          <div className="flex gap-1.5 items-center">
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden w-6 h-6 flex items-center justify-center rounded text-xs cursor-pointer transition-colors"
                style={{ background: 'var(--ctp-surface0)', color: 'var(--ctp-subtext1)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--ctp-surface1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface0)'}
              >
                ✕
              </button>
            )}
            <button
              onClick={onOpenReference}
              className="text-xs px-2 py-1 rounded cursor-pointer transition-colors"
              style={{
                background: 'var(--ctp-surface0)',
                color: 'var(--ctp-mauve)',
                border: '1px solid var(--ctp-surface1)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--ctp-surface1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface0)'}
            >
              Full Reference
            </button>
            <button
              onClick={() => setShowDiagram(true)}
              className="text-xs px-2 py-1 rounded cursor-pointer transition-colors"
              style={{
                background: 'var(--ctp-surface0)',
                color: 'var(--ctp-blue)',
                border: '1px solid var(--ctp-surface1)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--ctp-surface1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface0)'}
            >
              ER Diagram
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-3 text-[10px]" style={{ color: 'var(--ctp-overlay0)' }}>
          <span>
            <span className="font-mono font-bold" style={{ color: 'var(--ctp-yellow)' }}>PK</span>
            {' '}Primary key
          </span>
          <span>
            <span className="font-mono font-bold" style={{ color: 'var(--ctp-peach)' }}>FK</span>
            {' '}Foreign key
          </span>
        </div>

        {/* Tables */}
        {visibleTables.map((table) => (
          <div
            key={table.name}
            className="rounded-lg overflow-hidden"
            style={{ border: '1px solid var(--ctp-surface1)', background: 'var(--ctp-surface0)' }}
          >
            {/* Table name + desc */}
            <div
              className="px-3 py-2"
              style={{ background: 'var(--ctp-surface1)' }}
            >
              <div className="font-mono text-xs font-semibold" style={{ color: 'var(--ctp-blue)' }}>
                {table.name}
              </div>
              <div className="text-[10px] mt-0.5 leading-tight" style={{ color: 'var(--ctp-overlay1)' }}>
                {table.desc}
              </div>
            </div>

            {/* Columns */}
            <div>
              {table.columns.map((col, i) => (
                <div
                  key={col.name}
                  className="px-3 py-1.5 flex items-center justify-between gap-2 min-w-0"
                  style={{ borderTop: i > 0 ? '1px solid var(--ctp-surface1)' : 'none' }}
                  title={col.desc}
                >
                  {/* Name + badge */}
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    {col.pk && (
                      <span
                        className="text-[9px] font-bold font-mono shrink-0 px-1 rounded"
                        style={{ color: 'var(--ctp-crust)', background: 'var(--ctp-yellow)' }}
                      >
                        PK
                      </span>
                    )}
                    {col.fk && (
                      <span
                        className="text-[9px] font-bold font-mono shrink-0 px-1 rounded"
                        style={{ color: 'var(--ctp-crust)', background: 'var(--ctp-peach)' }}
                      >
                        FK
                      </span>
                    )}
                    <div className="min-w-0">
                      <span
                        className="font-mono text-xs block truncate"
                        style={{ color: 'var(--ctp-text)' }}
                        title={col.name}
                      >
                        {col.name}
                      </span>
                      {col.fk && (
                        <span
                          className="text-[10px] block truncate"
                          style={{ color: 'var(--ctp-overlay0)' }}
                          title={`References ${col.fk}`}
                        >
                          → {col.fk}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Type */}
                  <span
                    className="text-[10px] font-mono shrink-0"
                    style={{ color: 'var(--ctp-overlay0)' }}
                  >
                    {col.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ER Diagram modal */}
      {showDiagram && (
        <SchemaDiagram theme={theme} onClose={() => setShowDiagram(false)} />
      )}
    </>
  );
}
