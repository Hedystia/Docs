# Validation

Hedystia ships with a built-in schema builder called `h`. It implements the [Standard Schema](https://standardschema.dev/) specification, meaning it integrates cleanly with any Standard Schema-compatible library.

## Importing `h`

```ts twoslash
// @noErrors
import { h } from 'hedystia'
// or from the standalone package:
// import { h } from '@hedystia/validations'
```

## Primitive Types

### `h.string()`

Validates a string value.

```ts twoslash
// @noErrors
import { h } from 'hedystia'
h.string()                     // any string
h.string().minLength(3)        // at least 3 characters
h.string().maxLength(100)      // at most 100 characters
h.string().email()             // valid email format
h.string().uuid()              // valid UUID format
h.string().domain()            // valid URL with http(s)
h.string().phone()             // valid phone number
h.string().date()              // parseable date string
h.string().regex(/^[a-z]+$/)   // matches regex
```

### `h.number()`

Validates a number value.

```ts twoslash
// @noErrors
import { h } from 'hedystia'
h.number()               // any number
h.number().min(0)        // must be >= 0
h.number().max(100)      // must be <= 100
h.number().coerce()      // coerce string → number (useful for URL params/query)
```

### `h.boolean()`

Validates a boolean value.

```ts twoslash
// @noErrors
import { h } from 'hedystia'
h.boolean()              // true or false
h.boolean().coerce()     // coerce strings: "true"/"1" → true, "false"/"0" → false
```

### `h.any()`

Accepts any value without validation.

```ts twoslash
// @noErrors
import { h } from 'hedystia'
h.any()
```

## Composite Types

### `h.object()`

Validates a plain object with typed fields.

```ts twoslash
// @noErrors
import { h } from 'hedystia'
h.object({
  id: h.number(),
  name: h.string(),
  email: h.string().email(),
})
```

Nested objects are supported:

```ts twoslash
// @noErrors
import { h } from 'hedystia'
h.object({
  user: h.object({
    id: h.number(),
    profile: h.object({
      bio: h.string(),
    }),
  }),
})
```

### `h.literal()`

Validates an exact value.

```ts twoslash
// @noErrors
import { h } from 'hedystia'
h.literal('admin')
h.literal(42)
h.literal(true)
```

### `h.options()`

Validates a union of values. Pass multiple schemas; the first match wins.

```ts twoslash
// @noErrors
import { h } from 'hedystia'
h.options(h.literal('en'), h.literal('es'), h.literal('fr'))
// equivalent to: 'en' | 'es' | 'fr'
```

### Array Schemas

Call `.array()` on any schema to validate an array of that type.

```ts twoslash
// @noErrors
import { h } from 'hedystia'
h.string().array()                   // string[]
h.number().array()                   // number[]
h.object({ id: h.number() }).array() // Array<{ id: number }>
```

### `.optional()`

Makes any field optional (accepts `undefined`).

```ts twoslash
// @noErrors
import { h } from 'hedystia'
h.object({
  name: h.string(),
  bio: h.string().optional(),      // string | undefined
  age: h.number().optional(),
})
```

### `.null()`

Extends a schema to also accept `null`.

```ts twoslash
// @noErrors
import { h } from 'hedystia'
h.string().null()    // string | null
h.number().null()    // number | null
h.string().enum(['red', 'green', 'blue'] as const)
h.number().enum([1, 2, 3] as const)
```

## Using Schemas in Routes

All schemas are plugged into the route's third argument:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.post(
  '/products',
  ({ body }) => {
    return { id: 1, ...body }
  },
  {
    body: h.object({
      name: h.string().minLength(1).maxLength(100),
      price: h.number().min(0),
      category: h.options(
        h.literal('clothing'),
        h.literal('electronics'),
        h.literal('food')
      ),
      tags: h.string().array().optional(),
    }),
    response: h.object({
      id: h.number(),
      name: h.string(),
      price: h.number(),
    }),
    error: h.object({
      message: h.string(),
      code: h.number(),
    }),
  }
)
```

## Coercion

URL parameters and query strings are always strings. Use `.coerce()` to convert them automatically:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.get(
  '/items/:id',
  ({ params, query }) => {
    // params.id is number (coerced)
    // query.page is number (coerced)
    return { id: params.id, page: query.page }
  },
  {
    params: h.object({ id: h.number().coerce() }),
    query: h.object({
      page: h.number().coerce().optional(),
    }),
  }
)
```

## Standard Schema Compatibility

Since `h` implements the Standard Schema specification, you can use third-party libraries like Zod or Valibot in any schema position:

```ts twoslash
// @noErrors
import Hedystia from 'hedystia'
const app = new Hedystia()
// ---cut---
import { z } from 'zod'

app.post(
  '/login',
  ({ body }) => ({ token: 'abc' }),
  {
    body: z.object({
      username: z.string().min(3),
      password: z.string().min(8),
    }),
  }
)
```
