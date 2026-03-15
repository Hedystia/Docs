---
title: Full Example
---

# Full Example

A complete example showing schema definition, relations, queries, migrations, and caching.

## Project Structure

```
src/
  database/
    schemas/
      users.ts
      posts.ts
      index.ts
    migrations/
      create_tables.ts
    index.ts
  app.ts
```

## Schema Definitions

### `schemas/users.ts`

```ts
import { table, d } from "@hedystia/db";

export const users = table("users", {
  id: d.integer().primaryKey().autoIncrement(),
  name: d.varchar(255).notNull(),
  email: d.varchar(255).unique().notNull(),
  age: d.integer().default(0),
  active: d.boolean().default(true),
  bio: d.text().nullable(),
  createdAt: d.datetime(),
});
```

### `schemas/posts.ts`

```ts
import { table, d } from "@hedystia/db";
import { users } from "./users";

export const posts = table("posts", {
  id: d.integer().primaryKey().autoIncrement(),
  userId: d.integer().notNull().references(() => users.id, {
    onDelete: "CASCADE",
  }),
  title: d.varchar(255).notNull(),
  content: d.text(),
  published: d.boolean().default(false),
  createdAt: d.datetime(),
});
```

### `schemas/index.ts`

```ts
export * from "./users";
export * from "./posts";
```

## Database Configuration

### `index.ts`

```ts
import { database } from "@hedystia/db";
import { users, posts } from "./schemas";

export const db = database({
  schemas: [users, posts],
  database: "sqlite",
  connection: { filename: "./data.db" },
  syncSchemas: true,
  cache: {
    enabled: true,
    ttl: 60000,
    maxTtl: 300000,
  },
});
```

## Usage

### `app.ts`

```ts
import { db } from "./database";

async function main() {
  await db.initialize();

  // Insert users
  const alice = await db.users.insert({
    name: "Alice",
    email: "alice@example.com",
    age: 25,
  });

  const bob = await db.users.insert({
    name: "Bob",
    email: "bob@example.com",
    age: 30,
  });

  // Insert posts
  await db.posts.insert({
    userId: alice.id,
    title: "Hello World",
    content: "My first post!",
    published: true,
  });

  await db.posts.insert({
    userId: alice.id,
    title: "Draft Post",
    content: "Work in progress",
  });

  await db.posts.insert({
    userId: bob.id,
    title: "Bob's Post",
    content: "Hello from Bob!",
    published: true,
  });

  // Find all users
  const allUsers = await db.users.find();
  console.log("All users:", allUsers);

  // Find with conditions
  const adults = await db.users.find({
    where: { age: { gte: 18 } },
    orderBy: { name: "asc" },
  });
  console.log("Adults:", adults);

  // Find first
  const user = await db.users.findFirst({
    where: { email: "alice@example.com" },
  });
  console.log("Found:", user);

  // Count
  const total = await db.users.count();
  console.log("Total users:", total);

  // Check existence
  const hasAlice = await db.users.exists({
    where: { email: "alice@example.com" },
  });
  console.log("Alice exists:", hasAlice);

  // Update
  await db.users.update({
    where: { name: "Alice" },
    data: { age: 26 },
  });

  // Upsert
  await db.users.upsert({
    where: { email: "charlie@example.com" },
    create: { name: "Charlie", email: "charlie@example.com", age: 22 },
    update: { age: 23 },
  });

  // Load with relations
  const usersWithPosts = await db.users.find({
    where: { name: "Alice" },
    with: { posts: true },
  });
  console.log("Alice's posts:", usersWithPosts[0].posts);

  // Complex queries
  const filtered = await db.users.find({
    where: {
      OR: [
        { name: { like: "%ali%" } },
        { age: { between: [28, 35] } },
      ],
    },
    select: ["id", "name", "age"],
    orderBy: { age: "desc" },
    take: 5,
  });
  console.log("Filtered:", filtered);

  // Delete
  const deleted = await db.users.delete({
    where: { name: "Charlie" },
  });
  console.log("Deleted:", deleted, "rows");

  // Raw SQL
  const raw = await db.raw("SELECT COUNT(*) as total FROM users");
  console.log("Raw result:", raw);

  await db.close();
}

main();
```

## Using with MySQL

```ts
const db = database({
  schemas: [users, posts],
  database: "mysql",
  connection: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "myapp",
  },
  syncSchemas: true,
  cache: true,
});
```

## Using with File Storage

```ts
const db = database({
  schemas: [users, posts],
  database: "file",
  connection: { directory: "./data" },
  syncSchemas: true,
  cache: true,
});
```

No driver installation needed. Data is stored as JSON files in the specified directory.
