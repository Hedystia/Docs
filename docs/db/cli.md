---
title: Database CLI
description: How to use the @hedystia/db command-line interface.
---

# Database CLI

`@hedystia/db` ships with a command line tool to help you scaffold schema definitions and write programmatic migrations.

To use the CLI, invoke it via `bunx`:

```bash
bunx @hedystia/db [command]
```

## Commands

### `schema create`
**Syntax:** `bunx @hedystia/db schema create <name> [--path <path>]`
**Shorthand:** `bunx @hedystia/db schema <name>`
**Description:** Generates a new file with boilerplate for a new table schema. By default, it places the file in `src/database/schemas`.

### `migration create`
**Syntax:** `bunx @hedystia/db migration create <name> [--path <path>] [--no-id]`
**Shorthand:** `bunx @hedystia/db migration <name>`
**Description:** Generates an empty migration definition file. By default, files are placed in `src/database/migrations`.

### `migrate up`
**Syntax:** `bunx @hedystia/db migrate up [options]`
**Description:** Applies pending migrations against the database. 

**Options:**
- `--migrations <path>`: Path to your generated migrations.
- `--schemas <path>`: Path to your schema definitions.
- `--database <type>`: The `sqlite`, `mysql`, etc connection type.
- `--connection <config>`: A JSON connection payload or path.

### `migrate down`
**Syntax:** `bunx @hedystia/db migrate down [options]`
**Description:** Rolls back applied migrations.

**Options:**
- `--steps <n>`: Number of migrations to rollback (default: 1).
- Takes the same connection flags as `migrate up`.
