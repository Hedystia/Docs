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

Use the `table` function and column helpers to define your tables:

```ts
import { table, integer, varchar, boolean, datetime } from "@hedystia/db";

export const users = table("users", {
  id: integer().primaryKey().autoIncrement(),
  name: varchar(255).notNull(),
  email: varchar(255).unique(),
  age: integer().default(0),
  active: boolean().default(true),
  createdAt: datetime(),
});
```

> **Note:** The `d.xxx()` prefix style (e.g., `import { d } from "@hedystia/db"; d.integer()`) is still supported for backward compatibility.

### Column Types

| Function | SQL Type | TypeScript Type |
|---|---|---|
| `integer()` | INT / INTEGER | `number` |
| `bigint()` | BIGINT / INTEGER | `number` |
| `varchar(n)` | VARCHAR(n) / TEXT | `string` |
| `char(n)` | CHAR(n) / TEXT | `string` |
| `text()` | TEXT | `string` |
| `boolean()` | TINYINT(1) / INTEGER | `boolean` |
| `json()` | JSON / TEXT | `unknown` |
| `datetime()` | DATETIME / TEXT | `Date` |
| `timestamp()` | TIMESTAMP / TEXT | `Date` |
| `decimal(p, s)` | DECIMAL(p,s) / REAL | `number` |
| `float()` | FLOAT / REAL | `number` |
| `blob()` | BLOB | `Buffer` |

### Column Modifiers

```ts
integer()
  .primaryKey()      // PRIMARY KEY
  .autoIncrement()   // AUTO_INCREMENT / AUTOINCREMENT
  .notNull()         // NOT NULL
  .nullable()        // Allow NULL
  .null()            // Allow NULL (alias for .nullable())
  .unique()          // UNIQUE constraint
  .default(value)    // DEFAULT value
  .references(ref)   // Foreign key reference
  .name(alias)       // Column name alias in the database
  .type<T>()         // Custom type literal for TypeScript inference
```

### Column Name Alias

Use `.name()` to map a code-friendly property name to a different column name in the database. You can also use the standalone `name()` function to start a column definition from a database column name:

```ts
import { table, varchar, integer, name } from "@hedystia/db";

export const guilds = table("guilds", {
  id: integer().primaryKey().autoIncrement(),
  // Using .name() - code uses "guildId", database stores as "guild_id"
  guildId: varchar(255).name("guild_id").notNull(),
  // Using name() starter function
  guildName: name("guild_name").varchar(255).notNull(),
});
```

### Custom Type Literals

Use `.type<T>()` to narrow the TypeScript type for a column, restricting autocomplete and type checking to specific values:

```ts
import { table, integer, varchar } from "@hedystia/db";

export const settings = table("settings", {
  id: integer().primaryKey().autoIncrement(),
  // Limits autocomplete to specific string values
  locale: varchar(25).type<"en_US" | "es_ES" | "fr_FR">().notNull(),
  theme: varchar(25).type<"light" | "dark">().default("light" as any),
});
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
import { table, integer, varchar } from "@hedystia/db";

export const users = table("users", {
  id: integer().primaryKey().autoIncrement(),
  name: varchar(255).notNull(),
});

export const posts = table("posts", {
  id: integer().primaryKey().autoIncrement(),
  userId: integer().references(() => users.id, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    relationName: "author",
  }),
  title: varchar(255).notNull(),
});
```

Load relations with `with`:

```ts
const usersWithPosts = await db.users.find({
  with: { posts: true },
});
```
