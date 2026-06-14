export const PYTHON_TOPICS = [
  // ─── TOPIC 1: Python Core ────────────────────────────────────────────────────
  {
    id: 'py-core',
    title: 'Python Core for DE',
    description: 'Comprehensions, type hints, generators, and clean function patterns',
    lesson: {
      intro: 'Data engineers write Python daily to filter, group, and reshape data. The fundamentals — list comprehensions, type hints, generators — are what separate code that works from code that\'s maintainable and production-ready.',
      concepts: [
        {
          title: 'List comprehensions',
          body: 'The fastest way to filter or transform a list. Preferred over for-loops with .append() in production code.',
          code: `# Filter + transform in one line
errors = [e["message"] for e in logs if e["level"] == "ERROR"]

# Nested: flatten a list of lists
records = [r for page in pages for r in page["data"]]`,
        },
        {
          title: 'Type hints (required in production code)',
          body: 'The JD specifically asks for "clean, testable, production-grade code." Type hints make functions self-documenting and catch bugs early. Use them on every function you write.',
          code: `from typing import Optional

def extract_records(response: dict, limit: int = 100) -> list[dict]:
    return response.get("data", [])[:limit]

def safe_get(record: dict, field: str, default: Optional[str] = None) -> Optional[str]:
    value = record.get(field)
    return default if value is None or value == "" else value`,
        },
        {
          title: 'Generators for large data',
          body: 'When processing millions of rows you cannot load everything into memory. A generator yields one item at a time using "yield" instead of "return", keeping memory usage flat.',
          code: `def read_in_batches(records: list[dict], batch_size: int = 1000):
    for i in range(0, len(records), batch_size):
        yield records[i : i + batch_size]

# Usage
for batch in read_in_batches(all_records, batch_size=500):
    load_to_bigquery(batch)`,
        },
        {
          title: 'Grouping with defaultdict',
          body: 'defaultdict avoids the "key not found" check when building grouped structures. Use it when you need to group records by a field.',
          code: `from collections import defaultdict

def group_by(records: list[dict], key: str) -> dict[str, list]:
    groups: dict[str, list] = defaultdict(list)
    for record in records:
        groups[record[key]].append(record)
    return dict(groups)`,
        },
      ],
    },
    exercises: [
      {
        id: 'py-c-01',
        prompt: 'You receive log entries from a pipeline. Write `get_errors(logs)` that returns only ERROR-level entries.',
        hint: 'Use a list comprehension: [e for e in logs if e["level"] == "ERROR"]',
        starterCode: `def get_errors(logs: list[dict]) -> list[dict]:
    pass`,
        setupCode: `logs = [
    {"level": "INFO",    "message": "Pipeline started",   "ts": "2024-03-01T08:00:00"},
    {"level": "ERROR",   "message": "Connection timeout",  "ts": "2024-03-01T08:01:05"},
    {"level": "WARNING", "message": "Retrying request",    "ts": "2024-03-01T08:01:06"},
    {"level": "ERROR",   "message": "Invalid schema",      "ts": "2024-03-01T08:05:00"},
    {"level": "INFO",    "message": "Pipeline finished",   "ts": "2024-03-01T08:10:00"},
]`,
        testCode: `result = get_errors(logs)
assert isinstance(result, list), "Should return a list"
assert len(result) == 2, f"Expected 2 errors, got {len(result)}"
assert all(e["level"] == "ERROR" for e in result)
assert result[0]["message"] == "Connection timeout"
print(f"Found {len(result)} errors:")
for e in result:
    print(f"  [{e['ts']}] {e['message']}")`,
        solution: `def get_errors(logs: list[dict]) -> list[dict]:
    return [e for e in logs if e["level"] == "ERROR"]`,
      },
      {
        id: 'py-c-02',
        prompt: 'Write `group_by_status(deals)` that groups a list of CRM deals by their "status" field and returns a dict mapping each status to the list of deals with that status.',
        hint: 'Use a plain dict: groups.setdefault(status, []).append(deal). Or use collections.defaultdict(list).',
        starterCode: `def group_by_status(deals: list[dict]) -> dict[str, list]:
    pass`,
        setupCode: `deals = [
    {"id": 1, "name": "Acme Corp",    "status": "closed_won",  "amount": 12000},
    {"id": 2, "name": "Globex",       "status": "open",        "amount":  5000},
    {"id": 3, "name": "Initech",      "status": "closed_lost", "amount":  3000},
    {"id": 4, "name": "Umbrella Co",  "status": "open",        "amount":  8000},
    {"id": 5, "name": "Stark Ind",    "status": "closed_won",  "amount": 25000},
    {"id": 6, "name": "Wayne Ent",    "status": "closed_lost", "amount":  7000},
]`,
        testCode: `result = group_by_status(deals)
assert isinstance(result, dict)
assert set(result.keys()) == {"closed_won", "open", "closed_lost"}, f"Keys: {set(result.keys())}"
assert len(result["closed_won"])  == 2, f"closed_won: {len(result['closed_won'])}"
assert len(result["open"])        == 2, f"open: {len(result['open'])}"
assert len(result["closed_lost"]) == 2, f"closed_lost: {len(result['closed_lost'])}"
print("Grouped deals:")
for status, items in result.items():
    total = sum(d["amount"] for d in items)
    print(f"  {status}: {len(items)} deals  total=\${total:,}")`,
        solution: `def group_by_status(deals: list[dict]) -> dict[str, list]:
    groups: dict[str, list] = {}
    for deal in deals:
        groups.setdefault(deal["status"], []).append(deal)
    return groups`,
      },
      {
        id: 'py-c-03',
        prompt: 'Write `safe_get(record, field, default=None)` that returns a field\'s value but treats missing keys, None, and empty strings all as "missing" and returns the default instead.',
        hint: 'Use record.get(field) then check if the result is None or "".',
        starterCode: `from typing import Any, Optional

def safe_get(record: dict, field: str, default: Optional[Any] = None) -> Any:
    pass`,
        setupCode: `r1 = {"id": 1, "name": "Alice", "email": "alice@example.com", "phone": None}
r2 = {"id": 2, "name": "Bob",   "phone": "+1-555-0100"}           # email missing
r3 = {"id": 3, "name": "Charlie", "email": "", "phone": "+1-555-0200"}  # email empty`,
        testCode: `assert safe_get(r1, "phone",   "N/A") == "N/A",               "None → default"
assert safe_get(r2, "email",   "N/A") == "N/A",               "Missing key → default"
assert safe_get(r3, "email",   "N/A") == "N/A",               "Empty string → default"
assert safe_get(r1, "email",   "N/A") == "alice@example.com", "Present value returned"
assert safe_get(r1, "id",         0 ) == 1,                    "Int value returned"
print("All safe_get cases passed!")`,
        solution: `from typing import Any, Optional

def safe_get(record: dict, field: str, default: Optional[Any] = None) -> Any:
    value = record.get(field)
    if value is None or value == "":
        return default
    return value`,
      },
      {
        id: 'py-c-04',
        prompt: 'Write `read_in_batches(records, batch_size)` as a generator that yields successive sublists of `batch_size` records. This is the pattern used to write to BigQuery or any API that has a row limit per request.',
        hint: 'Use yield inside a for loop over range(0, len(records), batch_size). Slice records[i : i + batch_size].',
        starterCode: `from typing import Generator

def read_in_batches(records: list, batch_size: int) -> Generator[list, None, None]:
    pass`,
        setupCode: `records = list(range(1, 26))  # [1, 2, 3, ..., 25]
# We will call read_in_batches(records, batch_size=10)
# Expected: [1..10], [11..20], [21..25]`,
        testCode: `batches = list(read_in_batches(records, 10))
assert len(batches) == 3, f"Expected 3 batches, got {len(batches)}"
assert batches[0] == list(range(1, 11)),  f"First batch wrong: {batches[0]}"
assert batches[1] == list(range(11, 21)), f"Second batch wrong: {batches[1]}"
assert batches[2] == list(range(21, 26)), f"Third batch (partial) wrong: {batches[2]}"

# Verify it's actually a generator (not a list)
import types
gen = read_in_batches(records, 10)
assert isinstance(gen, types.GeneratorType), "Must be a generator (use yield)"
print(f"3 batches: {[len(b) for b in batches]} records each")`,
        solution: `from typing import Generator

def read_in_batches(records: list, batch_size: int) -> Generator[list, None, None]:
    for i in range(0, len(records), batch_size):
        yield records[i : i + batch_size]`,
      },
      {
        id: 'py-c-05',
        prompt: 'Write `summarize_pipeline_run(events)` that takes a list of pipeline event dicts (each with "pipeline", "status", "duration_s") and returns a summary dict: for each pipeline, the total runs, success count, failure count, and average duration in seconds (rounded to 1 decimal).',
        hint: 'Group by pipeline first using a dict of dicts. Accumulate counts and total duration, then compute avg at the end.',
        starterCode: `def summarize_pipeline_run(events: list[dict]) -> dict[str, dict]:
    # Return {pipeline_name: {total, success, failure, avg_duration_s}}
    pass`,
        setupCode: `events = [
    {"pipeline": "customer_etl",  "status": "success", "duration_s": 45},
    {"pipeline": "sales_report",  "status": "success", "duration_s": 120},
    {"pipeline": "customer_etl",  "status": "failure", "duration_s": 12},
    {"pipeline": "customer_etl",  "status": "success", "duration_s": 50},
    {"pipeline": "sales_report",  "status": "failure", "duration_s": 30},
    {"pipeline": "inventory_sync","status": "success", "duration_s": 200},
]`,
        testCode: `result = summarize_pipeline_run(events)
assert set(result.keys()) == {"customer_etl", "sales_report", "inventory_sync"}

ce = result["customer_etl"]
assert ce["total"]   == 3,    f"total: {ce['total']}"
assert ce["success"] == 2,    f"success: {ce['success']}"
assert ce["failure"] == 1,    f"failure: {ce['failure']}"
assert ce["avg_duration_s"] == 35.7, f"avg: {ce['avg_duration_s']}"

sr = result["sales_report"]
assert sr["total"]   == 2
assert sr["success"] == 1
assert sr["avg_duration_s"] == 75.0

print("Pipeline summary:")
for name, s in result.items():
    print(f"  {name}: {s['total']} runs  {s['success']} ok  {s['failure']} fail  avg={s['avg_duration_s']}s")`,
        solution: `def summarize_pipeline_run(events: list[dict]) -> dict[str, dict]:
    acc: dict[str, dict] = {}
    for e in events:
        p = e["pipeline"]
        if p not in acc:
            acc[p] = {"total": 0, "success": 0, "failure": 0, "_total_dur": 0}
        acc[p]["total"] += 1
        acc[p][e["status"]] = acc[p].get(e["status"], 0) + 1
        acc[p]["_total_dur"] += e["duration_s"]
    return {
        name: {
            "total": s["total"],
            "success": s.get("success", 0),
            "failure": s.get("failure", 0),
            "avg_duration_s": round(s["_total_dur"] / s["total"], 1),
        }
        for name, s in acc.items()
    }`,
      },
    ],
  },

  // ─── TOPIC 2: JSON & API Data ────────────────────────────────────────────────
  {
    id: 'py-json',
    title: 'JSON & API Data',
    description: 'Parse, flatten, and validate data from REST APIs and CRM exports',
    lesson: {
      intro: 'Most data sources return JSON — paginated REST APIs, Salesforce SOQL, Stripe webhooks. Learning to flatten, validate, and normalize JSON is the first step of every ETL pipeline.',
      concepts: [
        {
          title: 'Flatten paginated responses',
          body: 'APIs split results across pages. A nested comprehension flattens all records into one list in a single expression.',
          code: `pages = [{"data": [{"id": 1}, {"id": 2}]}, {"data": [{"id": 3}]}]

records = [r for page in pages for r in page["data"]]
# → [{"id": 1}, {"id": 2}, {"id": 3}]`,
        },
        {
          title: 'Salesforce SOQL format',
          body: 'Salesforce responses wrap records in {"records": [...]} and include an "attributes" key per record that you typically strip before loading to the warehouse.',
          code: `def extract_sf(response: dict) -> list[dict]:
    return [
        {k: v for k, v in r.items() if k != "attributes"}
        for r in response["records"]
    ]`,
        },
        {
          title: 'Exploding nested lists (one-to-many)',
          body: 'When a field is a list, expand it so each value gets its own row — same as SQL UNNEST or pandas explode().',
          code: `records = [{"id": 1, "tags": ["python", "etl"]}, {"id": 2, "tags": ["sql"]}]

rows = [
    {"id": r["id"], "tag": tag}
    for r in records
    for tag in r.get("tags", [])
]`,
        },
        {
          title: 'Batch validation',
          body: 'Validate records before writing to the warehouse. Separate valid from invalid so the pipeline continues with good data and errors are surfaced separately.',
          code: `def validate_batch(records, required):
    valid, invalid = [], []
    for rec in records:
        missing = [f for f in required if not rec.get(f)]
        if missing:
            invalid.append({"record": rec, "reason": f"Missing: {missing}"})
        else:
            valid.append(rec)
    return valid, invalid`,
        },
      ],
    },
    exercises: [
      {
        id: 'py-j-01',
        prompt: 'A REST API returns paginated data where each page dict has a "data" key with a list of records. Write `flatten_pages(pages)` that returns one flat list of all records across all pages.',
        hint: 'Nested comprehension: [r for page in pages for r in page["data"]]',
        starterCode: `def flatten_pages(pages: list[dict]) -> list[dict]:
    pass`,
        setupCode: `pages = [
    {"page": 1, "data": [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}],     "has_next": True},
    {"page": 2, "data": [{"id": 3, "name": "Charlie"}, {"id": 4, "name": "Diana"}], "has_next": True},
    {"page": 3, "data": [{"id": 5, "name": "Eve"}],                                  "has_next": False},
]`,
        testCode: `result = flatten_pages(pages)
assert isinstance(result, list)
assert len(result) == 5, f"Expected 5, got {len(result)}"
assert result[0]["id"] == 1
assert result[4]["name"] == "Eve"
print(f"Flattened {len(pages)} pages → {len(result)} records")
for r in result:
    print(f"  {r['id']}: {r['name']}")`,
        solution: `def flatten_pages(pages: list[dict]) -> list[dict]:
    return [r for page in pages for r in page["data"]]`,
      },
      {
        id: 'py-j-02',
        prompt: 'Salesforce SOQL returns `{"totalSize": N, "done": true, "records": [...]}`. Each record has an "attributes" metadata key that should be removed. Write `extract_sf_records(response)` that returns the cleaned list.',
        hint: 'Access response["records"] and build a new dict per record excluding the "attributes" key.',
        starterCode: `def extract_sf_records(response: dict) -> list[dict]:
    pass`,
        setupCode: `sf_response = {
    "totalSize": 3,
    "done": True,
    "records": [
        {"attributes": {"type": "Account", "url": "/services/data/v58.0/sobjects/Account/001"},
         "Id": "001", "Name": "Acme Corp",  "AnnualRevenue": 5000000},
        {"attributes": {"type": "Account", "url": "/services/data/v58.0/sobjects/Account/002"},
         "Id": "002", "Name": "Globex",     "AnnualRevenue": 3000000},
        {"attributes": {"type": "Account", "url": "/services/data/v58.0/sobjects/Account/003"},
         "Id": "003", "Name": "Initech",    "AnnualRevenue": 1000000},
    ],
}`,
        testCode: `result = extract_sf_records(sf_response)
assert len(result) == 3
assert "attributes" not in result[0], "Should remove 'attributes'"
assert result[0]["Id"] == "001"
assert result[2]["Name"] == "Initech"
print(f"Extracted {len(result)} records:")
for r in result:
    print(f"  {r['Id']}: {r['Name']}  (\${r['AnnualRevenue']:,})")`,
        solution: `def extract_sf_records(response: dict) -> list[dict]:
    return [{k: v for k, v in r.items() if k != "attributes"} for r in response["records"]]`,
      },
      {
        id: 'py-j-03',
        prompt: 'Write `normalize_product(raw)` that returns a dict with guaranteed fields: `id` (int, required), `name` (str, required), `price` (float, default 0.0), `category` (str, default "uncategorized"), `active` (bool, default True). Raise ValueError if id or name is missing.',
        hint: 'Check required fields first, raise ValueError if absent. For optional ones, use raw.get("price") or 0.0 wrapped in float().',
        starterCode: `def normalize_product(raw: dict) -> dict:
    pass`,
        setupCode: `p_full    = {"id": 1, "name": "Widget Pro", "price": 49.99, "category": "tools", "active": True}
p_minimal = {"id": 2, "name": "Gadget X"}                # missing price, category, active
p_no_id   = {"name": "Orphan", "price": 9.99}            # missing id → ValueError
p_no_name = {"id": 4}                                     # missing name → ValueError`,
        testCode: `a = normalize_product(p_full)
assert a["id"] == 1 and a["price"] == 49.99

b = normalize_product(p_minimal)
assert b["price"] == 0.0,            f"Default price: {b['price']}"
assert b["category"] == "uncategorized"
assert b["active"] == True

try:
    normalize_product(p_no_id)
    assert False, "Should raise ValueError for missing id"
except ValueError:
    pass

try:
    normalize_product(p_no_name)
    assert False, "Should raise ValueError for missing name"
except ValueError:
    pass

print("All normalization cases passed!")`,
        solution: `def normalize_product(raw: dict) -> dict:
    if not raw.get("id"):
        raise ValueError("Missing required field: id")
    if not raw.get("name"):
        raise ValueError("Missing required field: name")
    return {
        "id":       int(raw["id"]),
        "name":     str(raw["name"]),
        "price":    float(raw.get("price") or 0.0),
        "category": raw.get("category") or "uncategorized",
        "active":   raw.get("active", True),
    }`,
      },
      {
        id: 'py-j-04',
        prompt: 'Write `explode_tags(records)` that takes records like `{"id": 1, "tags": ["python", "etl"]}` and returns one row per tag. Records with empty or missing tags should produce no rows.',
        hint: 'Nested comprehension: [{"id": r["id"], "tag": tag} for r in records for tag in r.get("tags", []) if tag]',
        starterCode: `def explode_tags(records: list[dict]) -> list[dict]:
    pass`,
        setupCode: `records = [
    {"id": 1, "name": "Pipeline A", "tags": ["python", "etl", "bigquery"]},
    {"id": 2, "name": "Pipeline B", "tags": ["airflow"]},
    {"id": 3, "name": "Pipeline C", "tags": []},       # no tags → 0 rows
    {"id": 4, "name": "Pipeline D"},                    # missing tags → 0 rows
]`,
        testCode: `result = explode_tags(records)
assert len(result) == 4, f"Expected 4 rows, got {len(result)}"
assert result[0] == {"id": 1, "tag": "python"}
assert result[2] == {"id": 1, "tag": "bigquery"}
assert result[3] == {"id": 2, "tag": "airflow"}
print(f"Exploded into {len(result)} rows:")
for r in result:
    print(f"  id={r['id']}  tag={r['tag']}")`,
        solution: `def explode_tags(records: list[dict]) -> list[dict]:
    return [
        {"id": r["id"], "tag": tag}
        for r in records
        for tag in r.get("tags", [])
        if tag
    ]`,
      },
      {
        id: 'py-j-05',
        prompt: 'Write `validate_batch(records, required_fields)` that splits records into valid and invalid. Return `{"valid": [...], "invalid": [{"record": ..., "reason": "..."}]}`. A record is invalid if any required field is absent or falsy.',
        hint: 'missing = [f for f in required_fields if not record.get(f)]. If missing is non-empty, it\'s invalid.',
        starterCode: `def validate_batch(records: list[dict], required_fields: list[str]) -> dict:
    pass`,
        setupCode: `records = [
    {"id": 1, "name": "Alice", "email": "alice@example.com"},
    {"id": 2, "name": "Bob"},                                    # missing email
    {"id": None, "name": "Charlie", "email": "c@example.com"},  # null id
    {"id": 4, "name": "Diana", "email": "diana@example.com"},
]
required = ["id", "name", "email"]`,
        testCode: `result = validate_batch(records, required)
assert len(result["valid"])   == 2, f"Expected 2 valid,   got {len(result['valid'])}"
assert len(result["invalid"]) == 2, f"Expected 2 invalid, got {len(result['invalid'])}"
valid_ids = [r["id"] for r in result["valid"]]
assert 1 in valid_ids and 4 in valid_ids
for inv in result["invalid"]:
    assert "reason" in inv and "record" in inv
print(f"Valid: {len(result['valid'])}, Invalid: {len(result['invalid'])}")
for inv in result["invalid"]:
    print(f"  Bad id={inv['record'].get('id')}: {inv['reason']}")`,
        solution: `def validate_batch(records: list[dict], required_fields: list[str]) -> dict:
    valid, invalid = [], []
    for record in records:
        missing = [f for f in required_fields if not record.get(f)]
        if missing:
            invalid.append({"record": record, "reason": f"Missing: {', '.join(missing)}"})
        else:
            valid.append(record)
    return {"valid": valid, "invalid": invalid}`,
      },
    ],
  },

  // ─── TOPIC 3: Pandas for ETL ─────────────────────────────────────────────────
  {
    id: 'py-pandas',
    title: 'Pandas for ETL',
    description: 'Filter, aggregate, join, clean, and reshape tabular data',
    lesson: {
      intro: 'Pandas is the backbone of Python ETL for batch data. It handles column renaming, complex joins, aggregations, and datetime transformations. In interviews expect to write transformations on DataFrames from scratch.',
      concepts: [
        {
          title: 'Filter and select columns',
          body: 'Filter rows with boolean indexing. Use & (not "and") for multiple conditions. Select columns by passing a list.',
          code: `active_big = df[(df["is_active"]) & (df["amount"] > 1000)]
result = active_big[["id", "name", "amount"]]`,
        },
        {
          title: 'GroupBy and aggregation',
          body: '.agg() lets you compute multiple metrics at once and rename them in the same call.',
          code: `summary = (
    df.groupby("category")["amount"]
    .agg(total="sum", count="count", avg="mean")
    .reset_index()
)`,
        },
        {
          title: 'Merge (JOIN)',
          body: 'pd.merge() is SQL JOIN. Use how="left" to keep all rows from the left table even without a match.',
          code: `enriched = pd.merge(
    orders, customers[["id", "name"]],
    left_on="customer_id", right_on="id", how="left"
)`,
        },
        {
          title: 'Detect changed records (SCD Type 1)',
          body: 'In incremental loads you need to find which rows changed between the current state and the new snapshot. Merge on the key and compare value columns.',
          code: `merged = current.merge(new, on="id", suffixes=("_old", "_new"))
changed = merged[merged["value_old"] != merged["value_new"]]`,
        },
        {
          title: 'DateTime and window operations',
          body: 'Parse strings with pd.to_datetime(). Use .dt accessor for year/month/day. Use groupby + transform for window-like operations (rank, cumsum).',
          code: `df["date"]  = pd.to_datetime(df["date"])
df["year"]  = df["date"].dt.year
df["month"] = df["date"].dt.month

# Rank within group (like SQL RANK() OVER PARTITION BY)
df["rank"] = df.groupby("country")["amount"].rank(ascending=False, method="dense")`,
        },
      ],
    },
    exercises: [
      {
        id: 'py-p-01',
        prompt: 'Write `get_active_big_spenders(df)` that returns only active customers with total_spend > 1000, keeping only `customer_id`, `name`, and `total_spend` columns.',
        hint: 'Filter: df[(df["is_active"]) & (df["total_spend"] > 1000)], then select columns.',
        starterCode: `import pandas as pd

def get_active_big_spenders(df: pd.DataFrame) -> pd.DataFrame:
    pass`,
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "customer_id": [1, 2, 3, 4, 5],
    "name":        ["Alice", "Bob", "Charlie", "Diana", "Eve"],
    "country":     ["US", "UK", "US", "CA", "UK"],
    "total_spend": [2500.0, 800.0, 1500.0, 300.0, 3200.0],
    "is_active":   [True, True, False, True, True],
})`,
        testCode: `result = get_active_big_spenders(df)
assert list(result.columns) == ["customer_id", "name", "total_spend"], f"Cols: {list(result.columns)}"
assert len(result) == 2, f"Expected 2 rows, got {len(result)}"
assert set(result["customer_id"].tolist()) == {1, 5}
print(result.to_string(index=False))`,
        solution: `import pandas as pd

def get_active_big_spenders(df: pd.DataFrame) -> pd.DataFrame:
    return (
        df[(df["is_active"] == True) & (df["total_spend"] > 1000)]
        [["customer_id", "name", "total_spend"]]
        .reset_index(drop=True)
    )`,
      },
      {
        id: 'py-p-02',
        prompt: 'Write `clean_columns(df)` that strips whitespace, lowercases, and replaces spaces with underscores in every column name. Return the modified DataFrame.',
        hint: 'Set df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]',
        starterCode: `import pandas as pd

def clean_columns(df: pd.DataFrame) -> pd.DataFrame:
    pass`,
        setupCode: `import pandas as pd

df = pd.DataFrame({
    " Customer ID ": [1, 2, 3],
    "First Name":    ["Alice", "Bob", "Charlie"],
    "Total Spend":   [2500.0, 800.0, 1500.0],
    "Is Active":     [True, True, False],
})`,
        testCode: `result = clean_columns(df)
assert list(result.columns) == ["customer_id", "first_name", "total_spend", "is_active"], f"Got: {list(result.columns)}"
assert len(result) == 3
assert result["customer_id"].tolist() == [1, 2, 3]
print("Cleaned columns:", list(result.columns))`,
        solution: `import pandas as pd

def clean_columns(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = [c.strip().lower().replace(' ', '_') for c in df.columns]
    return df`,
      },
      {
        id: 'py-p-03',
        prompt: 'Write `sales_summary(df)` that groups by `category` and returns a DataFrame with `category`, `total_revenue` (sum), `num_orders` (count), `avg_order` (mean rounded to 2 decimals), sorted by total_revenue descending.',
        hint: 'Use .agg(total_revenue="sum", num_orders="count", avg_order="mean") then .round(2) and .sort_values().',
        starterCode: `import pandas as pd

def sales_summary(df: pd.DataFrame) -> pd.DataFrame:
    pass`,
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "order_id": [1, 2, 3, 4, 5, 6, 7],
    "category": ["software", "hardware", "software", "services", "hardware", "software", "services"],
    "amount":   [120.0, 850.0, 200.0, 500.0, 950.0, 175.0, 300.0],
})`,
        testCode: `result = sales_summary(df)
assert list(result.columns) == ["category", "total_revenue", "num_orders", "avg_order"], f"Cols: {list(result.columns)}"
assert result.iloc[0]["category"] == "hardware", f"Should sort desc, got {result.iloc[0]['category']}"
sw = result[result["category"] == "software"].iloc[0]
assert sw["total_revenue"] == 495.0
assert sw["num_orders"]    == 3
assert sw["avg_order"]     == 165.0
print(result.to_string(index=False))`,
        solution: `import pandas as pd

def sales_summary(df: pd.DataFrame) -> pd.DataFrame:
    agg = (
        df.groupby("category")["amount"]
        .agg(total_revenue="sum", num_orders="count", avg_order="mean")
        .reset_index()
    )
    agg["avg_order"] = agg["avg_order"].round(2)
    return agg.sort_values("total_revenue", ascending=False).reset_index(drop=True)`,
      },
      {
        id: 'py-p-04',
        prompt: 'Write `enrich_orders(orders_df, customers_df)` that left-joins orders with customers on `customer_id`, adding `name` and `country`. Return only: `order_id`, `customer_id`, `name`, `country`, `amount`. Orders without a matching customer should have NaN.',
        hint: 'pd.merge(orders_df, customers_df, on="customer_id", how="left"), then select the 5 columns.',
        starterCode: `import pandas as pd

def enrich_orders(orders_df: pd.DataFrame, customers_df: pd.DataFrame) -> pd.DataFrame:
    pass`,
        setupCode: `import pandas as pd

orders_df = pd.DataFrame({
    "order_id":    [101, 102, 103, 104],
    "customer_id": [1, 2, 1, 99],        # 99 has no matching customer
    "amount":      [250.0, 400.0, 150.0, 300.0],
})
customers_df = pd.DataFrame({
    "customer_id": [1, 2, 3],
    "name":    ["Alice", "Bob", "Charlie"],
    "country": ["US", "UK", "CA"],
})`,
        testCode: `import pandas as pd
result = enrich_orders(orders_df, customers_df)
assert list(result.columns) == ["order_id", "customer_id", "name", "country", "amount"]
assert len(result) == 4
assert len(result[result["name"] == "Alice"]) == 2
unmatched = result[result["customer_id"] == 99].iloc[0]
assert pd.isna(unmatched["name"]), "Unmatched should have NaN name"
print(result.to_string(index=False))`,
        solution: `import pandas as pd

def enrich_orders(orders_df: pd.DataFrame, customers_df: pd.DataFrame) -> pd.DataFrame:
    merged = pd.merge(orders_df, customers_df, on="customer_id", how="left")
    return merged[["order_id", "customer_id", "name", "country", "amount"]]`,
      },
      {
        id: 'py-p-05',
        prompt: 'Write `clean_dataframe(df)` that: drops rows where `id` is null, fills null `category` with "unknown", removes exact duplicate rows, and resets the index.',
        hint: 'Chain: .dropna(subset=["id"]) → .fillna({"category": "unknown"}) → .drop_duplicates() → .reset_index(drop=True)',
        starterCode: `import pandas as pd

def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    pass`,
        setupCode: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "id":       [1,     2,     None, 3,        2,     4  ],
    "name":     ["Alice","Bob","Ghost","Charlie","Bob","Diana"],
    "category": ["A",   None,  "B",  None,     None,  "C"],
    "amount":   [100,   200,   50,   300,      200,   400],
})
# Expected after cleaning:
#   - row with id=None dropped
#   - second row with id=2 (duplicate) dropped
#   - null categories filled with "unknown"
#   → 4 rows remaining`,
        testCode: `result = clean_dataframe(df)
assert result["id"].isna().sum() == 0
assert result["category"].isna().sum() == 0
assert len(result) == 4, f"Expected 4 rows, got {len(result)}"
assert result["category"].tolist() == ["A", "unknown", "unknown", "C"]
assert list(result.index) == [0, 1, 2, 3]
print(result.to_string(index=False))`,
        solution: `import pandas as pd

def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    return (
        df.dropna(subset=["id"])
        .fillna({"category": "unknown"})
        .drop_duplicates()
        .reset_index(drop=True)
    )`,
      },
      {
        id: 'py-p-06',
        prompt: 'Write `monthly_revenue(df)` that parses `date` (strings "YYYY-MM-DD"), groups by year and month, sums `amount` as `revenue`, and returns a DataFrame with columns `year`, `month`, `revenue` sorted ascending.',
        hint: 'pd.to_datetime(df["date"]), then .dt.year and .dt.month. GroupBy both, agg sum, rename, reset_index.',
        starterCode: `import pandas as pd

def monthly_revenue(df: pd.DataFrame) -> pd.DataFrame:
    pass`,
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "date":   ["2024-01-15", "2024-01-22", "2024-02-10", "2024-02-28", "2024-03-05"],
    "amount": [500.0,         300.0,         800.0,         200.0,         1100.0],
})`,
        testCode: `result = monthly_revenue(df)
assert list(result.columns) == ["year", "month", "revenue"]
assert len(result) == 3
jan = result[result["month"] == 1].iloc[0]
assert jan["revenue"] == 800.0
feb = result[result["month"] == 2].iloc[0]
assert feb["revenue"] == 1000.0
assert result.iloc[0]["month"] == 1
print(result.to_string(index=False))`,
        solution: `import pandas as pd

def monthly_revenue(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["date"]  = pd.to_datetime(df["date"])
    df["year"]  = df["date"].dt.year
    df["month"] = df["date"].dt.month
    return (
        df.groupby(["year", "month"])["amount"]
        .sum().reset_index()
        .rename(columns={"amount": "revenue"})
    )`,
      },
      {
        id: 'py-p-07',
        prompt: 'Write `detect_changes(current_df, new_df)` that finds records where the `value` column changed between the current state and a new snapshot. Both DataFrames have `id` and `value` columns. Return a DataFrame with `id`, `old_value`, `new_value` for changed rows only.',
        hint: 'Merge on "id" with suffixes=("_old", "_new"), then filter rows where value_old != value_new.',
        starterCode: `import pandas as pd

def detect_changes(current_df: pd.DataFrame, new_df: pd.DataFrame) -> pd.DataFrame:
    pass`,
        setupCode: `import pandas as pd

current_df = pd.DataFrame({
    "id":    [1, 2, 3, 4],
    "value": [100, 200, 300, 400],
})
new_df = pd.DataFrame({
    "id":    [1, 2, 3, 4],
    "value": [100, 250, 300, 450],  # id=2 changed 200→250, id=4 changed 400→450
})`,
        testCode: `result = detect_changes(current_df, new_df)
assert list(result.columns) == ["id", "old_value", "new_value"], f"Cols: {list(result.columns)}"
assert len(result) == 2, f"Expected 2 changed rows, got {len(result)}"
r2 = result[result["id"] == 2].iloc[0]
assert r2["old_value"] == 200 and r2["new_value"] == 250
r4 = result[result["id"] == 4].iloc[0]
assert r4["old_value"] == 400 and r4["new_value"] == 450
print("Changed records:")
print(result.to_string(index=False))`,
        solution: `import pandas as pd

def detect_changes(current_df: pd.DataFrame, new_df: pd.DataFrame) -> pd.DataFrame:
    merged = current_df.merge(new_df, on="id", suffixes=("_old", "_new"))
    changed = merged[merged["value_old"] != merged["value_new"]]
    return changed[["id", "value_old", "value_new"]].reset_index(drop=True)`,
      },
      {
        id: 'py-p-08',
        prompt: 'Write `rank_by_country(df)` that adds a `rank` column ranking each customer by `total_spend` within their `country` (rank 1 = highest spend, dense ranking). Return the full DataFrame with the new column, sorted by country and rank.',
        hint: 'Use df.groupby("country")["total_spend"].rank(ascending=False, method="dense"). Cast to int.',
        starterCode: `import pandas as pd

def rank_by_country(df: pd.DataFrame) -> pd.DataFrame:
    pass`,
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "customer_id": [1, 2, 3, 4, 5, 6],
    "name":    ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"],
    "country": ["US", "US", "UK", "US", "UK", "UK"],
    "total_spend": [3000, 1500, 2000, 5000, 2000, 800],
})
# Expected ranks within US: Diana=1, Alice=2, Bob=3
# Expected ranks within UK: Charlie=1 (tie with Eve), Eve=1 (tie), Frank=3`,
        testCode: `result = rank_by_country(df)
assert "rank" in result.columns, "Missing 'rank' column"
assert len(result) == 6

us = result[result["country"] == "US"].set_index("name")
assert us.loc["Diana",   "rank"] == 1
assert us.loc["Alice",   "rank"] == 2
assert us.loc["Bob",     "rank"] == 3

uk = result[result["country"] == "UK"].set_index("name")
assert uk.loc["Charlie", "rank"] == 1
assert uk.loc["Eve",     "rank"] == 1  # tie
assert uk.loc["Frank",   "rank"] == 3
print(result.sort_values(["country", "rank"]).to_string(index=False))`,
        solution: `import pandas as pd

def rank_by_country(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["rank"] = df.groupby("country")["total_spend"].rank(ascending=False, method="dense").astype(int)
    return df.sort_values(["country", "rank"]).reset_index(drop=True)`,
      },
    ],
  },

  // ─── TOPIC 4: ETL Pipeline Patterns ──────────────────────────────────────────
  {
    id: 'py-etl',
    title: 'ETL Pipeline Patterns',
    description: 'Extract, transform, deduplicate, handle errors, and design production-grade pipelines',
    lesson: {
      intro: 'Production ETL is not just about transformations — it\'s about making pipelines reliable. Validate at ingestion, isolate errors per record, deduplicate before loading, and chain functions so each step is independently testable.',
      concepts: [
        {
          title: 'Extract with validation',
          body: 'Raise clear errors early. Never let a bad API response silently produce empty results downstream.',
          code: `def extract(response: dict) -> list[dict]:
    if not isinstance(response, dict):
        raise ValueError(f"Expected dict, got {type(response).__name__}")
    if "data" not in response:
        raise ValueError("Missing 'data' key in response")
    return response["data"]`,
        },
        {
          title: 'Deduplication by key',
          body: 'When loading incrementally you receive updates to existing records. A dict keyed by ID automatically keeps the last value for each key.',
          code: `def deduplicate(records: list[dict], key: str) -> list[dict]:
    seen = {}
    for record in records:
        seen[record[key]] = record  # later wins
    return list(seen.values())`,
        },
        {
          title: 'Per-record error isolation',
          body: 'Never let one bad record kill the whole batch. Wrap each record in try/except and collect errors separately so the pipeline continues.',
          code: `def safe_process(records):
    results, errors = [], []
    for record in records:
        try:
            results.append(transform(record))
        except Exception as e:
            errors.append({"record": record, "error": str(e)})
    return results, errors`,
        },
        {
          title: 'Incremental load pattern',
          body: 'Process only new or updated records by tracking a watermark (usually a timestamp). This avoids reprocessing the full dataset on every run.',
          code: `def extract_incremental(records: list[dict], since: str) -> list[dict]:
    # since is an ISO timestamp string — comparison works lexicographically
    return [r for r in records if r["updated_at"] > since]`,
        },
        {
          title: 'Retry wrapper',
          body: 'External API calls fail transiently. A simple retry wrapper makes any function more resilient without cluttering the business logic.',
          code: `def retry(func, max_attempts=3, exceptions=(Exception,)):
    last_err = None
    for _ in range(max_attempts):
        try:
            return func()
        except exceptions as e:
            last_err = e
    raise last_err`,
        },
      ],
    },
    exercises: [
      {
        id: 'py-e-01',
        prompt: 'Write `extract(api_response)` that validates the response and returns the list of records. Raise ValueError if the response is not a dict, lacks a "data" key, or if "data" is not a list.',
        hint: 'Use isinstance() to check types, then check for the "data" key.',
        starterCode: `def extract(api_response) -> list[dict]:
    pass`,
        setupCode: `good     = {"status": "ok", "data": [{"id": 1}, {"id": 2}]}
empty    = {"status": "ok", "data": []}
no_data  = {"status": "ok", "records": [{"id": 1}]}   # wrong key
not_dict = [{"id": 1}, {"id": 2}]                     # not a dict`,
        testCode: `result = extract(good)
assert isinstance(result, list) and len(result) == 2

assert extract(empty) == []

try:
    extract(no_data)
    assert False, "Should raise for missing 'data'"
except ValueError:
    pass

try:
    extract(not_dict)
    assert False, "Should raise for non-dict"
except ValueError:
    pass

print("All extract() validations passed!")`,
        solution: `def extract(api_response) -> list[dict]:
    if not isinstance(api_response, dict):
        raise ValueError("API response must be a dict")
    if "data" not in api_response:
        raise ValueError("Missing 'data' key")
    if not isinstance(api_response["data"], list):
        raise ValueError("'data' must be a list")
    return api_response["data"]`,
      },
      {
        id: 'py-e-02',
        prompt: 'Write `transform(records)` that normalizes each record: convert all camelCase keys to snake_case, ensure "amount" is a float (default 0.0 if missing or invalid), and skip records without an "id". Return a tuple (clean_records, skipped_count).',
        hint: 'Return a tuple (list, int). Wrap float() in try/except. Skip if not record.get("id").',
        starterCode: `def to_snake_case(key: str) -> str:
    result = []
    for char in key:
        if char.isupper():
            result.append('_')
            result.append(char.lower())
        else:
            result.append(char)
    return ''.join(result)

def transform(records: list[dict]) -> tuple[list[dict], int]:
    pass`,
        setupCode: `records = [
    {"id": 1, "customerName": "Alice",  "amount": "2500.50"},
    {"id": 2, "customerName": "Bob",    "amount": "not_a_number"},
    {"customerName": "Ghost",           "amount": "100"},     # no id → skip
    {"id": 4, "customerName": "Diana",  "amount": None},
    {"id": 5, "customerName": "Eve",    "amount": 750},
]`,
        testCode: `clean, skipped = transform(records)
assert isinstance(clean, list) and isinstance(skipped, int)
assert skipped == 1, f"Expected 1 skipped, got {skipped}"
assert len(clean) == 4
assert "customer_name" in clean[0],   "Keys should be snake_case"
assert clean[0]["amount"] == 2500.50
assert clean[1]["amount"] == 0.0,     "Invalid amount → 0.0"
assert clean[3]["amount"] == 0.0,     "None amount → 0.0"
print(f"{len(clean)} clean, {skipped} skipped")
for r in clean:
    print(f"  id={r['id']}  {r['customer_name']}  amount={r['amount']}")`,
        solution: `def to_snake_case(key: str) -> str:
    result = []
    for char in key:
        if char.isupper():
            result.append('_')
            result.append(char.lower())
        else:
            result.append(char)
    return ''.join(result)

def transform(records: list[dict]) -> tuple[list[dict], int]:
    clean, skipped = [], 0
    for record in records:
        if not record.get("id"):
            skipped += 1
            continue
        normalized = {to_snake_case(k): v for k, v in record.items()}
        try:
            normalized["amount"] = float(normalized.get("amount") or 0)
        except (ValueError, TypeError):
            normalized["amount"] = 0.0
        clean.append(normalized)
    return clean, skipped`,
      },
      {
        id: 'py-e-03',
        prompt: 'Write `deduplicate(records, key)` that removes duplicates, keeping the LAST occurrence of each key value.',
        hint: 'Build a dict {record[key]: record} — later records overwrite earlier. Return list(seen.values()).',
        starterCode: `def deduplicate(records: list[dict], key: str) -> list[dict]:
    pass`,
        setupCode: `records = [
    {"id": 1, "name": "Alice v1",    "amount": 100},
    {"id": 2, "name": "Bob",         "amount": 200},
    {"id": 1, "name": "Alice v2",    "amount": 150},   # duplicate id=1, keep this one
    {"id": 3, "name": "Charlie",     "amount": 300},
    {"id": 2, "name": "Bob updated", "amount": 250},   # duplicate id=2, keep this one
]`,
        testCode: `result = deduplicate(records, "id")
assert len(result) == 3
alice = next(r for r in result if r["id"] == 1)
assert alice["name"] == "Alice v2", f"Should keep last: {alice['name']}"
bob   = next(r for r in result if r["id"] == 2)
assert bob["name"] == "Bob updated"
print(f"Deduplicated {len(records)} → {len(result)} records:")
for r in result:
    print(f"  id={r['id']}: {r['name']}  amount={r['amount']}")`,
        solution: `def deduplicate(records: list[dict], key: str) -> list[dict]:
    seen = {}
    for record in records:
        seen[record[key]] = record
    return list(seen.values())`,
      },
      {
        id: 'py-e-04',
        prompt: 'Write `extract_incremental(records, since)` that returns only records where `updated_at` is strictly after the `since` timestamp (both are ISO strings like "2024-03-01T00:00:00"). This simulates a watermark-based incremental load.',
        hint: 'ISO datetime strings sort correctly as plain strings. Filter: r["updated_at"] > since.',
        starterCode: `def extract_incremental(records: list[dict], since: str) -> list[dict]:
    pass`,
        setupCode: `records = [
    {"id": 1, "name": "Alice",   "updated_at": "2024-03-01T08:00:00", "value": 100},
    {"id": 2, "name": "Bob",     "updated_at": "2024-03-01T12:00:00", "value": 200},
    {"id": 3, "name": "Charlie", "updated_at": "2024-03-02T09:00:00", "value": 300},
    {"id": 4, "name": "Diana",   "updated_at": "2024-03-03T14:00:00", "value": 400},
    {"id": 5, "name": "Eve",     "updated_at": "2024-02-28T23:59:59", "value": 500},
]
# Last pipeline run watermark
last_run = "2024-03-01T12:00:00"
# Only ids 3 and 4 are strictly after the watermark`,
        testCode: `result = extract_incremental(records, last_run)
assert len(result) == 2, f"Expected 2, got {len(result)}"
ids = [r["id"] for r in result]
assert 3 in ids and 4 in ids, f"Wrong ids: {ids}"
assert 1 not in ids and 2 not in ids and 5 not in ids
print(f"Incremental extract: {len(result)} new records since {last_run}")
for r in result:
    print(f"  id={r['id']}  {r['name']}  updated={r['updated_at']}")`,
        solution: `def extract_incremental(records: list[dict], since: str) -> list[dict]:
    return [r for r in records if r["updated_at"] > since]`,
      },
      {
        id: 'py-e-05',
        prompt: 'Write `run_pipeline(raw_response)` that chains extract → transform → deduplicate and returns `{"processed": n, "skipped": n, "output": [records]}`. All three helper functions are provided in setup.',
        hint: 'Call extract(), then transform() which returns (clean, skipped), then deduplicate(clean, "id"). Build the summary dict.',
        starterCode: `def run_pipeline(raw_response: dict) -> dict:
    pass`,
        setupCode: `def extract(response):
    if not isinstance(response, dict) or "data" not in response:
        raise ValueError("Invalid response")
    return response["data"]

def to_snake_case(key):
    r = []
    for c in key:
        if c.isupper(): r.append('_'); r.append(c.lower())
        else: r.append(c)
    return ''.join(r)

def transform(records):
    clean, skipped = [], 0
    for rec in records:
        if not rec.get("id"):
            skipped += 1
            continue
        n = {to_snake_case(k): v for k, v in rec.items()}
        try:
            n["amount"] = float(n.get("amount") or 0)
        except (ValueError, TypeError):
            n["amount"] = 0.0
        clean.append(n)
    return clean, skipped

def deduplicate(records, key):
    seen = {}
    for r in records: seen[r[key]] = r
    return list(seen.values())

raw = {
    "status": "ok",
    "data": [
        {"id": 1, "customerName": "Alice",         "amount": "500"},
        {"id": 2, "customerName": "Bob",            "amount": "300"},
        {"customerName": "Ghost"},                   # no id → skip
        {"id": 1, "customerName": "Alice Updated",  "amount": "600"},  # dup
    ],
}`,
        testCode: `result = run_pipeline(raw)
assert "processed" in result and "skipped" in result and "output" in result
assert result["skipped"] == 1
assert len(result["output"]) == 2, f"Expected 2 after dedup, got {len(result['output'])}"
alice = next(r for r in result["output"] if r["id"] == 1)
assert alice["customer_name"] == "Alice Updated"
print(f"Pipeline: {result['processed']} processed, {result['skipped']} skipped")
for r in result["output"]:
    print(f"  id={r['id']}  {r['customer_name']}  amount={r['amount']}")`,
        solution: `def run_pipeline(raw_response: dict) -> dict:
    records = extract(raw_response)
    clean, skipped = transform(records)
    output = deduplicate(clean, "id")
    return {"processed": len(output), "skipped": skipped, "output": output}`,
      },
      {
        id: 'py-e-06',
        prompt: 'Write `safe_pipeline(records)` that processes each record with `process_record()` individually, catching errors per record without stopping the batch. Return `{"results": [...], "errors": [{"record": ..., "error": "..."}]}`.',
        hint: 'Wrap process_record(record) in try/except. Append to results on success, to errors on failure.',
        starterCode: `def process_record(record: dict) -> dict:
    if not isinstance(record.get("id"), int):
        raise ValueError("id must be an integer")
    if not isinstance(record.get("value"), (int, float)):
        raise ValueError("value must be a number")
    return {"id": record["id"], "value_doubled": record["value"] * 2}

def safe_pipeline(records: list[dict]) -> dict:
    pass`,
        setupCode: `records = [
    {"id": 1,     "value": 10},
    {"id": "bad", "value": 20},       # id not int → error
    {"id": 3,     "value": "text"},   # value not number → error
    {"id": 4,     "value": 40},
    {"id": 5,     "value": 0},
]`,
        testCode: `result = safe_pipeline(records)
assert len(result["results"]) == 3, f"Expected 3, got {len(result['results'])}"
assert len(result["errors"])  == 2, f"Expected 2, got {len(result['errors'])}"
assert result["results"][0] == {"id": 1, "value_doubled": 20}
for err in result["errors"]:
    assert "record" in err and "error" in err
print(f"{len(result['results'])} ok, {len(result['errors'])} errors")
for err in result["errors"]:
    print(f"  Error id={err['record'].get('id')}: {err['error']}")`,
        solution: `def process_record(record: dict) -> dict:
    if not isinstance(record.get("id"), int):
        raise ValueError("id must be an integer")
    if not isinstance(record.get("value"), (int, float)):
        raise ValueError("value must be a number")
    return {"id": record["id"], "value_doubled": record["value"] * 2}

def safe_pipeline(records: list[dict]) -> dict:
    results, errors = [], []
    for record in records:
        try:
            results.append(process_record(record))
        except Exception as e:
            errors.append({"record": record, "error": str(e)})
    return {"results": results, "errors": errors}`,
      },
    ],
  },

  // ─── TOPIC 5: Data Quality ────────────────────────────────────────────────────
  {
    id: 'py-quality',
    title: 'Data Quality',
    description: 'Schema validation, null rates, freshness checks, and reconciliation',
    lesson: {
      intro: 'Bad data in, bad insights out. The JD specifically asks for "data quality and integrity across large-scale ETL processes." These patterns — schema validation, null rate checks, freshness, and reconciliation — are the building blocks of a data quality layer.',
      concepts: [
        {
          title: 'Schema validation',
          body: 'Check that every record has the expected fields and types before it enters the warehouse. This catches issues at the source before they corrupt downstream models.',
          code: `SCHEMA = {"id": int, "name": str, "amount": float}

def validate_schema(record: dict, schema: dict) -> list[str]:
    errors = []
    for field, expected_type in schema.items():
        if field not in record:
            errors.append(f"Missing field: {field}")
        elif not isinstance(record[field], expected_type):
            errors.append(f"Wrong type for {field}: expected {expected_type.__name__}")
    return errors`,
        },
        {
          title: 'Null rate check',
          body: 'Detect columns with unexpectedly high null rates. In production, a sudden spike in nulls often means an upstream source changed its schema.',
          code: `import pandas as pd

def null_rates(df: pd.DataFrame) -> dict[str, float]:
    return {
        col: round(df[col].isna().sum() / len(df), 4)
        for col in df.columns
    }`,
        },
        {
          title: 'Freshness check',
          body: 'Validate that the most recent record is not older than the expected interval. A stale table means the pipeline is silently failing.',
          code: `from datetime import datetime, timedelta

def check_freshness(records: list[dict], max_age_hours: int = 24) -> bool:
    if not records:
        return False
    latest = max(r["updated_at"] for r in records)
    latest_dt = datetime.fromisoformat(latest)
    return datetime.utcnow() - latest_dt <= timedelta(hours=max_age_hours)`,
        },
        {
          title: 'Reconciliation',
          body: 'Compare a source and destination to verify no records were dropped or corrupted during the load. Count and ID mismatches both matter.',
          code: `def reconcile(source: list[dict], dest: list[dict], key: str) -> dict:
    src_ids  = {r[key] for r in source}
    dest_ids = {r[key] for r in dest}
    return {
        "missing_in_dest":   src_ids  - dest_ids,
        "extra_in_dest":     dest_ids - src_ids,
        "match": src_ids == dest_ids,
    }`,
        },
      ],
    },
    exercises: [
      {
        id: 'py-q-01',
        prompt: 'Write `validate_schema(record, schema)` where `schema` is a dict mapping field names to expected Python types (e.g. `{"id": int, "name": str}`). Return a list of error strings: one for each missing field and one for each field with the wrong type. Return an empty list if the record is valid.',
        hint: 'Iterate schema.items(). Check if field is in record, then check isinstance(record[field], expected_type).',
        starterCode: `def validate_schema(record: dict, schema: dict) -> list[str]:
    pass`,
        setupCode: `SCHEMA = {
    "id":     int,
    "name":   str,
    "amount": float,
    "active": bool,
}

r_valid   = {"id": 1, "name": "Alice", "amount": 99.9, "active": True}
r_missing = {"id": 2, "amount": 50.0, "active": False}      # missing "name"
r_bad_type = {"id": "3", "name": "Bob", "amount": 10.0, "active": True}  # id is str not int
r_multiple = {"id": 4, "name": 123, "active": "yes"}         # wrong type + missing field`,
        testCode: `errors_valid = validate_schema(r_valid, SCHEMA)
assert errors_valid == [], f"Valid record should have no errors: {errors_valid}"

errors_missing = validate_schema(r_missing, SCHEMA)
assert len(errors_missing) == 1
assert "name" in errors_missing[0].lower()

errors_type = validate_schema(r_bad_type, SCHEMA)
assert len(errors_type) == 1
assert "id" in errors_type[0].lower()

errors_multi = validate_schema(r_multiple, SCHEMA)
assert len(errors_multi) == 3, f"Expected 3 errors, got {len(errors_multi)}: {errors_multi}"

print("Schema validation working correctly!")
print(f"  valid: {errors_valid}")
print(f"  missing name: {errors_missing}")
print(f"  wrong id type: {errors_type}")
print(f"  multiple errors: {errors_multi}")`,
        solution: `def validate_schema(record: dict, schema: dict) -> list[str]:
    errors = []
    for field, expected_type in schema.items():
        if field not in record:
            errors.append(f"Missing field: {field}")
        elif not isinstance(record[field], expected_type):
            actual = type(record[field]).__name__
            errors.append(f"Wrong type for '{field}': expected {expected_type.__name__}, got {actual}")
    return errors`,
      },
      {
        id: 'py-q-02',
        prompt: 'Write `check_null_rates(df)` that returns a dict mapping column names to their null rate (0.0–1.0, rounded to 4 decimals). Then write `find_high_null_columns(df, threshold)` that returns a list of column names where the null rate exceeds the threshold.',
        hint: 'df[col].isna().sum() / len(df) gives the null rate. Wrap in a dict comprehension.',
        starterCode: `import pandas as pd

def check_null_rates(df: pd.DataFrame) -> dict[str, float]:
    pass

def find_high_null_columns(df: pd.DataFrame, threshold: float = 0.2) -> list[str]:
    pass`,
        setupCode: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "id":       [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "name":     ["A", None, "C", None, "E", None, "G", None, "I", "J"],
    "amount":   [1.0, 2.0, None, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0],
    "category": [None, None, None, None, None, "X", "Y", "Z", "W", "V"],
})
# null rates: id=0.0, name=0.4, amount=0.1, category=0.5`,
        testCode: `rates = check_null_rates(df)
assert rates["id"]       == 0.0,  f"id null rate: {rates['id']}"
assert rates["name"]     == 0.4,  f"name null rate: {rates['name']}"
assert rates["amount"]   == 0.1,  f"amount null rate: {rates['amount']}"
assert rates["category"] == 0.5,  f"category null rate: {rates['category']}"

high = find_high_null_columns(df, threshold=0.3)
assert set(high) == {"name", "category"}, f"High null cols: {high}"

low = find_high_null_columns(df, threshold=0.05)
assert set(low) == {"name", "amount", "category"}

print("Null rates:")
for col, rate in rates.items():
    flag = " ⚠" if rate > 0.3 else ""
    print(f"  {col}: {rate:.1%}{flag}")`,
        solution: `import pandas as pd

def check_null_rates(df: pd.DataFrame) -> dict[str, float]:
    return {col: round(df[col].isna().sum() / len(df), 4) for col in df.columns}

def find_high_null_columns(df: pd.DataFrame, threshold: float = 0.2) -> list[str]:
    rates = check_null_rates(df)
    return [col for col, rate in rates.items() if rate > threshold]`,
      },
      {
        id: 'py-q-03',
        prompt: 'Write `check_freshness(records, max_age_hours)` that returns True if the most recent `updated_at` timestamp in the records is within `max_age_hours` of the provided `now` datetime. Return False if records is empty or data is stale.',
        hint: 'max(r["updated_at"] for r in records) gives the latest. Parse with datetime.fromisoformat(). Compare with now - latest <= timedelta(hours=max_age_hours).',
        starterCode: `from datetime import datetime, timedelta

def check_freshness(records: list[dict], max_age_hours: int, now: datetime) -> bool:
    pass`,
        setupCode: `from datetime import datetime, timedelta

records_fresh = [
    {"id": 1, "updated_at": "2024-03-01T08:00:00"},
    {"id": 2, "updated_at": "2024-03-01T10:00:00"},
    {"id": 3, "updated_at": "2024-03-01T11:00:00"},
]
records_stale = [
    {"id": 1, "updated_at": "2024-02-28T08:00:00"},
    {"id": 2, "updated_at": "2024-02-27T10:00:00"},
]

# Simulated "now" for deterministic tests
now = datetime(2024, 3, 1, 12, 0, 0)  # 2024-03-01 12:00:00 UTC
# fresh records: latest is 11:00 → 1 hour ago → fresh within 24h
# stale records: latest is Feb 28 08:00 → 28 hours ago → stale`,
        testCode: `result_fresh = check_freshness(records_fresh, max_age_hours=24, now=now)
assert result_fresh == True, "Records from 1 hour ago should be fresh"

result_stale = check_freshness(records_stale, max_age_hours=24, now=now)
assert result_stale == False, "Records from 28 hours ago should be stale"

result_tight = check_freshness(records_fresh, max_age_hours=0, now=now)
assert result_tight == False, "max_age_hours=0 means nothing is fresh"

result_empty = check_freshness([], max_age_hours=24, now=now)
assert result_empty == False, "Empty records → not fresh"

print(f"Fresh (24h): {result_fresh}")
print(f"Stale (24h): {result_stale}")
print("Freshness checks passed!")`,
        solution: `from datetime import datetime, timedelta

def check_freshness(records: list[dict], max_age_hours: int, now: datetime) -> bool:
    if not records:
        return False
    latest_str = max(r["updated_at"] for r in records)
    latest     = datetime.fromisoformat(latest_str)
    return (now - latest) <= timedelta(hours=max_age_hours)`,
      },
      {
        id: 'py-q-04',
        prompt: 'Write `reconcile(source, destination, key)` that compares two lists of records and returns a report dict with: `source_count`, `dest_count`, `missing_in_dest` (IDs in source but not destination), `extra_in_dest` (IDs in destination but not source), and `match` (True if both sets are identical).',
        hint: 'Build sets of IDs for each list. missing_in_dest = src_ids - dest_ids. extra_in_dest = dest_ids - src_ids.',
        starterCode: `def reconcile(source: list[dict], destination: list[dict], key: str) -> dict:
    pass`,
        setupCode: `source = [
    {"id": 1, "name": "Alice",   "amount": 100},
    {"id": 2, "name": "Bob",     "amount": 200},
    {"id": 3, "name": "Charlie", "amount": 300},
    {"id": 4, "name": "Diana",   "amount": 400},
    {"id": 5, "name": "Eve",     "amount": 500},
]
destination = [
    {"id": 1, "name": "Alice",   "amount": 100},
    {"id": 2, "name": "Bob",     "amount": 200},
    {"id": 3, "name": "Charlie", "amount": 300},
    # id=4 missing → should appear in missing_in_dest
    {"id": 6, "name": "Frank",   "amount": 600},  # extra → extra_in_dest
]`,
        testCode: `result = reconcile(source, destination, "id")
assert result["source_count"] == 5
assert result["dest_count"]   == 4
assert result["missing_in_dest"] == {4},   f"Missing: {result['missing_in_dest']}"
assert result["extra_in_dest"]   == {6},   f"Extra: {result['extra_in_dest']}"
assert result["match"] == False

# Perfect match
perfect = reconcile(source, source, "id")
assert perfect["match"] == True
assert len(perfect["missing_in_dest"]) == 0
assert len(perfect["extra_in_dest"])   == 0

print("Reconciliation report:")
print(f"  Source: {result['source_count']}  Dest: {result['dest_count']}")
print(f"  Missing in dest: {result['missing_in_dest']}")
print(f"  Extra in dest:   {result['extra_in_dest']}")
print(f"  Match: {result['match']}")`,
        solution: `def reconcile(source: list[dict], destination: list[dict], key: str) -> dict:
    src_ids  = {r[key] for r in source}
    dest_ids = {r[key] for r in destination}
    return {
        "source_count":     len(source),
        "dest_count":       len(destination),
        "missing_in_dest":  src_ids - dest_ids,
        "extra_in_dest":    dest_ids - src_ids,
        "match":            src_ids == dest_ids,
    }`,
      },
      {
        id: 'py-q-05',
        prompt: 'Write `compute_stats(df, column)` that returns a quality stats dict for a numeric column: `count` (non-null), `null_count`, `null_rate` (0–1, 2 decimals), `min`, `max`, `mean` (2 decimals), and `outlier_ids` (list of ids where the value is more than 2 standard deviations from the mean).',
        hint: 'Use df[column].mean() and .std(). An outlier is where abs(value - mean) > 2 * std. Filter non-null rows first.',
        starterCode: `import pandas as pd

def compute_stats(df: pd.DataFrame, column: str) -> dict:
    pass`,
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "id":    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "value": [10, 12, 11, 13, 10, 12, 11, 100, None, 9],
    # id=8 (value=100) is a clear outlier, id=9 is null
})`,
        testCode: `result = compute_stats(df, "value")
assert result["count"]      == 9,   f"count: {result['count']}"
assert result["null_count"] == 1,   f"null_count: {result['null_count']}"
assert result["null_rate"]  == 0.10, f"null_rate: {result['null_rate']}"
assert result["min"]        == 9.0
assert result["max"]        == 100.0
assert 8 in result["outlier_ids"],  f"id=8 should be outlier: {result['outlier_ids']}"
assert len(result["outlier_ids"]) == 1, f"Only id=8 should be outlier: {result['outlier_ids']}"
print("Column stats:")
for k, v in result.items():
    print(f"  {k}: {v}")`,
        solution: `import pandas as pd

def compute_stats(df: pd.DataFrame, column: str) -> dict:
    col = df[column]
    non_null = df[col.notna()]
    mean = non_null[column].mean()
    std  = non_null[column].std()
    outliers = non_null[abs(non_null[column] - mean) > 2 * std]["id"].tolist()
    return {
        "count":       int(col.notna().sum()),
        "null_count":  int(col.isna().sum()),
        "null_rate":   round(col.isna().sum() / len(df), 2),
        "min":         float(col.min()),
        "max":         float(col.max()),
        "mean":        round(float(mean), 2),
        "outlier_ids": outliers,
    }`,
      },
    ],
  },

  // ─── TOPIC 6: Airflow Patterns ────────────────────────────────────────────────
  {
    id: 'py-airflow',
    title: 'Airflow Patterns',
    description: 'Task callables, DAG configs, retry logic, and idempotency patterns',
    lesson: {
      intro: 'Airflow orchestrates Python functions as tasks in a DAG. You write plain Python — Airflow handles scheduling, retries, and dependencies. The most important skill is writing task callables that are idempotent, independently testable, and resilient to transient failures.',
      concepts: [
        {
          title: 'Task callable',
          body: 'A task callable is just a Python function. In Airflow it goes inside a PythonOperator or is decorated with @task. Write it so it can run independently and be tested without Airflow.',
          code: `def extract_customers(execution_date: str, **context) -> list[dict]:
    # This function would be called by Airflow with execution_date injected
    return [c for c in CUSTOMERS if c["created_at"] >= execution_date]`,
        },
        {
          title: 'Idempotency',
          body: 'An idempotent task produces the same result whether it runs once or ten times. This is critical because Airflow retries failed tasks. Always check if work is already done before doing it.',
          code: `def load_to_table(records: list[dict], table: str, run_date: str) -> int:
    # Check if already loaded for this date
    if already_loaded(table, run_date):
        print(f"Already loaded {run_date}, skipping")
        return 0
    # ... do the load
    return len(records)`,
        },
        {
          title: 'TaskFlow API (Airflow 2.x)',
          body: 'Use @dag and @task decorators. Return values are automatically passed to the next task via XCom. No need to push/pull XComs manually.',
          code: `from airflow.decorators import dag, task
from datetime import datetime

@dag(schedule="@daily", start_date=datetime(2024, 1, 1))
def customer_etl():
    @task
    def extract(execution_date=None) -> list[dict]:
        return fetch_records(since=execution_date)

    @task
    def transform(raw: list[dict]) -> list[dict]:
        return [clean(r) for r in raw]

    @task
    def load(clean: list[dict]) -> int:
        return write_to_bq(clean)

    load(transform(extract()))`,
        },
        {
          title: 'Retry wrapper',
          body: 'External API calls fail transiently. Airflow has built-in retries (retries=3) at the DAG level, but wrapping individual API calls with retry logic gives finer control.',
          code: `def retry(func, max_attempts=3, exceptions=(Exception,)):
    last_err = None
    for _ in range(max_attempts):
        try:
            return func()
        except exceptions as e:
            last_err = e
    raise last_err`,
        },
      ],
    },
    exercises: [
      {
        id: 'py-a-01',
        prompt: 'Write `extract_customers(execution_date)` — a task callable that returns all customers whose `created_at` is on or after `execution_date` (both ISO date strings). This simulates a daily Airflow task that extracts only new customers.',
        hint: 'ISO date strings sort correctly as plain strings: c["created_at"] >= execution_date',
        starterCode: `def extract_customers(execution_date: str) -> list[dict]:
    pass`,
        setupCode: `CUSTOMERS = [
    {"id": 1, "name": "Alice",   "created_at": "2024-01-10", "spend": 2500},
    {"id": 2, "name": "Bob",     "created_at": "2024-02-05", "spend":  800},
    {"id": 3, "name": "Charlie", "created_at": "2024-02-20", "spend": 1500},
    {"id": 4, "name": "Diana",   "created_at": "2024-03-01", "spend":  300},
    {"id": 5, "name": "Eve",     "created_at": "2024-03-15", "spend": 3200},
]`,
        testCode: `feb = extract_customers("2024-02-01")
assert len(feb) == 4, f"Expected 4 from Feb 1, got {len(feb)}"
ids = [r["id"] for r in feb]
assert 1 not in ids, "Alice (Jan) should be excluded"
assert 2 in ids

mar = extract_customers("2024-03-01")
assert len(mar) == 2, f"Expected 2 from Mar 1, got {len(mar)}"
print(f"From 2024-02-01: {len(feb)} customers")
for c in feb:
    print(f"  {c['name']} ({c['created_at']})")`,
        solution: `def extract_customers(execution_date: str) -> list[dict]:
    return [c for c in CUSTOMERS if c["created_at"] >= execution_date]`,
      },
      {
        id: 'py-a-02',
        prompt: 'Simulate the Airflow TaskFlow XCom pattern: write `extract()`, `transform(raw)`, and `load(clean)` where each return value feeds the next. Then write `run_dag()` that chains them and returns the count of loaded records.',
        hint: 'extract() returns RAW_DATA, transform(raw) filters records with a valid amount, load(clean) returns len(clean).',
        starterCode: `def extract() -> list[dict]:
    pass

def transform(raw: list[dict]) -> list[dict]:
    # Keep only records where "amount" is not None
    pass

def load(clean: list[dict]) -> int:
    # Simulate loading — return count of records loaded
    pass

def run_dag() -> int:
    pass`,
        setupCode: `RAW_DATA = [
    {"id": 1, "name": "Alice",   "amount": 100.0},
    {"id": 2, "name": "Bob",     "amount": None},   # invalid → filter out
    {"id": 3, "name": "Charlie", "amount": 200.0},
    {"id": 4, "name": "Diana"},                      # no amount → filter out
    {"id": 5, "name": "Eve",     "amount": 300.0},
]`,
        testCode: `raw = extract()
assert raw == RAW_DATA

clean = transform(raw)
assert len(clean) == 3, f"Expected 3 valid records, got {len(clean)}"

count = load(clean)
assert count == 3

final = run_dag()
assert final == 3
print(f"DAG complete: {final} records loaded")`,
        solution: `def extract() -> list[dict]:
    return RAW_DATA

def transform(raw: list[dict]) -> list[dict]:
    return [r for r in raw if r.get("amount") is not None]

def load(clean: list[dict]) -> int:
    return len(clean)

def run_dag() -> int:
    raw   = extract()
    clean = transform(raw)
    return load(clean)`,
      },
      {
        id: 'py-a-03',
        prompt: 'Write an idempotent `load_partition(records, partition_date, loaded_dates)` function. If `partition_date` is already in `loaded_dates`, return `{"status": "skipped", "count": 0}`. Otherwise add it to `loaded_dates` and return `{"status": "loaded", "count": len(records)}`.',
        hint: 'Check if partition_date in loaded_dates. If yes, return skipped. Otherwise, loaded_dates.add(partition_date) and return loaded.',
        starterCode: `def load_partition(records: list[dict], partition_date: str, loaded_dates: set) -> dict:
    pass`,
        setupCode: `records = [{"id": 1, "value": 100}, {"id": 2, "value": 200}, {"id": 3, "value": 300}]

# Simulates state stored between runs (e.g., in a metadata table)
loaded = set()
# First call: 2024-03-01 not loaded yet
# Second call: 2024-03-01 already loaded → skip
# Third call: 2024-03-02 not loaded → load`,
        testCode: `records = [{"id": 1, "value": 100}, {"id": 2, "value": 200}, {"id": 3, "value": 300}]
loaded = set()

r1 = load_partition(records, "2024-03-01", loaded)
assert r1 == {"status": "loaded", "count": 3}, f"First run: {r1}"
assert "2024-03-01" in loaded

r2 = load_partition(records, "2024-03-01", loaded)
assert r2 == {"status": "skipped", "count": 0}, f"Second run (dup): {r2}"

r3 = load_partition(records, "2024-03-02", loaded)
assert r3 == {"status": "loaded", "count": 3}, f"New date: {r3}"
assert len(loaded) == 2

print(f"Run 1: {r1}")
print(f"Run 2 (retry): {r2}")
print(f"Run 3 (new date): {r3}")`,
        solution: `def load_partition(records: list[dict], partition_date: str, loaded_dates: set) -> dict:
    if partition_date in loaded_dates:
        return {"status": "skipped", "count": 0}
    loaded_dates.add(partition_date)
    return {"status": "loaded", "count": len(records)}`,
      },
      {
        id: 'py-a-04',
        prompt: 'Write `retry(func, max_attempts=3, exceptions=(Exception,))` that calls `func()` up to `max_attempts` times, catching only exceptions in `exceptions`. If all attempts fail, raise the last exception. If an exception NOT in `exceptions` is raised, let it propagate immediately.',
        hint: 'Track last_err. Loop range(max_attempts), try func(), except exceptions as e: last_err = e. After loop: raise last_err.',
        starterCode: `def retry(func, max_attempts: int = 3, exceptions: tuple = (Exception,)):
    pass`,
        setupCode: `_calls = 0

def flaky_api():
    global _calls
    _calls += 1
    if _calls < 3:
        raise ConnectionError(f"Timeout on attempt {_calls}")
    return {"status": "ok", "records": 42}

def always_fails():
    raise ValueError("Service unavailable")`,
        testCode: `# Succeeds on 3rd attempt
_calls = 0
result = retry(flaky_api, max_attempts=3)
assert result == {"status": "ok", "records": 42}
assert _calls == 3, f"Expected 3 calls, got {_calls}"

# Raises after exhausting attempts
try:
    retry(always_fails, max_attempts=2)
    assert False, "Should raise ValueError"
except ValueError:
    pass

# Does NOT catch ConnectionError when only TimeoutError is specified
_calls = 0
try:
    retry(flaky_api, max_attempts=5, exceptions=(TimeoutError,))
    assert False, "Should propagate ConnectionError"
except ConnectionError:
    pass

print(f"retry() works: succeeded after {_calls} attempts, fails and propagates correctly")`,
        solution: `def retry(func, max_attempts: int = 3, exceptions: tuple = (Exception,)):
    last_err = None
    for _ in range(max_attempts):
        try:
            return func()
        except exceptions as e:
            last_err = e
    raise last_err`,
      },
      {
        id: 'py-a-05',
        prompt: 'Write `build_dag_config(dag_id, schedule, tasks)` that validates inputs and returns a config dict. Raise ValueError if: dag_id is empty, schedule is not a preset (starts with "@") or a valid 5-part cron expression, or tasks is an empty list.',
        hint: 'Check schedule.startswith("@") or len(schedule.split()) == 5. Check bool(dag_id). Check bool(tasks).',
        starterCode: `def build_dag_config(dag_id: str, schedule: str, tasks: list[str]) -> dict:
    pass`,
        setupCode: `c_valid   = ("customer_etl",  "@daily",      ["extract", "transform", "load"])
c_cron    = ("sales_report",  "0 6 * * *",   ["query", "export"])
c_bad_id  = ("",              "@daily",       ["extract"])
c_bad_sch = ("test_dag",      "every_day",    ["extract"])
c_no_task = ("test_dag",      "@hourly",      [])`,
        testCode: `cfg = build_dag_config(*c_valid)
assert cfg["dag_id"]     == "customer_etl"
assert cfg["task_count"] == 3

cfg2 = build_dag_config(*c_cron)
assert cfg2["task_count"] == 2

for bad in [c_bad_id, c_bad_sch, c_no_task]:
    try:
        build_dag_config(*bad)
        assert False, f"Should raise ValueError for {bad[0]}"
    except ValueError as e:
        pass

print(f"Valid config: {cfg}")
print(f"Cron config:  {cfg2}")
print("All invalid inputs correctly rejected!")`,
        solution: `def build_dag_config(dag_id: str, schedule: str, tasks: list[str]) -> dict:
    if not dag_id:
        raise ValueError("dag_id must be a non-empty string")
    if not schedule or (not schedule.startswith("@") and len(schedule.split()) != 5):
        raise ValueError("schedule must be a preset (@daily) or 5-part cron expression")
    if not tasks:
        raise ValueError("tasks must be a non-empty list")
    return {"dag_id": dag_id, "schedule": schedule, "tasks": tasks, "task_count": len(tasks)}`,
      },
    ],
  },
];
