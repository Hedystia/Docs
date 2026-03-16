# Hedystia 2.0 - Database ORM

**Type-Safe ORM with Multi-Database Support, Smart Caching, and Migration System**

Hedystia 2.0 introduces `@hedystia/db`, a brand-new database ORM package that brings the same developer experience philosophy to data persistence. Define your schema once in TypeScript and query any database with full type safety.

## 🗄️ @hedystia/db — A New ORM

We built `@hedystia/db` from the ground up to combine the best of Drizzle and TypeORM:

- **Drizzle-like schema definition** — Functional, composable, no decorators
- **TypeORM-like query API** — Intuitive `db.users.find()` syntax
- **One schema, multiple databases** — MySQL, SQLite, and File storage

```bash
bun add @hedystia/db
```

## 📐 Schema Definition

Define your tables with the `table` function and `d` column helpers:

```typescript
import { table, d } from "@hedystia/db";

export const users = table("users", {
  id: d.integer().primaryKey().autoIncrement(),
  name: d.varchar(255).notNull(),
  email: d.varchar(255).unique(),
  age: d.integer().default(0),
  active: d.boolean().default(true),
  bio: d.text().nullable(),
  createdAt: d.datetime(),
});

export const posts = table("posts", {
  id: d.integer().primaryKey().autoIncrement(),
  userId: d.integer().references(() => users.id, {
    onDelete: "CASCADE",
  }),
  title: d.varchar(255).notNull(),
  content: d.text(),
});
```

12 column types are supported: `integer`, `bigint`, `varchar`, `char`, `text`, `boolean`, `json`, `datetime`, `timestamp`, `decimal`, `float`, and `blob`.

## 🔌 Multi-Database Support

The same schema works across all supported databases:

```typescript
import { database } from "@hedystia/db";

// SQLite
const db = database({
  schemas: [users, posts],
  database: "sqlite",
  connection: { filename: "./data.db" },
  syncSchemas: true,
  cache: true,
});

// MySQL
const db = database({
  schemas: [users, posts],
  database: "mysql",
  connection: {
    host: "localhost",
    user: "root",
    password: "password",
    database: "myapp",
  },
  syncSchemas: true,
  cache: true,
});

// File-based (JSON)
const db = database({
  schemas: [users, posts],
  database: "file",
  connection: { directory: "./data" },
  syncSchemas: true,
  cache: true,
});
```

Database drivers (`mysql2`) are peer dependencies — only install what you need.

## 🔍 Intuitive Query API

No more verbose query builders. Access your tables directly from the database instance:

```typescript
await db.initialize();

// Insert
const user = await db.users.insert({
  name: "Alice",
  email: "alice@example.com",
  age: 25,
});

// Find all
const allUsers = await db.users.find();

// Find with conditions
const adults = await db.users.find({
  where: { age: { gte: 18 } },
  orderBy: { name: "asc" },
  take: 10,
});

// Find first
const alice = await db.users.findFirst({
  where: { email: "alice@example.com" },
});

// Update
await db.users.update({
  where: { id: 1 },
  data: { age: 26 },
});

// Delete
await db.users.delete({ where: { active: false } });

// Upsert
await db.users.upsert({
  where: { email: "alice@example.com" },
  create: { name: "Alice", email: "alice@example.com" },
  update: { age: 26 },
});

// Count & Exists
const total = await db.users.count();
const hasAdmin = await db.users.exists({ where: { role: "admin" } });
```

The full query API includes: `find`, `findMany`, `findFirst`, `insert`, `insertMany`, `update`, `delete`, `count`, `exists`, `upsert`, and `truncate`.

### Where Conditions

Rich filtering with `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `notLike`, `in`, `notIn`, `isNull`, `between`, `OR`, and `AND`:

```typescript
const results = await db.users.find({
  where: {
    OR: [
      { name: { like: "%alice%" } },
      { age: { between: [25, 35] } },
    ],
  },
});
```

## 🔗 Relations

Define foreign keys with `.references()` and load related data with `with`:

```typescript
const posts = table("posts", {
  id: d.integer().primaryKey().autoIncrement(),
  userId: d.integer().references(() => users.id, {
    onDelete: "CASCADE",
    relationName: "author",
  }),
  title: d.varchar(255).notNull(),
});

// Load users with their posts
const usersWithPosts = await db.users.find({
  with: { posts: true },
});
```

Relations are loaded with batched `IN` queries for optimal performance across all drivers.

## ⚡ Smart Caching

The built-in cache system automatically caches query results and invalidates them on mutations:

```typescript
const db = database({
  schemas: [users],
  database: "sqlite",
  connection: { filename: "./data.db" },
  cache: {
    enabled: true,
    ttl: 60000,       // Base TTL: 60 seconds
    maxTtl: 300000,   // Max TTL: 5 minutes
    maxEntries: 10000,
  },
});
```

Key features:
- **Entity cache** — Individual rows cached by primary key
- **Query cache** — Full query results cached by stable key
- **Auto-invalidation** — Insert, update, and delete automatically invalidate affected caches
- **Adaptive TTL** — Frequently accessed data stays cached longer using `baseTTL × (1 + log₂(hitCount + 1))`

In our benchmarks, the cache delivers **8x speedup** on repeated `find()` queries and **2.5x** on `count()`.

## 📦 Migration System

### Schema Sync

The fastest way to get started — automatically creates tables and adds missing columns:

```typescript
const db = database({
  schemas: [users, posts],
  database: "sqlite",
  connection: { filename: "./data.db" },
  syncSchemas: true,
});
```

### Programmatic Migrations

For production, define explicit migrations:

```typescript
import { migration } from "@hedystia/db";

const addAgeColumn = migration("add_age_column", {
  async up({ schema }) {
    await schema.addColumn("users", "age", {
      name: "age",
      type: "integer",
      primaryKey: false,
      autoIncrement: false,
      notNull: false,
      unique: false,
      defaultValue: 0,
    });
  },
  async down({ schema }) {
    await schema.dropColumn("users", "age");
  },
});
```

Migrations are tracked in the `__hedystia_migrations` table and never run twice.

### CLI

Generate migration and schema files from the command line:

```bash
# Create migration
bunx @hedystia/db migration create create_users --path src/database/migrations

# Create schema
bunx @hedystia/db schema create users --path src/database/schemas
```

## 🛡️ Error Handling

Typed error classes for precise error handling:

- `DatabaseError` — Base class for all errors
- `SchemaError` — Invalid schema definitions
- `DriverError` — Database driver errors
- `QueryError` — Invalid queries (e.g., update without where)
- `MigrationError` — Migration execution failures
- `SyncError` — Schema sync failures
- `CacheError` — Cache operation failures

## 📋 Summary

Hedystia 2.0 introduces a complete database solution:

1. **Type-Safe Schemas** — Define once, use everywhere with full TypeScript inference
2. **Multi-Database** — MySQL, SQLite, and File storage from a single schema
3. **Intuitive API** — `db.users.find()` instead of verbose query builders
4. **Smart Caching** — Adaptive TTL with automatic invalidation
5. **Migrations** — CLI and programmatic migration support
6. **Relations** — Foreign key references with eager loading

### Upgrade

```bash
bun add @hedystia/db
```

### Full Documentation

Check out the complete documentation at [Database — Getting Started](/db/start).

---

Thank you to everyone in the Hedystia community for your feedback and support. We're excited to see what you build! 🚀
