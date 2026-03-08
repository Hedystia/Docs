# Client Overview

`@hedystia/client` is the companion package for consuming a Hedystia server. It provides a fully typed proxy-based client that mirrors your server's route structure.

## Installation

```bash
bun add @hedystia/client
```

## Creating a Client

```ts twoslash
// @filename: server.ts
// @noErrors
import Hedystia, { h } from 'hedystia'
export const app = new Hedystia().get('/users', () => [{ id: 1 }])

// @filename: client.ts
// @noErrors
// ---cut---
import { createClient } from '@hedystia/client'
import type { app } from './server'   // import just the type

const client = createClient<typeof app>('http://localhost:3000')
```

If the server is in a separate package or binary, use `buildTypes` on the server side and import the generated types:

```ts twoslash
// @noErrors
import { createClient } from '@hedystia/client'
type AppRoutes = [
  { method: "GET"; path: "/ping"; response: { pong: boolean }; status: 200 }
]

const client = createClient<AppRoutes>('http://localhost:3000')
```

## Making HTTP Requests

The client proxy mirrors your route path. Each path segment becomes a property; dynamic params become function calls.

### GET Request

```ts twoslash
// @filename: server.ts
// @noErrors
import Hedystia from 'hedystia'
export const app = new Hedystia().get('/ping', () => 'pong')

// @filename: client.ts
// @noErrors
// ---cut---
import { createClient } from '@hedystia/client'
import type { app } from './server'
const client = createClient<typeof app>('http://localhost:3000')

// GET /ping
const { data, error } = await client.ping.get()
```

### GET with Path Params

```ts twoslash
// @filename: server.ts
// @noErrors
import Hedystia, { h } from 'hedystia'
export const app = new Hedystia().get('/users/:id', ({ params }) => ({ id: params.id }), {
  params: h.object({ id: h.number().coerce() })
})

// @filename: client.ts
// @noErrors
// ---cut---
import { createClient } from '@hedystia/client'
import type { app } from './server'
const client = createClient<typeof app>('http://localhost:3000')

// GET /users/123
const { data, error } = await client.users.id(123).get()
```

### POST Request

```ts twoslash
// @filename: server.ts
// @noErrors
import Hedystia, { h } from 'hedystia'
export const app = new Hedystia().post('/users', ({ body }) => body, {
  body: h.object({ name: h.string(), email: h.string() })
})

// @filename: client.ts
// @noErrors
// ---cut---
import { createClient } from '@hedystia/client'
import type { app } from './server'
const client = createClient<typeof app>('http://localhost:3000')

// POST /users with body
const { data, error } = await client.users.post({
  body: { name: 'Alice', email: 'alice@example.com' },
})
```

### PUT Request

```ts twoslash
// @filename: server.ts
// @noErrors
import Hedystia, { h } from 'hedystia'
export const app = new Hedystia().put('/users/:id', ({ body }) => body, {
  params: h.object({ id: h.number().coerce() }),
  body: h.object({ name: h.string() })
})

// @filename: client.ts
// @noErrors
// ---cut---
import { createClient } from '@hedystia/client'
import type { app } from './server'
const client = createClient<typeof app>('http://localhost:3000')

// PUT /users/123
const { data, error } = await client.users.id(123).put({
  body: { name: 'Bob' },
})
```

### DELETE Request

```ts twoslash
// @filename: server.ts
// @noErrors
import Hedystia, { h } from 'hedystia'
export const app = new Hedystia().delete('/users/:id', () => ({ ok: true }), {
  params: h.object({ id: h.number().coerce() })
})

// @filename: client.ts
// @noErrors
// ---cut---
import { createClient } from '@hedystia/client'
import type { app } from './server'
const client = createClient<typeof app>('http://localhost:3000')

// DELETE /users/123
const { data, error } = await client.users.id(123).delete()
```

## Response Shape

Every HTTP call returns:

```typescript
{
  data: T | null      // typed response data (null on error)
  error: E | null     // typed error (null on success)
  status: number      // HTTP status code
  ok: boolean         // true if status 2xx
}
```

```ts twoslash
// @noErrors
import { createClient } from '@hedystia/client'
const client = createClient<any>('http://localhost:3000')
const { data, error, status, ok } = await client.users.id(1).get()

if (ok) {
  console.log(data?.name)  // fully typed
} else {
  console.log(error?.message)  // typed error
}
```

## Query Parameters

```ts twoslash
// @noErrors
import { createClient } from '@hedystia/client'
const client = createClient<any>('http://localhost:3000')
// GET /search?q=hedystia&page=1
const { data } = await client.search.get({
  query: { q: 'hedystia', page: 1 },
})
```

## Custom Headers

Per-request headers:

```ts twoslash
// @noErrors
import { createClient } from '@hedystia/client'
const client = createClient<any>('http://localhost:3000')
const { data } = await client.me.get({
  headers: { Authorization: 'Bearer my-token' },
})
```

Global headers for all requests:

```ts twoslash
// @noErrors
import { createClient } from '@hedystia/client'
const client = createClient<any>('http://localhost:3000', {
  headers: { 'x-api-key': 'abc' },
})
```

## Client Options

```ts twoslash
// @noErrors
import { createClient } from '@hedystia/client'
const client = createClient<any>('http://localhost:3000', {
  credentials: 'include',   // 'omit' | 'same-origin' | 'include'
  headers: {},              // Default headers for all requests
  sse: false,               // Use SSE instead of WebSocket for subscriptions
  debugLevel: 'none',       // Logging level
})
```

## Subscribing to Real-Time Data

Use `.subscribe()` at the end of a path chain to open a subscription:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
import { createClient } from '@hedystia/client'
const app = new Hedystia().subscription('/guild/:id', async () => ({ ok: true }), {
  params: h.object({ id: h.string() }),
  data: h.object({ ok: h.boolean() })
})
const client = createClient<typeof app>('')

// Subscribe to /guild/123
const unsub = client.guild.id('123').subscribe(({ data, error }) => {
  if (data) console.log('Update:', data)
  if (error) console.log('Error:', error)
})

// Later: stop listening
unsub()
```

The callback receives an object with `data` and `error`, each typed based on the server's subscription schema.

## Sending Messages in Subscriptions

```typescript
const subscription = client.commands.subscribe(({ data }) => {
  console.log('Response:', data)
})

// Optionally send data to the server through the subscription
// (via the subscription's message mechanism)
```

## Response Format

By default, responses are parsed as JSON. You can override this:

```ts twoslash
// @noErrors
import { createClient } from '@hedystia/client'
const client = createClient<any>('')
const { data } = await client.file.get({
  responseFormat: 'text',    // 'json' | 'text' | 'blob' | 'arrayBuffer'
})
```
