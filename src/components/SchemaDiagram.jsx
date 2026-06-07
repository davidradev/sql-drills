import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

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

export default function SchemaDiagram({ theme, onClose }) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const id = `er-diag-${++diagCount}`;

    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'mocha' ? 'dark' : 'default',
      er: { diagramPadding: 32, layoutDirection: 'LR', minEntityWidth: 100 },
    });

    mermaid.render(id, CHART)
      .then(({ svg: rendered }) => {
        if (!cancelled) setSvg(rendered);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });

    return () => { cancelled = true; };
  }, [theme]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)' }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        style={{ background: 'var(--ctp-base)', border: '1px solid var(--ctp-surface1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--ctp-surface1)' }}
        >
          <div>
            <h2 className="text-base font-semibold m-0" style={{ color: 'var(--ctp-text)' }}>
              Schema Diagram
            </h2>
            <p className="text-xs mt-0.5 m-0" style={{ color: 'var(--ctp-overlay0)' }}>
              Entity-Relationship diagram — 5 tables
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer"
            style={{ background: 'var(--ctp-surface0)', color: 'var(--ctp-subtext0)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--ctp-surface1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--ctp-surface0)'}
          >
            ✕
          </button>
        </div>

        {/* Diagram */}
        <div className="overflow-auto flex-1 p-6 flex items-start justify-center">
          {error && (
            <p className="text-sm" style={{ color: 'var(--ctp-red)' }}>
              Failed to render diagram: {error}
            </p>
          )}
          {!error && !svg && (
            <p className="text-sm" style={{ color: 'var(--ctp-overlay0)' }}>Rendering…</p>
          )}
          {svg && (
            <div
              className="w-full"
              dangerouslySetInnerHTML={{ __html: svg }}
              style={{ lineHeight: 0 }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
