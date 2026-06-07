export default function ResultTable({ columns, rows }) {
  if (!columns.length) return null;

  return (
    <div
      className="overflow-x-auto rounded-lg mt-3"
      style={{ border: '1px solid var(--ctp-surface1)' }}
    >
      <table className="w-full text-sm text-left">
        <thead>
          <tr style={{ background: 'var(--ctp-surface1)' }}>
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wide whitespace-nowrap"
                style={{ color: 'var(--ctp-subtext0)' }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 50).map((row, i) => (
            <tr
              key={i}
              style={{ background: i % 2 === 0 ? 'var(--ctp-surface0)' : 'var(--ctp-base)', borderTop: '1px solid var(--ctp-surface1)' }}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-4 py-1.5 font-mono text-xs whitespace-nowrap"
                  style={{ color: cell === null ? 'var(--ctp-overlay0)' : 'var(--ctp-text)' }}
                >
                  {cell === null ? <span className="italic">null</span> : String(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > 50 && (
        <p className="text-xs px-4 py-2" style={{ color: 'var(--ctp-overlay0)' }}>
          Showing first 50 of {rows.length} rows
        </p>
      )}
    </div>
  );
}
