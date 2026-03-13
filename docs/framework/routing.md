# Routing

Hedystia provides methods for all standard HTTP verbs. Each route declaration is chainable and contributes to the server's type signature.

## HTTP Methods

### GET

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'

const app = new Hedystia()
  .get('/hello', () => 'Hello, world!')
```

### POST

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.post(
  '/users',
  ({ body }) => ({ id: 1, ...body }),

  {
    body: h.object({ name: h.string() }),
  }
)
```

### PUT

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.put(
  '/users/:id',
  ({ params, body }) => ({ id: params.id, ...body }),

  {
    params: h.object({ id: h.number().coerce() }),
    body: h.object({ name: h.string() }),
  }
)
```

### PATCH

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.patch(
  '/users/:id',
  ({ params, body }) => ({ updated: true, id: params.id }),

  {
    params: h.object({ id: h.number().coerce() }),
    body: h.object({ name: h.string().optional() }),
  }
)
```

### DELETE

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.delete(
  '/users/:id',
  ({ params }) => ({ deleted: params.id }),

  {
    params: h.object({ id: h.number().coerce() }),
  }
)
```

## Path Parameters

Dynamic segments are prefixed with `:`. Hedystia extracts them and makes them available on `ctx.params`.

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.get(
  '/posts/:postId/comments/:commentId',
  ({ params }) => {

    return { post: params.postId, comment: params.commentId }
  },
  {
    params: h.object({
      postId: h.number().coerce(),
      commentId: h.number().coerce(),
    }),
  }
)
```

## Query Parameters

Query params are available on `ctx.query`. Declare a schema to get them typed and validated.

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.get(
  '/search',
  ({ query }) => {

    return { results: [], term: query.q, page: query.page }
  },
  {
    query: h.object({
      q: h.string(),
      page: h.number().coerce().optional(),
    }),
  }
)
```

## Route Groups

Use `.group()` to scope routes under a shared path prefix. This is the primary way to organize your application.

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'

const app = new Hedystia()
  .group('/users', (app) =>
    app
      .get('/', () => [{ id: 1, name: 'Alice' }])
      .get('/:id', ({ params }) => ({ id: params.id }), {

        params: h.object({ id: h.number().coerce() }),
      })
      .post('/', ({ body }) => ({ id: 2, ...body }), {

        body: h.object({ name: h.string() }),
      })
  )
  .listen(3000)
```

This creates:
- `GET /users`
- `GET /users/:id`
- `POST /users`

## Mounting Sub-Applications

Use `.use()` to mount a separate Hedystia instance at a given prefix. This is ideal for splitting routes across files.

```ts twoslash
// @filename: users.ts
// @noErrors
import Hedystia, { h } from 'hedystia'

export const usersApp = new Hedystia()
  .get('/', () => [{ id: 1 }])
  .post('/', ({ body }) => body, {

    body: h.object({ name: h.string() }),
  })

// @filename: index.ts
// @noErrors
// ---cut---
import Hedystia from 'hedystia'
import { usersApp } from './users'

const app = new Hedystia()
  .use('/users', usersApp)
  .listen(3000)
```

## Static Routes

For routes that always return the same response, use `.static()`. These are optimized and bypass the normal handler pipeline.

You can pass any value: objects, strings, JSON, or Response objects:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
// Static object
app.static('/health', { status: 'ok' })

// Static string
app.static('/message', 'Hello from static!')

// Static JSON
app.static('/config', JSON.stringify({ debug: false }))

// With schema for documentation
app.static('/version', { version: '1.0.0' }, {
  response: h.object({ version: h.string() }),
})
```

All static routes are cached in memory for maximum performance. Content-Type is automatically detected based on the value.

## WebSocket Routes

For raw WebSocket connections (not subscriptions), use `.ws()`:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.ws('/chat', {
  message(ws, msg) {

    ws.send('Echo: ' + msg)
  },
  open(ws) {
    console.log('Client connected')
  },
  close(ws, code, reason) {
    console.log('Client disconnected:', code)
  },
})
```

## Starting the Server

Call `.listen(port)` to start the HTTP server after all routes are registered:

```typescript
const app = new Hedystia()
  /* ... routes ... */
  .listen(3000)

// Stop the server later
app.close()
```

## Route Schema Reference

Each route method accepts an optional schema object as its third argument:

| Field | Description |
|---|---|
| `params` | Validates path parameters |
| `query` | Validates query string |
| `body` | Validates request body (POST/PUT/PATCH/DELETE) |
| `headers` | Validates request headers |
| `response` | Declares response type (for documentation and client inference) |
| `error` | Declares error response shape |
| `description` | Used in Swagger docs |
| `tags` | Used to group routes in Swagger |
| `test` | Route testing function (inline tests) |
