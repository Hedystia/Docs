---
title: Getting Started
---

# @hedystia/db

A type-safe ORM for TypeScript with support for MySQL, SQLite, and File-based storage. Define your schema once and use it across any database.

## Installation

```bash
bun add @hedystia/db
```

### Database Drivers

Install the driver for your database. The ORM will automatically detect and use the most appropriate library available.

#### SQLite Driver
Supports multiple libraries in the following priority:
1. `better-sqlite3`
2. `sqlite3`
3. `sql.js`
4. `bun:sqlite`

```bash
# You can install any of these

bun add better-sqlite3
bun add sqlite3
bun add sql.js

# Or use bun:sqlite if you are using Bun
```

#### MySQL & MariaDB Driver
Supports both `mysql2` and `mysql` libraries.
- **Naming**: Use `database: "mysql"` or `database: "mariadb"`.
- **MariaDB**: Fully supported through the same drivers.

```bash
bun add mysql2 # Preferred
# or
bun add mysql
```

# File-based (no extra install needed)

## Defining Schemas

Use the `table` function and `d` column helpers to define your tables:

```ts
import { table, d } from "@hedystia/db";

export const users = table("users", {
  id: d.integer().primaryKey().autoIncrement(),
  name: d.varchar(255).notNull(),
  email: d.varchar(255).unique(),
  age: d.integer().default(0),
  active: d.boolean().default(true),
  createdAt: d.datetime(),
});
```

### Column Types

| Function | SQL Type | TypeScript Type |
|---|---|---|
| `d.integer()` | INT / INTEGER | `number` |
| `d.bigint()` | BIGINT / INTEGER | `number` |
| `d.varchar(n)` | VARCHAR(n) / TEXT | `string` |
| `d.char(n)` | CHAR(n) / TEXT | `string` |
| `d.text()` | TEXT | `string` |
| `d.boolean()` | TINYINT(1) / INTEGER | `boolean` |
| `d.json()` | JSON / TEXT | `unknown` |
| `d.datetime()` | DATETIME / TEXT | `Date` |
| `d.timestamp()` | TIMESTAMP / TEXT | `Date` |
| `d.decimal(p, s)` | DECIMAL(p,s) / REAL | `number` |
| `d.float()` | FLOAT / REAL | `number` |
| `d.blob()` | BLOB | `Buffer` |

### Column Modifiers

```ts
d.integer()
  .primaryKey()      // PRIMARY KEY
  .autoIncrement()   // AUTO_INCREMENT / AUTOINCREMENT
  .notNull()         // NOT NULL
  .nullable()        // Allow NULL
  .unique()          // UNIQUE constraint
  .default(value)    // DEFAULT value
  .references(ref)   // Foreign key reference
```

## Database Configuration

```ts
import { database } from "@hedystia/db";
import { users, posts } from "./schemas";

const db = database({
  schemas: [users, posts],
  database: "sqlite",         // "sqlite" | "mysql" | "file"
  connection: {
    filename: "./data.db",    // SQLite
  },
  syncSchemas: true,          // Auto-create/update tables
  runMigrations: false,       // Run pending migrations
  migrations: [],             // Migration definitions
  cache: true,                // Enable smart caching
});

await db.initialize();
```

### Connection Options

**SQLite:**
```ts
connection: { filename: "./data.db" }
```

**MySQL:**
```ts
connection: {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "mydb",
}
```

**File (JSON):**
```ts
connection: { directory: "./data" }
```

### Cache Configuration

```ts
cache: {
  enabled: true,
  ttl: 60000,         // Base TTL in ms (default: 60s)
  maxTtl: 300000,     // Max TTL in ms (default: 5min)
  maxEntries: 10000,  // Max cache entries
}
```

The cache automatically:
- Caches query results and individual entities
- Invalidates on insert, update, and delete
- Extends TTL for frequently accessed data using adaptive scaling

## Relations

Define foreign keys with `.references()`:

```ts
export const users = table("users", {
  id: d.integer().primaryKey().autoIncrement(),
  name: d.varchar(255).notNull(),
});

export const posts = table("posts", {
  id: d.integer().primaryKey().autoIncrement(),
  userId: d.integer().references(() => users.id, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    relationName: "author",
  }),
  title: d.varchar(255).notNull(),
});
```

Load relations with `with`:

```ts
const usersWithPosts = await db.users.find({
  with: { posts: true },
});
```
