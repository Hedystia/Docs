---
title: Queries
---

# Queries

All query methods are accessed directly from the database instance using the table name.

## find

Find all rows matching the query options.

```ts
// All users
const users = await db.users.find();

// With conditions
const adults = await db.users.find({
  where: { age: { gte: 18 } },
  orderBy: { name: "asc" },
  take: 10,
  skip: 0,
});
```

## findMany

Alias for `find`.

```ts
const users = await db.users.findMany({ where: { active: true } });
```

## findFirst

Find the first row matching the query options. Returns `null` if no match.

```ts
const user = await db.users.findFirst({ where: { email: "alice@example.com" } });
```

## insert

Insert a single row and return the inserted data.

```ts
const user = await db.users.insert({
  name: "Alice",
  email: "alice@example.com",
  age: 25,
});
```

### Inserting array and JSON data

```ts
const user = await db.users.insert({
  name: "Alice",
  tags: ["admin", "editor"],
  metadata: { role: "admin", level: 5 },
});
```

## insertMany

Insert multiple rows at once.

```ts
const users = await db.users.insertMany([
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" },
]);
```

## update

Update rows matching the where clause. Returns the updated rows.

```ts
const updated = await db.users.update({
  where: { name: "Alice" },
  data: { age: 26 },
});
```

::: warning
A `where` clause is required. To update all rows, use a condition that matches everything.
:::

## delete

Delete rows matching the where clause. Returns the number of deleted rows.

```ts
const count = await db.users.delete({ where: { active: false } });
```

::: warning
A `where` clause is required.
:::

## count

Count rows matching the conditions.

```ts
const total = await db.users.count();
const activeCount = await db.users.count({ where: { active: true } });
```

## exists

Check if any row matches the where clause.

```ts
const hasAdmin = await db.users.exists({ where: { role: "admin" } });
```

## upsert

Insert if not found, update if found.

```ts
const user = await db.users.upsert({
  where: { email: "alice@example.com" },
  create: { name: "Alice", email: "alice@example.com", age: 25 },
  update: { age: 26 },
});
```

## truncate

Remove all rows from a table.

```ts
await db.users.truncate();
```

## Where Conditions

### Simple equality

```ts
where: { name: "Alice" }
```

### Comparison operators

```ts
where: {
  age: {
    eq: 25,          // Equal
    neq: 25,         // Not equal
    gt: 18,          // Greater than
    gte: 18,         // Greater than or equal
    lt: 65,          // Less than
    lte: 65,         // Less than or equal
  }
}
```

### String matching

```ts
where: { name: { like: "%alice%" } }
where: { name: { notLike: "%test%" } }
```

### IN / NOT IN

```ts
where: { id: { in: [1, 2, 3] } }
where: { status: { notIn: ["banned", "deleted"] } }
```

### NULL checks

```ts
where: { deletedAt: { isNull: true } }
where: { email: { isNull: false } }
```

### BETWEEN

```ts
where: { age: { between: [18, 65] } }
```

### OR / AND

```ts
where: {
  OR: [
    { name: "Alice" },
    { name: "Bob" },
  ]
}

where: {
  AND: [
    { age: { gte: 18 } },
    { active: true },
  ]
}
```

## Query Options

```ts
await db.users.find({
  where: { active: true },          // Filter conditions
  select: ["id", "name"],           // Select specific columns
  orderBy: { name: "asc" },         // Sort order
  take: 10,                         // Limit results
  skip: 20,                         // Offset for pagination
  with: { posts: true },            // Load relations
});
```

## Raw SQL

Execute raw SQL queries when you need full control:

```ts
const rows = await db.raw("SELECT * FROM users WHERE age > ?", [18]);
```

## Transactions

Wrap multiple operations in a transaction:

```ts
await db.transaction(async () => {
  await db.raw("INSERT INTO users (name) VALUES (?)", ["Alice"]);
  await db.raw("INSERT INTO posts (userId, title) VALUES (?, ?)", [1, "Hello"]);
});
```

## Caching

`@hedystia/db` comes with a powerful caching system that can remember the results of `find` and `count` operations, significantly reducing database load.

To enable caching for a table, pass the `cache` configuration in the database connection or specifically on a table definition. Data is invalidated automatically on `insert`, `update`, and `delete`.

```ts
const db = database({
  schemas: { users },
  // Enable global caching
  cache: { enabled: true, ttl: 60000 },
  // ...
});
```
