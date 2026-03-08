# Typed Requests

One of Hedystia's core strengths is that the client knows exactly what every route expects — body shape, query params, path params — and TypeScript enforces these at compile time.

## How Typing Works

When you call `createClient<typeof app>()`, TypeScript extracts the route definitions from your server instance type. The client proxy is then typed according to those definitions.

This means:

- Passing the wrong body shape → TypeScript error
- Accessing a non-existent route → TypeScript error
- Supplying the wrong param type → TypeScript error

No runtime code generation. No schema sync step. The types update the moment you change your server.

## Body Typing

```ts twoslash
// @filename: server.ts
// @noErrors
import Hedystia, { h } from 'hedystia'
export const app = new Hedystia().post('/products', ({ body }) => body, {
  body: h.object({
    name: h.string(),
    price: h.number(),
    tags: h.string().array().optional(),
  }),
})

// @filename: client.ts
// @noErrors
// ---cut---
import { createClient } from '@hedystia/client'
import type { app } from './server'
const client = createClient<typeof app>('http://localhost:3000')

// Client — TypeScript enforces the exact shape
const { data } = await client.products.post({
  body: {
    name: 'Widget',
    price: 9.99,
    tags: ['sale', 'new'],   // optional, correctly typed
  },
})
```

## Param Typing

Path parameters are inferred from the route path and schema:

```ts twoslash
// @filename: server.ts
// @noErrors
import Hedystia, { h } from 'hedystia'
export const app = new Hedystia()
  .get('/users/:id', ({ params }) => params, {
    params: h.object({ id: h.number().coerce() }),
  })

// @filename: client.ts
// @noErrors
// ---cut---
import { createClient } from '@hedystia/client'
import type { app } from './server'
const client = createClient<typeof app>('http://localhost:3000')

// Client
await client.users.id(42).get()    // ✓ TypeScript accepts number
await client.users.id('abc').get() // ✗ TypeScript error: expected number
```

## Query Typing

```ts twoslash
// @filename: server.ts
// @noErrors
import Hedystia, { h } from 'hedystia'
export const app = new Hedystia()
  .get('/search', ({ query }) => ({ results: [] }), {
    query: h.object({
      q: h.string(),
      limit: h.number().coerce().optional(),
    }),
  })

// @filename: client.ts
// @noErrors
// ---cut---
import { createClient } from '@hedystia/client'
import type { app } from './server'
const client = createClient<typeof app>('http://localhost:3000')

// Client
await client.search.get({
  query: { q: 'hello', limit: 10 },
})
```

## Header Typing

```ts twoslash
// @noErrors
// @filename: server.ts
import Hedystia, { h } from 'hedystia'
export const app = new Hedystia()
  .get('/secure', ({ headers }) => ({ ok: true }), {
    headers: h.object({ authorization: h.string() }),
  })

// @filename: client.ts
// ---cut---
import { createClient } from '@hedystia/client'
import type { app } from './server'
const client = createClient<typeof app>('http://localhost:3000')

// Client — TypeScript expects authorization header
await client.secure.get({
  headers: { authorization: 'Bearer token' },
})
```

## Response Typing

The return type of `data` is inferred from the response schema:

```ts twoslash
// @noErrors
// @filename: server.ts
import Hedystia, { h } from 'hedystia'
export const app = new Hedystia()
  .get('/stats', () => ({ users: 100, requests: 50000 }), {
    response: h.object({
      users: h.number(),
      requests: h.number(),
    }),
  })

// @filename: client.ts
// ---cut---
import { createClient } from '@hedystia/client'
import type { app } from './server'
const client = createClient<typeof app>('http://localhost:3000')

// Client — TypeScript knows the shape of data
const { data } = await client.stats.get()
console.log(data?.users)     // typed: number | null
console.log(data?.requests)  // typed: number | null
```

## Error Typing

```ts twoslash
// @noErrors
// @filename: server.ts
import Hedystia, { h } from 'hedystia'
export const app = new Hedystia()
  .get('/items/:id', ({ params, error }) => {
    if (!params.id) error(404, 'Not found')
    return { id: params.id }
  }, {
    params: h.object({ id: h.number().coerce() }),
    error: h.object({ message: h.string(), code: h.number() }),
  })

// @filename: client.ts
// ---cut---
import { createClient } from '@hedystia/client'
import type { app } from './server'
const client = createClient<typeof app>('http://localhost:3000')

// Client
const { data, error } = await client.items.id(99).get()
if (error) {
  console.log(error.message)  // typed: string
  console.log(error.code)     // typed: number
}
```

## Nested Paths

Routes with multi-segment paths map to a chain of properties:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
import { createClient } from '@hedystia/client'
const app = new Hedystia()
// ---cut---
// Server route: GET /api/v1/users/:id/posts
app.group('/api', (app) =>
  app.group('/v1', (app) =>
    app.group('/users', (app) =>
      app.get('/:id/posts', ({ params }) => [], {
        params: h.object({ id: h.number().coerce() }),
      })
    )
  )
)

// Client
const client = createClient<typeof app>('')
await client.api.v1.users.id(5).posts.get()
```

## Subscription Typing

Subscription callbacks are typed based on the `data` and `error` schemas:

```ts twoslash
// @noErrors
// @filename: server.ts
import Hedystia, { h } from 'hedystia'
export const app = new Hedystia()
  .subscription('/feed', async () => {}, {
    data: h.object({ item: h.string(), timestamp: h.number() }),
    error: h.object({ reason: h.string() }),
  })

// @filename: client.ts
// ---cut---
import { createClient } from '@hedystia/client'
import type { app } from './server'
const client = createClient<typeof app>('http://localhost:3000')

// Client
client.feed.subscribe(({ data, error }) => {
  if (data) {
    console.log(data.item)       // typed: string
    console.log(data.timestamp)  // typed: number
  }
  if (error) {
    console.log(error.reason)    // typed: string
  }
})
```
