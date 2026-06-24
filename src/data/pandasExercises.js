// ─── Pandas Drills ─────────────────────────────────────────────────────────────
// Topics added so far:
//   1. pd-create   — Creating DataFrames             (7 exercises)
//   2. pd-select   — Selecting & Filtering           (7 exercises)

export const PANDAS_TOPICS = [

  // ─── TOPIC 1: Creating DataFrames ────────────────────────────────────────────
  {
    id: 'pd-create',
    title: 'Creating DataFrames',
    description: 'Build DataFrames from Python dicts and lists, inspect their structure, select columns, add computed fields, and reset the index.',
    lesson: {
      intro: 'A DataFrame is pandas\' central object: a 2-D table where every row is one observation and every column is a typed variable. You can build one from Python data structures you already have (lists of dicts, dicts of lists), inspect it immediately, and start adding or selecting columns. Understanding how the index works — and how to reset it — is essential before anything else.',
      concepts: [
        {
          title: 'pd.DataFrame() from a list of dicts',
          body: 'The most natural way to create a DataFrame: pass a list of dicts where each dict is one row. The keys become column names. If a row is missing a key it gets NaN for that column. pandas automatically assigns a numeric index 0, 1, 2, … to each row.',
          code: `import pandas as pd

data = [
    {"name": "Ana",  "age": 28, "city": "Madrid"},
    {"name": "Ben",  "age": 34, "city": "Lima"},
    {"name": "Cara", "age": 22},          # city missing → NaN
]
df = pd.DataFrame(data)
print(df)
#    name  age    city
# 0   Ana   28  Madrid
# 1   Ben   34    Lima
# 2  Cara   22     NaN

print(df.columns.tolist())   # ['name', 'age', 'city']
print(len(df))               # 3  (number of rows)`,
          note: 'The 0, 1, 2 index on the left is added automatically by pandas. It is not a column — it lives at df.index.',
        },
        {
          title: 'pd.DataFrame() from a dict of lists',
          body: 'An alternative format: a dict where each key is a column name and the value is a list of values for that column. All lists must be the same length, otherwise pandas raises a ValueError. This format is handy when your data is already organised by column (e.g. from a CSV reader or an API response).',
          code: `import pandas as pd

df = pd.DataFrame({
    "product": ["Laptop", "Mouse", "Keyboard"],
    "price":   [999.0, 29.99, 79.0],
    "stock":   [15, 200, 85],
})
print(df)
#     product   price  stock
# 0    Laptop  999.00     15
# 1     Mouse   29.99    200
# 2  Keyboard   79.00     85`,
        },
        {
          title: 'Inspecting a DataFrame: shape, dtypes, head()',
          body: 'Before analysing data always inspect it first. df.shape returns a tuple (rows, cols). df.dtypes shows the data type of each column. df.head(n) shows the first n rows (default 5). len(df) gives the row count. The dtype "object" means string (or mixed types) — numeric columns stored as object will silently fail in aggregations.',
          code: `df = pd.DataFrame({
    "id":    [1, 2, 3],
    "name":  ["Alice", "Bob", "Carol"],
    "score": [85.5, 92.0, 78.3],
})

print(df.shape)     # (3, 3)  → 3 rows, 3 columns
rows, cols = df.shape   # unpack the tuple

print(df.dtypes)
# id        int64
# name     object   ← string dtype
# score   float64

print(df.head(2))
#    id   name  score
# 0   1  Alice   85.5
# 1   2    Bob   92.0

print(list(df.columns))   # ['id', 'name', 'score']`,
          note: 'Always run df.dtypes after loading data. If a numeric column shows "object", cast it with df["col"].astype(float).',
        },
        {
          title: 'Selecting columns: df["col"] vs df[["c1", "c2"]]',
          body: 'df["col"] selects one column and returns a Series (1-D). df[["col1", "col2"]] selects multiple columns and returns a DataFrame (2-D). The double brackets are not a typo — the outer [] is the indexing operator and the inner [] is a Python list of names. Mixing them up is one of the most common pandas mistakes.',
          code: `# Single column → Series (1D)
prices = df["price"]
print(type(prices))         # pandas.core.series.Series
print(prices.tolist())      # [999.0, 29.99, 79.0]

# Multiple columns → DataFrame (2D)
subset = df[["product", "price"]]
print(type(subset))         # pandas.core.frame.DataFrame
print(subset)
#     product   price
# 0    Laptop  999.00
# 1     Mouse   29.99
# 2  Keyboard   79.00

# Common mistake — this raises a KeyError:
# df["product", "price"]   ← wrong: no inner list`,
          note: 'Single brackets → Series. Double brackets → DataFrame. A Series has no .columns attribute; a DataFrame does.',
        },
        {
          title: 'Adding columns + reset_index(drop=True)',
          body: 'Assign a new column with df["new"] = expression. The expression operates element-wise on existing columns (no loop needed). After filtering rows, the original index values are preserved — creating gaps (e.g. 0, 2, 4). reset_index(drop=True) resets to a clean 0, 1, 2 sequence. Without drop=True the old index becomes a new column, which is rarely what you want.',
          code: `df["total"] = df["price"] * df["stock"]  # element-wise, no loop

# After filtering, the index has gaps
expensive = df[df["price"] > 100]
print(expensive.index.tolist())           # [0] — only Laptop remains

# reset_index(drop=True) gives a clean 0, 1, 2 index
expensive = expensive.reset_index(drop=True)
print(expensive.index.tolist())           # [0]

# Without drop=True, the old index becomes a column:
messy = df[df["price"] > 100].reset_index()
print(messy.columns.tolist())  # ['index', 'product', 'price', 'stock', 'total']
#                                             ^ unwanted extra column`,
          note: 'Always use reset_index(drop=True) unless you specifically need the old index as a column. And always work on a copy — df = df.copy() — to avoid accidentally modifying the original.',
        },
      ],
    },
    exercises: [
      {
        id: 'pd-cr-01',
        concept: 0,
        prompt: 'Write `make_df(data)` that creates a DataFrame from `data` (a list of dicts) and returns it. Each dict has the keys `"name"`, `"age"`, and `"city"`.',
        hint: 'One line: return pd.DataFrame(data)',
        setupCode: `import pandas as pd

data = [
    {"name": "Ana",     "age": 28, "city": "Madrid"},
    {"name": "Ben",     "age": 34, "city": "Lima"},
    {"name": "Cara",    "age": 22, "city": "Buenos Aires"},
    {"name": "Daniel",  "age": 41, "city": "London"},
]`,
        starterCode: `def make_df(data):
    # Create a DataFrame from the list of dicts and return it
    ...`,
        solution: `def make_df(data):
    return pd.DataFrame(data)`,
        testCode: `result = make_df(data)
assert list(result.columns) == ["name", "age", "city"], f"Columns: {list(result.columns)}"
assert len(result) == 4, f"Expected 4 rows, got {len(result)}"
assert result.iloc[0]["name"] == "Ana"
assert result.iloc[2]["city"] == "Buenos Aires"
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-cr-02',
        concept: 1,
        prompt: 'Write `build_inventory(cols)` that creates a DataFrame from `cols` (a dict of lists) and returns it.',
        hint: 'One line: return pd.DataFrame(cols)',
        setupCode: `import pandas as pd

cols = {
    "product": ["Laptop", "Mouse", "Keyboard", "Monitor"],
    "price":   [999.0, 29.99, 79.0, 349.0],
    "stock":   [15, 200, 85, 30],
}`,
        starterCode: `def build_inventory(cols):
    # Create a DataFrame from the dict of lists and return it
    ...`,
        solution: `def build_inventory(cols):
    return pd.DataFrame(cols)`,
        testCode: `result = build_inventory(cols)
assert list(result.columns) == ["product", "price", "stock"]
assert len(result) == 4
assert result["price"].tolist() == [999.0, 29.99, 79.0, 349.0]
assert result["product"].iloc[0] == "Laptop"
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-cr-03',
        concept: 2,
        prompt: 'Write `inspect_df(df)` that returns a dict with three keys: `"rows"` (number of rows), `"cols"` (number of columns), and `"column_names"` (list of column names).',
        hint: 'df.shape returns a tuple (rows, cols). Unpack it with rows, cols = df.shape. Use list(df.columns) for the column names.',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "id":     [1, 2, 3, 4],
    "name":   ["Alice", "Bob", "Carol", "Dave"],
    "score":  [85.5, 92.0, 78.3, 95.1],
    "passed": [True, True, True, True],
})`,
        starterCode: `def inspect_df(df):
    # df.shape → (rows, cols)
    # list(df.columns) → column names
    ...`,
        solution: `def inspect_df(df):
    rows, cols = df.shape
    return {
        "rows":         rows,
        "cols":         cols,
        "column_names": list(df.columns),
    }`,
        testCode: `result = inspect_df(df)
assert result["rows"] == 4,            f"rows: {result['rows']}"
assert result["cols"] == 4,            f"cols: {result['cols']}"
assert result["column_names"] == ["id", "name", "score", "passed"]
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-cr-04',
        concept: 3,
        prompt: 'Write `get_scores(df)` that returns the `"score"` column as a **Series** (not a DataFrame).',
        hint: 'Use single brackets: df["score"]. If you use df[["score"]] you get a DataFrame instead of a Series and the test will fail.',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "id":    [1, 2, 3, 4],
    "name":  ["Alice", "Bob", "Carol", "Dave"],
    "score": [85.5, 92.0, 78.3, 95.1],
})`,
        starterCode: `def get_scores(df):
    # Return the "score" column as a Series — use single brackets df["score"]
    ...`,
        solution: `def get_scores(df):
    return df["score"]`,
        testCode: `result = get_scores(df)
assert isinstance(result, pd.Series), f"Expected Series, got {type(result).__name__}"
assert result.tolist() == [85.5, 92.0, 78.3, 95.1]
assert result.name == "score"
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-cr-05',
        concept: 3,
        prompt: 'Write `get_catalog(df)` that returns a **DataFrame** with only the `"product"` and `"price"` columns (in that order). The `"stock"` and `"category"` columns must not appear in the result.',
        hint: 'Use double brackets to get a DataFrame: df[["product", "price"]]',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "product":  ["Laptop", "Mouse", "Keyboard", "Monitor"],
    "price":    [999.0, 29.99, 79.0, 349.0],
    "stock":    [15, 200, 85, 30],
    "category": ["Electronics", "Accessories", "Accessories", "Electronics"],
})`,
        starterCode: `def get_catalog(df):
    # Return a DataFrame with only "product" and "price"
    # Use double brackets: df[["col1", "col2"]]
    ...`,
        solution: `def get_catalog(df):
    return df[["product", "price"]]`,
        testCode: `import pandas as pd
result = get_catalog(df)
assert isinstance(result, pd.DataFrame), f"Expected DataFrame, got {type(result).__name__}"
assert list(result.columns) == ["product", "price"], f"Columns: {list(result.columns)}"
assert "stock" not in result.columns
assert "category" not in result.columns
assert len(result) == 4
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-cr-06',
        concept: 4,
        prompt: 'Write `add_total_value(df)` that adds a `"total_value"` column equal to `price × stock`, and returns the full DataFrame. The original DataFrame must **not** be modified.',
        hint: 'Start with df = df.copy(), then assign: df["total_value"] = df["price"] * df["stock"].',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "product": ["Laptop", "Mouse", "Keyboard", "Monitor"],
    "price":   [999.0, 29.99, 79.0, 349.0],
    "stock":   [15, 200, 85, 30],
})`,
        starterCode: `def add_total_value(df):
    df = df.copy()   # don't modify the original
    # Add "total_value" = price * stock
    ...`,
        solution: `def add_total_value(df):
    df = df.copy()
    df["total_value"] = df["price"] * df["stock"]
    return df`,
        testCode: `result = add_total_value(df)
assert "total_value" in result.columns, "Column 'total_value' not found"
# Laptop: 999*15=14985, Mouse: 29.99*200=5998, Keyboard: 79*85=6715, Monitor: 349*30=10470
assert result["total_value"].tolist() == [14985.0, 5998.0, 6715.0, 10470.0]
assert "total_value" not in df.columns, "Original DataFrame was modified!"
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-cr-07',
        concept: 4,
        prompt: `Write \`make_report(df)\` that does all of the following and returns the result:
1. Adds a \`"status"\` column: \`"in stock"\` if stock > 0, else \`"out of stock"\`
2. Sorts by \`"price"\` descending
3. Resets the index (use drop=True so the old index does not become a column)`,
        hint: 'For the status column use .apply() with a lambda. Then chain .sort_values("price", ascending=False).reset_index(drop=True).',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "product": ["Laptop", "Mouse", "Keyboard", "Monitor"],
    "price":   [999.0, 29.99, 79.0, 349.0],
    "stock":   [15, 200, 85, 0],
})`,
        starterCode: `def make_report(df):
    df = df.copy()
    # 1. Add "status": "in stock" if stock > 0, else "out of stock"
    # 2. Sort by price descending
    # 3. Reset index with drop=True
    ...`,
        solution: `def make_report(df):
    df = df.copy()
    df["status"] = df["stock"].apply(lambda s: "in stock" if s > 0 else "out of stock")
    return df.sort_values("price", ascending=False).reset_index(drop=True)`,
        testCode: `result = make_report(df)
assert "status" in result.columns
# Sorted by price desc: Laptop(999), Monitor(349), Keyboard(79), Mouse(29.99)
assert result["product"].tolist() == ["Laptop", "Monitor", "Keyboard", "Mouse"]
# Monitor has stock=0 → "out of stock"; others have stock > 0
assert result["status"].tolist() == ["in stock", "out of stock", "in stock", "in stock"]
assert result.index.tolist() == [0, 1, 2, 3], f"Index: {result.index.tolist()}"
print("All tests passed!")
print(result)`,
      },
    ],
  },

  // ─── TOPIC 2: Selecting & Filtering ──────────────────────────────────────────
  {
    id: 'pd-select',
    title: 'Selecting & Filtering',
    description: 'Filter rows with boolean masks, combine conditions with & | ~, use isin(), and select rows and columns together with .loc[].',
    lesson: {
      intro: 'Filtering is the most frequent operation in pandas. You build a boolean mask — a Series of True/False values with the same index as your DataFrame — and use it to keep only the matching rows. pandas provides operators for combining masks and methods like .isin() for membership checks. The .loc[] accessor lets you filter rows and select columns in a single step, which is both readable and efficient.',
      concepts: [
        {
          title: 'Boolean masks: filtering rows with a condition',
          body: 'A boolean mask is a Series of True/False values you get by comparing a column to a value. Passing the mask back into the DataFrame keeps only the True rows. The comparison operators are: > (greater than), < (less than), >= (≥), <= (≤), == (equal), != (not equal).',
          code: `import pandas as pd

df = pd.DataFrame({
    "product": ["Laptop", "Mouse", "Keyboard", "Monitor"],
    "price":   [999.0, 29.99, 79.0, 349.0],
    "stock":   [15, 200, 85, 30],
})

# Step 1: build the mask
mask = df["price"] > 100
print(mask)
# 0     True
# 1    False
# 2    False
# 3     True

# Step 2: apply the mask
result = df[mask]       # keeps only rows where mask is True
print(result)
#   product   price  stock
# 0  Laptop  999.00     15
# 3  Monitor 349.00     30

# One-liner (most common style)
result = df[df["price"] > 100]`,
          note: 'Notice the index still shows 0 and 3 — the original positions. Use .reset_index(drop=True) if you need a clean 0, 1, 2 index after filtering.',
        },
        {
          title: 'Combining conditions: & (AND), | (OR), ~ (NOT)',
          body: 'Combine multiple masks with & (both must be True), | (at least one must be True), or ~ (inverts True/False). Each condition must be wrapped in its own parentheses — Python\'s precedence rules will produce wrong results without them. Never use Python\'s "and", "or", "not" keywords with pandas masks; they compare whole Series instead of element-by-element.',
          code: `# AND: both conditions must be True
expensive_and_available = df[(df["price"] > 100) & (df["stock"] > 0)]

# OR: at least one condition must be True
cheap_or_plenty = df[(df["price"] < 50) | (df["stock"] > 100)]

# NOT: invert the mask
not_expensive = df[~(df["price"] > 100)]

# WRONG — do not use 'and' / 'or' — raises ValueError:
# df[df["price"] > 100 and df["stock"] > 0]   ← error`,
          note: 'Always wrap each condition in parentheses before combining with & or |. Forgetting the parentheses is the single most common pandas syntax error.',
        },
        {
          title: '.isin() — filter by a list of allowed values',
          body: '.isin(values) returns True for every row whose column value appears in the provided list. It is the pandas equivalent of SQL\'s IN (...). Combine with ~ to get NOT IN. isin() is cleaner than chaining multiple == conditions with |.',
          code: `# Keep rows where category is Electronics or Accessories
allowed = ["Electronics", "Accessories"]
result = df[df["category"].isin(allowed)]

# Exclude certain values (NOT IN)
result = df[~df["category"].isin(["Books", "Clothing"])]

# Equivalent without isin — harder to read:
result = df[(df["category"] == "Electronics") | (df["category"] == "Accessories")]`,
        },
        {
          title: '.loc[row_mask, column_list] — filter rows and select columns together',
          body: '.loc[] takes two arguments separated by a comma: the first selects rows (a boolean mask or label), the second selects columns (a column name or list of names). This lets you filter and project in one readable step. The result always has the column order you specify.',
          code: `df = pd.DataFrame({
    "id":    [1, 2, 3, 4, 5],
    "name":  ["Alice", "Bob", "Carol", "Dana", "Eve"],
    "score": [88, 54, 92, 71, 45],
    "grade": ["B", "F", "A", "C", "F"],
})

# Keep rows where score >= 80, return only name and score
result = df.loc[df["score"] >= 80, ["name", "score"]]
print(result)
#     name  score
# 0  Alice     88
# 2  Carol     92

# Single column with loc (returns a Series)
names = df.loc[df["score"] >= 80, "name"]`,
          note: '.loc uses label-based indexing. The row selector can be a boolean mask, a label, or a slice of labels. The column selector can be a single name (returns Series) or a list of names (returns DataFrame).',
        },
        {
          title: '.copy() — avoid the SettingWithCopyWarning',
          body: 'When you filter a DataFrame and then try to modify the result, pandas may warn that you are editing a "slice" of another DataFrame. The fix is to call .copy() on the filtered result to make a fully independent DataFrame. As a rule: always call .copy() right after filtering if you plan to add or change columns.',
          code: `# Without .copy() — may trigger SettingWithCopyWarning
subset = df[df["score"] >= 80]
subset["grade"] = "A"   # WARNING: might not modify subset, might modify df

# With .copy() — safe, no warnings
subset = df[df["score"] >= 80].copy()
subset["grade"] = "A"   # modifies only subset, df is unchanged

# Equivalent: filter, then .copy() on its own line
subset = df[df["score"] >= 80]
subset = subset.copy()`,
          note: 'In functions that receive a DataFrame and return a modified version, always start with df = df.copy() to avoid modifying the caller\'s data.',
        },
      ],
    },
    exercises: [
      {
        id: 'pd-sl-01',
        concept: 0,
        prompt: 'Write `filter_expensive(df, min_price)` that returns rows where `price >= min_price`. Reset the index with `drop=True`.',
        hint: 'df[df["price"] >= min_price].reset_index(drop=True)',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "product": ["Laptop", "Mouse", "Keyboard", "Monitor", "Headset"],
    "price":   [999.0, 29.99, 79.0, 349.0, 149.0],
    "stock":   [15, 200, 85, 30, 60],
})`,
        starterCode: `def filter_expensive(df, min_price):
    # Return rows where price >= min_price, index reset
    ...`,
        solution: `def filter_expensive(df, min_price):
    return df[df["price"] >= min_price].reset_index(drop=True)`,
        testCode: `r1 = filter_expensive(df, 100)
assert r1["product"].tolist() == ["Laptop", "Monitor", "Headset"], f"Got: {r1['product'].tolist()}"
assert r1.index.tolist() == [0, 1, 2]

r2 = filter_expensive(df, 500)
assert r2["product"].tolist() == ["Laptop"]

r3 = filter_expensive(df, 0)
assert len(r3) == 5
print("All tests passed!")
print(r1)`,
      },
      {
        id: 'pd-sl-02',
        concept: 0,
        prompt: 'Write `filter_by_country(df, country)` that returns only rows where the `"country"` column exactly equals `country`. Reset the index.',
        hint: 'Use == for equality: df[df["country"] == country]',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "name":    ["Alice", "Bob", "Charlie", "Diana", "Eve"],
    "country": ["US", "UK", "US", "CA", "UK"],
    "salary":  [75000, 85000, 48000, 110000, 63000],
})`,
        starterCode: `def filter_by_country(df, country):
    # Return rows where country column == country argument, index reset
    ...`,
        solution: `def filter_by_country(df, country):
    return df[df["country"] == country].reset_index(drop=True)`,
        testCode: `r1 = filter_by_country(df, "US")
assert r1["name"].tolist() == ["Alice", "Charlie"]
assert r1.index.tolist() == [0, 1]

r2 = filter_by_country(df, "UK")
assert r2["name"].tolist() == ["Bob", "Eve"]

r3 = filter_by_country(df, "CA")
assert len(r3) == 1 and r3.iloc[0]["name"] == "Diana"
print("All tests passed!")
print(r1)`,
      },
      {
        id: 'pd-sl-03',
        concept: 1,
        prompt: 'Write `filter_senior_earners(df)` that returns employees whose `age >= 30` **AND** `salary > 70000`. Reset the index.',
        hint: 'Combine two masks with &. Wrap each condition in parentheses: (df["age"] >= 30) & (df["salary"] > 70000)',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "name":   ["Alice", "Bob", "Charlie", "Diana", "Eve"],
    "age":    [25, 34, 29, 42, 31],
    "country":["US", "UK", "US", "CA", "UK"],
    "salary": [55000, 85000, 48000, 92000, 63000],
})`,
        starterCode: `def filter_senior_earners(df):
    # Keep rows where age >= 30 AND salary > 70000
    # Use & to combine; wrap each condition in ()
    ...`,
        solution: `def filter_senior_earners(df):
    mask = (df["age"] >= 30) & (df["salary"] > 70000)
    return df[mask].reset_index(drop=True)`,
        testCode: `result = filter_senior_earners(df)
# Bob: age=34 ✓, salary=85000 ✓
# Diana: age=42 ✓, salary=92000 ✓
# Eve: age=31 ✓, salary=63000 ✗ (salary not > 70000)
assert result["name"].tolist() == ["Bob", "Diana"], f"Got: {result['name'].tolist()}"
assert result.index.tolist() == [0, 1]
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-sl-04',
        concept: 1,
        prompt: 'Write `filter_london_or_highpay(df)` that returns rows where `city == "London"` **OR** `salary > 80000`. Reset the index.',
        hint: 'Use | to combine conditions. Wrap each in parentheses: (condition1) | (condition2)',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "name":   ["Alice", "Bob", "Charlie", "Diana", "Eve"],
    "city":   ["Madrid", "London", "NYC", "Paris", "London"],
    "salary": [55000, 85000, 48000, 92000, 63000],
})`,
        starterCode: `def filter_london_or_highpay(df):
    # Keep rows where city == "London" OR salary > 80000
    ...`,
        solution: `def filter_london_or_highpay(df):
    mask = (df["city"] == "London") | (df["salary"] > 80000)
    return df[mask].reset_index(drop=True)`,
        testCode: `result = filter_london_or_highpay(df)
# Bob: London ✓ and salary 85000 ✓
# Diana: Paris, salary 92000 ✓ (salary > 80000)
# Eve: London ✓, salary 63000
assert result["name"].tolist() == ["Bob", "Diana", "Eve"], f"Got: {result['name'].tolist()}"
assert result.index.tolist() == [0, 1, 2]
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-sl-05',
        concept: 2,
        prompt: 'Write `filter_tech_products(df)` that keeps only rows where `category` is `"Electronics"` or `"Accessories"`. Use `.isin()`. Reset the index.',
        hint: 'df[df["category"].isin(["Electronics", "Accessories"])].reset_index(drop=True)',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "product":  ["Laptop", "Novel", "T-Shirt", "Phone", "Apple", "Tablet"],
    "category": ["Electronics", "Books", "Clothing", "Electronics", "Food", "Electronics"],
    "price":    [999.0, 15.0, 25.0, 799.0, 1.5, 499.0],
})`,
        starterCode: `def filter_tech_products(df):
    # Keep rows where category is "Electronics" or "Accessories"
    # Use .isin() instead of chaining multiple == conditions
    ...`,
        solution: `def filter_tech_products(df):
    return df[df["category"].isin(["Electronics", "Accessories"])].reset_index(drop=True)`,
        testCode: `result = filter_tech_products(df)
assert result["product"].tolist() == ["Laptop", "Phone", "Tablet"], f"Got: {result['product'].tolist()}"
assert result["category"].unique().tolist() == ["Electronics"]
assert result.index.tolist() == [0, 1, 2]
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-sl-06',
        concept: 3,
        prompt: 'Write `get_passing_names(df)` that uses `.loc[]` to return **only** the `"name"` and `"score"` columns for rows where `score >= 70`. Reset the index.',
        hint: 'df.loc[df["score"] >= 70, ["name", "score"]].reset_index(drop=True)',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "id":    [1, 2, 3, 4, 5],
    "name":  ["Alice", "Bob", "Charlie", "Diana", "Eve"],
    "score": [88, 54, 92, 71, 45],
    "grade": ["B", "F", "A", "C", "F"],
})`,
        starterCode: `def get_passing_names(df):
    # Use .loc[mask, column_list] to filter rows and select columns at once
    # Return rows where score >= 70, keeping only "name" and "score"
    ...`,
        solution: `def get_passing_names(df):
    return df.loc[df["score"] >= 70, ["name", "score"]].reset_index(drop=True)`,
        testCode: `result = get_passing_names(df)
assert list(result.columns) == ["name", "score"], f"Columns: {list(result.columns)}"
assert result["name"].tolist() == ["Alice", "Charlie", "Diana"]
assert result["score"].tolist() == [88, 92, 71]
assert "id" not in result.columns
assert "grade" not in result.columns
assert result.index.tolist() == [0, 1, 2]
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-sl-07',
        concept: 4,
        prompt: `Write \`get_active_us_earners(df)\` that:
1. Keeps rows where \`active == True\`, \`country == "US"\`, and \`salary > 60000\` (all three conditions)
2. Returns **only** the \`"name"\` and \`"salary"\` columns using \`.loc[]\`
3. Returns a copy with the index reset`,
        hint: 'Build the combined mask first: mask = (cond1) & (cond2) & (cond3). Then use df.loc[mask, ["name","salary"]].reset_index(drop=True).copy()',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "name":    ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"],
    "country": ["US", "UK", "US", "CA", "US", "UK"],
    "age":     [28, 35, 22, 41, 33, 29],
    "salary":  [75000, 90000, 45000, 110000, 68000, 52000],
    "active":  [True, True, False, True, True, False],
})`,
        starterCode: `def get_active_us_earners(df):
    # All three: active==True AND country=="US" AND salary>60000
    # Return only name and salary, copy with reset index
    ...`,
        solution: `def get_active_us_earners(df):
    mask = (df["active"] == True) & (df["country"] == "US") & (df["salary"] > 60000)
    return df.loc[mask, ["name", "salary"]].reset_index(drop=True).copy()`,
        testCode: `result = get_active_us_earners(df)
# Alice: US, active, salary=75000 ✓
# Charlie: US, active=False ✗
# Eve: US, active, salary=68000 ✓
assert list(result.columns) == ["name", "salary"], f"Columns: {list(result.columns)}"
assert result["name"].tolist() == ["Alice", "Eve"], f"Got: {result['name'].tolist()}"
assert result["salary"].tolist() == [75000, 68000]
assert result.index.tolist() == [0, 1]
print("All tests passed!")
print(result)`,
      },
    ],
  },


  // ─── TOPIC 3: Transforming Columns ───────────────────────────────────────────
  {
    id: 'pd-transform',
    title: 'Transforming Columns',
    description: 'Add computed columns with arithmetic, .apply(), .map(), np.where(), and chainable .assign().',
    lesson: {
      intro: 'Transforming columns is how you derive new information from existing data — revenue from price × quantity, categories from thresholds, regions from country codes. pandas gives you four tools for this, each with a different trade-off between speed and flexibility. Understanding which one to reach for first saves a lot of time.',
      concepts: [
        {
          title: 'Vectorized arithmetic — the fastest way',
          body: 'Arithmetic operators (+, -, *, /, //, %) work element-wise on entire columns without any loop. Mixing a column with a scalar (single number) broadcasts the scalar across all rows. This is always the first option to consider because it is the simplest to read and the fastest to run.',
          code: `import pandas as pd

df = pd.DataFrame({
    "product":  ["Laptop", "Mouse", "Keyboard"],
    "price":    [999.0, 29.99, 79.0],
    "quantity": [3, 15, 8],
    "cost":     [600.0, 10.0, 30.0],
})

df["revenue"] = df["price"] * df["quantity"]   # element-wise multiply
df["profit"]  = df["revenue"] - df["cost"] * df["quantity"]
df["vat"]     = df["price"] * 1.21             # scalar broadcast

# Arithmetic never modifies in place — always assign to a column name
print(df[["product", "revenue", "profit"]])
#    product  revenue   profit
# 0   Laptop  2997.0   1197.0
# 1    Mouse   449.85   299.85
# 2  Keyboard  632.0    392.0`,
          note: 'Always assign the result back to a column: df["new"] = expression. The expression itself does not change df.',
        },
        {
          title: '.apply() — element-wise Python logic',
          body: '.apply(func) calls func once per element. Use a lambda for simple one-liners. For if/elif/else chains, define a named function because lambdas cannot contain elif. .apply() is more flexible than arithmetic but slower — pandas cannot optimise Python functions the way it can optimise arithmetic.',
          code: `# Simple lambda — one condition
df["label"] = df["score"].apply(lambda x: "pass" if x >= 60 else "fail")

# Named function — needed for if/elif/else
def classify(price):
    if price >= 100:
        return "premium"
    elif price >= 30:
        return "standard"
    else:
        return "budget"

df["tier"] = df["price"].apply(classify)

# apply on a string column
df["upper_name"] = df["name"].apply(str.upper)
# (though .str.upper() is faster for strings — see the Strings topic)`,
          note: 'If you only have two outcomes (if/else), consider np.where() instead — it is 10-100x faster on large DataFrames.',
        },
        {
          title: '.map() — replace values using a lookup dict',
          body: '.map(dict) replaces each value in a Series with the corresponding value from the dict. Keys not found in the dict become NaN. This is the cleanest way to translate codes to labels (country code → region name, status code → description, etc.). It only works on a Series, not a whole DataFrame.',
          code: `region_map = {
    "US": "Americas",
    "BR": "Americas",
    "DE": "Europe",
    "FR": "Europe",
    "JP": "Asia",
}

df["region"] = df["country"].map(region_map)
# Any country NOT in the dict → NaN

# Check for unmapped values after mapping:
print(df[df["region"].isna()])   # rows where country wasn't in the dict

# If there might be missing keys, fill afterwards:
df["region"] = df["country"].map(region_map).fillna("Other")`,
          note: 'After .map(), always check for NaN with df["col"].isna().sum() to confirm all values were found in the dict.',
        },
        {
          title: 'np.where() — fast if/else for a whole column',
          body: 'np.where(condition, value_if_true, value_if_false) is numpy\'s vectorised ternary operator. It is equivalent to a two-branch .apply() but runs entirely in C — typically 10-100x faster. Use it whenever you have a single condition (True → A, False → B).',
          code: `import numpy as np

# Same as: df["stock"].apply(lambda s: "available" if s > 0 else "out of stock")
# but much faster:
df["status"] = np.where(df["stock"] > 0, "available", "out of stock")

# Works with numeric outcomes too
df["discounted"] = np.where(df["is_member"], df["price"] * 0.9, df["price"])

# Nest np.where for three outcomes (if/elif/else equivalent)
df["tier"] = np.where(
    df["price"] >= 100, "premium",
    np.where(df["price"] >= 30, "standard", "budget")
)`,
          note: 'np.where() only handles True/False — two branches. For three or more branches, use a nested np.where or .apply() with a named function.',
        },
        {
          title: '.assign() — chain transforms without mutating',
          body: '.assign(**kwargs) returns a NEW DataFrame with one or more extra columns. The original is never changed. You can chain multiple .assign() calls. Inside a lambda passed to assign, the argument d refers to the DataFrame as it exists at that point in the chain — so you can reference a column created earlier in the same chain.',
          code: `# assign returns a new DataFrame — df is unchanged
result = (
    df
    .assign(revenue = df["price"] * df["quantity"])
    .assign(tier    = lambda d: np.where(d["revenue"] > 500, "high", "low"))
    .assign(label   = lambda d: d["product"].str.upper())
)

# df still has no revenue, tier, or label column
print("revenue" in df.columns)   # False
print("revenue" in result.columns)  # True

# Useful in pipelines: you can keep chaining
result = (
    df
    .assign(revenue=df["price"] * df["quantity"])
    .sort_values("revenue", ascending=False)
    .reset_index(drop=True)
)`,
          note: 'Use .assign() in pipelines when you want readable, step-by-step transformations without intermediate variables. For a single new column in an exploratory script, direct assignment (df["col"] = ...) is fine.',
        },
      ],
    },
    exercises: [
      {
        id: 'pd-tr-01',
        concept: 0,
        prompt: 'Write `add_revenue(df)` that adds a `"revenue"` column equal to `price × quantity` and returns the full DataFrame. Do not modify the original.',
        hint: 'df["revenue"] = df["price"] * df["quantity"]. Remember df = df.copy() first.',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "product":  ["Laptop", "Mouse", "Keyboard", "Monitor", "Headset"],
    "price":    [999.0, 29.99, 79.0, 349.0, 149.0],
    "quantity": [3, 15, 8, 2, 6],
})`,
        starterCode: `def add_revenue(df):
    df = df.copy()
    # Add "revenue" = price * quantity
    ...`,
        solution: `def add_revenue(df):
    df = df.copy()
    df["revenue"] = df["price"] * df["quantity"]
    return df`,
        testCode: `result = add_revenue(df)
assert "revenue" in result.columns
# Laptop:999*3=2997, Mouse:29.99*15=449.85, Keyboard:79*8=632, Monitor:349*2=698, Headset:149*6=894
assert result["revenue"].tolist() == [2997.0, 449.85, 632.0, 698.0, 894.0]
assert "revenue" not in df.columns, "Original was modified!"
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-tr-02',
        concept: 0,
        prompt: 'Write `add_profit(df)` that adds a `"profit"` column (revenue − cost) and a `"margin_pct"` column (profit ÷ revenue × 100, rounded to 1 decimal). Return the full DataFrame without modifying the original.',
        hint: 'Do the arithmetic step by step: first compute profit, then use profit and revenue to compute margin_pct. Both are just df["a"] OP df["b"] expressions.',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "product": ["Laptop", "Mouse", "Keyboard"],
    "revenue": [2997.0, 449.85, 632.0],
    "cost":    [1800.0, 150.0, 200.0],
})`,
        starterCode: `def add_profit(df):
    df = df.copy()
    # profit = revenue - cost
    # margin_pct = (profit / revenue) * 100, rounded to 1 decimal
    ...`,
        solution: `def add_profit(df):
    df = df.copy()
    df["profit"]     = df["revenue"] - df["cost"]
    df["margin_pct"] = (df["profit"] / df["revenue"] * 100).round(1)
    return df`,
        testCode: `result = add_profit(df)
assert "profit" in result.columns
assert "margin_pct" in result.columns
assert result["profit"].tolist() == [1197.0, 299.85, 432.0]
# Laptop: 1197/2997*100 = 39.9, Mouse: 299.85/449.85*100 = 66.7, Keyboard: 432/632*100 = 68.4
assert result["margin_pct"].tolist() == [39.9, 66.7, 68.4]
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-tr-03',
        concept: 1,
        prompt: 'Write `add_pass_fail(df)` that adds a `"result"` column: `"pass"` if score ≥ 60, else `"fail"`. Use `.apply()` with a lambda. Do not modify the original.',
        hint: 'df["result"] = df["score"].apply(lambda x: "pass" if x >= 60 else "fail")',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "name":  ["Alice", "Bob", "Charlie", "Diana", "Eve"],
    "score": [88, 54, 72, 45, 91],
})`,
        starterCode: `def add_pass_fail(df):
    df = df.copy()
    # Add "result": "pass" if score >= 60, else "fail"
    # Use .apply() with a lambda
    ...`,
        solution: `def add_pass_fail(df):
    df = df.copy()
    df["result"] = df["score"].apply(lambda x: "pass" if x >= 60 else "fail")
    return df`,
        testCode: `result = add_pass_fail(df)
assert "result" in result.columns
assert result["result"].tolist() == ["pass", "fail", "pass", "fail", "pass"]
assert "result" not in df.columns
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-tr-04',
        concept: 1,
        prompt: 'Write `add_tier(df)` that adds a `"tier"` column using a named function with `if/elif/else`: `"budget"` if price < 30, `"standard"` if price < 100, else `"premium"`. Use `.apply()`. Do not modify the original.',
        hint: 'Define a helper function classify(price) with if/elif/else, then df["tier"] = df["price"].apply(classify). Lambdas cannot have elif, so you need a named function.',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "product": ["Widget", "Gadget", "Device", "Tool", "Gizmo"],
    "price":   [15.0, 45.0, 110.0, 30.0, 200.0],
})`,
        starterCode: `def add_tier(df):
    df = df.copy()
    # Define a classify(price) function with if/elif/else
    # Then apply it to the price column
    ...`,
        solution: `def add_tier(df):
    def classify(price):
        if price >= 100:
            return "premium"
        elif price >= 30:
            return "standard"
        else:
            return "budget"
    df = df.copy()
    df["tier"] = df["price"].apply(classify)
    return df`,
        testCode: `result = add_tier(df)
assert "tier" in result.columns
# Widget:15 → budget, Gadget:45 → standard, Device:110 → premium, Tool:30 → standard, Gizmo:200 → premium
assert result["tier"].tolist() == ["budget", "standard", "premium", "standard", "premium"]
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-tr-05',
        concept: 2,
        prompt: 'Write `add_region(df)` that adds a `"region"` column by mapping the `"country"` column through a dict: `"US"/"BR"/"CA"` → `"Americas"`, `"DE"/"FR"/"ES"` → `"Europe"`, `"JP"/"CN"` → `"Asia"`. Use `.map()`. Do not modify the original.',
        hint: 'Define region_map = {...}, then df["region"] = df["country"].map(region_map).',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "name":    ["Alice", "Bruno", "Carlos", "Diana", "Eva", "Franz", "Grace", "Hiroshi"],
    "country": ["US", "BR", "CA", "DE", "FR", "ES", "JP", "CN"],
})`,
        starterCode: `def add_region(df):
    df = df.copy()
    region_map = {
        "US": "Americas", "BR": "Americas", "CA": "Americas",
        "DE": "Europe",   "FR": "Europe",   "ES": "Europe",
        "JP": "Asia",     "CN": "Asia",
    }
    # Use .map() to create the "region" column
    ...`,
        solution: `def add_region(df):
    df = df.copy()
    region_map = {
        "US": "Americas", "BR": "Americas", "CA": "Americas",
        "DE": "Europe",   "FR": "Europe",   "ES": "Europe",
        "JP": "Asia",     "CN": "Asia",
    }
    df["region"] = df["country"].map(region_map)
    return df`,
        testCode: `result = add_region(df)
assert "region" in result.columns
assert result["region"].isna().sum() == 0, "Some countries were not mapped!"
assert result["region"].tolist() == ["Americas","Americas","Americas","Europe","Europe","Europe","Asia","Asia"]
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-tr-06',
        concept: 3,
        prompt: 'Write `add_availability(df)` that adds a `"status"` column using `np.where()`: `"available"` if stock > 0, else `"out of stock"`. Do not use `.apply()` — use `np.where()` instead. Do not modify the original.',
        hint: 'import numpy as np, then df["status"] = np.where(df["stock"] > 0, "available", "out of stock")',
        setupCode: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "product": ["Laptop", "Mouse", "Keyboard", "Monitor", "Headset"],
    "stock":   [15, 0, 85, 0, 60],
})`,
        starterCode: `def add_availability(df):
    df = df.copy()
    # Use np.where(condition, value_if_true, value_if_false)
    # "available" if stock > 0, "out of stock" otherwise
    ...`,
        solution: `def add_availability(df):
    df = df.copy()
    df["status"] = np.where(df["stock"] > 0, "available", "out of stock")
    return df`,
        testCode: `result = add_availability(df)
assert "status" in result.columns
assert result["status"].tolist() == ["available","out of stock","available","out of stock","available"]
assert "status" not in df.columns
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-tr-07',
        concept: 4,
        prompt: `Write \`transform_sales(df)\` using \`.assign()\` to:
1. Add \`"revenue"\` = price × quantity
2. Add \`"tier"\`: \`"high"\` if revenue > 500, else \`"low"\` (use \`np.where\` inside the lambda)
3. Return sorted by \`"revenue"\` descending with index reset`,
        hint: 'Chain two .assign() calls. In the second one, use a lambda: .assign(tier=lambda d: np.where(d["revenue"] > 500, "high", "low")). The lambda receives d — the DataFrame after the first assign — so d["revenue"] already exists.',
        setupCode: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "product":  ["Laptop", "Mouse", "Keyboard", "Monitor", "Headset", "Webcam"],
    "price":    [999.0, 29.99, 79.0, 349.0, 149.0, 89.0],
    "quantity": [3, 15, 8, 2, 6, 10],
})`,
        starterCode: `def transform_sales(df):
    # Use .assign() — it returns a new DataFrame, never modifies df
    # Chain: .assign(revenue=...).assign(tier=lambda d: ...).sort_values(...).reset_index(drop=True)
    ...`,
        solution: `def transform_sales(df):
    return (
        df
        .assign(revenue=df["price"] * df["quantity"])
        .assign(tier=lambda d: np.where(d["revenue"] > 500, "high", "low"))
        .sort_values("revenue", ascending=False)
        .reset_index(drop=True)
    )`,
        testCode: `result = transform_sales(df)
assert "revenue" in result.columns and "tier" in result.columns
# Revenues: Laptop=2997, Mouse=449.85, Keyboard=632, Monitor=698, Headset=894, Webcam=890
# Sorted desc: Laptop(2997), Headset(894), Webcam(890), Monitor(698), Keyboard(632), Mouse(449.85)
assert result["product"].tolist() == ["Laptop","Headset","Webcam","Monitor","Keyboard","Mouse"]
assert result["revenue"].tolist() == [2997.0, 894.0, 890.0, 698.0, 632.0, 449.85]
assert result["tier"].tolist() == ["high","high","high","high","high","low"]
assert result.index.tolist() == [0,1,2,3,4,5]
# Original unchanged
assert "revenue" not in df.columns
print("All tests passed!")
print(result)`,
      },
    ],
  },

  // ─── TOPIC 4: GroupBy & Aggregation ──────────────────────────────────────────
  {
    id: 'pd-groupby',
    title: 'GroupBy & Aggregation',
    description: 'Split data into groups and reduce each to summary statistics with .groupby().agg(). Add group-level stats back to every row with .transform().',
    lesson: {
      intro: 'GroupBy is the pandas equivalent of SQL\'s GROUP BY clause. It follows a split → apply → combine pattern: split the DataFrame into groups by one or more column values, apply a function to each group independently, then combine the results into a new DataFrame. Mastering the difference between .agg() (one row per group) and .transform() (same number of rows as input) is one of the most important pandas skills.',
      concepts: [
        {
          title: 'How groupby works: split → apply → combine',
          body: 'df.groupby("col") creates a GroupBy object — it does not compute anything yet. Chaining .agg(), .sum(), .mean() etc. triggers the actual computation. The result has one row per unique value of the groupby column and the groupby column as the index — call .reset_index() to make it a regular column again.',
          code: `import pandas as pd

df = pd.DataFrame({
    "category": ["A", "B", "A", "B", "A"],
    "revenue":  [100, 200, 150, 50, 80],
})

# Step 1: create the GroupBy object (nothing computed yet)
grouped = df.groupby("category")

# Step 2: apply an aggregation
result = grouped["revenue"].sum()
print(result)
# category
# A    330       ← "category" is the index
# B    250

# Step 3: reset_index() to make it a regular column
result = grouped["revenue"].sum().reset_index()
print(result)
#   category  revenue
# 0        A      330
# 1        B      250`,
          note: 'After .groupby().agg(), the groupby column becomes the DataFrame index. Almost always follow with .reset_index() to convert it back to a regular column.',
        },
        {
          title: 'Common aggregation functions',
          body: 'Pass a string function name or a list of them. The most useful ones: "sum" (total), "mean" (average), "count" (number of rows, ignores NaN), "nunique" (distinct non-null values), "min" / "max", "std" (standard deviation). You can aggregate a single column or a whole DataFrame.',
          code: `# Aggregate one column
total = df.groupby("category")["revenue"].sum().reset_index()

# Aggregate multiple columns with the same function
means = df.groupby("dept")[["salary", "bonus"]].mean().reset_index()

# Chain .round() directly on the result
means["salary"] = means["salary"].round(2)

# Count rows per group (non-null values)
counts = df.groupby("status")["id"].count().reset_index()
counts.columns = ["status", "count"]   # rename after aggregation`,
        },
        {
          title: 'Named aggregations — clean column names in one step',
          body: 'Passing keyword arguments to .agg() lets you name the output columns directly. The syntax is: agg(output_name=("input_column", "function")). This avoids the need to rename columns afterwards and makes the code self-documenting.',
          code: `result = (
    df
    .groupby("department")
    .agg(
        total_salary  = ("salary",  "sum"),
        avg_salary    = ("salary",  "mean"),
        headcount     = ("name",    "count"),
        unique_cities = ("city",    "nunique"),
    )
    .reset_index()
)

print(result)
#   department  total_salary    avg_salary  headcount  unique_cities
# 0        Eng        265000  88333.333333          3              2
# 1         HR        195000  65000.000000          3              3

# Round after aggregation
result["avg_salary"] = result["avg_salary"].round(2)`,
          note: 'Named aggregations require pandas 0.25+. The output column names are exactly what you write as keyword arguments — no need to rename afterwards.',
        },
        {
          title: 'Grouping by multiple columns',
          body: 'Pass a list of column names to groupby() to create groups defined by unique combinations of all those columns. The result has a row for every combination that exists in the data.',
          code: `df = pd.DataFrame({
    "dept": ["Eng","Eng","HR","HR","Eng"],
    "year": [2022, 2023, 2022, 2023, 2022],
    "sal":  [80000, 90000, 60000, 65000, 85000],
})

result = (
    df
    .groupby(["dept", "year"])
    .agg(avg_sal=("sal", "mean"))
    .reset_index()
)
print(result)
#   dept  year    avg_sal
# 0  Eng  2022  82500.0
# 1  Eng  2023  90000.0
# 2   HR  2022  60000.0
# 3   HR  2023  65000.0`,
          note: 'The result only contains rows for combinations that actually exist in the data. If Eng + 2024 has no rows, it will not appear in the output.',
        },
        {
          title: '.transform() — add group stats back to every row',
          body: '.transform("func") applies the function per group but returns a Series with the same length and index as the original DataFrame — every row gets its group\'s value. This is perfect for adding a group average or group total as a new column without collapsing the DataFrame. The key distinction: .agg() → one row per group. .transform() → one value per original row.',
          code: `df = pd.DataFrame({
    "name": ["Alice","Bob","Carol","Dave"],
    "dept": ["Eng","HR","Eng","HR"],
    "sal":  [90000, 65000, 80000, 72000],
})

# agg — collapses to 2 rows (one per dept)
agg_result = df.groupby("dept")["sal"].mean()
print(agg_result)
# dept
# Eng    85000.0
# HR     68500.0

# transform — keeps all 4 rows, adds group mean to each row
df["dept_avg"] = df.groupby("dept")["sal"].transform("mean")
df["diff"]     = df["sal"] - df["dept_avg"]
print(df[["name","sal","dept_avg","diff"]])
#     name    sal  dept_avg    diff
# 0  Alice  90000   85000.0   5000.0
# 1    Bob  65000   68500.0  -3500.0
# 2  Carol  80000   85000.0  -5000.0
# 3   Dave  72000   68500.0   3500.0`,
          note: 'transform() supports the same function strings as agg(): "mean", "sum", "min", "max", "count", "std". It always returns the same number of rows as the input.',
        },
      ],
    },
    exercises: [
      {
        id: 'pd-gb-01',
        concept: 0,
        prompt: 'Write `revenue_by_category(df)` that groups by `"category"`, computes the total `"revenue"` per category (sum), names the result column `"total_revenue"`, and returns sorted by `"total_revenue"` descending with index reset.',
        hint: 'df.groupby("category")["revenue"].sum().reset_index() gives you category and revenue columns. Rename the revenue column and sort.',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "product":  ["Laptop", "Novel", "Phone", "Textbook", "Tablet", "Comic"],
    "category": ["Electronics", "Books", "Electronics", "Books", "Electronics", "Books"],
    "revenue":  [2997.0, 75.0, 2397.0, 480.0, 499.0, 200.0],
})`,
        starterCode: `def revenue_by_category(df):
    # groupby "category", sum "revenue"
    # Name the output column "total_revenue"
    # Sort descending by total_revenue, reset index
    ...`,
        solution: `def revenue_by_category(df):
    result = (
        df.groupby("category")["revenue"]
        .sum()
        .reset_index()
        .rename(columns={"revenue": "total_revenue"})
        .sort_values("total_revenue", ascending=False)
        .reset_index(drop=True)
    )
    return result`,
        testCode: `result = revenue_by_category(df)
assert list(result.columns) == ["category", "total_revenue"]
# Electronics: 2997+2397+499 = 5893, Books: 75+480+200 = 755
assert result.iloc[0]["category"] == "Electronics"
assert result.iloc[0]["total_revenue"] == 5893.0
assert result.iloc[1]["category"] == "Books"
assert result.iloc[1]["total_revenue"] == 755.0
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-gb-02',
        concept: 1,
        prompt: 'Write `avg_salary_by_dept(df)` that groups by `"department"`, computes the mean `"salary"` per department rounded to 2 decimal places, names the column `"avg_salary"`, and returns sorted by `"avg_salary"` descending with index reset.',
        hint: 'After groupby().mean().reset_index(), rename the salary column and round it: result["avg_salary"] = result["avg_salary"].round(2)',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "name":       ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"],
    "department": ["Eng", "Eng", "HR", "HR", "Eng", "HR"],
    "salary":     [90000, 80000, 65000, 72000, 95000, 58000],
})`,
        starterCode: `def avg_salary_by_dept(df):
    # groupby "department", mean "salary"
    # Round to 2 decimal places, name column "avg_salary"
    # Sort by avg_salary descending, reset index
    ...`,
        solution: `def avg_salary_by_dept(df):
    result = (
        df.groupby("department")["salary"]
        .mean()
        .round(2)
        .reset_index()
        .rename(columns={"salary": "avg_salary"})
        .sort_values("avg_salary", ascending=False)
        .reset_index(drop=True)
    )
    return result`,
        testCode: `result = avg_salary_by_dept(df)
assert list(result.columns) == ["department", "avg_salary"]
# Eng: (90000+80000+95000)/3 = 88333.33, HR: (65000+72000+58000)/3 = 65000.0
assert result.iloc[0]["department"] == "Eng"
assert result.iloc[0]["avg_salary"] == 88333.33
assert result.iloc[1]["department"] == "HR"
assert result.iloc[1]["avg_salary"] == 65000.0
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-gb-03',
        concept: 2,
        prompt: `Write \`dept_summary(df)\` using **named aggregations** to return a DataFrame with columns: \`"department"\`, \`"total_salary"\` (sum), \`"avg_salary"\` (mean, rounded to 2 dec), \`"headcount"\` (count). Sort by \`"total_salary"\` descending, index reset.`,
        hint: 'Use .agg(total_salary=("salary","sum"), avg_salary=("salary","mean"), headcount=("name","count")). Round avg_salary after: result["avg_salary"] = result["avg_salary"].round(2)',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "name":       ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"],
    "department": ["Eng", "Eng", "HR", "HR", "Eng", "HR"],
    "salary":     [90000, 80000, 65000, 72000, 95000, 58000],
})`,
        starterCode: `def dept_summary(df):
    # Use named aggregations: .agg(col_name=("source_col", "function"), ...)
    # Remember to .reset_index() after .agg()
    ...`,
        solution: `def dept_summary(df):
    result = (
        df.groupby("department")
        .agg(
            total_salary = ("salary", "sum"),
            avg_salary   = ("salary", "mean"),
            headcount    = ("name",   "count"),
        )
        .reset_index()
    )
    result["avg_salary"] = result["avg_salary"].round(2)
    return result.sort_values("total_salary", ascending=False).reset_index(drop=True)`,
        testCode: `result = dept_summary(df)
assert list(result.columns) == ["department", "total_salary", "avg_salary", "headcount"]
# Eng: total=265000, avg=88333.33, headcount=3
# HR:  total=195000, avg=65000.0,  headcount=3
assert result.iloc[0]["department"] == "Eng"
assert result.iloc[0]["total_salary"] == 265000
assert result.iloc[0]["avg_salary"] == 88333.33
assert result.iloc[0]["headcount"] == 3
assert result.iloc[1]["total_salary"] == 195000
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-gb-04',
        concept: 2,
        prompt: `Write \`category_report(df)\` using named aggregations to return: \`"category"\`, \`"total_revenue"\` (sum of revenue), \`"avg_price"\` (mean of price, rounded to 2 dec), \`"total_units"\` (sum of quantity), \`"product_count"\` (nunique of product). Sort by \`"total_revenue"\` descending.`,
        hint: 'You can aggregate different columns in the same .agg() call: agg(total_revenue=("revenue","sum"), avg_price=("price","mean"), total_units=("quantity","sum"), product_count=("product","nunique"))',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "product":  ["Laptop", "Novel", "Phone", "Textbook", "Tablet", "Comic", "Headset"],
    "category": ["Electronics","Books","Electronics","Books","Electronics","Books","Electronics"],
    "price":    [999.0, 15.0, 799.0, 60.0, 499.0, 10.0, 149.0],
    "quantity": [3, 5, 3, 8, 1, 20, 6],
    "revenue":  [2997.0, 75.0, 2397.0, 480.0, 499.0, 200.0, 894.0],
})`,
        starterCode: `def category_report(df):
    ...`,
        solution: `def category_report(df):
    result = (
        df.groupby("category")
        .agg(
            total_revenue  = ("revenue",  "sum"),
            avg_price      = ("price",    "mean"),
            total_units    = ("quantity", "sum"),
            product_count  = ("product",  "nunique"),
        )
        .reset_index()
    )
    result["avg_price"] = result["avg_price"].round(2)
    return result.sort_values("total_revenue", ascending=False).reset_index(drop=True)`,
        testCode: `result = category_report(df)
assert list(result.columns) == ["category","total_revenue","avg_price","total_units","product_count"]
# Electronics: rev=2997+2397+499+894=6787, avg_price=(999+799+499+149)/4=611.5, units=3+3+1+6=13, count=4
# Books:       rev=75+480+200=755,         avg_price=(15+60+10)/3=28.33,         units=5+8+20=33,  count=3
assert result.iloc[0]["category"] == "Electronics"
assert result.iloc[0]["total_revenue"] == 6787.0
assert result.iloc[0]["total_units"] == 13
assert result.iloc[0]["product_count"] == 4
assert result.iloc[0]["avg_price"] == 611.5
assert result.iloc[1]["category"] == "Books"
assert result.iloc[1]["avg_price"] == 28.33
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-gb-05',
        concept: 3,
        prompt: 'Write `salary_by_dept_year(df)` that groups by **both** `"department"` and `"year"`, computes the mean `"salary"` (rounded to 2 dec) named `"avg_salary"`. Return sorted by department then year ascending, index reset.',
        hint: 'Pass a list to groupby: df.groupby(["department", "year"]). Both columns appear in the result after .reset_index().',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "name":       ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"],
    "department": ["Eng",   "HR",  "Eng",     "HR",    "Eng", "HR"],
    "year":       [2022,    2022,  2023,      2023,    2022,  2022],
    "salary":     [80000,   60000, 90000,     65000,   85000, 55000],
})`,
        starterCode: `def salary_by_dept_year(df):
    # Group by BOTH department and year
    # Mean salary, rounded to 2 decimals, named "avg_salary"
    # Sort by department then year
    ...`,
        solution: `def salary_by_dept_year(df):
    result = (
        df.groupby(["department", "year"])
        .agg(avg_salary=("salary", "mean"))
        .reset_index()
    )
    result["avg_salary"] = result["avg_salary"].round(2)
    return result.sort_values(["department", "year"]).reset_index(drop=True)`,
        testCode: `result = salary_by_dept_year(df)
assert list(result.columns) == ["department", "year", "avg_salary"]
assert len(result) == 4
# Eng 2022: (80000+85000)/2 = 82500, Eng 2023: 90000
# HR  2022: (60000+55000)/2 = 57500, HR  2023: 65000
eng_22 = result[(result["department"]=="Eng") & (result["year"]==2022)]["avg_salary"].iloc[0]
eng_23 = result[(result["department"]=="Eng") & (result["year"]==2023)]["avg_salary"].iloc[0]
hr_22  = result[(result["department"]=="HR")  & (result["year"]==2022)]["avg_salary"].iloc[0]
assert eng_22 == 82500.0, f"Eng 2022: {eng_22}"
assert eng_23 == 90000.0, f"Eng 2023: {eng_23}"
assert hr_22  == 57500.0, f"HR 2022:  {hr_22}"
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-gb-06',
        concept: 4,
        prompt: 'Write `add_dept_avg(df)` that adds a `"dept_avg_salary"` column with each employee\'s **department** average salary (using `.transform()`), and a `"salary_diff"` column (employee salary minus department average). Do not modify the original.',
        hint: 'df["dept_avg_salary"] = df.groupby("department")["salary"].transform("mean"). Then salary_diff = salary - dept_avg_salary. transform() keeps the same number of rows — every employee gets their department\'s average.',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "name":       ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"],
    "department": ["Eng", "Eng", "HR", "HR", "Eng", "HR"],
    "salary":     [90000, 80000, 65000, 72000, 95000, 58000],
})`,
        starterCode: `def add_dept_avg(df):
    df = df.copy()
    # Use groupby().transform("mean") to add dept_avg_salary
    # Then compute salary_diff = salary - dept_avg_salary
    ...`,
        solution: `def add_dept_avg(df):
    df = df.copy()
    df["dept_avg_salary"] = df.groupby("department")["salary"].transform("mean")
    df["salary_diff"]     = df["salary"] - df["dept_avg_salary"]
    return df`,
        testCode: `import math
result = add_dept_avg(df)
assert "dept_avg_salary" in result.columns
assert "salary_diff" in result.columns
assert len(result) == 6, "transform() must keep all 6 rows"

# Eng avg = (90000+80000+95000)/3 = 88333.33...
eng_avg = (90000 + 80000 + 95000) / 3
# HR avg  = (65000+72000+58000)/3 = 65000.0
hr_avg  = (65000 + 72000 + 58000) / 3

alice = result[result["name"] == "Alice"].iloc[0]
frank = result[result["name"] == "Frank"].iloc[0]
assert math.isclose(alice["dept_avg_salary"], eng_avg)
assert math.isclose(alice["salary_diff"], 90000 - eng_avg)
assert math.isclose(frank["dept_avg_salary"], hr_avg)

assert "dept_avg_salary" not in df.columns, "Original was modified!"
print("All tests passed!")
print(result[["name","department","salary","dept_avg_salary","salary_diff"]])`,
      },
      {
        id: 'pd-gb-07',
        concept: 4,
        prompt: `Write \`top_categories(df, n)\` that:
1. Groups by \`"category"\`, computing \`"total_revenue"\` (sum), \`"avg_revenue"\` (mean, rounded to 2 dec), \`"product_count"\` (count)
2. Sorts by \`"total_revenue"\` descending
3. Returns only the top \`n\` rows with index reset`,
        hint: 'After the groupby and sort, use .head(n) to keep only the top n rows, then .reset_index(drop=True).',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "product":  ["Laptop","Novel","Phone","Textbook","Tablet","Comic","Headset","Webcam"],
    "category": ["Electronics","Books","Electronics","Books","Electronics","Books","Accessories","Accessories"],
    "revenue":  [2997.0, 75.0, 2397.0, 480.0, 499.0, 200.0, 894.0, 890.0],
})`,
        starterCode: `def top_categories(df, n):
    # groupby, named aggs, sort desc, head(n), reset index
    ...`,
        solution: `def top_categories(df, n):
    result = (
        df.groupby("category")
        .agg(
            total_revenue  = ("revenue", "sum"),
            avg_revenue    = ("revenue", "mean"),
            product_count  = ("product", "count"),
        )
        .reset_index()
    )
    result["avg_revenue"] = result["avg_revenue"].round(2)
    return (
        result
        .sort_values("total_revenue", ascending=False)
        .head(n)
        .reset_index(drop=True)
    )`,
        testCode: `result = top_categories(df, 2)
assert list(result.columns) == ["category","total_revenue","avg_revenue","product_count"]
assert len(result) == 2
# Electronics: 2997+2397+499 = 5893, Accessories: 894+890 = 1784, Books: 75+480+200 = 755
assert result.iloc[0]["category"] == "Electronics"
assert result.iloc[0]["total_revenue"] == 5893.0
assert result.iloc[1]["category"] == "Accessories"
assert result.iloc[1]["total_revenue"] == 1784.0

result3 = top_categories(df, 3)
assert len(result3) == 3
assert result3.iloc[2]["category"] == "Books"
print("All tests passed!")
print(result)`,
      },
    ],
  },


  // ─── TOPIC 5: Sorting & Ranking ──────────────────────────────────────────────
  {
    id: 'pd-sort',
    title: 'Sorting & Ranking',
    description: 'Sort rows with .sort_values(), grab top/bottom N with .nlargest()/.nsmallest(), and assign numeric positions with .rank() — globally and within groups.',
    lesson: {
      intro: 'Sorting and ranking let you impose order before displaying results, preparing exports, or computing leaderboards. pandas gives you four tools: .sort_values() for full sorts by one or more columns, .nlargest()/.nsmallest() for quickly extracting the top or bottom N rows without sorting everything, and .rank() for assigning numeric positions including within subgroups via .groupby().',
      concepts: [
        {
          title: '.sort_values() — sorting by a single column',
          body: '.sort_values(by="col") returns a new DataFrame sorted by that column ascending (smallest first) by default. Pass ascending=False to flip to descending. The original DataFrame is never modified. Always follow with .reset_index(drop=True) so the index becomes 0,1,2,… again — otherwise the original row numbers carry over, which is confusing.',
          code: `import pandas as pd

df = pd.DataFrame({
    "product":  ["Laptop", "Mouse", "Keyboard", "Monitor", "Headset"],
    "category": ["Electronics","Accessories","Accessories","Electronics","Accessories"],
    "price":    [999.0, 29.99, 79.0, 349.0, 149.0],
    "revenue":  [2997.0, 449.85, 632.0, 698.0, 894.0],
})

# Ascending (cheapest first) — default
cheap_first = df.sort_values("price").reset_index(drop=True)

# Descending (most expensive first)
expensive_first = df.sort_values("price", ascending=False).reset_index(drop=True)
print(expensive_first[["product","price"]])
#    product   price
# 0   Laptop   999.0
# 1  Monitor   349.0
# 2  Headset   149.0
# 3 Keyboard    79.0
# 4    Mouse   29.99

# sort_values returns a NEW DataFrame — df is unchanged
print("price" in df.sort_values("revenue"))   # True, df still has all columns`,
          note: 'sort_values never modifies the original DataFrame in place (unless you pass inplace=True, which is rarely recommended). Always assign the result: result = df.sort_values("col").',
        },
        {
          title: 'Multi-column sort with mixed ascending directions',
          body: 'Pass a list to by= to sort on multiple columns. When ascending= is a list of booleans, each boolean applies to the corresponding column in order. Rows with the same value in the first column are then sorted by the second, and so on — exactly like SQL ORDER BY col1 ASC, col2 DESC.',
          code: `# Sort by category ascending, then price ascending within each category
df.sort_values(["category", "price"]).reset_index(drop=True)
# All Accessories come first (A < E), sorted cheapest → most expensive
# Then all Electronics, cheapest → most expensive

# Mixed: category ascending, price DESCENDING within each category
df.sort_values(
    ["category", "price"],
    ascending=[True, False]   # one bool per column
).reset_index(drop=True)
#    category  product   price
# 0  Accessories  Headset   149.0   ← most expensive Accessory first
# 1  Accessories Keyboard    79.0
# 2  Accessories    Mouse   29.99
# 3  Electronics   Laptop   999.0   ← most expensive Electronic first
# 4  Electronics  Monitor   349.0`,
          note: 'The ascending list must be the same length as the by list. ascending=True or ascending=False (a single bool) applies to ALL columns in the sort.',
        },
        {
          title: '.nlargest() and .nsmallest() — fast top/bottom N',
          body: '.nlargest(n, "col") returns the n rows with the highest values in "col". .nsmallest(n, "col") returns the n rows with the lowest values. Both are more efficient than sort_values().head(n) on large DataFrames because they use a partial sort. The result keeps the original index — use .reset_index(drop=True) if you want 0-based indexing.',
          code: `# Top 3 by revenue
top3 = df.nlargest(3, "revenue").reset_index(drop=True)
print(top3[["product","revenue"]])
#    product  revenue
# 0   Laptop   2997.0
# 1  Headset    894.0
# 2  Monitor    698.0

# Bottom 2 by price (cheapest)
bottom2 = df.nsmallest(2, "price").reset_index(drop=True)
print(bottom2[["product","price"]])
#    product  price
# 0    Mouse  29.99
# 1 Keyboard  79.00

# Works on a Series too (returns a Series)
top_prices = df["price"].nlargest(3)

# Equivalent but slower on large data:
# df.sort_values("revenue", ascending=False).head(3)`,
          note: 'Use nlargest/nsmallest when you only need the top or bottom N — they avoid sorting the entire DataFrame. Use sort_values when you need the full sorted result.',
        },
        {
          title: '.rank() — assign numeric positions globally',
          body: '.rank() adds a numeric position to each row. By default, rank 1 = smallest value (ascending). Use ascending=False to make rank 1 = largest. The method= parameter controls ties: "dense" gives tied values the same rank with no gaps (1,2,2,3), "average" gives tied values the average of their positions (1,2.5,2.5,4 — default), "first" breaks ties by order of appearance.',
          code: `df = pd.DataFrame({
    "product": ["A","B","C","D","E"],
    "revenue": [2997.0, 449.85, 632.0, 698.0, 894.0],
})

# Rank 1 = highest revenue (descending)
df["rank"] = df["revenue"].rank(ascending=False, method="dense")
print(df[["product","revenue","rank"]])
#   product  revenue  rank
# 0       A   2997.0   1.0   ← highest → rank 1
# 1       B    449.85   5.0
# 2       C    632.0   4.0
# 3       D    698.0   3.0
# 4       E    894.0   2.0

# rank() returns float64 by default
# Convert to int after if needed:
df["rank"] = df["revenue"].rank(ascending=False, method="dense").astype(int)`,
          note: 'rank() returns floats (1.0, 2.0, …) by default. Cast with .astype(int) if you need integers. Use method="dense" for the most natural numbering — ties share a rank, and the next rank has no gap.',
        },
        {
          title: '.groupby().rank() — rank within subgroups',
          body: 'Chaining .rank() after a .groupby() applies the ranking independently within each group. Every row still gets exactly one rank value, and ranks start from 1 within each group. This is equivalent to a SQL RANK() or DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC).',
          code: `df = pd.DataFrame({
    "name": ["Alice","Bob","Carol","Dave","Eve","Frank"],
    "dept": ["Eng","HR","Eng","HR","Eng","HR"],
    "sal":  [90000, 58000, 80000, 72000, 95000, 65000],
})

# Rank salary within each department (highest = rank 1)
df["dept_rank"] = df.groupby("dept")["sal"].rank(
    ascending=False, method="dense"
).astype(int)

print(df.sort_values(["dept","dept_rank"]))
#     name dept     sal  dept_rank
# 4    Eve  Eng   95000          1   ← top Eng salary
# 0  Alice  Eng   90000          2
# 2  Carol  Eng   80000          3
# 3   Dave   HR   72000          1   ← top HR salary
# 5  Frank   HR   65000          2
# 1    Bob   HR   58000          3`,
          note: 'groupby().rank() returns a Series aligned with the original DataFrame index — you can assign it directly as a new column without any join or merge.',
        },
      ],
    },
    exercises: [
      {
        id: 'pd-so-01',
        concept: 0,
        prompt: 'Write `sort_by_revenue(df)` that returns the DataFrame sorted by `"revenue"` descending, with index reset. Do not modify the original.',
        hint: 'df.sort_values("revenue", ascending=False).reset_index(drop=True)',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "product":  ["Laptop","Mouse","Keyboard","Monitor","Headset","Webcam"],
    "category": ["Electronics","Accessories","Accessories","Electronics","Accessories","Electronics"],
    "revenue":  [2997.0, 449.85, 632.0, 698.0, 894.0, 890.0],
})`,
        starterCode: `def sort_by_revenue(df):
    # Sort by revenue descending, reset index
    ...`,
        solution: `def sort_by_revenue(df):
    return df.sort_values("revenue", ascending=False).reset_index(drop=True)`,
        testCode: `result = sort_by_revenue(df)
# Revenue desc: Laptop(2997), Headset(894), Webcam(890), Monitor(698), Keyboard(632), Mouse(449.85)
assert result["product"].tolist() == ["Laptop","Headset","Webcam","Monitor","Keyboard","Mouse"]
assert result["revenue"].tolist() == [2997.0, 894.0, 890.0, 698.0, 632.0, 449.85]
assert result.index.tolist() == [0,1,2,3,4,5]
# Original unchanged
assert df["product"].iloc[0] == "Laptop"
assert df.index.tolist() == [0,1,2,3,4,5]
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-so-02',
        concept: 0,
        prompt: 'Write `sort_by_category_and_name(df)` that sorts by `"category"` ascending, then by `"product"` ascending within each category. Return with index reset.',
        hint: 'df.sort_values(["category", "product"]).reset_index(drop=True) — both columns ascending is the default.',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "product":  ["Laptop","Widget","Monitor","Gadget","Phone","Headset"],
    "category": ["Electronics","Accessories","Electronics","Accessories","Electronics","Accessories"],
    "price":    [999.0, 9.99, 349.0, 49.99, 799.0, 149.0],
})`,
        starterCode: `def sort_by_category_and_name(df):
    # Sort: category asc, then product name asc within each category
    ...`,
        solution: `def sort_by_category_and_name(df):
    return df.sort_values(["category", "product"]).reset_index(drop=True)`,
        testCode: `result = sort_by_category_and_name(df)
# Accessories: Gadget, Headset, Widget (alpha order)
# Electronics: Laptop, Monitor, Phone (alpha order)
assert result["product"].tolist() == ["Gadget","Headset","Widget","Laptop","Monitor","Phone"]
assert result["category"].tolist() == ["Accessories","Accessories","Accessories","Electronics","Electronics","Electronics"]
assert result.index.tolist() == [0,1,2,3,4,5]
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-so-03',
        concept: 1,
        prompt: 'Write `sort_dept_salary(df)` that sorts by `"department"` ascending, then by `"salary"` **descending** within each department (highest earner first). Return with index reset.',
        hint: 'sort_values(["department","salary"], ascending=[True, False]) — one bool per column in the list.',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "name":       ["Alice","Bob","Charlie","Diana","Eve","Frank"],
    "department": ["Eng","HR","Eng","HR","Eng","HR"],
    "salary":     [90000, 58000, 80000, 72000, 95000, 65000],
})`,
        starterCode: `def sort_dept_salary(df):
    # dept ascending, salary descending within each dept
    # Use ascending=[True, False]
    ...`,
        solution: `def sort_dept_salary(df):
    return df.sort_values(["department","salary"], ascending=[True,False]).reset_index(drop=True)`,
        testCode: `result = sort_dept_salary(df)
# Eng (asc): Eve(95000), Alice(90000), Charlie(80000)
# HR  (asc): Diana(72000), Frank(65000), Bob(58000)
assert result["name"].tolist() == ["Eve","Alice","Charlie","Diana","Frank","Bob"]
assert result["salary"].tolist() == [95000, 90000, 80000, 72000, 65000, 58000]
assert result.index.tolist() == [0,1,2,3,4,5]
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-so-04',
        concept: 2,
        prompt: 'Write `top_products(df, n)` that returns the `n` products with the highest `"revenue"` using `.nlargest()`, with index reset.',
        hint: 'df.nlargest(n, "revenue").reset_index(drop=True)',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "product": ["Laptop","Mouse","Keyboard","Monitor","Headset","Webcam"],
    "revenue": [2997.0, 449.85, 632.0, 698.0, 894.0, 890.0],
})`,
        starterCode: `def top_products(df, n):
    # Use .nlargest() — faster than sort_values().head(n)
    ...`,
        solution: `def top_products(df, n):
    return df.nlargest(n, "revenue").reset_index(drop=True)`,
        testCode: `top3 = top_products(df, 3)
assert len(top3) == 3
# Laptop(2997), Headset(894), Webcam(890)
assert top3["product"].tolist() == ["Laptop","Headset","Webcam"]
assert top3["revenue"].tolist() == [2997.0, 894.0, 890.0]
assert top3.index.tolist() == [0,1,2]

top1 = top_products(df, 1)
assert len(top1) == 1
assert top1.iloc[0]["product"] == "Laptop"
print("All tests passed!")
print(top3)`,
      },
      {
        id: 'pd-so-05',
        concept: 2,
        prompt: 'Write `cheapest_products(df, n)` that returns the `n` products with the **lowest** `"price"` using `.nsmallest()`, with index reset.',
        hint: 'df.nsmallest(n, "price").reset_index(drop=True)',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "product": ["Laptop","Mouse","Keyboard","Monitor","Headset"],
    "price":   [999.0, 29.99, 79.0, 349.0, 149.0],
    "stock":   [5, 100, 30, 8, 20],
})`,
        starterCode: `def cheapest_products(df, n):
    # Use .nsmallest() to get n rows with lowest price
    ...`,
        solution: `def cheapest_products(df, n):
    return df.nsmallest(n, "price").reset_index(drop=True)`,
        testCode: `bottom2 = cheapest_products(df, 2)
assert len(bottom2) == 2
# Mouse(29.99), Keyboard(79.0)
assert bottom2["product"].tolist() == ["Mouse","Keyboard"]
assert bottom2["price"].tolist() == [29.99, 79.0]

bottom1 = cheapest_products(df, 1)
assert bottom1.iloc[0]["product"] == "Mouse"
print("All tests passed!")
print(bottom2)`,
      },
      {
        id: 'pd-so-06',
        concept: 3,
        prompt: 'Write `add_revenue_rank(df)` that adds a `"rank"` column where rank 1 = highest revenue. Use `.rank(ascending=False, method="dense")` and cast to `int`. Do not modify the original.',
        hint: 'df["rank"] = df["revenue"].rank(ascending=False, method="dense").astype(int). Remember to copy first.',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "product": ["Laptop","Mouse","Keyboard","Monitor","Headset"],
    "revenue": [2997.0, 449.85, 632.0, 698.0, 894.0],
})`,
        starterCode: `def add_revenue_rank(df):
    df = df.copy()
    # Add "rank" column: rank 1 = highest revenue
    # Use method="dense" and cast to int
    ...`,
        solution: `def add_revenue_rank(df):
    df = df.copy()
    df["rank"] = df["revenue"].rank(ascending=False, method="dense").astype(int)
    return df`,
        testCode: `result = add_revenue_rank(df)
assert "rank" in result.columns
# Laptop(2997)=1, Headset(894)=2, Monitor(698)=3, Keyboard(632)=4, Mouse(449.85)=5
laptop = result[result["product"]=="Laptop"]["rank"].iloc[0]
mouse  = result[result["product"]=="Mouse"]["rank"].iloc[0]
headset = result[result["product"]=="Headset"]["rank"].iloc[0]
assert laptop == 1,  f"Laptop rank: {laptop}"
assert mouse  == 5,  f"Mouse rank: {mouse}"
assert headset == 2, f"Headset rank: {headset}"
assert result["rank"].dtype in [int, "int32", "int64"]
assert "rank" not in df.columns
print("All tests passed!")
print(result.sort_values("rank"))`,
      },
      {
        id: 'pd-so-07',
        concept: 4,
        prompt: `Write \`rank_within_dept(df)\` that adds a \`"dept_rank"\` column ranking each employee's salary **within their department** (rank 1 = highest salary in that department). Use \`.groupby().rank(ascending=False, method="dense")\` cast to int. Do not modify the original.`,
        hint: 'df["dept_rank"] = df.groupby("department")["salary"].rank(ascending=False, method="dense").astype(int). groupby().rank() keeps all rows — it is like transform(), not agg().',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "name":       ["Alice","Bob","Charlie","Diana","Eve","Frank"],
    "department": ["Eng","HR","Eng","HR","Eng","HR"],
    "salary":     [90000, 58000, 80000, 72000, 95000, 65000],
})`,
        starterCode: `def rank_within_dept(df):
    df = df.copy()
    # Add "dept_rank": rank within each department, 1 = highest salary
    # groupby("department")["salary"].rank(ascending=False, method="dense")
    ...`,
        solution: `def rank_within_dept(df):
    df = df.copy()
    df["dept_rank"] = df.groupby("department")["salary"].rank(
        ascending=False, method="dense"
    ).astype(int)
    return df`,
        testCode: `result = rank_within_dept(df)
assert "dept_rank" in result.columns
assert len(result) == 6, "All 6 rows must be present"
# Eng: Eve(95000)=1, Alice(90000)=2, Charlie(80000)=3
# HR:  Diana(72000)=1, Frank(65000)=2, Bob(58000)=3
eve    = result[result["name"]=="Eve"]["dept_rank"].iloc[0]
alice  = result[result["name"]=="Alice"]["dept_rank"].iloc[0]
diana  = result[result["name"]=="Diana"]["dept_rank"].iloc[0]
bob    = result[result["name"]=="Bob"]["dept_rank"].iloc[0]
assert eve   == 1, f"Eve rank: {eve}"
assert alice == 2, f"Alice rank: {alice}"
assert diana == 1, f"Diana rank: {diana}"
assert bob   == 3, f"Bob rank: {bob}"
assert "dept_rank" not in df.columns
print("All tests passed!")
print(result.sort_values(["department","dept_rank"]))`,
      },
    ],
  },

  // ─── TOPIC 6: Handling Missing Values ────────────────────────────────────────
  {
    id: 'pd-missing',
    title: 'Handling Missing Values',
    description: 'Detect nulls with .isna(), drop rows with .dropna(), fill gaps with .fillna(), propagate with .ffill()/.bfill(), and impute with group statistics.',
    lesson: {
      intro: 'Real datasets always have missing values. pandas represents them as NaN (Not a Number) for numeric types and None or NaN for object columns. Handling them correctly is one of the most important data-cleaning skills: the wrong approach silently distorts aggregations (mean, sum, count all behave differently with NaN) and can break downstream models or pipelines.',
      concepts: [
        {
          title: 'Detecting missing values — .isna() and .notna()',
          body: '.isna() returns a boolean DataFrame (or Series) that is True wherever a value is null. .notna() is the opposite. Use .isna().sum() to count nulls per column — the most common first step in any data-cleaning workflow. Use boolean indexing with .isna() to filter rows that have or lack a null in a specific column.',
          code: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "name":   ["Alice", "Bob", "Charlie", "Diana"],
    "age":    [30, None, 35, None],
    "salary": [75000.0, 58000.0, None, 72000.0],
    "dept":   ["Eng", "HR", None, None],
})

# Count nulls per column
print(df.isna().sum())
# name      0
# age       2
# salary    1
# dept      2

# Percentage null
print((df.isna().sum() / len(df) * 100).round(1))

# Filter rows where salary is null
print(df[df["salary"].isna()])

# Filter rows where ALL values are present
print(df[df.notna().all(axis=1)])   # only Alice`,
          note: 'None (Python) and np.nan (numpy float) are both treated as missing by pandas. df.isna() catches both.',
        },
        {
          title: '.dropna() — removing rows or columns with nulls',
          body: '.dropna() removes rows (or columns) that contain null values. Three key parameters: subset= to only check specific columns, how="any" (default, drop if ANY checked column is null) vs how="all" (only drop if ALL checked columns are null), and thresh=n to keep rows that have at least n non-null values.',
          code: `# Drop any row with at least one null (default)
df.dropna()

# Drop rows where 'salary' specifically is null
df.dropna(subset=["salary"])

# Drop rows where salary AND dept are BOTH null
df.dropna(subset=["salary","dept"], how="all")

# Keep rows with at least 3 non-null values out of 4 columns
df.dropna(thresh=3)

# Drop COLUMNS with any null (axis=1)
df.dropna(axis=1)

# Always reset the index after dropping rows
result = df.dropna(subset=["salary"]).reset_index(drop=True)`,
          note: 'dropna() returns a new DataFrame and never modifies df in place. Always reset the index afterwards so rows are numbered 0, 1, 2, … without gaps.',
        },
        {
          title: '.fillna() — replacing nulls with a constant or dict',
          body: '.fillna(value) replaces all nulls with that value. Pass a dict to fill different columns with different values: fillna({"col1": 0, "col2": "Unknown"}). You can also fill with a computed statistic like the column median. Always assign the result — fillna() never modifies df in place.',
          code: `# Fill ALL nulls with a single value
df.fillna(0)                        # fill everything with 0

# Fill different columns with different values
df.fillna({
    "age":    df["age"].mean(),     # fill age with column average
    "salary": 0.0,                  # fill salary with 0
    "dept":   "Unknown",            # fill dept with a string
})

# Fill a single column with its median
df["salary"] = df["salary"].fillna(df["salary"].median())

# Fill with a value computed on non-null rows
df["price"] = df["price"].fillna(df["price"].mean().round(2))

# Note: fillna returns a new object — always assign back
result = df.fillna({"dept": "Unknown"})   # not just df.fillna(...)`,
          note: 'fillna() with a dict only fills columns whose names are in the dict — other columns are left untouched. This is the safest way to fill selectively.',
        },
        {
          title: '.ffill() and .bfill() — propagating values across gaps',
          body: 'Forward fill (.ffill()) replaces each NaN with the last valid value before it. Backward fill (.bfill()) uses the next valid value after it. These are the standard tools for time-series gaps where a measurement was simply not recorded for some periods and the previous value should carry over.',
          code: `df = pd.DataFrame({
    "date":  ["2024-01-01","2024-01-02","2024-01-03","2024-01-04","2024-01-05"],
    "price": [100.0, None, None, 105.0, None],
})

# Forward fill: carry last known price forward
df["price"] = df["price"].ffill()
print(df["price"].tolist())
# [100.0, 100.0, 100.0, 105.0, 105.0]

# Backward fill: fill with the next known price
df_bfill = df.copy()
df_bfill["price"] = df_bfill["price"].bfill()
# [100.0, 105.0, 105.0, 105.0, NaN]  ← last row has no future value

# Limit consecutive fills (don't fill more than 1 gap at a time)
df["price"] = df["price"].ffill(limit=1)`,
          note: '.ffill() and .bfill() only work well on data that is already sorted in the correct order (e.g., by date). Always sort first if needed.',
        },
        {
          title: 'Filling with group statistics — groupby + transform + fillna',
          body: 'Instead of filling with a global column average (which may distort data), fill each null with the average of its own group. The pattern is: compute the group stat with .groupby().transform("mean"), then pass that as the argument to .fillna(). transform() returns a Series with the same length as the original DataFrame, so every null row gets its group\'s stat directly.',
          code: `df = pd.DataFrame({
    "name": ["Alice","Bob","Carol","Dave","Eve","Frank"],
    "dept": ["Eng","Eng","HR","HR","Eng","HR"],
    "sal":  [90000.0, None, 65000.0, 72000.0, 80000.0, None],
})

# Step 1: compute group means aligned to original rows
dept_means = df.groupby("dept")["sal"].transform("mean")
# Alice→85000, Bob→85000 (Eng avg), Carol→68500, Dave→68500, Eve→85000, Frank→68500

# Step 2: fill only the nulls
df["sal"] = df["sal"].fillna(dept_means)

# One-liner version:
df["sal"] = df["sal"].fillna(
    df.groupby("dept")["sal"].transform("mean")
)

# Eng non-null salaries: 90000+80000 → mean=85000.0 → Bob gets 85000.0
# HR  non-null salaries: 65000+72000 → mean=68500.0 → Frank gets 68500.0`,
          note: 'This pattern is extremely common in data engineering. transform("mean") uses only the non-null values in each group to compute the group average — nulls are automatically excluded from the mean calculation.',
        },
      ],
    },
    exercises: [
      {
        id: 'pd-ms-01',
        concept: 0,
        prompt: 'Write `null_summary(df)` that returns a `pd.Series` with the **count of null values per column** (the result of `.isna().sum()`).',
        hint: 'return df.isna().sum() — this already returns a Series indexed by column name.',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "name":       ["Alice", "Bob", "Charlie", "Diana", "Eve"],
    "age":        [30, None, 35, 28, None],
    "salary":     [75000.0, 58000.0, None, 72000.0, None],
    "department": ["Eng", "HR", "Eng", None, "Eng"],
})`,
        starterCode: `def null_summary(df):
    # Return a Series with the count of nulls per column
    ...`,
        solution: `def null_summary(df):
    return df.isna().sum()`,
        testCode: `result = null_summary(df)
assert isinstance(result, pd.Series)
assert result["name"] == 0
assert result["age"] == 2
assert result["salary"] == 2
assert result["department"] == 1
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-ms-02',
        concept: 0,
        prompt: 'Write `filter_complete_rows(df)` that returns only the rows where **every column is non-null**, with index reset. Use `.notna()` and boolean indexing.',
        hint: 'df[df.notna().all(axis=1)].reset_index(drop=True) — .all(axis=1) checks that all columns are non-null for each row.',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "name":       ["Alice", "Bob", "Charlie", "Diana", "Eve"],
    "age":        [30, None, 35, 28, None],
    "salary":     [75000.0, 58000.0, None, 72000.0, None],
    "department": ["Eng", "HR", "Eng", None, "Eng"],
})`,
        starterCode: `def filter_complete_rows(df):
    # Keep only rows where every column has a value
    # Hint: df.notna().all(axis=1) is True for fully complete rows
    ...`,
        solution: `def filter_complete_rows(df):
    return df[df.notna().all(axis=1)].reset_index(drop=True)`,
        testCode: `result = filter_complete_rows(df)
# Only Alice has all 4 values filled
assert len(result) == 1
assert result["name"].iloc[0] == "Alice"
assert result.index.tolist() == [0]
# Verify no nulls in result
assert result.isna().sum().sum() == 0
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-ms-03',
        concept: 1,
        prompt: 'Write `drop_missing_salary(df)` that drops rows where `"salary"` is null, and returns the remaining rows with index reset.',
        hint: 'df.dropna(subset=["salary"]).reset_index(drop=True)',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "name":       ["Alice", "Bob", "Charlie", "Diana", "Eve"],
    "age":        [30, None, 35, 28, None],
    "salary":     [75000.0, 58000.0, None, 72000.0, None],
    "department": ["Eng", "HR", "Eng", None, "Eng"],
})`,
        starterCode: `def drop_missing_salary(df):
    # Drop rows where salary is null, reset index
    ...`,
        solution: `def drop_missing_salary(df):
    return df.dropna(subset=["salary"]).reset_index(drop=True)`,
        testCode: `result = drop_missing_salary(df)
# Charlie(idx 2) and Eve(idx 4) have null salary → dropped
# Remaining: Alice, Bob, Diana
assert len(result) == 3
assert "Charlie" not in result["name"].tolist()
assert "Eve" not in result["name"].tolist()
assert result["name"].tolist() == ["Alice","Bob","Diana"]
assert result["salary"].isna().sum() == 0
assert result.index.tolist() == [0, 1, 2]
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-ms-04',
        concept: 2,
        prompt: 'Write `fill_defaults(df)` that fills nulls column-by-column: `"price"` → `0.0`, `"stock"` → `0`, `"category"` → `"Unknown"`. Use a single `.fillna(dict)` call. Do not modify the original.',
        hint: 'df.fillna({"price": 0.0, "stock": 0, "category": "Unknown"})',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "product":  ["Laptop", "Mouse", "Keyboard", "Monitor"],
    "category": ["Electronics", None, None, "Electronics"],
    "price":    [999.0, None, 79.0, None],
    "stock":    [5.0, 10.0, None, 8.0],
})`,
        starterCode: `def fill_defaults(df):
    # Fill nulls with column-specific defaults using a dict
    # price → 0.0, stock → 0, category → "Unknown"
    ...`,
        solution: `def fill_defaults(df):
    return df.fillna({"price": 0.0, "stock": 0, "category": "Unknown"})`,
        testCode: `result = fill_defaults(df)
assert result["price"].isna().sum() == 0
assert result["stock"].isna().sum() == 0
assert result["category"].isna().sum() == 0
# Mouse: price was null → 0.0
mouse = result[result["product"]=="Mouse"].iloc[0]
assert mouse["price"] == 0.0
assert mouse["category"] == "Unknown"
# Keyboard: stock was null → 0
keyboard = result[result["product"]=="Keyboard"].iloc[0]
assert keyboard["stock"] == 0
assert keyboard["category"] == "Unknown"
# Monitor: price was null → 0.0 but category unchanged
monitor = result[result["product"]=="Monitor"].iloc[0]
assert monitor["price"] == 0.0
assert monitor["category"] == "Electronics"
# Original unchanged
assert df["price"].isna().sum() > 0
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-ms-05',
        concept: 3,
        prompt: 'Write `forward_fill_prices(df)` that fills null `"price"` values using **forward fill** (each null inherits the last non-null price above it). Do not modify the original.',
        hint: 'df["price"] = df["price"].ffill(). Work on a copy.',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "date":  ["2024-01-01","2024-01-02","2024-01-03","2024-01-04","2024-01-05","2024-01-06"],
    "price": [100.0, None, None, 105.0, None, 108.0],
})`,
        starterCode: `def forward_fill_prices(df):
    df = df.copy()
    # Fill null prices by propagating the last known price forward
    ...`,
        solution: `def forward_fill_prices(df):
    df = df.copy()
    df["price"] = df["price"].ffill()
    return df`,
        testCode: `result = forward_fill_prices(df)
assert result["price"].isna().sum() == 0
# Jan01=100, Jan02=100 (ffill), Jan03=100 (ffill), Jan04=105, Jan05=105 (ffill), Jan06=108
assert result["price"].tolist() == [100.0, 100.0, 100.0, 105.0, 105.0, 108.0]
# Original unchanged
assert df["price"].isna().sum() > 0
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-ms-06',
        concept: 4,
        prompt: 'Write `fill_with_dept_mean(df)` that fills null `"salary"` values with the **mean salary of the same department**. Use `.groupby().transform("mean")` + `.fillna()`. Do not modify the original.',
        hint: 'df["salary"] = df["salary"].fillna(df.groupby("department")["salary"].transform("mean")). Copy first.',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "name":       ["Alice","Bob","Charlie","Diana","Eve","Frank"],
    "department": ["Eng","Eng","HR","HR","Eng","HR"],
    "salary":     [90000.0, None, 65000.0, 72000.0, 80000.0, None],
})`,
        starterCode: `def fill_with_dept_mean(df):
    df = df.copy()
    # Fill null salary with the mean salary of the same department
    # Step 1: df.groupby("department")["salary"].transform("mean") → group means per row
    # Step 2: .fillna(group_means) → fill only the nulls
    ...`,
        solution: `def fill_with_dept_mean(df):
    df = df.copy()
    dept_means = df.groupby("department")["salary"].transform("mean")
    df["salary"] = df["salary"].fillna(dept_means)
    return df`,
        testCode: `import math
result = fill_with_dept_mean(df)
assert result["salary"].isna().sum() == 0
# Eng non-null: Alice(90000) + Eve(80000) → mean = 85000.0 → Bob gets 85000.0
# HR  non-null: Charlie(65000) + Diana(72000) → mean = 68500.0 → Frank gets 68500.0
bob   = result[result["name"]=="Bob"]["salary"].iloc[0]
frank = result[result["name"]=="Frank"]["salary"].iloc[0]
assert math.isclose(bob, 85000.0),   f"Bob salary: {bob}"
assert math.isclose(frank, 68500.0), f"Frank salary: {frank}"
# Non-null rows unchanged
assert result[result["name"]=="Alice"]["salary"].iloc[0] == 90000.0
assert "salary" in df.columns
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-ms-07',
        concept: 4,
        prompt: `Write \`clean_employees(df)\` that performs a full cleaning pipeline in order:
1. Drop rows where \`"name"\` is null
2. Fill null \`"salary"\` values with the **median** of the non-null salaries (in the remaining rows)
3. Fill null \`"department"\` values with \`"Unknown"\`
4. Return with index reset`,
        hint: 'After dropping null names, compute median: df["salary"].median(). Then fillna({"salary": median_val, "department": "Unknown"}).',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "name":       ["Alice", "Bob", None, "Charlie", "Diana", "Eve", "Frank"],
    "department": ["Eng", "HR", "Eng", None, "Eng", "HR", "HR"],
    "salary":     [90000.0, None, 75000.0, 65000.0, 85000.0, None, 72000.0],
})`,
        starterCode: `def clean_employees(df):
    # 1. Drop rows where name is null
    # 2. Fill salary nulls with the column median (compute AFTER step 1)
    # 3. Fill department nulls with "Unknown"
    # 4. Reset index
    ...`,
        solution: `def clean_employees(df):
    df = df.dropna(subset=["name"]).copy()
    median_salary = df["salary"].median()
    df = df.fillna({"salary": median_salary, "department": "Unknown"})
    return df.reset_index(drop=True)`,
        testCode: `import math
result = clean_employees(df)
# Drop null-name row → 6 rows remain: Alice,Bob,Charlie,Diana,Eve,Frank
assert len(result) == 6
assert result["name"].isna().sum() == 0
assert result["salary"].isna().sum() == 0
assert result["department"].isna().sum() == 0
# Non-null salaries in 6 rows: 90000, 65000, 85000, 72000 → sorted: 65000,72000,85000,90000
# Median = (72000+85000)/2 = 78500.0
bob = result[result["name"]=="Bob"]["salary"].iloc[0]
eve = result[result["name"]=="Eve"]["salary"].iloc[0]
assert math.isclose(bob, 78500.0), f"Bob salary: {bob}"
assert math.isclose(eve, 78500.0), f"Eve salary: {eve}"
charlie = result[result["name"]=="Charlie"]["department"].iloc[0]
assert charlie == "Unknown", f"Charlie dept: {charlie}"
assert result.index.tolist() == list(range(6))
print("All tests passed!")
print(result)`,
      },
    ],
  },


  // ─── TOPIC 7: String Operations ──────────────────────────────────────────────
  {
    id: 'pd-strings',
    title: 'String Operations',
    description: 'Clean and transform text columns with the .str accessor — normalize case, filter by pattern, split, extract, and chain operations into pipelines.',
    lesson: {
      intro: 'Text data is almost always messy: mixed case, extra whitespace, inconsistent formatting, embedded codes. pandas exposes the entire Python string API on any object column via the .str accessor, running each method across every row without a loop. Mastering .str is essential for any ETL or data-cleaning pipeline.',
      concepts: [
        {
          title: '.str accessor — cleaning methods',
          body: 'Any column whose dtype is object (strings) has a .str accessor. All methods are vectorized — they run on every row at once and return a new Series. The most common cleaning methods: .str.strip() removes leading/trailing whitespace, .str.lower() / .str.upper() normalise case, .str.title() capitalises every word, .str.replace(old, new) substitutes substrings. Chaining multiple .str calls is clean and idiomatic.',
          code: `import pandas as pd

df = pd.DataFrame({
    "name":  ["  alice smith  ", "BOB JONES", " charlie BROWN "],
    "email": ["  ALICE@Gmail.COM  ", "bob@OUTLOOK.com", " Charlie@Yahoo.com  "],
    "code":  ["prod-001", "PROD-002", "prod-003"],
})

# Chain strip → title for names
df["name"]  = df["name"].str.strip().str.title()
# ["Alice Smith", "Bob Jones", "Charlie Brown"]

# Chain strip → lower for emails
df["email"] = df["email"].str.strip().str.lower()
# ["alice@gmail.com", "bob@outlook.com", "charlie@yahoo.com"]

# Strip → upper for codes
df["code"]  = df["code"].str.strip().str.upper()
# ["PROD-001", "PROD-002", "PROD-003"]

# str.replace works with plain strings or regex (regex=True)
df["code"] = df["code"].str.replace("PROD-", "P", regex=False)`,
          note: 'Every .str method returns a new Series — the original column is unchanged until you assign back: df["col"] = df["col"].str.strip().',
        },
        {
          title: '.str.contains(), .str.startswith(), .str.endswith() — filtering by pattern',
          body: 'These three methods return boolean Series that you use for row-level filtering — exactly like df[df["col"] == value] but for substring checks. contains() accepts a regex pattern by default (regex=True); set regex=False for plain string matching. Always pass na=False when the column might have NaN values, otherwise the null rows produce NaN in the boolean mask and pandas raises a TypeError when indexing.',
          code: `df = pd.DataFrame({
    "name":  ["Alice", "Bob", "Charlie", "Ana"],
    "email": ["alice@gmail.com", "bob@outlook.com", None, "ana@gmail.com"],
    "code":  ["ELEC-001", "ACC-002", "ELEC-003", "FURN-001"],
})

# Keep only gmail users (na=False so NaN rows evaluate as False)
gmail = df[df["email"].str.contains("@gmail.com", na=False)]
#    name          email      code
# 0  Alice  alice@gmail.com  ELEC-001
# 3    Ana    ana@gmail.com  FURN-001

# Keep rows where code starts with "ELEC"
elec = df[df["code"].str.startswith("ELEC")]
# Alice (ELEC-001) and Charlie (ELEC-003)

# Keep rows where name ends with a vowel
vowel_end = df[df["name"].str.lower().str.endswith(("a","e","i","o","u"))]`,
          note: 'str.contains() with regex=True (default) lets you use full regex patterns like r"^[A-Z]" or r"\\d{3}". Use regex=False for plain string matching — it is faster and avoids accidentally treating special characters as regex metacharacters.',
        },
        {
          title: '.str.split(), .str[n], .str.len() — slicing and splitting',
          body: '.str.split("sep") splits each string on a separator and returns a Series of lists. Chain .str[n] to extract the nth element of each list. Use .str.len() to get the character count of each string. You can also slice strings directly with .str[start:stop], just like Python string slicing.',
          code: `df = pd.DataFrame({
    "email": ["alice@gmail.com","bob@outlook.com","carol@yahoo.com"],
    "code":  ["ELEC-001", "ACC-002", "FURN-003"],
    "name":  ["Alice Smith", "Bob Jones", "Carol White"],
})

# Split email on "@" and take the domain (index 1)
df["domain"] = df["email"].str.split("@").str[1]
# ["gmail.com", "outlook.com", "yahoo.com"]

# Split email and take the username (index 0)
df["username"] = df["email"].str.split("@").str[0]

# Slice: first 4 characters of code
df["prefix"] = df["code"].str[:4]
# ["ELEC", "ACC-", "FURN"]

# Length of each name
df["name_len"] = df["name"].str.len()
# [11, 9, 11]

# First word of name
df["first_name"] = df["name"].str.split().str[0]
# ["Alice", "Bob", "Carol"]`,
          note: 'str.split() with no argument splits on any whitespace (including multiple spaces and tabs). str.split(",") splits on a specific character.',
        },
        {
          title: '.str.extract() — pull structured data out of text with regex',
          body: '.str.extract(r"pattern") applies a regex with capture groups () to each string and returns a DataFrame with one column per group. Named groups (?P<name>...) become column names in the output. If a row does not match, that row gets NaN. This is the cleanest way to parse structured data embedded in text (product codes, version strings, dates in filenames, etc.).',
          code: `df = pd.DataFrame({
    "code": ["ELEC-001", "ACC-002", "FURN-003", "ELEC-042"],
    "version": ["v1.2.3", "v0.9.0", "v2.0.1", "v1.0.0"],
})

# Extract two capture groups → two columns
parsed = df["code"].str.extract(r"([A-Z]+)-(\d+)")
#       0    1
# 0  ELEC  001
# 1   ACC  002
# ...

# Named groups → column names in output
parsed = df["code"].str.extract(r"(?P<prefix>[A-Z]+)-(?P<number>\\d+)")
#   prefix number
# 0   ELEC    001
# 1    ACC    002

# Assign back to the original DataFrame
df[["category", "item_id"]] = df["code"].str.extract(r"([A-Z]+)-(\\d+)")

# Extract version number (just the digits)
df["major"] = df["version"].str.extract(r"v(\\d+)\\.").astype(int)`,
          note: 'extract() with a single capture group returns a Series if you call .str.extract(r"(pattern)")[0]. With named groups it returns a clean DataFrame that you can assign directly.',
        },
        {
          title: 'Chaining string operations into a pipeline',
          body: 'Real-world text cleaning usually chains several .str calls in sequence. Wrap each column transformation in parentheses for clean multi-line chaining. You can combine .str methods with .assign() to build a full transformation pipeline that leaves the original DataFrame unchanged.',
          code: `df = pd.DataFrame({
    "raw_name":  ["  alice smith  ", "BOB JONES"],
    "raw_email": ["  ALICE@Gmail.COM  ", "bob@OUTLOOK.com"],
    "raw_code":  ["prod-001", "PROD-002"],
})

result = df.assign(
    name  = df["raw_name"].str.strip().str.title(),
    email = df["raw_email"].str.strip().str.lower(),
    code  = df["raw_code"].str.strip().str.upper(),
    # Extract domain AFTER normalising email — use a lambda so the
    # normalised email column is available in the same chain
    domain = lambda d: d["email"].str.split("@").str[1],
)[["name", "email", "code", "domain"]]  # keep only the clean columns

print(result)
#          name            email      code       domain
# 0  Alice Smith  alice@gmail.com  PROD-001    gmail.com
# 1    Bob Jones  bob@outlook.com  PROD-002  outlook.com`,
          note: 'Wrapping the transformation in .assign() guarantees the original df is never modified. The lambda in the last assign step receives the DataFrame after the earlier assigns, so d["email"] already holds the cleaned value.',
        },
      ],
    },
    exercises: [
      {
        id: 'pd-st-01',
        concept: 0,
        prompt: 'Write `normalize_names(df)` that cleans the `"name"` column (on a copy): strip whitespace and convert to title case. Return the full DataFrame.',
        hint: 'df["name"] = df["name"].str.strip().str.title(). Copy first.',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "id":   [1, 2, 3, 4],
    "name": ["  alice smith  ", "BOB JONES", " charlie BROWN ", "DIANA ROSS  "],
    "score": [88, 72, 91, 65],
})`,
        starterCode: `def normalize_names(df):
    df = df.copy()
    # Clean "name": strip whitespace, then title case
    ...`,
        solution: `def normalize_names(df):
    df = df.copy()
    df["name"] = df["name"].str.strip().str.title()
    return df`,
        testCode: `result = normalize_names(df)
assert result["name"].tolist() == ["Alice Smith", "Bob Jones", "Charlie Brown", "Diana Ross"]
assert result["score"].tolist() == [88, 72, 91, 65]
# Original unchanged
assert df["name"].iloc[0] == "  alice smith  "
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-st-02',
        concept: 0,
        prompt: 'Write `clean_emails(df)` that cleans the `"email"` column (on a copy): strip whitespace and convert to lowercase. Return the full DataFrame.',
        hint: 'df["email"] = df["email"].str.strip().str.lower()',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "name":  ["Alice", "Bob", "Charlie", "Diana"],
    "email": ["  ALICE@Gmail.COM  ", "bob@OUTLOOK.com  ", "  CHARLIE@Yahoo.com", "Diana@Gmail.com"],
})`,
        starterCode: `def clean_emails(df):
    df = df.copy()
    # Clean "email": strip whitespace, then lowercase
    ...`,
        solution: `def clean_emails(df):
    df = df.copy()
    df["email"] = df["email"].str.strip().str.lower()
    return df`,
        testCode: `result = clean_emails(df)
assert result["email"].tolist() == [
    "alice@gmail.com", "bob@outlook.com", "charlie@yahoo.com", "diana@gmail.com"
]
assert result["name"].tolist() == ["Alice","Bob","Charlie","Diana"]
assert df["email"].iloc[0] == "  ALICE@Gmail.COM  "
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-st-03',
        concept: 1,
        prompt: 'Write `filter_gmail_users(df)` that returns only the rows where `"email"` contains `"@gmail.com"`, with index reset. Use `.str.contains()` with `na=False`.',
        hint: 'df[df["email"].str.contains("@gmail.com", na=False)].reset_index(drop=True)',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "name":  ["Alice","Bob","Charlie","Diana","Eve"],
    "email": ["alice@gmail.com","bob@outlook.com","charlie@yahoo.com","diana@gmail.com","eve@gmail.com"],
})`,
        starterCode: `def filter_gmail_users(df):
    # Keep rows where email contains "@gmail.com"
    # Use na=False to handle potential nulls safely
    ...`,
        solution: `def filter_gmail_users(df):
    return df[df["email"].str.contains("@gmail.com", na=False)].reset_index(drop=True)`,
        testCode: `result = filter_gmail_users(df)
assert len(result) == 3
assert result["name"].tolist() == ["Alice","Diana","Eve"]
assert result.index.tolist() == [0, 1, 2]
assert all("@gmail.com" in e for e in result["email"])
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-st-04',
        concept: 1,
        prompt: 'Write `filter_electronics(df)` that returns only rows where `"product_code"` starts with `"ELEC"`, with index reset. Use `.str.startswith()`.',
        hint: 'df[df["product_code"].str.startswith("ELEC")].reset_index(drop=True)',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "product_code": ["ELEC-001","ELEC-002","ACC-001","ELEC-003","ACC-002","FURN-001"],
    "name":         ["Laptop","Monitor","Mouse","Phone","Keyboard","Desk"],
    "price":        [999.0, 349.0, 29.99, 799.0, 79.0, 299.0],
})`,
        starterCode: `def filter_electronics(df):
    # Keep rows where product_code starts with "ELEC"
    ...`,
        solution: `def filter_electronics(df):
    return df[df["product_code"].str.startswith("ELEC")].reset_index(drop=True)`,
        testCode: `result = filter_electronics(df)
assert len(result) == 3
assert result["name"].tolist() == ["Laptop","Monitor","Phone"]
assert result["product_code"].tolist() == ["ELEC-001","ELEC-002","ELEC-003"]
assert result.index.tolist() == [0,1,2]
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-st-05',
        concept: 2,
        prompt: 'Write `extract_domain(df)` that adds a `"domain"` column by splitting `"email"` on `"@"` and taking the part after the `@`. Do not modify the original.',
        hint: 'df["domain"] = df["email"].str.split("@").str[1]  — .str[1] picks the second element of each split list.',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "name":  ["Alice","Bob","Charlie","Diana","Eve"],
    "email": ["alice@gmail.com","bob@outlook.com","charlie@yahoo.com","diana@gmail.com","eve@company.org"],
})`,
        starterCode: `def extract_domain(df):
    df = df.copy()
    # Split "email" on "@" and take element [1] (the domain part)
    ...`,
        solution: `def extract_domain(df):
    df = df.copy()
    df["domain"] = df["email"].str.split("@").str[1]
    return df`,
        testCode: `result = extract_domain(df)
assert "domain" in result.columns
assert result["domain"].tolist() == ["gmail.com","outlook.com","yahoo.com","gmail.com","company.org"]
assert "domain" not in df.columns
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-st-06',
        concept: 2,
        prompt: 'Write `add_name_length(df)` that adds a `"name_length"` column with the character count of each name in `"full_name"`. Do not modify the original.',
        hint: 'df["name_length"] = df["full_name"].str.len()',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "full_name": ["Alice Smith","Bob J","Charlie Brown","Di","Eve"],
    "score":     [88, 72, 91, 65, 79],
})`,
        starterCode: `def add_name_length(df):
    df = df.copy()
    # Add "name_length" = character count of "full_name"
    ...`,
        solution: `def add_name_length(df):
    df = df.copy()
    df["name_length"] = df["full_name"].str.len()
    return df`,
        testCode: `result = add_name_length(df)
assert "name_length" in result.columns
# "Alice Smith"=11, "Bob J"=5, "Charlie Brown"=13, "Di"=2, "Eve"=3
assert result["name_length"].tolist() == [11, 5, 13, 2, 3]
assert "name_length" not in df.columns
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-st-07',
        concept: null,
        prompt: `Write \`clean_records(df)\` that transforms the raw input into a clean DataFrame with exactly these columns:
- \`"name"\` — raw_name stripped and title-cased
- \`"email"\` — raw_email stripped and lowercased
- \`"code"\` — raw_code stripped and uppercased
- \`"domain"\` — the part of the cleaned email after \`"@"\`

Return only these 4 columns. Do not modify the original.`,
        hint: 'Use .assign() to build all columns at once. For "domain", use a lambda: lambda d: d["email"].str.split("@").str[1] so it reads from the already-cleaned email column within the same chain. Finish with [["name","email","code","domain"]] to select the final columns.',
        setupCode: `import pandas as pd

df = pd.DataFrame({
    "raw_name":  ["  alice smith  ", "BOB JONES", " charlie BROWN ", "  DIANA ROSS"],
    "raw_email": ["  ALICE@Gmail.COM  ", "bob@OUTLOOK.com  ", "  Charlie@Yahoo.com", "DIANA@Company.org"],
    "raw_code":  ["prod-001", "PROD-002", "prod-003", "PROD-004"],
})`,
        starterCode: `def clean_records(df):
    # Use .assign() to create all 4 columns cleanly
    # For "domain": use lambda d: d["email"].str.split("@").str[1]
    # so it uses the already-cleaned email within the chain
    # End with [["name","email","code","domain"]] to return only those columns
    ...`,
        solution: `def clean_records(df):
    return df.assign(
        name   = df["raw_name"].str.strip().str.title(),
        email  = df["raw_email"].str.strip().str.lower(),
        code   = df["raw_code"].str.strip().str.upper(),
        domain = lambda d: d["email"].str.split("@").str[1],
    )[["name","email","code","domain"]]`,
        testCode: `result = clean_records(df)
assert list(result.columns) == ["name","email","code","domain"]
assert result["name"].tolist()   == ["Alice Smith","Bob Jones","Charlie Brown","Diana Ross"]
assert result["email"].tolist()  == ["alice@gmail.com","bob@outlook.com","charlie@yahoo.com","diana@company.org"]
assert result["code"].tolist()   == ["PROD-001","PROD-002","PROD-003","PROD-004"]
assert result["domain"].tolist() == ["gmail.com","outlook.com","yahoo.com","company.org"]
# Original unchanged
assert "name" not in df.columns
print("All tests passed!")
print(result)`,
      },
    ],
  },

  // ─── TOPIC 8: Merging DataFrames ─────────────────────────────────────────────
  {
    id: 'pd-merge',
    title: 'Merging DataFrames',
    description: 'Combine DataFrames with pd.merge() (inner, left, outer), join on multiple keys, handle column collisions with suffixes, and stack tables with pd.concat().',
    lesson: {
      intro: 'Most real datasets live in multiple tables, and combining them is one of the most common operations in data engineering. pandas gives you pd.merge() for SQL-style joins (inner, left, right, outer), the ability to join on multiple keys simultaneously, suffix control for column name collisions, and pd.concat() for stacking DataFrames vertically or horizontally.',
      concepts: [
        {
          title: 'pd.merge() — the inner join',
          body: 'pd.merge(left, right, on="key") joins two DataFrames on a shared column name. The default is an inner join — only rows where the key exists in BOTH tables are kept. Use left_on= and right_on= when the key columns have different names in each table. The result has the columns of both tables (except the duplicate key column).',
          code: `import pandas as pd

products = pd.DataFrame({
    "product_id": [1, 2, 3, 4],
    "name":       ["Laptop","Mouse","Keyboard","Monitor"],
    "cat_id":     [10, 20, 20, 10],
})

categories = pd.DataFrame({
    "cat_id":   [10, 20, 30],
    "cat_name": ["Electronics","Accessories","Furniture"],
})

# Inner join: only products that have a matching cat_id
result = pd.merge(products, categories, on="cat_id")
# 4 rows — all products matched (cat_id 30 "Furniture" has no products → excluded)

# Different key names in each table
orders = pd.DataFrame({"order_product_id": [1, 2], "qty": [3, 10]})
result = pd.merge(orders, products,
                  left_on="order_product_id", right_on="product_id")`,
          note: 'pd.merge() always returns a NEW DataFrame. The original tables are never modified. If a key value appears multiple times in both tables, every combination is returned (a Cartesian product for that key) — this is the "fan-out" problem to watch for.',
        },
        {
          title: 'how= — left, right, and outer joins',
          body: 'The how= parameter controls which rows survive when a key is missing on one side. "inner" (default): only rows that match on both sides. "left": all rows from the LEFT table, NaN for columns from the right when there is no match. "right": all rows from the RIGHT table. "outer": all rows from both sides, NaN wherever there is no match. The LEFT join is the most common after inner — use it when you want to keep all records from the primary table and optionally enrich them with data from a secondary table.',
          code: `employees = pd.DataFrame({
    "emp_id": [1, 2, 3, 4],
    "name":   ["Alice","Bob","Charlie","Diana"],
    "dept_id":[10, 20, 10, 99],   # dept 99 doesn't exist in departments
})
departments = pd.DataFrame({
    "dept_id": [10, 20],
    "dept":    ["Engineering","HR"],
})

# Left join: keep all employees, NaN where no dept match
result = pd.merge(employees, departments, on="dept_id", how="left")
#   emp_id     name  dept_id           dept
# 0       1    Alice       10  Engineering
# 1       2      Bob       20           HR
# 2       3  Charlie       10  Engineering
# 3       4    Diana       99          NaN  ← no matching dept

# Anti-join pattern: find employees WITHOUT a department
unmatched = result[result["dept"].isna()]

# Outer join: rows from BOTH sides, NaN where no match on either side
outer = pd.merge(employees, departments, on="dept_id", how="outer")`,
          note: 'The left join + filter-on-null pattern is called an anti-join: it finds rows in the left table that have NO match in the right table. This is very common for finding orphaned records.',
        },
        {
          title: 'Merging on multiple keys',
          body: 'Pass a list to on= to require that all listed columns match between the two tables. This is the equivalent of SQL JOIN ON a.col1 = b.col1 AND a.col2 = b.col2. Rows are only joined when the entire combination of keys matches on both sides.',
          code: `sales = pd.DataFrame({
    "product_id": [1, 1, 2, 2, 3],
    "region_id":  [1, 2, 1, 2, 1],
    "amount":     [500.0, 300.0, 200.0, 400.0, 150.0],
})
targets = pd.DataFrame({
    "product_id": [1, 1, 2, 2],
    "region_id":  [1, 2, 1, 2],
    "target":     [450.0, 350.0, 250.0, 380.0],
})

# Inner join: match on BOTH product_id AND region_id
result = pd.merge(sales, targets, on=["product_id","region_id"])
# 4 rows — product 3 / region 1 has no target → excluded from inner join

# Add a derived column after the join
result["achieved"] = result["amount"] >= result["target"]
#   product_id  region_id  amount  target  achieved
# 0          1          1   500.0   450.0      True
# 1          1          2   300.0   350.0     False
# 2          2          1   200.0   250.0     False
# 3          2          2   400.0   380.0      True`,
          note: 'When merging on multiple keys, the order of keys in the list does not matter for correctness, but convention is to list more selective keys first (e.g., ID before date) for readability.',
        },
        {
          title: 'Handling column name collisions with suffixes',
          body: 'When both tables have a non-key column with the same name, pandas would create duplicate column names — to avoid this it automatically appends "_x" and "_y" suffixes. Use the suffixes= parameter to specify meaningful names instead. This is common when comparing two snapshots of the same table (Q1 vs Q2, before vs after, actual vs budget).',
          code: `q1 = pd.DataFrame({
    "product": ["Laptop","Mouse","Keyboard"],
    "revenue": [2997.0, 449.85, 632.0],
    "units":   [3, 15, 8],
})
q2 = pd.DataFrame({
    "product": ["Laptop","Mouse","Monitor"],
    "revenue": [3500.0, 380.0, 698.0],
    "units":   [5, 12, 2],
})

# Default suffixes "_x" and "_y" — confusing
pd.merge(q1, q2, on="product")
# product  revenue_x  units_x  revenue_y  units_y

# Custom suffixes — self-documenting
result = pd.merge(q1, q2, on="product", suffixes=("_q1","_q2"))
# product  revenue_q1  units_q1  revenue_q2  units_q2

# Add a comparison column
result["revenue_growth"] = result["revenue_q2"] - result["revenue_q1"]`,
          note: 'The suffixes= parameter takes a 2-tuple: (left_suffix, right_suffix). If you know one table\'s column should take precedence, you can rename it before the merge and leave the other as-is.',
        },
        {
          title: 'pd.concat() — stacking DataFrames',
          body: 'pd.concat([df1, df2, ...]) stacks DataFrames vertically (rows on top of each other). Use ignore_index=True to reset the index so the result has 0,1,2,… row numbers. All DataFrames must have the same column names (or columns are outer-joined, with NaN for missing). Use axis=1 to stack horizontally (columns side by side) instead.',
          code: `q1 = pd.DataFrame({
    "name":       ["Alice","Bob"],
    "department": ["Eng","Eng"],
    "revenue":    [50000, 45000],
})
q2 = pd.DataFrame({
    "name":       ["Carol","Dave"],
    "department": ["HR","HR"],
    "revenue":    [30000, 28000],
})

# Stack vertically — ignore_index resets to 0,1,2,3
all_data = pd.concat([q1, q2], ignore_index=True)
#     name department  revenue
# 0  Alice        Eng    50000
# 1    Bob        Eng    45000
# 2  Carol         HR    30000
# 3   Dave         HR    28000

# Can concatenate more than two
yearly = pd.concat([q1, q2, q3, q4], ignore_index=True)

# Stack horizontally (columns side by side)
wide = pd.concat([df_a, df_b], axis=1)`,
          note: 'pd.concat() differs from pd.merge(): concat simply stacks without any key matching, while merge joins on shared key values. Use concat when tables have the same structure and you want to combine their rows; use merge when tables have complementary data that should be joined on a shared key.',
        },
      ],
    },
    exercises: [
      {
        id: 'pd-mg-01',
        concept: 0,
        prompt: 'Write `merge_products_categories(products, categories)` that does an **inner join** on `"category_id"` and returns the merged DataFrame.',
        hint: 'pd.merge(products, categories, on="category_id") — how="inner" is the default.',
        setupCode: `import pandas as pd

products = pd.DataFrame({
    "product_id":  [1, 2, 3, 4, 5],
    "name":        ["Laptop","Mouse","Keyboard","Monitor","Headset"],
    "category_id": [10, 20, 20, 10, 20],
    "price":       [999.0, 29.99, 79.0, 349.0, 149.0],
})
categories = pd.DataFrame({
    "category_id": [10, 20, 30],
    "category":    ["Electronics","Accessories","Furniture"],
})`,
        starterCode: `def merge_products_categories(products, categories):
    # Inner join on category_id
    ...`,
        solution: `def merge_products_categories(products, categories):
    return pd.merge(products, categories, on="category_id")`,
        testCode: `result = merge_products_categories(products, categories)
# All 5 products have a matching category → 5 rows
# "Furniture" (cat 30) has no products → excluded
assert len(result) == 5
assert "category" in result.columns
assert "name" in result.columns
assert set(result["category"].unique()) == {"Electronics","Accessories"}
laptop = result[result["name"]=="Laptop"].iloc[0]
assert laptop["category"] == "Electronics"
mouse = result[result["name"]=="Mouse"].iloc[0]
assert mouse["category"] == "Accessories"
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-mg-02',
        concept: 1,
        prompt: 'Write `merge_all_employees(employees, departments)` that does a **left join** on `"dept_id"`, keeping all employees even if their department does not exist in the departments table.',
        hint: 'pd.merge(employees, departments, on="dept_id", how="left")',
        setupCode: `import pandas as pd

employees = pd.DataFrame({
    "emp_id":  [1, 2, 3, 4, 5],
    "name":    ["Alice","Bob","Charlie","Diana","Eve"],
    "dept_id": [10, 20, 10, 99, 20],
})
departments = pd.DataFrame({
    "dept_id":   [10, 20],
    "dept_name": ["Engineering","HR"],
})`,
        starterCode: `def merge_all_employees(employees, departments):
    # Left join: keep ALL employees, NaN for those without a dept
    ...`,
        solution: `def merge_all_employees(employees, departments):
    return pd.merge(employees, departments, on="dept_id", how="left")`,
        testCode: `result = merge_all_employees(employees, departments)
# All 5 employees kept; Diana (dept 99) gets NaN for dept_name
assert len(result) == 5
assert "dept_name" in result.columns
diana = result[result["name"]=="Diana"].iloc[0]
assert diana["dept_name"] != diana["dept_name"]   # NaN != NaN is True
alice = result[result["name"]=="Alice"].iloc[0]
assert alice["dept_name"] == "Engineering"
bob = result[result["name"]=="Bob"].iloc[0]
assert bob["dept_name"] == "HR"
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-mg-03',
        concept: 1,
        prompt: 'Write `find_unmatched_employees(employees, departments)` that returns employees who have **no matching department** (the anti-join pattern: left join, then filter where department name is null). Return with index reset.',
        hint: 'Do a left join, then filter: merged[merged["dept_name"].isna()].reset_index(drop=True)',
        setupCode: `import pandas as pd

employees = pd.DataFrame({
    "emp_id":  [1, 2, 3, 4, 5],
    "name":    ["Alice","Bob","Charlie","Diana","Eve"],
    "dept_id": [10, 20, 10, 99, 88],
})
departments = pd.DataFrame({
    "dept_id":   [10, 20],
    "dept_name": ["Engineering","HR"],
})`,
        starterCode: `def find_unmatched_employees(employees, departments):
    # Left join, then keep only rows where dept_name is null
    # These are employees with no matching department
    ...`,
        solution: `def find_unmatched_employees(employees, departments):
    merged = pd.merge(employees, departments, on="dept_id", how="left")
    return merged[merged["dept_name"].isna()].reset_index(drop=True)`,
        testCode: `result = find_unmatched_employees(employees, departments)
# Diana (dept 99) and Eve (dept 88) have no matching department
assert len(result) == 2
assert set(result["name"].tolist()) == {"Diana","Eve"}
assert result["dept_name"].isna().all()
assert result.index.tolist() == [0, 1]
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-mg-04',
        concept: 2,
        prompt: 'Write `merge_with_targets(sales, targets)` that does an **inner join on both `"product_id"` and `"region_id"`**, then adds an `"achieved"` column that is `True` when `amount >= target`. Return sorted by `product_id`, then `region_id`, with index reset.',
        hint: 'pd.merge(sales, targets, on=["product_id","region_id"]) — pass a list to on=.',
        setupCode: `import pandas as pd

sales = pd.DataFrame({
    "product_id": [1, 1, 2, 2, 3],
    "region_id":  [1, 2, 1, 2, 1],
    "amount":     [500.0, 300.0, 200.0, 400.0, 150.0],
})
targets = pd.DataFrame({
    "product_id": [1, 1, 2, 2],
    "region_id":  [1, 2, 1, 2],
    "target":     [450.0, 350.0, 250.0, 380.0],
})`,
        starterCode: `def merge_with_targets(sales, targets):
    # Inner join on both product_id and region_id
    # Then add "achieved" = amount >= target
    # Sort by product_id, region_id and reset index
    ...`,
        solution: `def merge_with_targets(sales, targets):
    result = pd.merge(sales, targets, on=["product_id","region_id"])
    result["achieved"] = result["amount"] >= result["target"]
    return result.sort_values(["product_id","region_id"]).reset_index(drop=True)`,
        testCode: `result = merge_with_targets(sales, targets)
# Product 3 / region 1 has no target → excluded
assert len(result) == 4
assert "achieved" in result.columns
# (1,1): amount=500 >= target=450 → True
# (1,2): amount=300 < target=350 → False
# (2,1): amount=200 < target=250 → False
# (2,2): amount=400 >= target=380 → True
row_1_1 = result[(result["product_id"]==1)&(result["region_id"]==1)].iloc[0]
row_1_2 = result[(result["product_id"]==1)&(result["region_id"]==2)].iloc[0]
row_2_2 = result[(result["product_id"]==2)&(result["region_id"]==2)].iloc[0]
assert row_1_1["achieved"] == True
assert row_1_2["achieved"] == False
assert row_2_2["achieved"] == True
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-mg-05',
        concept: 3,
        prompt: 'Write `compare_quarters(q1, q2)` that does an **inner join on `"product"`** with `suffixes=("_q1","_q2")`. Return the merged DataFrame with columns: `product, revenue_q1, units_q1, revenue_q2, units_q2`.',
        hint: 'pd.merge(q1, q2, on="product", suffixes=("_q1","_q2")) — when both tables have "revenue" and "units", the suffixes distinguish them.',
        setupCode: `import pandas as pd

q1 = pd.DataFrame({
    "product": ["Laptop","Mouse","Keyboard"],
    "revenue": [2997.0, 449.85, 632.0],
    "units":   [3, 15, 8],
})
q2 = pd.DataFrame({
    "product": ["Laptop","Mouse","Monitor"],
    "revenue": [3500.0, 380.0, 698.0],
    "units":   [5, 12, 2],
})`,
        starterCode: `def compare_quarters(q1, q2):
    # Inner join on "product" with meaningful suffixes
    # Keyboard is only in q1, Monitor only in q2 → excluded from inner join
    ...`,
        solution: `def compare_quarters(q1, q2):
    return pd.merge(q1, q2, on="product", suffixes=("_q1","_q2"))`,
        testCode: `result = compare_quarters(q1, q2)
# Only Laptop and Mouse exist in both quarters
assert len(result) == 2
assert list(result.columns) == ["product","revenue_q1","units_q1","revenue_q2","units_q2"]
laptop = result[result["product"]=="Laptop"].iloc[0]
assert laptop["revenue_q1"] == 2997.0
assert laptop["revenue_q2"] == 3500.0
assert laptop["units_q1"] == 3
assert laptop["units_q2"] == 5
mouse = result[result["product"]=="Mouse"].iloc[0]
assert mouse["revenue_q1"] == 449.85
assert mouse["revenue_q2"] == 380.0
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-mg-06',
        concept: 4,
        prompt: 'Write `stack_records(df1, df2)` that stacks two DataFrames vertically into one using `pd.concat()`, with the index reset to `0, 1, 2, …`.',
        hint: 'pd.concat([df1, df2], ignore_index=True)',
        setupCode: `import pandas as pd

df1 = pd.DataFrame({
    "name":       ["Alice","Bob","Charlie"],
    "department": ["Eng","Eng","Eng"],
    "salary":     [90000, 80000, 95000],
})
df2 = pd.DataFrame({
    "name":       ["Diana","Eve","Frank"],
    "department": ["HR","HR","HR"],
    "salary":     [65000, 72000, 58000],
})`,
        starterCode: `def stack_records(df1, df2):
    # Stack df1 on top of df2 (vertical concat), reset index
    ...`,
        solution: `def stack_records(df1, df2):
    return pd.concat([df1, df2], ignore_index=True)`,
        testCode: `result = stack_records(df1, df2)
assert len(result) == 6
assert list(result.columns) == ["name","department","salary"]
assert result.index.tolist() == [0,1,2,3,4,5]
assert result["name"].tolist() == ["Alice","Bob","Charlie","Diana","Eve","Frank"]
assert result["department"].tolist() == ["Eng","Eng","Eng","HR","HR","HR"]
# Original DataFrames unchanged
assert len(df1) == 3
assert len(df2) == 3
print("All tests passed!")
print(result)`,
      },
      {
        id: 'pd-mg-07',
        concept: null,
        prompt: `Write \`category_revenue_report(sales, products, categories)\` that:
1. Merges \`sales\` with \`products\` on \`"product_id"\` (inner)
2. Merges the result with \`categories\` on \`"category_id"\` (inner)
3. Groups by \`"category_name"\` and sums \`"revenue"\` as \`"total_revenue"\`
4. Returns sorted by \`"total_revenue"\` descending, index reset, with columns \`["category_name", "total_revenue"]\``,
        hint: 'Chain two pd.merge() calls, then .groupby("category_name").agg(total_revenue=("revenue","sum")).reset_index().sort_values("total_revenue", ascending=False).reset_index(drop=True)',
        setupCode: `import pandas as pd

sales = pd.DataFrame({
    "sale_id":    [1, 2, 3, 4, 5, 6],
    "product_id": [1, 2, 1, 3, 2, 3],
    "revenue":    [999.0, 29.99, 999.0, 79.0, 29.99, 79.0],
})
products = pd.DataFrame({
    "product_id":  [1, 2, 3],
    "name":        ["Laptop","Mouse","Keyboard"],
    "category_id": [10, 20, 20],
})
categories = pd.DataFrame({
    "category_id":   [10, 20],
    "category_name": ["Electronics","Accessories"],
})`,
        starterCode: `def category_revenue_report(sales, products, categories):
    # Step 1: merge sales + products on product_id
    # Step 2: merge result + categories on category_id
    # Step 3: groupby category_name, sum revenue → "total_revenue"
    # Step 4: sort descending, reset index, return ["category_name","total_revenue"]
    ...`,
        solution: `def category_revenue_report(sales, products, categories):
    merged = pd.merge(sales, products, on="product_id")
    merged = pd.merge(merged, categories, on="category_id")
    result = (
        merged
        .groupby("category_name")
        .agg(total_revenue=("revenue","sum"))
        .reset_index()
        .sort_values("total_revenue", ascending=False)
        .reset_index(drop=True)
    )
    return result[["category_name","total_revenue"]]`,
        testCode: `import math
result = category_revenue_report(sales, products, categories)
assert list(result.columns) == ["category_name","total_revenue"]
assert len(result) == 2
# Electronics: Laptop sales 1+3 = 999+999 = 1998.0
# Accessories: Mouse sales 2+5 = 29.99+29.99 = 59.98 ; Keyboard sales 4+6 = 79+79 = 158.0 → total = 217.98
assert result.iloc[0]["category_name"] == "Electronics"
assert math.isclose(result.iloc[0]["total_revenue"], 1998.0)
assert result.iloc[1]["category_name"] == "Accessories"
assert math.isclose(result.iloc[1]["total_revenue"], 217.98)
print("All tests passed!")
print(result)`,
      },
    ],
  },

];