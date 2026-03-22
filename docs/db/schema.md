---
title: Schema Definition
description: Learn how to define database schemas and tables in @hedystia/db.
---

# Schema Definition

In `@hedystia/db`, a schema is the source of truth for your database tables. They define the column names, data types, constraints, and relationships.

## Defining Tables

To define a table, use the `table()` function, providing the table name as the first argument, and an object of column definitions as the second argument.

```typescript
import { table, integer, varchar, boolean } from "@hedystia/db";

export const users = table("users_table", {
  id: integer().primaryKey().autoIncrement(),
  name: varchar(255).notNull(),
  email: varchar(255).unique(),
  isActive: boolean().default(true),
});
```

The first argument (`"users_table"`) is the **actual name of the table in your database**.
The object keys (`id`, `name`, `email`, `isActive`) are the **properties you use in your TypeScript code**.
This allows you to decouple your TypeScript interfaces from your snake_case or legacy database table names!

## Registering Schemas: Arrays vs Objects

When defining your database instance, you must supply your tables to the `schemas` property. You can provide them as an **Array** or as an **Object**. 

> [!IMPORTANT]
> We **highly recommend** using the **Object** method (`{ users, posts }`), as it dramatically improves your developer experience via database aliases.

### The Object Method (Recommended)

When you pass schemas as an object literal, the keys of the object become the accessors on your database instance.

```typescript
const db = database({
  schemas: { users }, // Object Literal
  // ...
});

// The table is accessed via the object key: db.users
await db.users.find();
```

This ensures that regardless of what the underlying database table is named (e.g. `table("hedystia_test_users", {...})`), you will always access it via `db.users`.

Additionally, relationships (via `with`) will also use these object keys:
```typescript
// Uses the object key `posts` for eager loaded relationships
await db.users.find({ with: { posts: true } });
```

### The Array Method

If you pass your schemas as an array, the database instance will use the underlying database table name as the accessor, converting snake_case table names to camelCase.

```typescript
const db = database({
  schemas: [users], // Array
  // ...
});

// If the table was defined as table("hedystia_test_users", {...})
// You must access it via the raw underlying name or its camelCase equivalent!
await db.hedystia_test_users.find();
```

## Column Types

`@hedystia/db` supports a wide array of column types:

- `integer()`: Standard integer numbers.
- `bigint()`: Large integers.
- `decimal(precision, scale)`: Exact decimal numbers.
- `float()`: Floating point numbers.
- `varchar(length)`: Variable-length strings. Default length is 255.
- `char(length)`: Fixed-length strings.
- `text()`: Long strings.
- `boolean()`: True/False values.
- `datetime()` & `timestamp()`: Date and time representations.
- `json()`: JSON objects.
- `array()`: JSON arrays.
- `blob()`: Binary data.

## Column Modifiers

You can chain modifiers to your columns to add constraints:

- `.primaryKey()`: Marks the column as the primary key.
- `.autoIncrement()`: Enables auto-incrementing (usually paired with constraints).
- `.notNull()`: Ensures the column cannot be null.
- `.nullable()`: Explicitly marks the column as nullable (default behavior).
- `.unique()`: Ensures all values in the column are unique.
- `.default(value)`: Sets a default value for new rows.
- `.name(alias)`: Explicitly sets the database column name, independently from the TypeScript object key.

```typescript
const products = table("products", {
  id: integer().primaryKey().autoIncrement(),
  // TypeScript key: "productName" -> Database column: "title"
  productName: varchar(255).name("title").notNull(),
});
```
