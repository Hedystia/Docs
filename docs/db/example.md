---
title: Example
---

```js
const Database = require("@hedystia/db");

// Create a file named database.ht and enter the password
const database = new Database("./database.ht", "password");

// Delete the table if it exists
database.deleteTableIfExists("users");
// Create a table if it doesn't exist with the specified columns
database.createTable("users", ["id", "name", "email"]);

database.insert("users", {
	id: "1",
	name: "John Doe",
	email: "jdoe@example.com",
});

database.insert("users", {
	id: "2",
	name: "María",
	email: "maria@example.com",
});

const users = database.select("users");

console.log("----------------------------------");

console.log(users);

database.addColumn("users", "phone");

database.addColumn("users", "lang", "en-US");

const newUsersPhone = database.select("users");

console.log("----------------------------------");

console.log(newUsersPhone);

database.deleteColumn("users", "phone");

const oldUsersPhone = database.select("users");

console.log("----------------------------------");

console.log(oldUsersPhone);

const userJohn = database.select("users", { name: "John Doe" });

console.log("----------------------------------");

console.log(userJohn);

database.delete("users", { name: "María" });

const users2 = database.select("users");

console.log("----------------------------------");

console.log(users2);

database.update("users", { id: "1" }, { name: "Jane Doe", lang: "es-ES" });

const users3 = database.select("users");

console.log("----------------------------------");

console.log(users3);

database.renameTable("users", "customers");

const users4 = database.select("customers");

console.log("----------------------------------");

console.log(users4);

database.renameTable("customers", "users");

database.renameColumn("users", "name", "fullName");

const users5 = database.select("users");

console.log("----------------------------------");

console.log(users5);

database.renameColumn("users", "fullName", "name");

database.dropAll();

const users6 = database.select("users");

console.log("----------------------------------");

console.log(users6);

database.deleteTableIfExists("test_migration");
database.deleteTableIfExists("migrations");

database.enableMigrations();

database.createMigration(
	{
		id: "cdaa5095-0c11-4878-8d89-c9be41215e57",
		description: "Description",
		timestamp: Date.now(),
	},
	() => {
		database.createTableIfNotExists("test_migration", ["name"]);
		database.insert("test_migration", { name: "John" });
	},
);

const migrations = database.select("migrations");

console.log("----------------------------------");

console.log(migrations);

const testMigration = database.select("test_migration");

console.log("----------------------------------");

console.log(testMigration);

const tableNames = database.getTableNames();

console.log("----------------------------------");

console.log(tableNames);

const columnNames = database.getColumnNames("users");

console.log("----------------------------------");

console.log(columnNames);

const recordCount = database.getRecordCount("users");

console.log("----------------------------------");

console.log(recordCount);
```
