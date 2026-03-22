---
title: Database Relations
description: Connect and eagerly load related data using foreign keys in @hedystia/db.
---

# Database Relations

Relational databases shine when connecting disparate sets of data. In `@hedystia/db`, relationships between tables are handled gracefully via foreign key definitions.

## Defining Relationships

You define a relationship on a column using the `.references()` modifier. The modifier takes a callback returning the referenced column from another table.

```typescript
import { table, integer, varchar } from "@hedystia/db";

export const users = table("users", {
  id: integer().primaryKey().autoIncrement(),
  name: varchar(255).notNull(),
});

export const posts = table("posts", {
  id: integer().primaryKey().autoIncrement(),
  title: varchar(255).notNull(),
  
  // Create a foreign key linking back to `users.id`
  userId: integer().references(() => users.id, { onDelete: "CASCADE" }),
});
```

Here, the `userId` in `posts` references `users.id`. When you initialize your database with `{ users, posts }`, `@hedystia/db` automatically registers this relation "both ways". 
`posts` belongs to `users`, and `users` has many `posts`.

### Cascade Deletion

You can pass an optional object to `references()` to define the behavior upon deletion or updates:
- `{ onDelete: "CASCADE" }`: If the parent user is deleted, all their posts are heavily deleted.
- `{ onDelete: "SET NULL" }`: If the parent user is deleted, the post's `userId` column is set to null.

## Eager Loading (The `with` Query)

Once relationships are established, eager loading them is as simple as adding the `with` configuration inside any `find()` or `findFirst()` operations.

```typescript
// Eagerly load all the posts associated with Alice
const alice = await db.users.findFirst({
  where: { name: "Alice" },
  with: { posts: true },
});

console.log(alice.posts); // Array of post objects!
```

> [!TIP]
> **Always ensure you are using Object Schemas** `schemas: { users, posts }` so that relations are eagerly loaded with the exact alias key you expect (`"posts"`).

## Nested Relationship Loading

You can even provide query options into the relationship objects to filter, restrict, or sort your eager-loaded relational joins!

```typescript
const latestFeed = await db.users.find({
  with: {
    posts: {
      take: 5,               // Eagerly load only the 5 most recent posts per user
      orderBy: { id: "desc" }
    }
  }
});
```

## Reverse Relationships

When `posts` registers a reference to `users.id`, `@hedystia/db` automatically registers a reverse mapping. This allows you to eagerly load the `users` object from a query on `posts`:

```typescript
const blogPost = await db.posts.findFirst({
  where: { id: 1 },
  // Eager load the user who authored this post
  with: { users: true },
});

console.log(blogPost.users); // Returns the parent user object
```
