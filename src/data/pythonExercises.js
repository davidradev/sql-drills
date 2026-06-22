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

  // ─── TOPIC 7: Glovo Interview Prep ───────────────────────────────────────────
  {
    id: 'py-glovo',
    title: 'Glovo Interview Prep',
    description: 'OOP sprint, Pandas data manipulation, and code-quality review — the 3 phases of the Glovo live coding interview',
    lesson: {
      intro: 'The Glovo live interview is 60 minutes across three phases: (1) a Python OOP sprint with a food-delivery problem, (2) fast-paced Pandas and SQL data manipulation, and (3) a collaborative code-review where you spot smells and refactor. These exercises cover all three.',
      concepts: [
        {
          title: 'OOP in the interview: class with validation',
          body: 'Interviewers want to see clean __init__ with guard clauses, descriptive attribute names, and a @property for derived values. Define VALID_STATUSES as a class constant so it is not re-created per instance.',
          code: `from typing import Optional
from datetime import datetime

class Order:
    VALID_STATUSES = {"pending", "delivered", "cancelled"}

    def __init__(self, order_id: str, total: float, status: str,
                 ordered_at: str, delivered_at: Optional[str] = None):
        if not order_id:
            raise ValueError("order_id cannot be empty")
        if total < 0:
            raise ValueError("total cannot be negative")
        if status not in self.VALID_STATUSES:
            raise ValueError(f"invalid status: {status}")
        self.order_id    = order_id
        self.total       = total
        self.status      = status
        self.ordered_at  = datetime.fromisoformat(ordered_at)
        self.delivered_at = datetime.fromisoformat(delivered_at) if delivered_at else None

    @property
    def delivery_minutes(self) -> Optional[int]:
        if self.delivered_at is None:
            return None
        return int((self.delivered_at - self.ordered_at).total_seconds() / 60)`,
        },
        {
          title: 'Pandas: compute time deltas',
          body: 'Convert string columns to datetime with pd.to_datetime(). Subtract to get a timedelta Series. Call .dt.total_seconds() / 60 for minutes. NaT values (cancelled orders) automatically become NaN.',
          code: `import pandas as pd
df["ordered_at"]   = pd.to_datetime(df["ordered_at"])
df["delivered_at"] = pd.to_datetime(df["delivered_at"])   # NaT for nulls
df["delivery_min"] = (df["delivered_at"] - df["ordered_at"]).dt.total_seconds() / 60`,
        },
        {
          title: 'Pandas: groupby + agg in one step',
          body: 'Use named aggregations with .agg(alias=(col, func)) to produce a clean output DataFrame with descriptive column names. Chain .reset_index() to flatten the MultiIndex.',
          code: `summary = (
    df[df["status"] == "delivered"]
    .groupby("city")
    .agg(
        orders        = ("id",            "count"),
        revenue       = ("total_amount",  "sum"),
        avg_del_min   = ("delivery_min",  "mean"),
    )
    .round(1)
    .reset_index()
)`,
        },
        {
          title: 'Code smells to know by heart',
          body: 'The code review section tests pattern recognition. Know the most common smells: SQL injection via f-strings, hardcoded secrets, bare except, god functions, mutable global state, and missing return values.',
          code: `# BAD — 5 smells in 8 lines
SECRET = "admin123"           # hardcoded credential
cache  = []                   # mutable global

def process(x):               # non-descriptive name
    try:
        cur.execute(f"SELECT * FROM orders WHERE city='{x}'")  # SQL injection
        for row in cur: cache.append(row)                      # mutates global
        print(sum(r[4] for r in cache))                        # side-effect, magic index
    except: pass               # bare except, silent failure`,
        },
        {
          title: 'SOLID in one paragraph',
          body: 'S — one class, one reason to change. O — extend behaviour without modifying existing code. L — subclasses must be substitutable. I — small, focused interfaces. D — depend on abstractions, not concretions. In interviews, S and D are the most commonly tested.',
          code: `# Violates SRP: this class fetches, transforms, AND sends an alert
class OrderProcessor:
    def run(self):
        data = requests.get(API_URL).json()   # fetch
        total = sum(r["amount"] for r in data) # transform
        send_slack(f"Revenue: {total}")         # notify

# Fix: split into Fetcher, Transformer, Notifier`,
        },
      ],
    },
    exercises: [
      // ── Phase 1: OOP Sprint ──────────────────────────────────────────────────
      {
        id: 'gl-py-01',
        prompt: 'Write an `Order` class. `__init__` accepts: `order_id` (str), `total_amount` (float), `status` (str), `ordered_at` (ISO datetime str), `delivered_at` (optional ISO str, default None). Raise `ValueError` for: empty order_id, negative total_amount, or status not in {"delivered","cancelled","pending"}. Store `ordered_at` and `delivered_at` as `datetime` objects (use `datetime.fromisoformat`). Add a `delivery_minutes` property that returns the integer minutes between ordered_at and delivered_at, or `None` for non-delivered orders.',
        hint: 'Guard clauses first. Use `datetime.fromisoformat(s) if s else None` for delivered_at. In the property: `int((self.delivered_at - self.ordered_at).total_seconds() / 60)`.',
        starterCode: `from datetime import datetime
from typing import Optional

class Order:
    VALID_STATUSES = {"delivered", "cancelled", "pending"}

    def __init__(self, order_id: str, total_amount: float, status: str,
                 ordered_at: str, delivered_at: Optional[str] = None):
        pass

    @property
    def delivery_minutes(self) -> Optional[int]:
        pass`,
        setupCode: `from datetime import datetime
from typing import Optional`,
        testCode: `o1 = Order("GO001", 22.50, "delivered", "2024-03-01 12:30:00", "2024-03-01 12:55:00")
assert o1.order_id       == "GO001"
assert o1.total_amount   == 22.50
assert o1.status         == "delivered"
assert o1.delivery_minutes == 25, f"Expected 25 min, got {o1.delivery_minutes}"

o2 = Order("GO007", 19.00, "cancelled", "2024-03-04 13:00:00")
assert o2.delivery_minutes is None, "Cancelled order: delivery_minutes must be None"
assert isinstance(o2.ordered_at, datetime)

try:
    Order("", 19.00, "delivered", "2024-03-01 12:00:00")
    assert False, "Empty order_id should raise ValueError"
except ValueError:
    pass

try:
    Order("GO001", -5.0, "delivered", "2024-03-01 12:00:00")
    assert False, "Negative amount should raise ValueError"
except ValueError:
    pass

try:
    Order("GO001", 19.00, "refunded", "2024-03-01 12:00:00")
    assert False, "Invalid status should raise ValueError"
except ValueError:
    pass

Order("GO002", 0.0, "pending", "2024-03-01 12:00:00")  # zero amount is valid
print(f"Order {o1.order_id}: {o1.delivery_minutes} min, {o1.total_amount} EUR")
print(f"Order {o2.order_id}: status={o2.status}, delivery_minutes={o2.delivery_minutes}")`,
        solution: `from datetime import datetime
from typing import Optional

class Order:
    VALID_STATUSES = {"delivered", "cancelled", "pending"}

    def __init__(self, order_id: str, total_amount: float, status: str,
                 ordered_at: str, delivered_at: Optional[str] = None):
        if not order_id:
            raise ValueError("order_id cannot be empty")
        if total_amount < 0:
            raise ValueError("total_amount cannot be negative")
        if status not in self.VALID_STATUSES:
            raise ValueError(f"status must be one of {self.VALID_STATUSES}, got '{status}'")
        self.order_id     = order_id
        self.total_amount = total_amount
        self.status       = status
        self.ordered_at   = datetime.fromisoformat(ordered_at)
        self.delivered_at = datetime.fromisoformat(delivered_at) if delivered_at else None

    @property
    def delivery_minutes(self) -> Optional[int]:
        if self.delivered_at is None:
            return None
        return int((self.delivered_at - self.ordered_at).total_seconds() / 60)`,
      },
      {
        id: 'gl-py-02',
        prompt: 'Write an `OrderBatch` class that holds a list of `Order` objects. Implement: `add(order)` to append one order, `total_revenue(status="delivered")` that returns the sum of total_amount for orders with that status, `average_delivery_minutes()` that returns the float average delivery time across delivered orders (or None if there are none), and `__len__` returning the total number of orders. The `Order` class from gl-py-01 is available.',
        hint: 'Store orders in self._orders = []. For average_delivery_minutes: filter to orders where delivery_minutes is not None, then sum/len. Return None if the filtered list is empty.',
        starterCode: `from typing import Optional

class OrderBatch:
    def __init__(self):
        self._orders: list = []

    def add(self, order) -> None:
        pass

    def total_revenue(self, status: str = "delivered") -> float:
        pass

    def average_delivery_minutes(self) -> Optional[float]:
        pass

    def __len__(self) -> int:
        pass`,
        setupCode: `from datetime import datetime
from typing import Optional

class Order:
    VALID_STATUSES = {"delivered", "cancelled", "pending"}
    def __init__(self, order_id, total_amount, status, ordered_at, delivered_at=None):
        if not order_id: raise ValueError("order_id cannot be empty")
        if total_amount < 0: raise ValueError("total_amount cannot be negative")
        if status not in self.VALID_STATUSES: raise ValueError(f"invalid status: {status}")
        self.order_id     = order_id
        self.total_amount = total_amount
        self.status       = status
        self.ordered_at   = datetime.fromisoformat(ordered_at)
        self.delivered_at = datetime.fromisoformat(delivered_at) if delivered_at else None
    @property
    def delivery_minutes(self):
        if self.delivered_at is None: return None
        return int((self.delivered_at - self.ordered_at).total_seconds() / 60)`,
        testCode: `batch = OrderBatch()
assert len(batch) == 0

o1 = Order("GO001", 22.50, "delivered",  "2024-03-01 12:30:00", "2024-03-01 12:55:00")  # 25 min
o2 = Order("GO002", 18.90, "delivered",  "2024-03-01 20:00:00", "2024-03-01 20:35:00")  # 35 min
o3 = Order("GO007", 19.00, "cancelled",  "2024-03-04 13:00:00")
o4 = Order("GO008", 27.00, "delivered",  "2024-03-04 20:00:00", "2024-03-04 20:40:00")  # 40 min

for o in [o1, o2, o3, o4]:
    batch.add(o)

assert len(batch) == 4
assert batch.total_revenue()              == 22.50 + 18.90 + 27.00, f"Delivered revenue wrong"
assert batch.total_revenue("cancelled")   == 19.00, "Cancelled revenue wrong"
assert batch.total_revenue("pending")     == 0.0,   "No pending orders"

avg = batch.average_delivery_minutes()
assert avg is not None
assert round(avg, 4) == round((25 + 35 + 40) / 3, 4), f"Expected {(25+35+40)/3}, got {avg}"

empty_batch = OrderBatch()
assert empty_batch.average_delivery_minutes() is None

print(f"Batch: {len(batch)} orders")
print(f"Delivered revenue: {batch.total_revenue():.2f} EUR")
print(f"Avg delivery: {batch.average_delivery_minutes():.1f} min")`,
        solution: `from typing import Optional

class OrderBatch:
    def __init__(self):
        self._orders: list = []

    def add(self, order) -> None:
        self._orders.append(order)

    def total_revenue(self, status: str = "delivered") -> float:
        return sum(o.total_amount for o in self._orders if o.status == status)

    def average_delivery_minutes(self) -> Optional[float]:
        times = [o.delivery_minutes for o in self._orders if o.delivery_minutes is not None]
        return sum(times) / len(times) if times else None

    def __len__(self) -> int:
        return len(self._orders)`,
      },
      {
        id: 'gl-py-03',
        prompt: 'Add a `@classmethod from_dict(cls, data)` to the `Order` class that constructs an Order from a dict with keys: `"id"`, `"total_amount"`, `"status"`, `"ordered_at"`, and optionally `"delivered_at"`. The full Order class (without from_dict) is provided in setup — just write the classmethod.',
        hint: '@classmethod takes cls as first arg. Return cls(order_id=data["id"], ..., delivered_at=data.get("delivered_at")). Use .get() for optional keys.',
        starterCode: `@classmethod
def from_dict(cls, data: dict):
    pass`,
        setupCode: `from datetime import datetime
from typing import Optional

class Order:
    VALID_STATUSES = {"delivered", "cancelled", "pending"}
    def __init__(self, order_id, total_amount, status, ordered_at, delivered_at=None):
        if not order_id: raise ValueError("order_id cannot be empty")
        if total_amount < 0: raise ValueError("total_amount cannot be negative")
        if status not in self.VALID_STATUSES: raise ValueError(f"invalid status: {status}")
        self.order_id     = order_id
        self.total_amount = total_amount
        self.status       = status
        self.ordered_at   = datetime.fromisoformat(ordered_at)
        self.delivered_at = datetime.fromisoformat(delivered_at) if delivered_at else None
    @property
    def delivery_minutes(self):
        if self.delivered_at is None: return None
        return int((self.delivered_at - self.ordered_at).total_seconds() / 60)

Order.from_dict = from_dict.__get__(None, Order)  # injected below`,
        testCode: `import types

# Inject the classmethod into Order for testing
Order.from_dict = classmethod(lambda cls, data: from_dict(data))

delivered_dict = {
    "id": "GO001", "total_amount": 22.50, "status": "delivered",
    "ordered_at": "2024-03-01 12:30:00", "delivered_at": "2024-03-01 12:55:00"
}
cancelled_dict = {
    "id": "GO007", "total_amount": 19.00, "status": "cancelled",
    "ordered_at": "2024-03-04 13:00:00"
}

o1 = from_dict(delivered_dict)
assert o1.order_id       == "GO001"
assert o1.total_amount   == 22.50
assert o1.status         == "delivered"
assert o1.delivery_minutes == 25

o2 = from_dict(cancelled_dict)
assert o2.order_id         == "GO007"
assert o2.delivered_at     is None
assert o2.delivery_minutes is None

try:
    from_dict({"id": "", "total_amount": 5.0, "status": "delivered", "ordered_at": "2024-03-01 12:00:00"})
    assert False, "Should propagate ValueError from Order.__init__"
except ValueError:
    pass

print(f"from_dict: {o1.order_id} {o1.delivery_minutes}min | {o2.order_id} {o2.status}")`,
        solution: `@classmethod
def from_dict(cls, data: dict):
    return cls(
        order_id     = data["id"],
        total_amount = data["total_amount"],
        status       = data["status"],
        ordered_at   = data["ordered_at"],
        delivered_at = data.get("delivered_at"),
    )`,
      },
      // ── Phase 2: Pandas ──────────────────────────────────────────────────────
      {
        id: 'gl-py-04',
        prompt: 'Write `add_delivery_minutes(df)` that takes a DataFrame with string columns `ordered_at` and `delivered_at` (NULL for cancelled), converts both to datetime, and adds a `delivery_minutes` column (float, NaN for cancelled). Return the modified copy.',
        hint: 'pd.to_datetime() converts strings and handles None → NaT. Subtract datetimes to get a timedelta Series, then .dt.total_seconds() / 60.',
        starterCode: `import pandas as pd

def add_delivery_minutes(df: pd.DataFrame) -> pd.DataFrame:
    pass`,
        setupCode: `import pandas as pd

orders = pd.DataFrame([
    {"id": "GO001", "city": "Madrid",    "ordered_at": "2024-03-01 12:30:00", "delivered_at": "2024-03-01 12:55:00", "total_amount": 22.50, "status": "delivered"},
    {"id": "GO002", "city": "Madrid",    "ordered_at": "2024-03-01 20:00:00", "delivered_at": "2024-03-01 20:35:00", "total_amount": 18.90, "status": "delivered"},
    {"id": "GO007", "city": "Madrid",    "ordered_at": "2024-03-04 13:00:00", "delivered_at": None,                   "total_amount": 19.00, "status": "cancelled"},
    {"id": "GO008", "city": "Madrid",    "ordered_at": "2024-03-04 20:00:00", "delivered_at": "2024-03-04 20:40:00", "total_amount": 27.00, "status": "delivered"},
    {"id": "GO011", "city": "Barcelona", "ordered_at": "2024-03-01 13:00:00", "delivered_at": "2024-03-01 13:25:00", "total_amount": 34.00, "status": "delivered"},
    {"id": "GO014", "city": "Barcelona", "ordered_at": "2024-03-02 20:00:00", "delivered_at": None,                   "total_amount": 42.00, "status": "cancelled"},
])`,
        testCode: `result = add_delivery_minutes(orders)
assert "delivery_minutes" in result.columns, "Missing delivery_minutes column"
assert result["ordered_at"].dtype == "datetime64[ns]", "ordered_at must be datetime"
assert result["delivered_at"].dtype == "datetime64[ns]", "delivered_at must be datetime"

assert result.loc[result["id"]=="GO001","delivery_minutes"].values[0] == 25.0, "GO001 should be 25 min"
assert result.loc[result["id"]=="GO002","delivery_minutes"].values[0] == 35.0, "GO002 should be 35 min"
assert result.loc[result["id"]=="GO008","delivery_minutes"].values[0] == 40.0, "GO008 should be 40 min"
assert result.loc[result["id"]=="GO011","delivery_minutes"].values[0] == 25.0, "GO011 should be 25 min"

import math
cancelled_go007 = result.loc[result["id"]=="GO007","delivery_minutes"].values[0]
cancelled_go014 = result.loc[result["id"]=="GO014","delivery_minutes"].values[0]
assert math.isnan(cancelled_go007), "Cancelled order GO007 must have NaN delivery_minutes"
assert math.isnan(cancelled_go014), "Cancelled order GO014 must have NaN delivery_minutes"

assert len(result) == len(orders), "Row count must not change"
print("delivery_minutes column added:")
print(result[["id", "status", "delivery_minutes"]].to_string(index=False))`,
        solution: `import pandas as pd

def add_delivery_minutes(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["ordered_at"]       = pd.to_datetime(df["ordered_at"])
    df["delivered_at"]     = pd.to_datetime(df["delivered_at"])
    df["delivery_minutes"] = (df["delivered_at"] - df["ordered_at"]).dt.total_seconds() / 60
    return df`,
      },
      {
        id: 'gl-py-05',
        prompt: 'Write `city_summary(df)` that takes the orders DataFrame (which already has a `delivery_minutes` column from gl-py-04). Return a DataFrame with one row per city showing: `city`, `orders` (total count), `revenue` (sum of total_amount for delivered only), and `avg_delivery_min` (mean delivery_minutes for delivered only, rounded to 1 decimal). Sort by city.',
        hint: 'Filter to delivered for revenue and avg. Use groupby("city").agg() with named aggregations. Then join or merge the total order count separately, or compute all in one groupby on the full df using conditional logic.',
        starterCode: `import pandas as pd

def city_summary(df: pd.DataFrame) -> pd.DataFrame:
    pass`,
        setupCode: `import pandas as pd

orders = pd.DataFrame([
    {"id": "GO001", "city": "Madrid",    "ordered_at": "2024-03-01 12:30:00", "delivered_at": "2024-03-01 12:55:00", "total_amount": 22.50, "status": "delivered",  "delivery_minutes": 25.0},
    {"id": "GO002", "city": "Madrid",    "ordered_at": "2024-03-01 20:00:00", "delivered_at": "2024-03-01 20:35:00", "total_amount": 18.90, "status": "delivered",  "delivery_minutes": 35.0},
    {"id": "GO003", "city": "Madrid",    "ordered_at": "2024-03-02 13:00:00", "delivered_at": "2024-03-02 13:28:00", "total_amount": 16.00, "status": "delivered",  "delivery_minutes": 28.0},
    {"id": "GO007", "city": "Madrid",    "ordered_at": "2024-03-04 13:00:00", "delivered_at": None,                   "total_amount": 19.00, "status": "cancelled",  "delivery_minutes": float("nan")},
    {"id": "GO010", "city": "Madrid",    "ordered_at": "2024-03-05 20:00:00", "delivered_at": None,                   "total_amount": 35.00, "status": "cancelled",  "delivery_minutes": float("nan")},
    {"id": "GO011", "city": "Barcelona", "ordered_at": "2024-03-01 13:00:00", "delivered_at": "2024-03-01 13:25:00", "total_amount": 34.00, "status": "delivered",  "delivery_minutes": 25.0},
    {"id": "GO012", "city": "Barcelona", "ordered_at": "2024-03-01 20:00:00", "delivered_at": "2024-03-01 20:28:00", "total_amount": 19.50, "status": "delivered",  "delivery_minutes": 28.0},
    {"id": "GO014", "city": "Barcelona", "ordered_at": "2024-03-02 20:00:00", "delivered_at": None,                   "total_amount": 42.00, "status": "cancelled",  "delivery_minutes": float("nan")},
])`,
        testCode: `result = city_summary(orders)
assert list(result.columns) == ["city", "orders", "revenue", "avg_delivery_min"], f"Wrong columns: {list(result.columns)}"
assert len(result) == 2, f"Expected 2 rows (Madrid, Barcelona), got {len(result)}"

bcn = result[result["city"] == "Barcelona"].iloc[0]
mad = result[result["city"] == "Madrid"].iloc[0]

assert bcn["orders"]           == 3,    f"Barcelona: 3 total orders, got {bcn['orders']}"
assert bcn["revenue"]          == 53.50, f"Barcelona revenue: 34+19.5=53.5, got {bcn['revenue']}"
assert bcn["avg_delivery_min"] == 26.5, f"Barcelona avg: (25+28)/2=26.5, got {bcn['avg_delivery_min']}"

assert mad["orders"]           == 5,    f"Madrid: 5 total orders, got {mad['orders']}"
assert mad["revenue"]          == 57.40, f"Madrid revenue: 22.5+18.9+16=57.4, got {mad['revenue']}"
assert mad["avg_delivery_min"] == round((25+35+28)/3, 1), f"Madrid avg wrong: {mad['avg_delivery_min']}"

print(result.to_string(index=False))`,
        solution: `import pandas as pd

def city_summary(df: pd.DataFrame) -> pd.DataFrame:
    delivered = df[df["status"] == "delivered"]
    counts = df.groupby("city").size().rename("orders")
    stats  = delivered.groupby("city").agg(
        revenue          = ("total_amount",    "sum"),
        avg_delivery_min = ("delivery_minutes", "mean"),
    ).round(1)
    result = counts.to_frame().join(stats).reset_index().sort_values("city")
    return result[["city", "orders", "revenue", "avg_delivery_min"]]`,
      },
      {
        id: 'gl-py-06',
        prompt: 'Write `revenue_by_category(orders_df, restaurants_df)` that merges delivered orders with restaurants on `restaurant_id`, then returns a DataFrame with `category` and `revenue` (SUM of total_amount), sorted by revenue descending.',
        hint: 'Filter orders to delivered first. Merge on left_on="restaurant_id", right_on="id". GroupBy category and sum total_amount. Sort descending.',
        starterCode: `import pandas as pd

def revenue_by_category(orders_df: pd.DataFrame, restaurants_df: pd.DataFrame) -> pd.DataFrame:
    pass`,
        setupCode: `import pandas as pd

orders_df = pd.DataFrame([
    {"id": "GO001", "restaurant_id": 1, "total_amount": 22.50, "status": "delivered"},
    {"id": "GO002", "restaurant_id": 3, "total_amount": 18.90, "status": "delivered"},
    {"id": "GO003", "restaurant_id": 5, "total_amount": 16.00, "status": "delivered"},
    {"id": "GO005", "restaurant_id": 3, "total_amount": 24.50, "status": "delivered"},
    {"id": "GO007", "restaurant_id": 1, "total_amount": 19.00, "status": "cancelled"},
    {"id": "GO008", "restaurant_id": 3, "total_amount": 27.00, "status": "delivered"},
    {"id": "GO009", "restaurant_id": 5, "total_amount": 12.50, "status": "delivered"},
    {"id": "GO011", "restaurant_id": 2, "total_amount": 34.00, "status": "delivered"},
    {"id": "GO013", "restaurant_id": 6, "total_amount": 23.00, "status": "delivered"},
    {"id": "GO014", "restaurant_id": 2, "total_amount": 42.00, "status": "cancelled"},
    {"id": "GO016", "restaurant_id": 6, "total_amount": 21.00, "status": "delivered"},
    {"id": "GO017", "restaurant_id": 2, "total_amount": 36.00, "status": "delivered"},
])

restaurants_df = pd.DataFrame([
    {"id": 1, "name": "Pizza Palace",  "category": "Pizza"},
    {"id": 2, "name": "Sushi Spot",    "category": "Japanese"},
    {"id": 3, "name": "Burger Bar",    "category": "Burgers"},
    {"id": 5, "name": "Green Bowl",    "category": "Healthy"},
    {"id": 6, "name": "Pasta House",   "category": "Italian"},
])`,
        testCode: `result = revenue_by_category(orders_df, restaurants_df)
assert list(result.columns) == ["category", "revenue"], f"Wrong columns: {list(result.columns)}"
assert len(result) == 5, f"Expected 5 categories, got {len(result)}"

# First row must be highest revenue
cats = result["category"].tolist()
revs = result["revenue"].tolist()

assert cats[0] == "Burgers",  f"Burgers should be top: 18.9+24.5+27=70.4, got {cats[0]}"
assert revs[0] == 70.40,      f"Burgers revenue: {revs[0]}"
assert cats[1] == "Japanese", f"Japanese (Sushi) should be 2nd: 34+36=70, got {cats[1]}"
assert revs[1] == 70.00,      f"Japanese revenue: {revs[1]}"

assert "cancelled" not in str(result), "Cancelled orders must not affect revenue"
print(result.to_string(index=False))`,
        solution: `import pandas as pd

def revenue_by_category(orders_df: pd.DataFrame, restaurants_df: pd.DataFrame) -> pd.DataFrame:
    delivered = orders_df[orders_df["status"] == "delivered"]
    merged    = delivered.merge(restaurants_df[["id", "category"]],
                                left_on="restaurant_id", right_on="id")
    result    = (merged.groupby("category")["total_amount"]
                 .sum()
                 .reset_index()
                 .rename(columns={"total_amount": "revenue"})
                 .sort_values("revenue", ascending=False)
                 .reset_index(drop=True))
    return result`,
      },
      // ── Phase 3: Code Quality ────────────────────────────────────────────────
      {
        id: 'gl-py-07',
        prompt: 'The function below has multiple code-quality problems. Rewrite it as `get_city_revenue(conn, city)` that is: (1) safe from SQL injection, (2) returns a float instead of printing, (3) uses a context manager for the cursor, (4) uses a descriptive parameter name. The bad function is in the starter code — do not modify it, just write the clean version below it.',
        hint: 'Use parameterized queries: cursor.execute("SELECT ... WHERE city = ?", (city,)). Return result[0] or 0.0. Use with conn: or just manage cursor manually.',
        starterCode: `import sqlite3

# BAD — do not modify this
def process(x, conn):
    cur = conn.cursor()
    cur.execute(f"SELECT SUM(total_amount) FROM glovo_orders WHERE city='{x}' AND status='delivered'")
    r = cur.fetchone()
    print(r[0])   # side effect instead of return
    cur.close()

# CLEAN — write your implementation here
def get_city_revenue(conn: sqlite3.Connection, city: str) -> float:
    pass`,
        setupCode: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("""
    CREATE TABLE glovo_orders (
        id TEXT, city TEXT, total_amount REAL, status TEXT
    )
""")
conn.executemany("INSERT INTO glovo_orders VALUES (?,?,?,?)", [
    ("GO001", "Madrid",    22.50, "delivered"),
    ("GO002", "Madrid",    18.90, "delivered"),
    ("GO007", "Madrid",    19.00, "cancelled"),
    ("GO011", "Barcelona", 34.00, "delivered"),
    ("GO014", "Barcelona", 42.00, "cancelled"),
])
conn.commit()`,
        testCode: `madrid_revenue = get_city_revenue(conn, "Madrid")
assert madrid_revenue == 41.40, f"Madrid delivered revenue: 22.5+18.9=41.4, got {madrid_revenue}"

bcn_revenue = get_city_revenue(conn, "Barcelona")
assert bcn_revenue == 34.00, f"Barcelona delivered revenue: 34.0, got {bcn_revenue}"

empty = get_city_revenue(conn, "Valencia")
assert empty == 0.0, f"Unknown city should return 0.0, got {empty}"

# SQL injection safety test
injected = get_city_revenue(conn, "' OR '1'='1")
assert injected == 0.0, "SQL injection attempt should return 0.0 (parameterized query)"

print(f"Madrid revenue:    {madrid_revenue:.2f} EUR")
print(f"Barcelona revenue: {bcn_revenue:.2f} EUR")
print(f"Valencia revenue:  {empty:.2f} EUR (no data)")`,
        solution: `import sqlite3

# BAD — do not modify this
def process(x, conn):
    cur = conn.cursor()
    cur.execute(f"SELECT SUM(total_amount) FROM glovo_orders WHERE city='{x}' AND status='delivered'")
    r = cur.fetchone()
    print(r[0])
    cur.close()

# CLEAN — write your implementation here
def get_city_revenue(conn: sqlite3.Connection, city: str) -> float:
    cursor = conn.execute(
        "SELECT SUM(total_amount) FROM glovo_orders WHERE city = ? AND status = 'delivered'",
        (city,)
    )
    result = cursor.fetchone()[0]
    return result if result is not None else 0.0`,
      },
      {
        id: 'gl-py-08',
        prompt: 'Write pytest-style tests for `categorize_order(amount, delivery_minutes)`. The function is provided in setup. Write `test_categorize_order()` that asserts: (1) high amount + fast delivery → "premium", (2) slow delivery → "slow" regardless of amount, (3) None delivery_minutes → "cancelled", (4) the exact thresholds (amount >= 30, delivery <= 30 for premium; delivery > 45 for slow). Call test_categorize_order() at the end.',
        hint: 'Cover boundary values: amount=30 + delivery=30 → "premium". amount=29.99 → not premium. delivery=46 → slow. delivery=45 → not slow. None → cancelled.',
        starterCode: `def test_categorize_order():
    # Write your assertions here
    pass

test_categorize_order()`,
        setupCode: `from typing import Optional

def categorize_order(amount: float, delivery_minutes: Optional[int]) -> str:
    if delivery_minutes is None:
        return "cancelled"
    if delivery_minutes > 45:
        return "slow"
    if amount >= 30 and delivery_minutes <= 30:
        return "premium"
    return "standard"`,
        testCode: `# The test function itself is the exercise — testCode just re-runs it cleanly
try:
    test_categorize_order()
    print("All assertions in test_categorize_order() passed!")
except AssertionError as e:
    raise AssertionError(f"Your test caught a real bug or has a wrong assertion: {e}")

# Verify the test is non-trivial (must have at least a few assert calls)
import inspect
src = inspect.getsource(test_categorize_order)
assert src.count("assert") >= 5, f"Write at least 5 assertions to cover the edge cases. Found: {src.count('assert')}"
print("Good coverage: 5+ assertions verified.")`,
        solution: `def test_categorize_order():
    # Happy paths
    assert categorize_order(35.0, 25)  == "premium",   "High amount, fast delivery"
    assert categorize_order(25.0, 25)  == "standard",  "Low amount, fast — not premium"
    assert categorize_order(35.0, 50)  == "slow",      "Slow regardless of amount"
    assert categorize_order(10.0, 46)  == "slow",      "Exactly over 45 min threshold"
    assert categorize_order(35.0, None) == "cancelled", "None → cancelled"

    # Exact boundaries
    assert categorize_order(30.0, 30)  == "premium",   "Exactly at premium threshold (>=30, <=30)"
    assert categorize_order(29.99, 30) == "standard",  "Just below amount threshold"
    assert categorize_order(30.0, 31)  == "standard",  "Just over time threshold for premium"
    assert categorize_order(0.0, 45)   == "standard",  "Exactly 45 min is not slow (> 45 required)"

test_categorize_order()`,
      },
    ],
  },

  // ─── TOPIC 8: API ETL — Rick & Morty ─────────────────────────────────────────
  {
    id: 'py-rm',
    title: 'API ETL — Rick & Morty',
    description: 'Paginated REST API → extract → clean → SQLite. No pandas. Exact Guesty interview format.',
    lesson: {
      intro: 'In a Guesty Python interview, candidates were given the Rick and Morty public API and asked to read data from it, take only the necessary fields, clean them, and store them in a database — without pandas. These 8 exercises walk you through every step of that exact pipeline.',
      concepts: [
        {
          title: 'Fetching a paginated API',
          body: 'Real APIs return pages. Each response has info.next with the URL of the next page, or null when you\'re done. The pattern: start at page 1, collect results, follow info.next until None.',
          code: `import urllib.request, json

def fetch_all(start_url: str) -> list[dict]:
    results, url = [], start_url
    while url:
        with urllib.request.urlopen(url) as r:
            page = json.loads(r.read())
        results.extend(page["results"])
        url = page["info"]["next"]   # None on the last page
    return results`,
        },
        {
          title: 'Selecting only the fields you need',
          body: 'The Rick and Morty character object has 12 fields. Pick exactly what you need — id, name, status, species, gender, and origin. Flatten nested objects to plain strings: char["origin"]["name"].',
          code: `def extract(char: dict) -> dict:
    return {
        "id":      char["id"],
        "name":    char["name"],
        "status":  char["status"],
        "species": char["species"],
        "gender":  char["gender"],
        "origin":  char["origin"]["name"],  # nested dict → flat string
    }`,
        },
        {
          title: 'Cleaning without pandas',
          body: 'strip() removes whitespace. .lower() normalises status so "Alive", "ALIVE", "alive" all become "alive". Apply per record with a clean() function or a dict comprehension.',
          code: `def clean(char: dict) -> dict:
    return {
        **char,
        "name":    char["name"].strip(),
        "status":  char["status"].lower(),
        "species": char["species"].strip(),
    }`,
        },
        {
          title: 'Loading into SQLite with executemany',
          body: 'sqlite3 ships with Python — no install needed. Use executemany() for bulk inserts. Always use ? placeholders (never string formatting). INSERT OR REPLACE handles re-runs safely.',
          code: `import sqlite3
conn = sqlite3.connect(":memory:")
conn.execute("""
    CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY, name TEXT NOT NULL,
        status TEXT NOT NULL,   species TEXT NOT NULL,
        gender TEXT NOT NULL,   origin TEXT NOT NULL
    )
""")
conn.executemany(
    "INSERT OR REPLACE INTO characters VALUES (?,?,?,?,?,?)",
    [(c["id"], c["name"], c["status"], c["species"], c["gender"], c["origin"])
     for c in chars]
)
conn.commit()`,
        },
      ],
    },
    exercises: [
      {
        id: 'rm-01',
        prompt: 'The Rick and Morty API returns character objects with 12+ fields. Write `extract_characters(response)` that takes a raw API response page and returns a list of dicts with ONLY: `id`, `name`, `status`, `species`, `gender`, and `origin` — where `origin` is a plain string (flatten `char["origin"]["name"]`).',
        hint: 'Iterate response["results"]. For each character build a new dict: {"id": c["id"], ..., "origin": c["origin"]["name"]}.',
        starterCode: `def extract_characters(response: dict) -> list[dict]:
    pass`,
        setupCode: `API_PAGE = {
    "info": {
        "count": 826, "pages": 42,
        "next": "https://rickandmortyapi.com/api/character?page=2",
        "prev": None
    },
    "results": [
        {"id": 1,   "name": "Rick Sanchez",              "status": "Alive",   "species": "Human",
         "type": "", "gender": "Male",
         "origin":   {"name": "Earth (C-137)", "url": "https://rickandmortyapi.com/api/location/1"},
         "location": {"name": "Citadel of Ricks", "url": "https://rickandmortyapi.com/api/location/3"},
         "image":   "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
         "episode": ["https://rickandmortyapi.com/api/episode/1",
                     "https://rickandmortyapi.com/api/episode/2"],
         "url":     "https://rickandmortyapi.com/api/character/1",
         "created": "2017-11-04T18:48:46.250Z"},
        {"id": 2,   "name": "Morty Smith",               "status": "Alive",   "species": "Human",
         "type": "", "gender": "Male",
         "origin":   {"name": "Earth (C-137)", "url": "https://rickandmortyapi.com/api/location/1"},
         "location": {"name": "Citadel of Ricks", "url": "https://rickandmortyapi.com/api/location/3"},
         "image":   "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
         "episode": ["https://rickandmortyapi.com/api/episode/1"],
         "url":     "https://rickandmortyapi.com/api/character/2",
         "created": "2017-11-04T18:50:21.651Z"},
        {"id": 6,   "name": "Abadango Cluster Princess", "status": "Alive",   "species": "Alien",
         "type": "Parasite", "gender": "Female",
         "origin":   {"name": "Abadango", "url": "https://rickandmortyapi.com/api/location/2"},
         "location": {"name": "Abadango", "url": "https://rickandmortyapi.com/api/location/2"},
         "image":   "https://rickandmortyapi.com/api/character/avatar/6.jpeg",
         "episode": ["https://rickandmortyapi.com/api/episode/27"],
         "url":     "https://rickandmortyapi.com/api/character/6",
         "created": "2017-11-04T19:29:20.172Z"},
        {"id": 36,  "name": "Beebo",                     "status": "Dead",    "species": "Alien",
         "type": "", "gender": "Male",
         "origin":   {"name": "unknown", "url": ""},
         "location": {"name": "unknown", "url": ""},
         "image":   "https://rickandmortyapi.com/api/character/avatar/36.jpeg",
         "episode": ["https://rickandmortyapi.com/api/episode/10"],
         "url":     "https://rickandmortyapi.com/api/character/36",
         "created": "2017-11-05T09:22:14.110Z"},
        {"id": 183, "name": "Johnny Depp",               "status": "unknown", "species": "Human",
         "type": "", "gender": "Male",
         "origin":   {"name": "unknown", "url": ""},
         "location": {"name": "unknown", "url": ""},
         "image":   "https://rickandmortyapi.com/api/character/avatar/183.jpeg",
         "episode": ["https://rickandmortyapi.com/api/episode/8"],
         "url":     "https://rickandmortyapi.com/api/character/183",
         "created": "2017-12-29T19:19:09.896Z"},
    ]
}`,
        testCode: `result = extract_characters(API_PAGE)
assert len(result) == 5, f"Expected 5, got {len(result)}"
rick = result[0]
expected_keys = {"id", "name", "status", "species", "gender", "origin"}
assert set(rick.keys()) == expected_keys, f"Wrong keys: {set(rick.keys())}"
assert "image"    not in rick, "image should not be included"
assert "episode"  not in rick, "episode list should not be included"
assert "created"  not in rick, "created should not be included"
assert "type"     not in rick, "type should not be included"
assert "location" not in rick, "location should not be included"
assert rick["id"]     == 1
assert rick["name"]   == "Rick Sanchez"
assert rick["origin"] == "Earth (C-137)", f"origin must be a flat string, got: {rick['origin']}"
assert result[3]["origin"] == "unknown"
assert result[2]["species"] == "Alien"
print(f"Extracted {len(result)} characters with {len(rick)} fields each:")
for c in result:
    print(f"  [{c['id']:>3}] {c['name']:<30} {c['status']:<8} from {c['origin']}")`,
        solution: `def extract_characters(response: dict) -> list[dict]:
    return [
        {
            "id":      c["id"],
            "name":    c["name"],
            "status":  c["status"],
            "species": c["species"],
            "gender":  c["gender"],
            "origin":  c["origin"]["name"],
        }
        for c in response["results"]
    ]`,
      },
      {
        id: 'rm-02',
        prompt: 'API data is dirty: names have extra whitespace, status comes in any case ("Alive", "DEAD", "alive"). Write `clean_character(char)` that returns a cleaned copy: strip `name` and `species`, lowercase `status`. All other fields must be preserved unchanged.',
        hint: 'Use {**char, "name": char["name"].strip(), "status": char["status"].lower(), "species": char["species"].strip()} to copy and override.',
        starterCode: `def clean_character(char: dict) -> dict:
    pass`,
        setupCode: `raw_chars = [
    {"id": 1, "name": "  Rick Sanchez  ", "status": "Alive",   "species": "Human ", "gender": "Male",   "origin": "Earth (C-137)"},
    {"id": 2, "name": "Morty Smith",       "status": "DEAD",    "species": " Alien", "gender": "Male",   "origin": "Earth (C-137)"},
    {"id": 3, "name": " Summer Smith ",    "status": "alive",   "species": "Human ", "gender": "Female", "origin": "Earth (Replacement Dimension)"},
    {"id": 4, "name": "Beth Smith",        "status": "Unknown", "species": "Human",  "gender": "Female", "origin": "Earth (C-137)"},
    {"id": 5, "name": "  Jerry Smith  ",   "status": "Dead",    "species": "Human",  "gender": "Male",   "origin": "unknown"},
]`,
        testCode: `result = [clean_character(c) for c in raw_chars]
assert result[0]["name"]    == "Rick Sanchez",  f"Leading/trailing space not stripped: '{result[0]['name']}'"
assert result[0]["status"]  == "alive",          f"Status not lowercased: '{result[0]['status']}'"
assert result[0]["species"] == "Human",          f"Species not stripped: '{result[0]['species']}'"
assert result[1]["status"]  == "dead",           f"DEAD not lowercased: '{result[1]['status']}'"
assert result[1]["species"] == "Alien",          f"Leading space not stripped: '{result[1]['species']}'"
assert result[2]["name"]    == "Summer Smith",   f"Name not stripped: '{result[2]['name']}'"
assert result[2]["species"] == "Human",          f"Trailing space not stripped: '{result[2]['species']}'"
assert result[3]["status"]  == "unknown",        f"Unknown not lowercased: '{result[3]['status']}'"
assert result[4]["name"]    == "Jerry Smith",    f"Internal spaces changed: '{result[4]['name']}'"
assert result[0]["id"]      == 1,                "id must be preserved"
assert result[0]["gender"]  == "Male",           "gender must be preserved"
print("Cleaned characters:")
for c in result:
    print(f"  [{c['id']}] name='{c['name']}' status='{c['status']}' species='{c['species']}'")`,
        solution: `def clean_character(char: dict) -> dict:
    return {
        **char,
        "name":    char["name"].strip(),
        "status":  char["status"].lower(),
        "species": char["species"].strip(),
    }`,
      },
      {
        id: 'rm-03',
        prompt: 'Characters with `status = "unknown"` have incomplete data and should not go into the database. Write `filter_characters(chars)` that keeps only characters where status is `"alive"` or `"dead"` (always lowercase after cleaning). Return the filtered list.',
        hint: 'List comprehension: [c for c in chars if c["status"] in ("alive", "dead")]',
        starterCode: `def filter_characters(chars: list[dict]) -> list[dict]:
    pass`,
        setupCode: `chars = [
    {"id": 1,   "name": "Rick Sanchez",        "status": "alive",   "species": "Human",  "gender": "Male",    "origin": "Earth (C-137)"},
    {"id": 2,   "name": "Morty Smith",          "status": "alive",   "species": "Human",  "gender": "Male",    "origin": "Earth (C-137)"},
    {"id": 36,  "name": "Beebo",                "status": "dead",    "species": "Alien",  "gender": "Male",    "origin": "unknown"},
    {"id": 183, "name": "Johnny Depp",          "status": "unknown", "species": "Human",  "gender": "Male",    "origin": "unknown"},
    {"id": 290, "name": "Alien Googah",         "status": "unknown", "species": "Alien",  "gender": "unknown", "origin": "unknown"},
    {"id": 4,   "name": "Beth Smith",           "status": "alive",   "species": "Human",  "gender": "Female",  "origin": "Earth (C-137)"},
    {"id": 5,   "name": "Jerry Smith",          "status": "dead",    "species": "Human",  "gender": "Male",    "origin": "Earth (C-137)"},
]`,
        testCode: `result = filter_characters(chars)
assert len(result) == 5, f"Expected 5, got {len(result)}: {[c['name'] for c in result]}"
statuses = {c["status"] for c in result}
assert statuses == {"alive", "dead"}, f"Only alive/dead should remain, got: {statuses}"
ids_in_result = [c["id"] for c in result]
assert 183 not in ids_in_result, "Johnny Depp (unknown) should be excluded"
assert 290 not in ids_in_result, "Alien Googah (unknown) should be excluded"
assert 1   in  ids_in_result
assert 36  in  ids_in_result
print(f"Kept {len(result)}/{len(chars)} characters:")
for c in result:
    print(f"  [{c['id']}] {c['name']} — {c['status']}")`,
        solution: `def filter_characters(chars: list[dict]) -> list[dict]:
    return [c for c in chars if c["status"] in ("alive", "dead")]`,
      },
      {
        id: 'rm-04',
        prompt: 'The Rick and Morty API has 826 characters across 42 pages. Write `fetch_all(start_url, fetch_fn)` that calls `fetch_fn(url)` repeatedly, collects every item in `response["results"]`, and follows `response["info"]["next"]` until it is `None`. Return all results as one list.',
        hint: 'while url is not None: call fetch_fn(url), extend results, set url = response["info"]["next"].',
        starterCode: `def fetch_all(start_url: str, fetch_fn) -> list[dict]:
    pass`,
        setupCode: `BASE = "https://rickandmortyapi.com/api/character"

MOCK_PAGES = {
    BASE + "?page=1": {
        "info": {"count": 9, "pages": 3, "next": BASE + "?page=2", "prev": None},
        "results": [
            {"id": 1, "name": "Rick Sanchez"},
            {"id": 2, "name": "Morty Smith"},
            {"id": 3, "name": "Summer Smith"},
        ]
    },
    BASE + "?page=2": {
        "info": {"count": 9, "pages": 3, "next": BASE + "?page=3", "prev": BASE + "?page=1"},
        "results": [
            {"id": 4, "name": "Beth Smith"},
            {"id": 5, "name": "Jerry Smith"},
            {"id": 6, "name": "Abadango Cluster Princess"},
        ]
    },
    BASE + "?page=3": {
        "info": {"count": 9, "pages": 3, "next": None, "prev": BASE + "?page=2"},
        "results": [
            {"id": 7, "name": "Adjudicator Rick"},
            {"id": 8, "name": "Agony"},
            {"id": 9, "name": "Alan Rails"},
        ]
    },
}

def mock_fetch(url: str) -> dict:
    return MOCK_PAGES[url]`,
        testCode: `result = fetch_all(BASE + "?page=1", mock_fetch)
assert len(result) == 9, f"Expected 9 results (3 pages x 3 each), got {len(result)}"
assert result[0]["name"] == "Rick Sanchez", f"First item wrong: {result[0]}"
assert result[8]["name"] == "Alan Rails",   f"Last item wrong: {result[8]}"
ids = [r["id"] for r in result]
assert ids == list(range(1, 10)), f"IDs out of order or missing: {ids}"

# Starting from page 2 should only return pages 2 and 3
partial = fetch_all(BASE + "?page=2", mock_fetch)
assert len(partial) == 6, f"From page 2: expected 6, got {len(partial)}"

print(f"Fetched {len(result)} characters across 3 pages:")
for i, c in enumerate(result):
    print(f"  page {i // 3 + 1}  [{c['id']}] {c['name']}")`,
        solution: `def fetch_all(start_url: str, fetch_fn) -> list[dict]:
    results = []
    url = start_url
    while url:
        response = fetch_fn(url)
        results.extend(response["results"])
        url = response["info"]["next"]
    return results`,
      },
      {
        id: 'rm-05',
        prompt: 'Write `create_table(conn)` that creates a `characters` table in the given sqlite3 connection. Columns: `id INTEGER PRIMARY KEY`, `name TEXT NOT NULL`, `status TEXT NOT NULL`, `species TEXT NOT NULL`, `gender TEXT NOT NULL`, `origin TEXT NOT NULL`. Use `CREATE TABLE IF NOT EXISTS` so calling it twice is safe.',
        hint: 'conn.execute("""CREATE TABLE IF NOT EXISTS characters (...) """) then conn.commit().',
        starterCode: `import sqlite3

def create_table(conn: sqlite3.Connection) -> None:
    pass`,
        setupCode: `import sqlite3
conn = sqlite3.connect(":memory:")`,
        testCode: `create_table(conn)

tables = conn.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
table_names = [t[0] for t in tables]
assert "characters" in table_names, f"Table not found. Found: {table_names}"

cols = conn.execute("PRAGMA table_info(characters)").fetchall()
col_names = [c[1] for c in cols]
expected = ["id", "name", "status", "species", "gender", "origin"]
assert col_names == expected, f"Expected {expected}, got {col_names}"

pk_cols = [c[1] for c in cols if c[5] == 1]
assert pk_cols == ["id"], f"id must be PK, got: {pk_cols}"

# Must be safe to call twice
create_table(conn)
tables2 = conn.execute("SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='characters'").fetchone()[0]
assert tables2 == 1, "IF NOT EXISTS violated — table created twice"

print(f"Table 'characters' created with columns: {col_names}")`,
        solution: `import sqlite3

def create_table(conn: sqlite3.Connection) -> None:
    conn.execute("""
        CREATE TABLE IF NOT EXISTS characters (
            id      INTEGER PRIMARY KEY,
            name    TEXT NOT NULL,
            status  TEXT NOT NULL,
            species TEXT NOT NULL,
            gender  TEXT NOT NULL,
            origin  TEXT NOT NULL
        )
    """)
    conn.commit()`,
      },
      {
        id: 'rm-06',
        prompt: 'Write `insert_characters(conn, chars)` that bulk-inserts a list of cleaned character dicts into the `characters` table using `executemany` with `?` placeholders. Use `INSERT OR REPLACE` so re-running is safe. Return the number of rows inserted.',
        hint: 'conn.executemany("INSERT OR REPLACE INTO characters VALUES (?,?,?,?,?,?)", [(c["id"], ...) for c in chars]). Return len(chars).',
        starterCode: `import sqlite3

def insert_characters(conn: sqlite3.Connection, chars: list[dict]) -> int:
    pass`,
        setupCode: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("""
    CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY, name TEXT NOT NULL, status TEXT NOT NULL,
        species TEXT NOT NULL, gender TEXT NOT NULL, origin TEXT NOT NULL
    )
""")
conn.commit()

chars = [
    {"id": 1,  "name": "Rick Sanchez",  "status": "alive", "species": "Human", "gender": "Male",   "origin": "Earth (C-137)"},
    {"id": 2,  "name": "Morty Smith",   "status": "alive", "species": "Human", "gender": "Male",   "origin": "Earth (C-137)"},
    {"id": 6,  "name": "Abadango",      "status": "alive", "species": "Alien", "gender": "Female", "origin": "Abadango"},
    {"id": 36, "name": "Beebo",         "status": "dead",  "species": "Alien", "gender": "Male",   "origin": "unknown"},
    {"id": 4,  "name": "Beth Smith",    "status": "alive", "species": "Human", "gender": "Female", "origin": "Earth (C-137)"},
]`,
        testCode: `count = insert_characters(conn, chars)
assert count == 5, f"Should return 5, got {count}"

rows = conn.execute("SELECT * FROM characters ORDER BY id").fetchall()
assert len(rows) == 5, f"Expected 5 rows in DB, got {len(rows)}"

rick = conn.execute("SELECT name, status FROM characters WHERE id=1").fetchone()
assert rick[0] == "Rick Sanchez"
assert rick[1] == "alive"

# INSERT OR REPLACE: inserting again must not create duplicates
insert_characters(conn, chars)
total = conn.execute("SELECT COUNT(*) FROM characters").fetchone()[0]
assert total == 5, f"INSERT OR REPLACE created duplicates: {total} rows"

print(f"Inserted {count} characters (idempotent):")
for row in rows:
    print(f"  [{row[0]}] {row[1]} — {row[2]} {row[3]} from {row[5]}")`,
        solution: `import sqlite3

def insert_characters(conn: sqlite3.Connection, chars: list[dict]) -> int:
    conn.executemany(
        "INSERT OR REPLACE INTO characters (id, name, status, species, gender, origin) VALUES (?,?,?,?,?,?)",
        [(c["id"], c["name"], c["status"], c["species"], c["gender"], c["origin"]) for c in chars]
    )
    conn.commit()
    return len(chars)`,
      },
      {
        id: 'rm-07',
        prompt: 'Write `count_by_status(conn)` that queries the `characters` table and returns a dict mapping each status to the count of characters with that status. Example: `{"alive": 18, "dead": 4}`.',
        hint: 'conn.execute("SELECT status, COUNT(*) FROM characters GROUP BY status"). Build a dict from cursor.fetchall().',
        starterCode: `import sqlite3

def count_by_status(conn: sqlite3.Connection) -> dict:
    pass`,
        setupCode: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("""
    CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY, name TEXT NOT NULL, status TEXT NOT NULL,
        species TEXT NOT NULL, gender TEXT NOT NULL, origin TEXT NOT NULL
    )
""")
conn.executemany("INSERT INTO characters VALUES (?,?,?,?,?,?)", [
    (1,  "Rick Sanchez",  "alive", "Human", "Male",   "Earth (C-137)"),
    (2,  "Morty Smith",   "alive", "Human", "Male",   "Earth (C-137)"),
    (3,  "Summer Smith",  "alive", "Human", "Female", "Earth (Replacement Dimension)"),
    (4,  "Beth Smith",    "alive", "Human", "Female", "Earth (C-137)"),
    (6,  "Abadango",      "alive", "Alien", "Female", "Abadango"),
    (36, "Beebo",         "dead",  "Alien", "Male",   "unknown"),
    (5,  "Jerry Smith",   "dead",  "Human", "Male",   "Earth (C-137)"),
])
conn.commit()`,
        testCode: `result = count_by_status(conn)
assert isinstance(result, dict), f"Should return a dict, got {type(result)}"
assert result.get("alive") == 5, f"Expected 5 alive, got {result.get('alive')}"
assert result.get("dead")  == 2, f"Expected 2 dead, got {result.get('dead')}"
assert "unknown" not in result, "No unknown chars in this DB"
total = sum(result.values())
assert total == 7, f"Total should equal row count: {total}"
print(f"Status breakdown: {result}")`,
        solution: `import sqlite3

def count_by_status(conn: sqlite3.Connection) -> dict:
    cursor = conn.execute("SELECT status, COUNT(*) FROM characters GROUP BY status")
    return {row[0]: row[1] for row in cursor.fetchall()}`,
      },
      {
        id: 'rm-08',
        prompt: 'Write the complete pipeline: `run_pipeline(pages, conn)` where `pages` is a dict of mock API responses keyed by URL. Chain all steps: (1) follow pagination to collect raw characters, (2) extract the 6 needed fields, (3) clean name/status/species, (4) filter out status="unknown", (5) insert into the DB. Return `{"loaded": n, "skipped": n}`.',
        hint: 'Collect raw with a while loop following info.next → extract fields → clean with strip/lower → filter → executemany. skipped = total_extracted - len(valid).',
        starterCode: `import sqlite3

def run_pipeline(pages: dict, conn: sqlite3.Connection) -> dict:
    pass`,
        setupCode: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("""
    CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY, name TEXT NOT NULL, status TEXT NOT NULL,
        species TEXT NOT NULL, gender TEXT NOT NULL, origin TEXT NOT NULL
    )
""")
conn.commit()

BASE = "https://rickandmortyapi.com/api/character"
pages = {
    BASE + "?page=1": {
        "info": {"next": BASE + "?page=2"},
        "results": [
            {"id": 1,   "name": " Rick Sanchez ",  "status": "Alive",   "species": " Human",
             "gender": "Male",   "origin": {"name": "Earth (C-137)"}, "image": "...", "episode": ["e1","e2"], "created": "2017-11"},
            {"id": 2,   "name": "Morty Smith",      "status": "alive",   "species": "Human",
             "gender": "Male",   "origin": {"name": "Earth (C-137)"}, "image": "...", "episode": ["e1"],      "created": "2017-11"},
            {"id": 183, "name": "Johnny Depp",      "status": "UNKNOWN", "species": "Human",
             "gender": "Male",   "origin": {"name": "unknown"},        "image": "...", "episode": ["e3"],      "created": "2017-12"},
            {"id": 6,   "name": "Abadango",         "status": "Alive",   "species": "Alien",
             "gender": "Female", "origin": {"name": "Abadango"},       "image": "...", "episode": ["e27"],     "created": "2017-11"},
        ]
    },
    BASE + "?page=2": {
        "info": {"next": None},
        "results": [
            {"id": 36,  "name": "  Beebo  ",        "status": "Dead",    "species": "Alien ",
             "gender": "Male",    "origin": {"name": "unknown"},        "image": "...", "episode": ["e10"],    "created": "2017-11"},
            {"id": 290, "name": "Alien Googah",     "status": "unknown", "species": "Alien",
             "gender": "unknown", "origin": {"name": "unknown"},        "image": "...", "episode": [],         "created": "2018-01"},
            {"id": 4,   "name": "Beth Smith",       "status": "ALIVE",   "species": "Human",
             "gender": "Female",  "origin": {"name": "Earth (C-137)"}, "image": "...", "episode": ["e1","e2"],"created": "2017-11"},
        ]
    },
}`,
        testCode: `result = run_pipeline(pages, conn)

assert isinstance(result, dict), "Should return a dict"
assert "loaded"  in result, "Missing 'loaded' key"
assert "skipped" in result, "Missing 'skipped' key"
assert result["loaded"]  == 5, f"5 chars have alive/dead status, got loaded={result['loaded']}"
assert result["skipped"] == 2, f"2 chars have unknown status, got skipped={result['skipped']}"

rows = conn.execute("SELECT id, name, status, species FROM characters ORDER BY id").fetchall()
assert len(rows) == 5, f"Expected 5 rows in DB, got {len(rows)}"

rick = conn.execute("SELECT name, status, species FROM characters WHERE id=1").fetchone()
assert rick[0] == "Rick Sanchez", f"Name not stripped: '{rick[0]}'"
assert rick[1] == "alive",         f"Status not lowercased: '{rick[1]}'"
assert rick[2] == "Human",         f"Species not stripped: '{rick[2]}'"

beebo = conn.execute("SELECT name, species FROM characters WHERE id=36").fetchone()
assert beebo[0] == "Beebo",  f"Name not stripped: '{beebo[0]}'"
assert beebo[1] == "Alien",  f"Species not stripped: '{beebo[1]}'"

unknown_count = conn.execute("SELECT COUNT(*) FROM characters WHERE status='unknown'").fetchone()[0]
assert unknown_count == 0, f"unknown chars must not reach the DB, found {unknown_count}"

print(f"Pipeline: {result}")
print("DB contents:")
for row in rows:
    print(f"  [{row[0]}] {row[1]} — {row[2]} {row[3]}")`,
        solution: `import sqlite3

def run_pipeline(pages: dict, conn: sqlite3.Connection) -> dict:
    # 1. Collect all raw characters across all pages
    raw = []
    url = list(pages.keys())[0]
    while url:
        page = pages[url]
        raw.extend(page["results"])
        url = page["info"]["next"]

    # 2. Extract only needed fields (flatten origin)
    extracted = [
        {
            "id":      c["id"],
            "name":    c["name"],
            "status":  c["status"],
            "species": c["species"],
            "gender":  c["gender"],
            "origin":  c["origin"]["name"],
        }
        for c in raw
    ]

    # 3. Clean: strip whitespace, lowercase status
    cleaned = [
        {**c, "name": c["name"].strip(), "status": c["status"].lower(), "species": c["species"].strip()}
        for c in extracted
    ]

    # 4. Filter out unknown status
    valid = [c for c in cleaned if c["status"] in ("alive", "dead")]
    skipped = len(cleaned) - len(valid)

    # 5. Insert into DB
    conn.executemany(
        "INSERT OR REPLACE INTO characters (id, name, status, species, gender, origin) VALUES (?,?,?,?,?,?)",
        [(c["id"], c["name"], c["status"], c["species"], c["gender"], c["origin"]) for c in valid]
    )
    conn.commit()

    return {"loaded": len(valid), "skipped": skipped}`,
      },
    ],
  },

  // ─── TOPIC 9: OOP in Python ──────────────────────────────────────────────────
  {
    id: 'py-oop',
    title: 'OOP in Python',
    description: '15 exercises from zero to advanced: classes, encapsulation, magic methods, inheritance, ABCs, mixins, composition and context managers',
    lesson: {
      intro: 'Object-Oriented Programming (OOP) is a way of organizing code by grouping related data and behavior together into objects. Instead of writing a bunch of separate functions and variables, you bundle everything that belongs together into a single unit called a class. This makes your code easier to understand, reuse, and test — especially as projects grow larger.',
      concepts: [
        {
          title: 'Classes and instances — the blueprint analogy',
          body: 'Think of a class as a blueprint or a cookie cutter. The blueprint itself is not a house — it is the plan for making houses. Each house you build from that plan is an instance (also called an object). In Python, you define a class once, then create as many instances from it as you need. Each instance has its own independent copy of the data.\n\nThe __init__ method is the constructor — Python calls it automatically every time you create a new instance. The first parameter, self, always refers to the specific instance being created. You use self to attach data to that instance.',
          code: `# The class is the blueprint
class Dog:
    def __init__(self, name: str, breed: str):
        # self.name and self.breed belong to THIS specific dog instance
        self.name = name
        self.breed = breed

    def bark(self) -> str:
        return f"{self.name} says: Woof!"

    def __repr__(self) -> str:
        return f"Dog(name='{self.name}', breed='{self.breed}')"

# Creating instances — each is a separate object with its own data
dog1 = Dog("Rex", "Labrador")
dog2 = Dog("Luna", "Poodle")

print(dog1.bark())   # Rex says: Woof!
print(dog2.bark())   # Luna says: Woof!
print(dog1.name)     # Rex
print(dog2.name)     # Luna  (different from dog1!)
print(repr(dog1))    # Dog(name='Rex', breed='Labrador')`,
          note: 'self is not a keyword — it is just a strong convention. Python automatically passes the instance as the first argument to every method. You must declare it, but you never pass it manually when calling: dog1.bark() is the same as Dog.bark(dog1).',
        },
        {
          title: 'Encapsulation — protecting data from accidents',
          body: 'Encapsulation means hiding the internal details of an object and controlling how outside code can read or modify its data. The idea is simple: if other code can freely change any attribute at any time, bugs become very hard to track down. By controlling access, you can enforce rules like "balance can never go negative".\n\nIn Python, a single underscore prefix (_balance) is a convention meaning "this is internal — do not touch it from outside". It is not enforced by the language, but every Python developer recognizes and respects it.\n\nThe @property decorator lets you expose a value like a normal attribute, but with a method running behind the scenes. This lets you add validation, compute a value on the fly, or make something read-only.',
          code: `class BankAccount:
    def __init__(self, owner: str, balance: float = 0.0):
        self.owner = owner
        self._balance = balance  # _ means "internal — do not set this directly"

    # @property makes this look like an attribute: account.balance
    # but it is actually a method, so we control what it returns
    @property
    def balance(self) -> float:
        return self._balance

    def deposit(self, amount: float):
        if amount <= 0:
            raise ValueError(f"Deposit amount must be positive, got {amount}")
        self._balance += amount

    def withdraw(self, amount: float):
        if amount > self._balance:
            raise ValueError("Insufficient funds")
        self._balance -= amount

    def __repr__(self) -> str:
        return f"BankAccount('{self.owner}', balance={self._balance})"

acc = BankAccount("Alice", 100.0)
print(acc.balance)    # 100.0  — reads fine
acc.deposit(50)
print(acc.balance)    # 150.0
# acc.balance = 999   # would raise AttributeError — read-only!`,
          note: 'To make a property writable with validation, add a @balance.setter method. The setter runs every time someone writes account.balance = x, so you can validate before changing the internal value.',
        },
        {
          title: '@property setter — writing with validation',
          body: 'A property getter alone is read-only. Adding a setter (decorated with @attr_name.setter) allows writing the value, but your code runs first — so you can validate, convert, or transform the input before storing it.\n\nThis is extremely powerful: the caller writes temperature.celsius = 25 like a normal assignment, but behind the scenes your code checks that it is not below absolute zero. The caller does not need to know about the validation at all.',
          code: `class Temperature:
    def __init__(self, celsius: float):
        self.celsius = celsius  # uses the setter, so validation runs at init too!

    @property
    def celsius(self) -> float:
        return self._celsius

    @celsius.setter
    def celsius(self, value: float):
        if value < -273.15:
            raise ValueError(f"Temperature {value}°C is below absolute zero!")
        self._celsius = value  # store in the "private" _celsius

    @property
    def fahrenheit(self) -> float:
        # computed from celsius — no setter needed, it is always derived
        return self._celsius * 9 / 5 + 32

    @fahrenheit.setter
    def fahrenheit(self, value: float):
        self.celsius = (value - 32) * 5 / 9  # converts and uses celsius setter

t = Temperature(100)
print(t.fahrenheit)    # 212.0
t.fahrenheit = 32
print(t.celsius)       # 0.0

try:
    t.celsius = -500   # raises ValueError
except ValueError as e:
    print(e)           # Temperature -500°C is below absolute zero!`,
          note: 'Notice that __init__ calls self.celsius = celsius (not self._celsius = celsius). This means the setter runs during initialization too, so your validation is enforced from the very first moment the object is created.',
        },
        {
          title: 'Class attributes, @classmethod, and @staticmethod',
          body: 'So far all attributes lived on the instance (self.x). But sometimes you want data or behavior that belongs to the class itself, not to any one instance.\n\nClass attributes: defined at the class level (no self), shared between ALL instances. If one instance changes it via the class name, all instances see the change.\n\n@classmethod: receives cls (the class) instead of self. Used to create alternative constructors, or to read/write class attributes. Common pattern: Order.from_dict(data) builds an Order without calling Order() directly.\n\n@staticmethod: receives neither self nor cls. It is just a regular function that lives inside the class namespace because it is logically related to the class.',
          code: `class Order:
    # Class attribute — shared by ALL Order instances
    _total_orders_created = 0

    def __init__(self, order_id: str, amount: float):
        self.order_id = order_id
        self.amount = amount
        Order._total_orders_created += 1  # every new order increments the counter

    # @classmethod — alternative constructor: build an Order from a dict
    @classmethod
    def from_dict(cls, data: dict) -> "Order":
        return cls(data["id"], data["amount"])

    # @classmethod — read a class-level statistic
    @classmethod
    def total_created(cls) -> int:
        return cls._total_orders_created

    # @staticmethod — utility that relates to orders but needs no instance
    @staticmethod
    def is_valid_amount(amount: float) -> bool:
        return isinstance(amount, (int, float)) and amount > 0

# Normal constructor
o1 = Order("A001", 99.99)
# Alternative constructor via @classmethod
o2 = Order.from_dict({"id": "A002", "amount": 49.99})

print(Order.total_created())            # 2
print(Order.is_valid_amount(-5))        # False
print(Order.is_valid_amount(100))       # True`,
          note: 'Use @classmethod when the method needs to access or modify class-level state (cls._something). Use @staticmethod when the method is just a helper function — it does not need self or cls at all. If you are unsure, ask: "does this function care about the class or any instance?" If no, use @staticmethod.',
        },
        {
          title: 'Magic methods (dunders) — plugging into Python syntax',
          body: 'Python has a set of special methods with double underscores on both sides: __len__, __repr__, __eq__, __add__, etc. These are called "dunder" methods (double underscore). When you implement them on your class, Python calls them automatically in response to built-in syntax and functions.\n\nFor example: if you implement __len__, then len(my_object) works. If you implement __add__, then a + b works. If you implement __iter__, then for x in my_object works. This is how Python achieves its clean, consistent syntax — your custom objects can behave exactly like built-in types.\n\nThe most important dunders to know:\n  __repr__: "official" string for developers. Always implement this — it is what you see in the REPL and in error messages.\n  __str__: "friendly" string for end users. Falls back to __repr__ if not defined.\n  __eq__: what == does. Also required if you want to use objects in sets or as dict keys (with __hash__).\n  __lt__: what < does. Implement this (plus __eq__) and sorted() works on your objects.',
          code: `class Card:
    RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']

    def __init__(self, rank: str, suit: str):
        self.rank = rank
        self.suit = suit

    def __repr__(self) -> str:
        return f"Card('{self.rank}', '{self.suit}')"  # for developers

    def __str__(self) -> str:
        return f"{self.rank} of {self.suit}"           # for users

    def __eq__(self, other) -> bool:
        if not isinstance(other, Card): return NotImplemented
        return self.rank == other.rank and self.suit == other.suit

    def __lt__(self, other) -> bool:
        return self.RANKS.index(self.rank) < self.RANKS.index(other.rank)

    def __hash__(self) -> int:
        return hash((self.rank, self.suit))  # needed if you define __eq__

c1 = Card('A', 'spades')
c2 = Card('2', 'clubs')
print(repr(c1))       # Card('A', 'spades')
print(str(c1))        # A of spades
print(c2 < c1)        # True  — 2 is lower than A
hand = [Card('K','hearts'), Card('2','clubs'), Card('A','spades')]
print(sorted(hand))   # [Card('2', ...), Card('K', ...), Card('A', ...)]
seen = {c1, Card('A', 'spades')}
print(len(seen))      # 1  — same card, same hash`,
          note: 'Rule: if you define __eq__, you MUST also define __hash__. Python automatically sets __hash__ = None on classes that define __eq__ (making them unhashable), because two objects that compare equal must also have the same hash. If you want your objects in sets or dicts, define both.',
        },
        {
          title: 'Inheritance — building on existing classes',
          body: 'Inheritance lets you create a new class that automatically gets all the attributes and methods of an existing class. The existing class is called the parent (or base class), and the new one is called the child (or subclass).\n\nWhy use it? To avoid repeating code. If you have Dog and Cat that both need a name, both need an owner, and both need a method is_alive(), do not write that three times. Put it in Animal once, then let Dog and Cat inherit it.\n\nsuper() is how you call the parent\'s version of a method from inside the child. In __init__, you almost always want to call super().__init__(...) first, so the parent sets up its own data before you add yours.',
          code: `class Animal:
    def __init__(self, name: str, owner: str):
        self.name = name
        self.owner = owner
        self.alive = True

    def is_alive(self) -> bool:
        return self.alive

    def speak(self) -> str:
        # Base version — subclasses will override this
        raise NotImplementedError(f"{self.__class__.__name__} must implement speak()")

class Dog(Animal):
    def __init__(self, name: str, owner: str, breed: str):
        super().__init__(name, owner)  # let Animal handle name and owner
        self.breed = breed             # Dog-specific attribute

    def speak(self) -> str:
        return f"{self.name} barks: Woof!"

    def fetch(self) -> str:
        return f"{self.name} fetches the ball!"

class Cat(Animal):
    def __init__(self, name: str, owner: str):
        super().__init__(name, owner)

    def speak(self) -> str:
        return f"{self.name} meows softly."

dog = Dog("Rex", "Alice", "Labrador")
cat = Cat("Whiskers", "Bob")
print(dog.speak())      # Rex barks: Woof!
print(cat.speak())      # Whiskers meows softly.
print(dog.is_alive())   # True  — inherited from Animal
print(dog.fetch())      # Rex fetches the ball!  — Dog-only method`,
          note: 'isinstance(dog, Animal) returns True even though dog is a Dog. Every Dog IS an Animal (child IS a parent). This is the cornerstone of polymorphism.',
        },
        {
          title: 'Polymorphism — one interface, many behaviors',
          body: 'Polymorphism means "many shapes". It is the ability to call the same method on different objects and get different (but appropriate) behavior. You do not need to check what type of object you have — you just call speak() and each object does the right thing.\n\nThis is one of the biggest wins of OOP: you can write generic code (like "call area() on every shape") without knowing in advance what types of shapes will be in the list. Adding a new shape later does not require changing any existing code — just add the new class.',
          code: `class Shape:
    def area(self) -> float:
        raise NotImplementedError("Every Shape must implement area()")

    def describe(self) -> str:
        return f"I am a {self.__class__.__name__} with area {self.area():.2f}"

class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius
    def area(self) -> float:
        import math
        return math.pi * self.radius ** 2

class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height
    def area(self) -> float:
        return self.width * self.height

class Triangle(Shape):
    def __init__(self, base: float, height: float):
        self.base = base
        self.height = height
    def area(self) -> float:
        return 0.5 * self.base * self.height

# Polymorphism in action: same code works for all shapes
shapes = [Circle(5), Rectangle(4, 6), Triangle(3, 8)]
for shape in shapes:
    print(shape.describe())
# I am a Circle with area 78.54
# I am a Rectangle with area 24.00
# I am a Triangle with area 12.00

# Generic function — does not care which Shape it receives
def total_area(shapes: list) -> float:
    return sum(s.area() for s in shapes)`,
          note: 'This pattern — define a common interface in the base class, implement it differently in each child — is called the Template Method pattern. It is everywhere in production code.',
        },
        {
          title: 'ABCs, Mixins, and Context Managers',
          body: 'ABSTRACT BASE CLASSES (ABC): NotImplementedError is a gentlemen\'s agreement — Python will not stop you from forgetting to implement speak(). ABCs are stricter: if you forget to implement an @abstractmethod, Python refuses to let you create an instance at all. This turns a potential runtime bug into an immediate, clear error.\n\nMIXINS: A mixin is a small class with one focused job (logging, validation, serialization) that you "mix in" to other classes via multiple inheritance. It is not meant to stand alone — it just adds a capability. Python resolves method order with MRO (Method Resolution Order): left to right, depth first.\n\nCONTEXT MANAGERS: The "with" statement guarantees that cleanup code always runs — even if an exception occurs. You implement the protocol with two methods: __enter__ (runs when entering the "with" block, returns the resource) and __exit__ (runs when leaving, even on error). Return False from __exit__ to let exceptions propagate normally.',
          code: `from abc import ABC, abstractmethod

# ABC — Python enforces that subclasses implement format()
class Formatter(ABC):
    @abstractmethod
    def format(self, record: dict) -> str: ...

    def format_all(self, records: list) -> list[str]:
        return [self.format(r) for r in records]

class JSONFormatter(Formatter):
    def format(self, record: dict) -> str:
        import json
        return json.dumps(record)

# Formatter()  <-- TypeError! Can't instantiate abstract class
# JSONFormatter()  <-- works fine

# MIXIN — adds logging to any class
class LogMixin:
    def log(self, msg: str):
        if not hasattr(self, '_logs'): self._logs = []
        self._logs.append(msg)
    def get_logs(self) -> list:
        return getattr(self, '_logs', [])

class DataCleaner(LogMixin):   # mix in logging capability
    def clean(self, records: list) -> list:
        valid = [r for r in records if None not in r.values()]
        self.log(f"Kept {len(valid)} of {len(records)} records")
        return valid

# CONTEXT MANAGER — guarantees cleanup
class Timer:
    def __enter__(self):
        import time
        self._start = time.perf_counter()
        return self  # "as t" gets this

    def __exit__(self, exc_type, exc_val, exc_tb):
        import time
        self.elapsed = time.perf_counter() - self._start
        return False  # do not suppress exceptions

with Timer() as t:
    result = sum(range(1_000_000))
print(f"Done in {t.elapsed:.4f}s")  # always runs, even on exception`,
          note: '__exit__ receives 3 arguments: the exception type, value, and traceback. If no exception occurred, all three are None. Return True to suppress the exception (rare). Return False (or None) to let it propagate — this is almost always what you want.',
        },
      ],
    },
    exercises: [
      // ── oop-01 ──────────────────────────────────────────────────────────────
      {
        id: 'oop-01',
        title: 'Point class — constructor and methods',
        difficulty: 'easy',
        prompt: `Create a \`Point\` class that represents a point in 2D space.

**Requirements:**
- \`__init__(self, x: float, y: float)\`
- \`distance_to(self, other: "Point") -> float\` — Euclidean distance
- \`__repr__\` returns \`"Point(x=3, y=4)"\` (no decimal if the value is a whole number)

**Hint:** distance = √((x2-x1)² + (y2-y1)²)`,
        setupCode: ``,
        starterCode: `class Point:
    def __init__(self, x: float, y: float):
        pass

    def distance_to(self, other: "Point") -> float:
        pass

    def __repr__(self) -> str:
        pass`,
        solution: `class Point:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def distance_to(self, other: "Point") -> float:
        return ((self.x - other.x)**2 + (self.y - other.y)**2) ** 0.5

    def __repr__(self) -> str:
        def fmt(v):
            return int(v) if v == int(v) else v
        return f"Point(x={fmt(self.x)}, y={fmt(self.y)})"`,
        testCode: `p1 = Point(0, 0)
p2 = Point(3, 4)
assert p1.distance_to(p2) == 5.0, f"Expected 5.0, got {p1.distance_to(p2)}"
assert p2.distance_to(p1) == 5.0, "distance_to must be symmetric"
assert repr(p2) == "Point(x=3, y=4)", f"Got: {repr(p2)}"
assert repr(Point(1.5, 2.5)) == "Point(x=1.5, y=2.5)", f"Got: {repr(Point(1.5, 2.5))}"
assert p1.distance_to(p1) == 0.0, "Distance to self must be 0"
print("OK")`,
      },

      // ── oop-02 ──────────────────────────────────────────────────────────────
      {
        id: 'oop-02',
        title: 'BankAccount — encapsulation and validation',
        difficulty: 'easy',
        prompt: `Implement \`BankAccount\` with a private balance and input validation.

**Requirements:**
- \`__init__(self, owner: str, balance: float = 0)\` — store balance as \`_balance\`
- \`@property balance\` — read-only
- \`deposit(amount)\` — raises \`ValueError\` if \`amount <= 0\`
- \`withdraw(amount)\` — raises \`ValueError\` if \`amount > balance\`
- \`__repr__\` returns \`"BankAccount('Alice', 100.0)"\``,
        setupCode: ``,
        starterCode: `class BankAccount:
    def __init__(self, owner: str, balance: float = 0):
        pass

    @property
    def balance(self) -> float:
        pass

    def deposit(self, amount: float):
        pass

    def withdraw(self, amount: float):
        pass

    def __repr__(self) -> str:
        pass`,
        solution: `class BankAccount:
    def __init__(self, owner: str, balance: float = 0):
        self.owner = owner
        self._balance = balance

    @property
    def balance(self) -> float:
        return self._balance

    def deposit(self, amount: float):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        self._balance += amount

    def withdraw(self, amount: float):
        if amount > self._balance:
            raise ValueError("Insufficient funds")
        self._balance -= amount

    def __repr__(self) -> str:
        return f"BankAccount('{self.owner}', {self._balance})"`,
        testCode: `acc = BankAccount("Alice", 100.0)
assert acc.balance == 100.0
acc.deposit(50)
assert acc.balance == 150.0
acc.withdraw(30)
assert acc.balance == 120.0
try:
    acc.deposit(-10)
    assert False, "Should raise ValueError"
except ValueError:
    pass
try:
    acc.withdraw(999)
    assert False, "Should raise ValueError"
except ValueError:
    pass
assert repr(BankAccount("Alice", 100.0)) == "BankAccount('Alice', 100.0)", f"Got: {repr(acc)}"
print("OK")`,
      },

      // ── oop-03 ──────────────────────────────────────────────────────────────
      {
        id: 'oop-03',
        title: 'Temperature — @property with setter and conversion',
        difficulty: 'easy',
        prompt: `Create \`Temperature\` with a validated setter and automatic unit conversion.

**Requirements:**
- \`__init__(self, celsius: float)\`
- \`@property celsius\` with a setter that raises \`ValueError\` if \`value < -273.15\`
- \`@property fahrenheit\` — computed: \`celsius * 9/5 + 32\`
- \`@fahrenheit.setter\` — converts fahrenheit → celsius and validates
- \`__repr__\` → \`"Temperature(25.0°C)"\``,
        setupCode: ``,
        starterCode: `class Temperature:
    def __init__(self, celsius: float):
        pass

    @property
    def celsius(self) -> float:
        pass

    @celsius.setter
    def celsius(self, value: float):
        pass

    @property
    def fahrenheit(self) -> float:
        pass

    @fahrenheit.setter
    def fahrenheit(self, value: float):
        pass

    def __repr__(self) -> str:
        pass`,
        solution: `class Temperature:
    def __init__(self, celsius: float):
        self.celsius = celsius  # uses setter

    @property
    def celsius(self) -> float:
        return self._celsius

    @celsius.setter
    def celsius(self, value: float):
        if value < -273.15:
            raise ValueError(f"Temperature below absolute zero: {value}")
        self._celsius = value

    @property
    def fahrenheit(self) -> float:
        return self._celsius * 9 / 5 + 32

    @fahrenheit.setter
    def fahrenheit(self, value: float):
        self.celsius = (value - 32) * 5 / 9

    def __repr__(self) -> str:
        return f"Temperature({self._celsius}°C)"`,
        testCode: `t = Temperature(0)
assert t.celsius == 0
assert t.fahrenheit == 32.0, f"Expected 32.0, got {t.fahrenheit}"
t.celsius = 100
assert round(t.fahrenheit, 1) == 212.0
t.fahrenheit = 32
assert t.celsius == 0.0
try:
    t.celsius = -300
    assert False, "Should raise ValueError"
except ValueError:
    pass
assert repr(Temperature(25.0)) == "Temperature(25.0°C)", f"Got: {repr(Temperature(25.0))}"
print("OK")`,
      },

      // ── oop-04 ──────────────────────────────────────────────────────────────
      {
        id: 'oop-04',
        title: 'Scoreboard — class attributes and @classmethod',
        difficulty: 'easy',
        prompt: `Implement \`Scoreboard\` using class-level attributes shared across all instances.

**Requirements:**
- Class attributes: \`_high_score = 0\`, \`_total_games = 0\`
- \`__init__(self, player: str)\` — increments \`_total_games\`
- \`add_points(self, pts: int)\` — adds to \`self._score\`; updates \`_high_score\` if exceeded
- \`@property score\` — current instance score
- \`@classmethod high_score(cls)\` — returns the global maximum
- \`@classmethod reset(cls)\` — resets \`_high_score\` and \`_total_games\` to 0
- \`@staticmethod is_valid_points(pts: int) -> bool\` — True if \`pts > 0\``,
        setupCode: ``,
        starterCode: `class Scoreboard:
    _high_score = 0
    _total_games = 0

    def __init__(self, player: str):
        pass

    def add_points(self, pts: int):
        pass

    @property
    def score(self) -> int:
        pass

    @classmethod
    def high_score(cls) -> int:
        pass

    @classmethod
    def reset(cls):
        pass

    @staticmethod
    def is_valid_points(pts: int) -> bool:
        pass`,
        solution: `class Scoreboard:
    _high_score = 0
    _total_games = 0

    def __init__(self, player: str):
        self.player = player
        self._score = 0
        Scoreboard._total_games += 1

    def add_points(self, pts: int):
        self._score += pts
        if self._score > Scoreboard._high_score:
            Scoreboard._high_score = self._score

    @property
    def score(self) -> int:
        return self._score

    @classmethod
    def high_score(cls) -> int:
        return cls._high_score

    @classmethod
    def reset(cls):
        cls._high_score = 0
        cls._total_games = 0

    @staticmethod
    def is_valid_points(pts: int) -> bool:
        return pts > 0`,
        testCode: `Scoreboard.reset()
s1 = Scoreboard("Alice")
s2 = Scoreboard("Bob")
s1.add_points(100)
s2.add_points(200)
s1.add_points(150)
assert s1.score == 250, f"Expected 250, got {s1.score}"
assert s2.score == 200
assert Scoreboard.high_score() == 250, f"Expected 250, got {Scoreboard.high_score()}"
assert Scoreboard._total_games == 2
assert Scoreboard.is_valid_points(5) == True
assert Scoreboard.is_valid_points(0) == False
Scoreboard.reset()
assert Scoreboard.high_score() == 0
print("OK")`,
      },

      // ── oop-05 ──────────────────────────────────────────────────────────────
      {
        id: 'oop-05',
        title: 'Card — __eq__, __lt__, __hash__, __str__',
        difficulty: 'medium',
        prompt: `Model a playing card with comparison and hashability support.

**Requirements:**
- \`RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']\`
- \`SUITS = ['clubs','diamonds','hearts','spades']\`
- \`__init__\` validates rank and suit, raises \`ValueError\` if invalid
- \`__repr__\` → \`"Card('A', 'spades')"\`
- \`__str__\` → \`"A of spades"\`
- \`__eq__\` — same card (same rank and suit)
- \`__lt__\` — by rank index (natural order)
- \`__hash__\` — must be defined when you define \`__eq__\` (use \`hash((rank, suit))\`)`,
        setupCode: ``,
        starterCode: `class Card:
    RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
    SUITS = ['clubs','diamonds','hearts','spades']

    def __init__(self, rank: str, suit: str):
        pass

    def __repr__(self) -> str:
        pass

    def __str__(self) -> str:
        pass

    def __eq__(self, other) -> bool:
        pass

    def __lt__(self, other) -> bool:
        pass

    def __hash__(self) -> int:
        pass`,
        solution: `class Card:
    RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
    SUITS = ['clubs','diamonds','hearts','spades']

    def __init__(self, rank: str, suit: str):
        if rank not in self.RANKS:
            raise ValueError(f"Invalid rank: {rank}")
        if suit not in self.SUITS:
            raise ValueError(f"Invalid suit: {suit}")
        self.rank = rank
        self.suit = suit

    def __repr__(self) -> str:
        return f"Card('{self.rank}', '{self.suit}')"

    def __str__(self) -> str:
        return f"{self.rank} of {self.suit}"

    def __eq__(self, other) -> bool:
        if not isinstance(other, Card):
            return NotImplemented
        return self.rank == other.rank and self.suit == other.suit

    def __lt__(self, other) -> bool:
        return self.RANKS.index(self.rank) < self.RANKS.index(other.rank)

    def __hash__(self) -> int:
        return hash((self.rank, self.suit))`,
        testCode: `c1 = Card('A', 'spades')
c2 = Card('2', 'clubs')
c3 = Card('A', 'spades')
assert repr(c1) == "Card('A', 'spades')", f"Got: {repr(c1)}"
assert str(c1) == "A of spades", f"Got: {str(c1)}"
assert c1 == c3
assert c2 < c1
assert not (c1 < c2)
assert hash(c1) == hash(c3)
seen = {c1, c3}
assert len(seen) == 1, "Equal cards should hash the same"
try:
    Card('X', 'spades')
    assert False, "Should raise ValueError"
except ValueError:
    pass
hand = sorted([Card('K','hearts'), Card('2','clubs'), Card('A','spades')])
assert hand[0].rank == '2'
assert hand[-1].rank == 'A'
print("OK")`,
      },

      // ── oop-06 ──────────────────────────────────────────────────────────────
      {
        id: 'oop-06',
        title: 'Stack — __len__, __bool__, __contains__, __iter__',
        difficulty: 'medium',
        prompt: `Implement a stack (LIFO) with full Python protocol support.

**Requirements:**
- \`push(item)\`, \`pop()\` (raises \`IndexError\` if empty), \`peek()\` (raises \`IndexError\` if empty)
- \`__len__\` — number of elements
- \`__bool__\` — False if empty
- \`__contains__\` — supports \`item in stack\`
- \`__iter__\` — iterates top to bottom (use \`reversed\`)
- \`__repr__\` → \`"Stack([top, ..., bottom])"\``,
        setupCode: ``,
        starterCode: `class Stack:
    def __init__(self):
        self._data = []

    def push(self, item):
        pass

    def pop(self):
        pass

    def peek(self):
        pass

    def __len__(self) -> int:
        pass

    def __bool__(self) -> bool:
        pass

    def __contains__(self, item) -> bool:
        pass

    def __iter__(self):
        pass

    def __repr__(self) -> str:
        pass`,
        solution: `class Stack:
    def __init__(self):
        self._data = []

    def push(self, item):
        self._data.append(item)

    def pop(self):
        if not self._data:
            raise IndexError("pop from empty stack")
        return self._data.pop()

    def peek(self):
        if not self._data:
            raise IndexError("peek at empty stack")
        return self._data[-1]

    def __len__(self) -> int:
        return len(self._data)

    def __bool__(self) -> bool:
        return len(self._data) > 0

    def __contains__(self, item) -> bool:
        return item in self._data

    def __iter__(self):
        return iter(reversed(self._data))

    def __repr__(self) -> str:
        return f"Stack({list(reversed(self._data))})"`,
        testCode: `s = Stack()
assert not s
assert len(s) == 0
s.push(1); s.push(2); s.push(3)
assert len(s) == 3
assert bool(s)
assert s.peek() == 3
assert 2 in s
assert 99 not in s
assert list(s) == [3, 2, 1]
assert s.pop() == 3
assert len(s) == 2
assert repr(Stack()) == "Stack([])"
s2 = Stack(); s2.push("a"); s2.push("b")
assert repr(s2) == "Stack(['b', 'a'])", f"Got: {repr(s2)}"
try:
    Stack().pop()
    assert False
except IndexError:
    pass
try:
    Stack().peek()
    assert False
except IndexError:
    pass
print("OK")`,
      },

      // ── oop-07 ──────────────────────────────────────────────────────────────
      {
        id: 'oop-07',
        title: 'Vector2D — arithmetic operators',
        difficulty: 'medium',
        prompt: `Implement \`Vector2D\` with full arithmetic operator support.

**Requirements:**
- \`__init__(self, x: float, y: float)\`
- \`__add__\`, \`__sub__\` — vector addition and subtraction
- \`__mul__(self, scalar)\` — \`v * 3\`
- \`__rmul__(self, scalar)\` — \`3 * v\`
- \`__neg__\` — negate all components
- \`__abs__\` — magnitude (length of the vector)
- \`dot(self, other)\` — dot product
- \`__eq__\`, \`__repr__\` → \`"Vector2D(3, 4)"\``,
        setupCode: ``,
        starterCode: `class Vector2D:
    def __init__(self, x: float, y: float):
        pass

    def __add__(self, other: "Vector2D") -> "Vector2D":
        pass

    def __sub__(self, other: "Vector2D") -> "Vector2D":
        pass

    def __mul__(self, scalar: float) -> "Vector2D":
        pass

    def __rmul__(self, scalar: float) -> "Vector2D":
        pass

    def __neg__(self) -> "Vector2D":
        pass

    def __abs__(self) -> float:
        pass

    def dot(self, other: "Vector2D") -> float:
        pass

    def __eq__(self, other) -> bool:
        pass

    def __repr__(self) -> str:
        pass`,
        solution: `class Vector2D:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __add__(self, other: "Vector2D") -> "Vector2D":
        return Vector2D(self.x + other.x, self.y + other.y)

    def __sub__(self, other: "Vector2D") -> "Vector2D":
        return Vector2D(self.x - other.x, self.y - other.y)

    def __mul__(self, scalar: float) -> "Vector2D":
        return Vector2D(self.x * scalar, self.y * scalar)

    def __rmul__(self, scalar: float) -> "Vector2D":
        return self.__mul__(scalar)

    def __neg__(self) -> "Vector2D":
        return Vector2D(-self.x, -self.y)

    def __abs__(self) -> float:
        return (self.x**2 + self.y**2) ** 0.5

    def dot(self, other: "Vector2D") -> float:
        return self.x * other.x + self.y * other.y

    def __eq__(self, other) -> bool:
        if not isinstance(other, Vector2D):
            return NotImplemented
        return self.x == other.x and self.y == other.y

    def __repr__(self) -> str:
        return f"Vector2D({self.x}, {self.y})"`,
        testCode: `v1 = Vector2D(3, 4)
v2 = Vector2D(1, 2)
assert v1 + v2 == Vector2D(4, 6)
assert v1 - v2 == Vector2D(2, 2)
assert v1 * 2 == Vector2D(6, 8)
assert 2 * v1 == Vector2D(6, 8)
assert -v1 == Vector2D(-3, -4)
assert abs(v1) == 5.0
assert v1.dot(v2) == 11.0
assert repr(v1) == "Vector2D(3, 4)"
assert v1 == Vector2D(3, 4)
assert v1 != v2
print("OK")`,
      },

      // ── oop-08 ──────────────────────────────────────────────────────────────
      {
        id: 'oop-08',
        title: 'Animal, Dog, Cat — inheritance and polymorphism',
        difficulty: 'medium',
        prompt: `Build an animal class hierarchy using single inheritance.

**Requirements:**
- \`Animal(name: str, sound: str)\` — base class; \`speak()\` → \`"Rex says Woof!"\`
- \`Dog(name: str)\` — calls \`super().__init__(name, "Woof")\`; overrides \`speak()\` → \`"[name] fetches the ball and says Woof!"\`
- \`Cat(name: str)\` — calls \`super().__init__(name, "Meow")\`; overrides \`speak()\` → \`"[name] ignores you and says Meow"\`
- Function \`all_speak(animals: list) -> list[str]\` — returns the list of each animal's \`speak()\` result`,
        setupCode: ``,
        starterCode: `class Animal:
    def __init__(self, name: str, sound: str):
        pass

    def speak(self) -> str:
        pass

class Dog(Animal):
    def __init__(self, name: str):
        pass

    def speak(self) -> str:
        pass

class Cat(Animal):
    def __init__(self, name: str):
        pass

    def speak(self) -> str:
        pass

def all_speak(animals: list) -> list:
    pass`,
        solution: `class Animal:
    def __init__(self, name: str, sound: str):
        self.name = name
        self.sound = sound

    def speak(self) -> str:
        return f"{self.name} says {self.sound}!"

class Dog(Animal):
    def __init__(self, name: str):
        super().__init__(name, "Woof")

    def speak(self) -> str:
        return f"{self.name} fetches the ball and says {self.sound}!"

class Cat(Animal):
    def __init__(self, name: str):
        super().__init__(name, "Meow")

    def speak(self) -> str:
        return f"{self.name} ignores you and says {self.sound}"

def all_speak(animals: list) -> list:
    return [a.speak() for a in animals]`,
        testCode: `d = Dog("Rex")
c = Cat("Whiskers")
assert d.name == "Rex"
assert d.sound == "Woof"
assert "Rex" in d.speak() and "Woof" in d.speak() and "fetches" in d.speak()
assert "Whiskers" in c.speak() and "ignores" in c.speak()
animals = [Dog("Buddy"), Cat("Luna"), Dog("Max")]
results = all_speak(animals)
assert len(results) == 3
assert all(isinstance(r, str) for r in results)
assert "Buddy" in results[0]
print("OK")`,
      },

      // ── oop-09 ──────────────────────────────────────────────────────────────
      {
        id: 'oop-09',
        title: 'Shape — polymorphism with NotImplementedError',
        difficulty: 'medium',
        prompt: `Design a geometric shape hierarchy using polymorphism.

**Requirements:**
- \`Shape\` base: \`area()\` raises \`NotImplementedError\`; \`__repr__\` → class name
- \`Circle(radius)\` — area = π × r²
- \`Rectangle(width, height)\` — area = width × height
- \`Triangle(base, height)\` — area = 0.5 × base × height
- Function \`total_area(shapes: list) -> float\` — sum of all areas, rounded to 2 decimal places`,
        setupCode: `import math`,
        starterCode: `class Shape:
    def area(self) -> float:
        pass

    def __repr__(self) -> str:
        pass

class Circle(Shape):
    def __init__(self, radius: float):
        pass

    def area(self) -> float:
        pass

class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        pass

    def area(self) -> float:
        pass

class Triangle(Shape):
    def __init__(self, base: float, height: float):
        pass

    def area(self) -> float:
        pass

def total_area(shapes: list) -> float:
    pass`,
        solution: `class Shape:
    def area(self) -> float:
        raise NotImplementedError("Subclasses must implement area()")

    def __repr__(self) -> str:
        return self.__class__.__name__

class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius

    def area(self) -> float:
        return math.pi * self.radius ** 2

class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height

    def area(self) -> float:
        return self.width * self.height

class Triangle(Shape):
    def __init__(self, base: float, height: float):
        self.base = base
        self.height = height

    def area(self) -> float:
        return 0.5 * self.base * self.height

def total_area(shapes: list) -> float:
    return round(sum(s.area() for s in shapes), 2)`,
        testCode: `c = Circle(5)
r = Rectangle(4, 6)
t = Triangle(3, 8)
assert round(c.area(), 4) == round(math.pi * 25, 4)
assert r.area() == 24.0
assert t.area() == 12.0
shapes = [c, r, t]
expected = round(math.pi * 25 + 24 + 12, 2)
assert total_area(shapes) == expected, f"Expected {expected}, got {total_area(shapes)}"
try:
    Shape().area()
    assert False
except NotImplementedError:
    pass
assert repr(c) == "Circle"
assert repr(r) == "Rectangle"
print("OK")`,
      },

      // ── oop-10 ──────────────────────────────────────────────────────────────
      {
        id: 'oop-10',
        title: 'Formatter — ABC with abstract method',
        difficulty: 'medium',
        prompt: `Implement the Template Method pattern using an Abstract Base Class.

**Requirements:**
- \`Formatter(ABC)\`: abstract method \`format(record: dict) -> str\`; concrete method \`format_all(records: list) -> list[str]\` that calls \`format\` on each element
- \`JSONFormatter(Formatter)\`: \`format\` serializes with \`json.dumps\` (no extra spaces)
- \`TextFormatter(Formatter)\`: \`format\` → \`"k=v | k=v"\` with keys sorted alphabetically

\`Formatter\` cannot be instantiated directly.`,
        setupCode: `from abc import ABC, abstractmethod
import json`,
        starterCode: `class Formatter(ABC):
    @abstractmethod
    def format(self, record: dict) -> str:
        pass

    def format_all(self, records: list) -> list:
        pass

class JSONFormatter(Formatter):
    def format(self, record: dict) -> str:
        pass

class TextFormatter(Formatter):
    def format(self, record: dict) -> str:
        pass`,
        solution: `class Formatter(ABC):
    @abstractmethod
    def format(self, record: dict) -> str:
        pass

    def format_all(self, records: list) -> list:
        return [self.format(r) for r in records]

class JSONFormatter(Formatter):
    def format(self, record: dict) -> str:
        return json.dumps(record)

class TextFormatter(Formatter):
    def format(self, record: dict) -> str:
        return " | ".join(f"{k}={v}" for k, v in sorted(record.items()))`,
        testCode: `try:
    Formatter()
    assert False, "Should not instantiate ABC"
except TypeError:
    pass
records = [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]
jf = JSONFormatter()
tf = TextFormatter()
j_results = jf.format_all(records)
assert j_results[0] == '{"id": 1, "name": "Alice"}', f"Got: {j_results[0]}"
t_results = tf.format_all(records)
assert t_results[0] == "id=1 | name=Alice", f"Got: {t_results[0]}"
assert t_results[1] == "id=2 | name=Bob"
print("OK")`,
      },

      // ── oop-11 ──────────────────────────────────────────────────────────────
      {
        id: 'oop-11',
        title: 'Mixins — LogMixin + ValidateMixin',
        difficulty: 'hard',
        prompt: `Combine two Mixins in a concrete class using multiple inheritance.

**Requirements:**
- \`LogMixin\`: \`log(msg: str)\` — appends to \`self._logs\` (creates the list if it does not exist); \`get_logs() -> list[str]\`
- \`ValidateMixin\`: \`filter_none(records: list) -> list\` — removes dicts that have any \`None\` value
- \`DataCleaner(LogMixin, ValidateMixin)\`:
  - \`clean(records: list) -> list\` — filters using the mixin, then logs how many were removed and how many remain
  - Exact log messages: \`"Removed 2 invalid records"\` and \`"Kept 3 records"\``,
        setupCode: ``,
        starterCode: `class LogMixin:
    def log(self, msg: str):
        pass

    def get_logs(self) -> list:
        pass

class ValidateMixin:
    def filter_none(self, records: list) -> list:
        pass

class DataCleaner(LogMixin, ValidateMixin):
    def clean(self, records: list) -> list:
        pass`,
        solution: `class LogMixin:
    def log(self, msg: str):
        if not hasattr(self, '_logs'):
            self._logs = []
        self._logs.append(msg)

    def get_logs(self) -> list:
        return getattr(self, '_logs', [])

class ValidateMixin:
    def filter_none(self, records: list) -> list:
        return [r for r in records if None not in r.values()]

class DataCleaner(LogMixin, ValidateMixin):
    def clean(self, records: list) -> list:
        valid = self.filter_none(records)
        removed = len(records) - len(valid)
        self.log(f"Removed {removed} invalid records")
        self.log(f"Kept {len(valid)} records")
        return valid`,
        testCode: `records = [
    {"id": 1, "name": "Alice"},
    {"id": 2, "name": None},
    {"id": 3, "name": "Bob"},
    {"id": 4, "name": None},
    {"id": 5, "name": "Carol"},
]
cleaner = DataCleaner()
result = cleaner.clean(records)
assert len(result) == 3, f"Expected 3, got {len(result)}"
assert all(None not in r.values() for r in result)
logs = cleaner.get_logs()
assert logs[0] == "Removed 2 invalid records", f"Got: {logs[0]}"
assert logs[1] == "Kept 3 records", f"Got: {logs[1]}"
assert isinstance(cleaner, LogMixin)
assert isinstance(cleaner, ValidateMixin)
print("OK")`,
      },

      // ── oop-12 ──────────────────────────────────────────────────────────────
      {
        id: 'oop-12',
        title: 'DataPipeline — composition vs inheritance',
        difficulty: 'hard',
        prompt: `Build a data processing pipeline using composition instead of inheritance.

The \`Validator\` and \`Transformer\` classes are already defined in the setup code.

**Requirements for \`DataPipeline\`:**
- \`__init__(self, validator, transformer)\` — store both as attributes
- \`run(self, records: list) -> list\` — for each record:
  - If \`validator.validate(record)\` raises an exception, accumulate the error message in \`_errors\` and continue
  - If validation passes, apply \`transformer.transform(record)\` and add to results
- \`@property error_count\` — number of accumulated errors
- \`@property errors\` — list of error messages`,
        setupCode: `class Validator:
    def validate(self, record: dict):
        if record.get("amount", 0) < 0:
            raise ValueError(f"Negative amount: {record['amount']}")

class Transformer:
    def transform(self, record: dict) -> dict:
        return {**record, "amount": round(record["amount"], 2)}`,
        starterCode: `class DataPipeline:
    def __init__(self, validator, transformer):
        pass

    def run(self, records: list) -> list:
        pass

    @property
    def error_count(self) -> int:
        pass

    @property
    def errors(self) -> list:
        pass`,
        solution: `class DataPipeline:
    def __init__(self, validator, transformer):
        self.validator = validator
        self.transformer = transformer
        self._errors = []

    def run(self, records: list) -> list:
        results = []
        for record in records:
            try:
                self.validator.validate(record)
                results.append(self.transformer.transform(record))
            except Exception as e:
                self._errors.append(str(e))
        return results

    @property
    def error_count(self) -> int:
        return len(self._errors)

    @property
    def errors(self) -> list:
        return self._errors`,
        testCode: `pipeline = DataPipeline(Validator(), Transformer())
records = [
    {"id": 1, "amount": 19.999},
    {"id": 2, "amount": -5.0},
    {"id": 3, "amount": 42.1234},
    {"id": 4, "amount": -1.0},
]
result = pipeline.run(records)
assert len(result) == 2, f"Expected 2 valid, got {len(result)}"
assert result[0]["amount"] == 20.0
assert result[1]["amount"] == 42.12
assert pipeline.error_count == 2
assert len(pipeline.errors) == 2
assert "Negative amount" in pipeline.errors[0]
print("OK")`,
      },

      // ── oop-13 ──────────────────────────────────────────────────────────────
      {
        id: 'oop-13',
        title: 'RangeValidator — callable instances (__call__)',
        difficulty: 'hard',
        prompt: `Create a callable validator that can be used just like a function.

**Requirements:**
- \`RangeValidator(min_val: float, max_val: float, name: str = "value")\`
- \`__init__\` raises \`ValueError\` if \`min_val >= max_val\`
- \`__call__(self, value: float)\` — raises \`ValueError\` if \`value\` is not in \`[min_val, max_val]\`
- \`__repr__\` → \`"RangeValidator('price', 0..1000)"\`

Usage: \`validate_price = RangeValidator(0, 1000, 'price'); validate_price(500)\``,
        setupCode: ``,
        starterCode: `class RangeValidator:
    def __init__(self, min_val: float, max_val: float, name: str = "value"):
        pass

    def __call__(self, value: float):
        pass

    def __repr__(self) -> str:
        pass`,
        solution: `class RangeValidator:
    def __init__(self, min_val: float, max_val: float, name: str = "value"):
        if min_val >= max_val:
            raise ValueError(f"min_val must be less than max_val, got {min_val} >= {max_val}")
        self.min_val = min_val
        self.max_val = max_val
        self.name = name

    def __call__(self, value: float):
        if not (self.min_val <= value <= self.max_val):
            raise ValueError(f"{self.name} {value} out of range [{self.min_val}, {self.max_val}]")

    def __repr__(self) -> str:
        return f"RangeValidator('{self.name}', {self.min_val}..{self.max_val})"`,
        testCode: `validate_price = RangeValidator(0, 1000, "price")
validate_price(0)
validate_price(500)
validate_price(1000)
try:
    validate_price(-1)
    assert False
except ValueError as e:
    assert "price" in str(e)
try:
    validate_price(1001)
    assert False
except ValueError:
    pass
try:
    RangeValidator(100, 10, "bad")
    assert False
except ValueError:
    pass
assert repr(validate_price) == "RangeValidator('price', 0..1000)", f"Got: {repr(validate_price)}"
print("OK")`,
      },

      // ── oop-14 ──────────────────────────────────────────────────────────────
      {
        id: 'oop-14',
        title: 'Timer — context manager (__enter__ / __exit__)',
        difficulty: 'hard',
        prompt: `Implement a context manager that measures execution time.

**Requirements:**
- \`Timer(name: str = "")\`
- \`__enter__\` — records \`time.perf_counter()\`, returns \`self\`
- \`__exit__(exc_type, exc_val, exc_tb)\` — computes \`self.elapsed\`, returns \`False\` (do not suppress exceptions)
- \`@property elapsed\` — raises \`RuntimeError\` if accessed before exiting the \`with\` block
- \`__repr__\` → \`"Timer('etl')"\` or \`"Timer()"\` if name is empty`,
        setupCode: `import time`,
        starterCode: `class Timer:
    def __init__(self, name: str = ""):
        pass

    def __enter__(self) -> "Timer":
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        pass

    @property
    def elapsed(self) -> float:
        pass

    def __repr__(self) -> str:
        pass`,
        solution: `class Timer:
    def __init__(self, name: str = ""):
        self.name = name
        self._elapsed = None

    def __enter__(self) -> "Timer":
        self._start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self._elapsed = time.perf_counter() - self._start
        return False

    @property
    def elapsed(self) -> float:
        if self._elapsed is None:
            raise RuntimeError("Timer has not been used as a context manager yet")
        return self._elapsed

    def __repr__(self) -> str:
        if self.name:
            return f"Timer('{self.name}')"
        return "Timer()"`,
        testCode: `try:
    Timer().elapsed
    assert False
except RuntimeError:
    pass

with Timer("test") as t:
    total = sum(range(100_000))

assert t.elapsed > 0, "elapsed should be positive"
assert t.elapsed < 5.0, "should complete quickly"
assert repr(t) == "Timer('test')", f"Got: {repr(t)}"
assert repr(Timer()) == "Timer()"

try:
    with Timer() as t2:
        raise ValueError("boom")
except ValueError:
    pass
assert t2.elapsed > 0, "__exit__ must run even on exception"
print("OK")`,
      },

      // ── oop-15 ──────────────────────────────────────────────────────────────
      {
        id: 'oop-15',
        title: 'ETLPipeline — capstone: putting it all together',
        difficulty: 'hard',
        prompt: `Combine everything you have learned into a reusable ETL pipeline.

The base classes \`LogMixin\`, \`Extractor(ABC)\`, \`Loader(ABC)\`, \`ListExtractor\`, and \`MemoryLoader\` are already defined in the setup code.

**Implement \`ETLPipeline(LogMixin)\`:**
- \`__init__(self, extractor, loader)\` — composition
- \`transform(self, records: list) -> list\` — no-op by default (returns records unchanged); designed to be overridden
- \`run(self) -> dict\` → \`{"extracted": n, "loaded": m}\` with a log message for each step
  - Exact log messages: \`"Starting ETL"\`, \`"Extracted 5 records"\`, \`"Loaded 5 records"\`
- \`__enter__ / __exit__\` — logs \`"ETL done"\` on clean exit, \`"ETL failed: {err}"\` on exception; returns \`False\``,
        setupCode: `from abc import ABC, abstractmethod

class LogMixin:
    def log(self, msg: str):
        if not hasattr(self, '_logs'):
            self._logs = []
        self._logs.append(msg)
    def get_logs(self) -> list:
        return getattr(self, '_logs', [])

class Extractor(ABC):
    @abstractmethod
    def extract(self) -> list: ...

class Loader(ABC):
    @abstractmethod
    def load(self, records: list) -> int: ...

class ListExtractor(Extractor):
    def __init__(self, data: list):
        self._data = data
    def extract(self) -> list:
        return list(self._data)

class MemoryLoader(Loader):
    def __init__(self):
        self.stored = []
    def load(self, records: list) -> int:
        self.stored.extend(records)
        return len(records)`,
        starterCode: `class ETLPipeline(LogMixin):
    def __init__(self, extractor, loader):
        pass

    def transform(self, records: list) -> list:
        pass

    def run(self) -> dict:
        pass

    def __enter__(self) -> "ETLPipeline":
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        pass`,
        solution: `class ETLPipeline(LogMixin):
    def __init__(self, extractor, loader):
        self.extractor = extractor
        self.loader = loader

    def transform(self, records: list) -> list:
        return records

    def run(self) -> dict:
        self.log("Starting ETL")
        records = self.extractor.extract()
        self.log(f"Extracted {len(records)} records")
        transformed = self.transform(records)
        loaded = self.loader.load(transformed)
        self.log(f"Loaded {loaded} records")
        return {"extracted": len(records), "loaded": loaded}

    def __enter__(self) -> "ETLPipeline":
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_val is None:
            self.log("ETL done")
        else:
            self.log(f"ETL failed: {exc_val}")
        return False`,
        testCode: `data = [{"id": i, "val": i * 10} for i in range(5)]
loader = MemoryLoader()
pipeline = ETLPipeline(ListExtractor(data), loader)
result = pipeline.run()
assert result == {"extracted": 5, "loaded": 5}, f"Got: {result}"
assert len(loader.stored) == 5
logs = pipeline.get_logs()
assert logs[0] == "Starting ETL"
assert logs[1] == "Extracted 5 records"
assert logs[2] == "Loaded 5 records"

loader2 = MemoryLoader()
pipeline2 = ETLPipeline(ListExtractor(data), loader2)
with pipeline2 as p:
    p.run()
assert "ETL done" in pipeline2.get_logs()

loader3 = MemoryLoader()
pipeline3 = ETLPipeline(ListExtractor(data), loader3)
try:
    with pipeline3 as p:
        p.run()
        raise RuntimeError("disk full")
except RuntimeError:
    pass
assert any("ETL failed" in l for l in pipeline3.get_logs()), f"Logs: {pipeline3.get_logs()}"
print("OK")`,
      },
    ],
  },
];
