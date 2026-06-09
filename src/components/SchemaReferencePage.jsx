import { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import { TABLES } from '../data/schema';

const CHART = `erDiagram
    customers {
        INTEGER id PK
        TEXT name
        TEXT city
        TEXT country
        DATE registered_at
    }
    products {
        INTEGER id PK
        TEXT name
        TEXT category
        REAL price
        INTEGER stock
    }
    employees {
        INTEGER id PK
        TEXT name
        TEXT department
        REAL salary
        INTEGER manager_id FK
        DATE hired_at
    }
    orders {
        INTEGER id PK
        INTEGER customer_id FK
        TEXT status
        DATE ordered_at
    }
    order_items {
        INTEGER id PK
        INTEGER order_id FK
        INTEGER product_id FK
        INTEGER quantity
        REAL unit_price
    }
    customers ||--o{ orders : "places"
    orders ||--|{ order_items : "contains"
    products ||--o{ order_items : "included in"
    employees |o--o{ employees : "manages"
`;

let diagCount = 0;

export default function SchemaReferencePage({ theme, onClose }) {
  const [svg, setSvg] = useState('');
  const [diagramError, setDiagramError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const id = `ref-diag-${++diagCount}`;

    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'mocha' ? 'dark' : 'default',
      er: { diagramPadding: 32, layoutDirection: 'LR', minEntityWidth: 100 },
    });

    mermaid.render(id, CHART)
      .then(({ svg: rendered }) => { if (!cancelled) setSvg(rendered); })
      .catch((e) => { if (!cancelled) setDiagramError(e.message); });

    return () => { cancelled = true; };
  }, [theme]);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: 'var(--ctp-base)' }}
    >
      {/* Sticky header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-8 py-4"
        style={{
          background: 'var(--ctp-mantle)',
          borderBottom: '1px solid var(--ctp-surface1)',
        }}
      >
        <div>
          <h1 className="text-lg font-bold m-0" style={{ color: 'var(--ctp-text)' }}>
            Database Reference
          </h1>
          <p className="text-xs m-0 mt-0.5" style={{ color: 'var(--ctp-overlay0)' }}>
            5 tables · schema, relationships and column descriptions
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors"
          style={{
            background: 'var(--ctp-surface0)',
            color: 'var(--ctp-subtext1)',
            border: '1px solid var(--ctp-surface1)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--ctp-surface1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface0)'}
        >
          ← Back to exercises
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8 space-y-12">

        {/* ER Diagram section */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-4 m-0" style={{ color: 'var(--ctp-overlay1)' }}>
            Entity-Relationship Diagram
          </h2>
          <div
            className="rounded-xl overflow-auto p-6 flex items-start justify-center"
            style={{ background: 'var(--ctp-mantle)', border: '1px solid var(--ctp-surface1)', minHeight: 200 }}
          >
            {diagramError && (
              <p className="text-sm" style={{ color: 'var(--ctp-red)' }}>Failed to render: {diagramError}</p>
            )}
            {!diagramError && !svg && (
              <p className="text-sm" style={{ color: 'var(--ctp-overlay0)' }}>Rendering…</p>
            )}
            {svg && (
              <div className="w-full" dangerouslySetInnerHTML={{ __html: svg }} style={{ lineHeight: 0 }} />
            )}
          </div>
        </section>

        {/* Table reference section */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-4 m-0" style={{ color: 'var(--ctp-overlay1)' }}>
            Tables
          </h2>
          <div className="space-y-6">
            {TABLES.map((table) => (
              <div
                key={table.name}
                className="rounded-xl overflow-hidden"
                style={{ border: '1px solid var(--ctp-surface1)' }}
              >
                {/* Table header */}
                <div
                  className="px-6 py-4"
                  style={{ background: 'var(--ctp-surface0)', borderBottom: '1px solid var(--ctp-surface1)' }}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-base font-bold" style={{ color: 'var(--ctp-blue)' }}>
                      {table.name}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--ctp-overlay1)' }}>
                      {table.columns.length} columns
                    </span>
                  </div>
                  <p className="text-sm mt-1 m-0" style={{ color: 'var(--ctp-subtext1)' }}>
                    {table.desc}
                  </p>
                </div>

                {/* Columns table */}
                <table className="w-full text-sm" style={{ background: 'var(--ctp-base)' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--ctp-surface1)' }}>
                      <th className="text-left px-6 py-2 text-[11px] uppercase tracking-wide font-semibold w-40" style={{ color: 'var(--ctp-overlay0)' }}>Column</th>
                      <th className="text-left px-4 py-2 text-[11px] uppercase tracking-wide font-semibold w-24" style={{ color: 'var(--ctp-overlay0)' }}>Type</th>
                      <th className="text-left px-4 py-2 text-[11px] uppercase tracking-wide font-semibold w-16" style={{ color: 'var(--ctp-overlay0)' }}>Key</th>
                      <th className="text-left px-4 py-2 text-[11px] uppercase tracking-wide font-semibold" style={{ color: 'var(--ctp-overlay0)' }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.columns.map((col, i) => (
                      <tr
                        key={col.name}
                        style={{ borderTop: i > 0 ? '1px solid var(--ctp-surface1)' : 'none' }}
                      >
                        <td className="px-6 py-2.5 font-mono text-xs font-medium" style={{ color: 'var(--ctp-text)' }}>
                          {col.name}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs" style={{ color: 'var(--ctp-overlay0)' }}>
                          {col.type}
                        </td>
                        <td className="px-4 py-2.5">
                          {col.pk && (
                            <span
                              className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded"
                              style={{ color: 'var(--ctp-crust)', background: 'var(--ctp-yellow)' }}
                            >
                              PK
                            </span>
                          )}
                          {col.fk && (
                            <span
                              className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded"
                              style={{ color: 'var(--ctp-crust)', background: 'var(--ctp-peach)' }}
                            >
                              FK
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-xs leading-relaxed" style={{ color: 'var(--ctp-subtext1)' }}>
                          {col.desc}
                          {col.fk && (
                            <span className="ml-1 font-mono text-[10px]" style={{ color: 'var(--ctp-peach)' }}>
                              → {col.fk}.id
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
