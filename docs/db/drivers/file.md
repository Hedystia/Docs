---
title: File Driver
description: Configure and use the experimental File driver for @hedystia/db.
---

# File Driver (Experimental)

`@hedystia/db` offers a unique, zero-dependency `File` driver that stores database records directly in `.json` or `.jsonl` files on your local filesystem. This driver shines for simple hobby projects, static site generators, and environments holding very little data where SQLite is undesirable.

## Warning

> [!WARNING]
> The File driver is **experimental** and is not optimized for large datasets, high concurrency, or distributed deployments. It reads and writes JSON objects sequentially to the file system. Use with caution.

## Configuration

To use the File driver, set the database type to `"file"` and provide a directory path where the database will create a file for each respective table schema.

```typescript
import { database, table, varchar } from "@hedystia/db";

const config = table("config", {
  key: varchar(255).primaryKey(),
  value: varchar(255),
});

const db = database({
  schemas: { config },
  database: "file",
  connection: {
    directory: "./data/file_db", // Path to directory
  },
  syncSchemas: true,
});

await db.initialize();
```

## Behavior

When the database initializes, `@hedystia/db` ensures that `./data/file_db` exists. For each table defined in `schemas`, it creates a corresponding `[table].json` file to store the rows.
- Insertions append to the file or rewrite it.
- Eager loading relations behaves identically to SQL drivers, performing programmatic javascript array joins to assemble the nested query structure.
