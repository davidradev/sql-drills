import { useEffect, useState } from 'react';
import { SCHEMA, SEED } from '../data/seed';

export function useDatabase() {
  const [db, setDb] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const SQL = await window.initSqlJs({ locateFile: () => '/sql-wasm.wasm' });
        const database = new SQL.Database();
        database.run(SCHEMA);
        database.run(SEED);
        setDb(database);
        setReady(true);
      } catch (e) {
        setError(e.message);
      }
    }
    init();
  }, []);

  function runQuery(sql) {
    try {
      const results = db.exec(sql);
      if (results.length === 0) return { columns: [], rows: [], error: null };
      const { columns, values } = results[0];
      return { columns, rows: values, error: null };
    } catch (e) {
      return { columns: [], rows: [], error: e.message };
    }
  }

  return { db, ready, error, runQuery };
}
