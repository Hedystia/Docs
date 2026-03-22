---
title: SQLite Driver
description: Configure and use the SQLite driver for @hedystia/db.
---

# SQLite Driver

`@hedystia/db` has extensive support for the SQLite database. SQLite is an embedded database that requires no external server, making it excellent for local development, testing, and small-to-medium applications.

## Installation

Depending on your environment, you can install one of the supported SQLite providers:

```bash
bun add better-sqlite3
# or
bun add sqlite3
```

## Configuration

To use the SQLite driver, specify `"sqlite"` as your database type and provide a connection object with a `filename`.

```typescript
import { database } from "@hedystia/db";
import { users } from "./schema";

const db = database({
  schemas: { users },
  database: {
    name: "sqlite",
    provider: "better-sqlite3" // Optional: "better-sqlite3" | "sqlite3" | "bun:sqlite" | "sql.js"
  },
  connection: {
    filename: "./data/local.db", // Path to your sqlite file
  },
  syncSchemas: true,
});

await db.initialize();
```

## Providers

The `sqlite` driver allows you to select which underlying provider package to use:

1. **`better-sqlite3`** (Recommended for Node.js): The fastest and most synchronous SQLite3 driver for Node.js.
2. **`bun:sqlite`** (Recommended for Bun): A built-in, native SQLite library specifically written for Bun.
3. **`sqlite3`**: The asynchronous, callback-based native driver.
4. **`sql.js`**: An in-memory SQLite compiled to WebAssembly (primarily used for browser environments or ephemeral tests).

If you don't specify a provider, `@hedystia/db` will try to detect the best available one in your environment automatically.

## Memory Database

If you want an ephemeral database that lives only in RAM and resets when the application stops, you can pass `:memory:` as the filename:

```typescript
const db = database({
  schemas: { users },
  database: "sqlite",
  connection: {
    filename: ":memory:",
  },
});
```

This is particularly useful for automated testing.
