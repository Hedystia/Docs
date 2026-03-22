---
title: Migrations
---

# Migrations

## Schema Sync

The simplest way to keep your database in sync with your schema is `syncSchemas`:

```ts
const db = database({
  schemas: [users, posts],
  database: "sqlite",
  connection: { filename: "./data.db" },
  syncSchemas: true,  // Auto-creates tables and adds missing columns
});
```

This will:
- Create tables that don't exist
- Add columns that are missing from existing tables
- **Never** drop columns or tables (safe by default)

## Migration Definitions

For more control, define migrations using the `migration` function:

```ts
import { migration } from "@hedystia/db";

export const createUsers = migration("create_users", {
  async up({ schema, sql }) {
    await schema.createTable(users);
  },
  async down({ schema }) {
    await schema.dropTable("users");
  },
});
```

### Migration Context

The migration context provides:

| Method | Description |
|---|---|
| `schema.createTable(table)` | Create a table from a schema definition |
| `schema.dropTable(name)` | Drop a table by name |
| `schema.addColumn(table, name, column)` | Add a column to a table |
| `schema.dropColumn(table, name)` | Drop a column from a table |
| `schema.renameColumn(table, old, new)` | Rename a column |
| `sql(query, params?)` | Execute raw SQL |

### Running Migrations

Pass migrations to the database config — either as an array or a module namespace import:

```ts
import * as schemas from "./schemas";
// or: import { users } from "./schemas";
import * as migrations from "./migrations";
// or: import { createUsers, addAgeColumn } from "./migrations";

const db = database({
  schemas,
  // or: schemas: [users],
  database: "sqlite",
  connection: { filename: "./data.db" },
  runMigrations: true,
  migrations,
  // or: migrations: [createUsers, addAgeColumn],
});
```

Both forms are equivalent — the namespace import (`import * as migrations`) is automatically normalized by extracting all valid `MigrationDefinition` exports.

Migrations run in order and are tracked in the `__hedystia_migrations` table. Each migration only runs once.

### Adding Columns via Migration

```ts
export const addAge = migration("add_age_column", {
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

## CLI

To scaffold your migrations and schemas, please refer to the dedicated [CLI Documentation](/db/cli).
