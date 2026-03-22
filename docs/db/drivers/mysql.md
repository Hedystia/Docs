---
title: MySQL Driver
description: Configure and use the MySQL driver for @hedystia/db.
---

# MySQL Driver

`@hedystia/db` supports full integration with MySQL and MariaDB databases. This driver is ideal for robust, scalable web applications requiring a traditional relational database server.

## Installation

To connect to a MySQL or MariaDB database, you can install either the modern `mysql2` package or the legacy `mysql` package.

```bash
bun add mysql2  # Recommended
# or
bun add mysql
```

## Configuration

To use the MySQL driver, specify `"mysql"` as the database name and provide a connection object containing the host, port, user, password, and database.

```typescript
import { database } from "@hedystia/db";
import { users } from "./schema";

const db = database({
  schemas: { users },
  database: "mysql", 
  connection: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "secretpassword",
    database: "my_app_db",
  },
  syncSchemas: true,
});

await db.initialize();
```

## Providers

You can configure the MySQL driver to use either the older `mysql` package or the modern `mysql2` package. `@hedystia/db` handles this automatically, but defaults to `mysql2` if both are present.

```typescript
const db = database({
  schemas: { users },
  database: {
    name: "mysql",
    provider: "mysql2" // or "mysql"
  },
  connection: {
    // ...
  }
});
```

## Connection Pooling

By default, `@hedystia/db` implements connection pooling for the MySQL driver, which ensures performance scales under concurrent loads.
When your application closes, be sure to call `await db.close()` to cleanly terminate the connection pool and allow the event loop to exit.
