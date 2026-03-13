# Route Handlers

A route handler is a function that receives a context object and returns a response. In Hedystia, handlers are always fully typed based on the schema you provide.

## Handler Signature

```typescript
(ctx: Context) => Response | any | Promise<Response | any>
```

The `Context` type is inferred from the route schema.

## Basic Handlers

### Returning plain objects

The most common pattern — Hedystia serializes it as JSON:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.get('/users', () => {
  return [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
})
```

### Returning strings

Returned as `text/plain`:

```ts twoslash
// @noErrors
import Hedystia from 'hedystia'
const app = new Hedystia()
app.get('/ping', () => 'pong')
```

### Returning a full Response

While Hedystia recommends returning native types for most cases, you can still return a full `Response` object when you need manual control over every aspect of the fetch response. It is **completely optional** and usually not required.

For complete control:

```ts twoslash
// @noErrors
import Hedystia from 'hedystia'
import { Bun } from 'bun'
const app = new Hedystia()
app.get('/download', ({ set }) => {
  const file = Bun.file('./data.csv')
  set.headers.set('Content-Type', 'text/csv')
  set.headers.set('Content-Disposition', 'attachment; filename="data.csv"')
  return file
})
```

## Accessing Context

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const createOrder = async (body: any) => ({ id: 1, ...body })
const app = new Hedystia()
// ---cut---
app.post(
  '/orders',
  async ({ body, params, query, headers, set, error }) => {
    // Body is typed from body schema
    const order = await createOrder(body)

    // Set a custom response header
    set.headers.set('x-order-id', String(order.id))

    return order
  },
  {
    body: h.object({
      product: h.string(),
      quantity: h.number().min(1),
    }),
  }
)
```

## Async Handlers

Handlers can be `async` — errors thrown inside will be caught by `onError`:

```ts twoslash
// @noErrors
import Hedystia from 'hedystia'
const fetchFromDatabase = async () => ({})
const app = new Hedystia()
app.get('/data', async ({ error }) => {
  try {
    const result = await fetchFromDatabase()
    return result
  } catch (e) {
    error(500, 'Database error')
  }
})
```

## Handler Patterns

### Conditional Responses

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const db = { findUser: async (id: number) => ({ id, name: 'a' }) }
const app = new Hedystia()
// ---cut---
app.get(
  '/users/:id',
  async ({ params, error }) => {
    const user = await db.findUser(params.id)
    if (!user) error(404, 'User not found')
    return user
  },
  {
    params: h.object({ id: h.number().coerce() }),
    response: h.object({ id: h.number(), name: h.string() }),
    error: h.object({ message: h.string(), code: h.number() }),
  }
)
```

### Setting Status Codes

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const createUser = (body: any) => ({ id: 1, ...body })
const app = new Hedystia()
app.post(
  '/users',
  ({ body, set }) => {
    const user = createUser(body)
    set.status(201)  // Created
    return user
  },
  {
    body: h.object({ name: h.string() }),
  }
)
```

### Setting Cookies

```ts twoslash
// @noErrors
import Hedystia from 'hedystia'
const authenticate = (u: any, p: any) => 'token'
const app = new Hedystia()
app.post('/login', ({ body, set }) => {
  const token = authenticate((body as any).username, (body as any).password)
  set.cookies.set('session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,   // 1 week
  })
  return { ok: true }
})
```

### Redirects

```ts twoslash
// @noErrors
import Hedystia from 'hedystia'
const app = new Hedystia()
app.get('/old-path', ({ set }) => {
  set.status(301)
  set.headers.set('Location', '/new-path')
  return null
})
```

## Handler with Macros

When a macro is enabled, its resolved value is available on the context:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
// ---cut---
const app = new Hedystia()
  .macro({
    auth: () => ({
      resolve: async (ctx) => {
        const token = ctx.req.headers.get('authorization')?.slice(7)
        if (!token) ctx.error(401, 'Missing token')
        return { userId: 1, roles: ['admin'] }
      },
    }),
  })
  .get(
    '/dashboard',
    async (ctx) => {
      const { userId, roles } = await ctx.auth
      return { userId, roles, data: 'private data' }
    },
    {
      auth: true,
      response: h.object({
        userId: h.number(),
        roles: h.string().array(),
        data: h.string(),
      }),
    }
  )
```

## WebSocket Handlers

Define WebSocket behavior alongside HTTP routes:

```typescript
app.ws('/chat', {
  open(ws) {
    console.log('Client connected from', ws.remoteAddress)
    ws.send(JSON.stringify({ type: 'welcome' }))
  },
  message(ws, msg) {
    const parsed = JSON.parse(msg.toString())
    ws.publish('chat', JSON.stringify({ from: 'server', data: parsed }))
  },
  close(ws, code, reason) {
    console.log(`Disconnected: ${code} ${reason}`)
  },
  error(ws, error) {
    console.error('WebSocket error:', error)
  },
})
```
