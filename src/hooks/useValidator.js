export function validateResult(userResult, expectedResult, { ordered = false } = {}) {
  if (userResult.error) return { correct: false, reason: 'error' };
  if (expectedResult.error) return { correct: false, reason: 'internal_error' };

  const mapRows = (rows) =>
    rows.map((row) => row.map((v) => (v === null ? null : String(v).trim())));

  const userNorm = mapRows(userResult.rows);
  const expNorm = mapRows(expectedResult.rows);

  if (userNorm.length !== expNorm.length) return { correct: false, reason: 'wrong_row_count' };

  const toCompare = ordered
    ? [userNorm, expNorm]
    : [
        [...userNorm].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))),
        [...expNorm].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))),
      ];

  const match = JSON.stringify(toCompare[0]) === JSON.stringify(toCompare[1]);
  return { correct: match, reason: match ? 'ok' : 'wrong_values' };
}
