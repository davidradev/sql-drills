import { useState } from 'react';
import SchemaDiagram from './SchemaDiagram';

const TABLES = [
  {
    name: 'customers',
    columns: [
      { name: 'id',            type: 'INTEGER', pk: true },
      { name: 'name',          type: 'TEXT' },
      { name: 'city',          type: 'TEXT' },
      { name: 'country',       type: 'TEXT' },
      { name: 'registered_at', type: 'DATE' },
    ],
  },
  {
    name: 'products',
    columns: [
      { name: 'id',       type: 'INTEGER', pk: true },
      { name: 'name',     type: 'TEXT' },
      { name: 'category', type: 'TEXT' },
      { name: 'price',    type: 'REAL' },
      { name: 'stock',    type: 'INTEGER' },
    ],
  },
  {
    name: 'employees',
    columns: [
      { name: 'id',         type: 'INTEGER', pk: true },
      { name: 'name',       type: 'TEXT' },
      { name: 'department', type: 'TEXT' },
      { name: 'salary',     type: 'REAL' },
      { name: 'manager_id', type: 'INTEGER', fk: 'employees' },
      { name: 'hired_at',   type: 'DATE' },
    ],
  },
  {
    name: 'orders',
    columns: [
      { name: 'id',          type: 'INTEGER', pk: true },
      { name: 'customer_id', type: 'INTEGER', fk: 'customers' },
      { name: 'status',      type: 'TEXT' },
      { name: 'ordered_at',  type: 'DATE' },
    ],
  },
  {
    name: 'order_items',
    columns: [
      { name: 'id',         type: 'INTEGER', pk: true },
      { name: 'order_id',   type: 'INTEGER', fk: 'orders' },
      { name: 'product_id', type: 'INTEGER', fk: 'products' },
      { name: 'quantity',   type: 'INTEGER' },
      { name: 'unit_price', type: 'REAL' },
    ],
  },
];

export default function SchemaPanel({ theme }) {
  const [showDiagram, setShowDiagram] = useState(false);

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
        {TABLES.map((table) => (
          <div
            key={table.name}
            className="rounded-lg overflow-hidden"
            style={{ border: '1px solid var(--ctp-surface1)', background: 'var(--ctp-surface0)' }}
          >
            {/* Table name */}
            <div
              className="px-3 py-1.5 font-mono text-xs font-semibold"
              style={{ background: 'var(--ctp-surface1)', color: 'var(--ctp-blue)' }}
            >
              {table.name}
            </div>

            {/* Columns */}
            <div>
              {table.columns.map((col, i) => (
                <div
                  key={col.name}
                  className="px-3 py-1.5 flex items-center justify-between gap-2 min-w-0"
                  style={{
                    borderTop: i > 0 ? '1px solid var(--ctp-surface1)' : 'none',
                  }}
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
