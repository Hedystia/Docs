---
title: Start
---

## Installation

```
npm i @hedystia/db
pnpm install @hedystia/db
bun add @hedystia/db
yarn add @hedystia/db
```

## Nodejs Version

- `v18.0.0` or higher

## Links

- [Discord](https://discord.gg/aXvuUpvRQs) [Hedystia Discord]
- [Discord_Bot](https://hedystia.com) [Hedystia Bot]

## Functions

| Function                 | Description                                    |
| ------------------------ | ---------------------------------------------- |
| `dropAll`                | To drop all data from a table                  |
| `readTables`             | To read the tables from the database           |
| `enableMigrations`       | To enable migrations                           |
| `createMigration`        | To create a migration                          |
| `createTable`            | To create a table                              |
| `deleteTable`            | To delete a table                              |
| `createTableIfNotExists` | To create a table if it does not exist         |
| `deleteTableIfExists`    | To delete a table if it exists                 |
| `renameTable`            | To rename a table                              |
| `addColumn`              | To add a column to an already created table    |
| `deleteColumn`           | To remove a column to an already created table |
| `renameColumn`           | To rename a column                             |
| `insert`                 | To insert a data in the table                  |
| `update`                 | To update a data in the table                  |
| `select`                 | To search for information in a table           |
| `delete`                 | To delete a data from the table                |
| `getTableNames`          | To get the names of all tables                 |
| `getColumnNames`         | To get the names of all columns                |
| `getRecordCount`         | To get the number of records in a table        |
