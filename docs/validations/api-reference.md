# API Reference

The `@hedystia/validations` package provides a robust schema builder `h` to create type-safe schemas for your API.

## Core Schemas

These are the starting points for any validation schema.

| Method | Return Type | Description |
| :--- | :--- | :--- |
| `h.string()` | `StringSchemaType` | Validates that a value is a string. |
| `h.number()` | `NumberSchemaType` | Validates that a value is a number (excluding `NaN`). |
| `h.boolean()` | `BooleanSchemaType` | Validates that a value is a boolean (`true`/`false`). |
| `h.any()` | `AnySchemaType` | Accepts any value without validation. |
| `h.null()` | `NullSchemaType` | Validates that a value is exactly `null`. |
| `h.literal(value)` | `LiteralSchema` | Validates an exact match for a `string`, `number`, or `boolean`. |
| `h.object(definition)` | `ObjectSchemaType` | Validates an object against a key-value schema definition. |
| `h.array(schema)` | `ArraySchema` | Validates an array where every item matches the provided schema. |
| `h.enum(values)` | `UnionSchema` | Validates that a value matches one of the provided literal values in the array. |
| `h.options(...schemas)` | `UnionSchema` | Validates a union of multiple schemas (similar to Zod's `union`). |
| `h.instanceOf(class)` | `InstanceOfSchema`| Validates that a value is an instance of the specified class. |
| `h.date()` | `StringSchemaType` | Alias for `h.string().date()`. |
| `h.uuid()` | `StringSchemaType` | Alias for `h.string().uuid()`. |
| `h.email()` | `StringSchemaType` | Alias for `h.string().email()`. |
| `h.phone()` | `StringSchemaType` | Alias for `h.string().phone()`. |
| `h.domain()` | `StringSchemaType` | Alias for `h.string().domain()`. |

## String Modifiers

Methods available on `h.string()`.

| Method | Description |
| :--- | :--- |
| `.minLength(n)` | Ensures the string has at least `n` characters. |
| `.maxLength(n)` | Ensures the string has at most `n` characters. |
| `.email()` | Validates common email format. |
| `.uuid()` | Validates [UUID v4](https://en.wikipedia.org/wiki/Universally_unique_identifier) format. |
| `.regex(ptrn)` | Matches the string against a custom Regular Expression. |
| `.phone()` | Validates international phone formats. |
| `.domain(http?)`| Validates domain/URL format. If `true` (default), requires `http` or `https`. |
| `.date()` | Validates that the string is a valid parseable ISO date. |
| `.coerce()` | Converts incoming non-string values to string automatically. |

## Number Modifiers

Methods available on `h.number()`.

| Method | Description |
| :--- | :--- |
| `.min(n)` | Ensures the number is greater than or equal to `n`. |
| `.max(n)` | Ensures the number is less than or equal to `n`. |
| `.coerce()` | Converts strings or numeric types to number automatically. |

## General Modifiers

Methods available on most schemas to change their behavior.

| Method | Description |
| :--- | :--- |
| `.optional()` | Allows the value to be `undefined`. Maps to `T | undefined`. |
| `.null()` | Allows the value to be `null`. Maps to `T | null`. |
| `.nullable()` | Alias for `.null()`. Allows the value to be `null`. Maps to `T | null`. |
| `.array()` | Transforms the schema into an array of that type: `T[]`. |
| `.coerce()` | Enables type coercion for primitive types (string, number, boolean). |

## Type Utilities

| Helper | Description |
| :--- | :--- |
| `Infer<typeof T>` | TypeScript utility to extract the output type of a schema. |
