---
title: Getting Started
description: Introduction to the @hedystia/db package.
---

# Getting Started

`@hedystia/db` is a type-safe, lightweight, and incredibly fast ORM designed for the Hedystia framework. It provides first-class TypeScript support, an intuitive API, and multiple database drivers including SQLite, MySQL, File, and S3.

## Installation

You can install the database package and your driver of choice via `bun`:

```bash
bun add @hedystia/db
```

Then, depending on your database, install the appropriate driver:

**For SQLite:**
```bash
bun add better-sqlite3
# or bun add sqlite3
```

**For MySQL:**
```bash
bun add mysql2
```

## Creating Your First Database

Setting up your database is straightforward. You define your schema tables and then initialize the `database`.

```typescript
import { database, table, integer, varchar } from "@hedystia/db";

// 1. Define your schema
const users = table("users", {
  id: integer().primaryKey().autoIncrement(),
  name: varchar(255).notNull(),
  email: text().unique(),
});

// 2. Initialize the database instance
const db = database({
  // Highly Recommended: Pass schemas as an object literal
  schemas: { users },
  database: "sqlite",
  connection: {
    filename: "./local.db",
  },
  syncSchemas: true, // Auto-create tables if they don't exist
});

// 3. Connect to the database
await db.initialize();

// 4. Use the database!
const newUser = await db.users.insert({
  name: "John Doe",
  email: "john@example.com"
});

console.log(await db.users.find());
```

## Next Steps

Now that you have your database running, you can explore the following topics more deeply:

- **[Schema Definition](/db/schema)**: Learn how to define tables, column types, and the difference between passing arrays and objects to `schemas`.
- **[Relations](/db/relations)**: Connect tables together using foreign keys and references.
- **[Queries](/db/queries)**: Discover how to perform CRUD operations with powerful `where`, `select`, and `orderBy` filters.
- **[Drivers](/db/drivers/sqlite)**: Configure your specific database driver.
