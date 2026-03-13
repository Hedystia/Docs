# Context

Every route handler in Hedystia receives a context object (`ctx`) as its first argument. The shape of the context is fully inferred from the route schema.

## Context Properties

### `req`

The raw `Request` object from the Fetch API.

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.get('/info', ({ req }) => {
  const ua = req.headers.get('user-agent')
  return { userAgent: ua }
})
```

### `params`

Path parameters, automatically extracted from the URL and validated against the `params` schema.

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.get(
  '/posts/:id',
  ({ params }) => {
    return { id: params.id }
  },
  {
    params: h.object({ id: h.number().coerce() }),
  }
)
```

### `query`

Query string parameters, validated against the `query` schema.

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.get(
  '/search',
  ({ query }) => {
    return { term: query.q }
  },
  {
    query: h.object({ q: h.string() }),
  }
)
```

### `body`

The request body, parsed and validated against the `body` schema. Available on POST, PUT, PATCH, and DELETE routes.

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.post(
  '/users',
  ({ body }) => {
    return { created: body.name }
  },
  {
    body: h.object({ name: h.string() }),
  }
)
```

### `headers`

Request headers, validated against the `headers` schema if provided. Otherwise, raw headers are available.

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.get(
  '/me',
  ({ headers }) => {
    return { token: headers.authorization }
  },
  {
    headers: h.object({ authorization: h.string() }),
  }
)
```

### `rawHeaders`

The unvalidated raw headers object, always available regardless of schema.

```typescript
app.get('/debug', ({ rawHeaders }) => {
  return { headers: rawHeaders }
})
```

### `error`

A helper function to throw a typed HTTP error. Calling `ctx.error()` immediately terminates the request.

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.get(
  '/users/:id',
  ({ params, error }) => {
    if (params.id === 0) {
      error(404, 'User not found')
    }
    return { id: params.id }
  },
  {
    params: h.object({ id: h.number().coerce() }),
  }
)
```

<script setup>
import Response from '../components/nearl/response.vue'
</script>

The thrown error is caught by the framework and returned as a JSON response:

<Response :json="{ message: 'User not found', code: 404 }" />

### `set`

The response context — lets you set status codes, headers, and cookies without constructing a full `Response` object.

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.get('/redirect', ({ set }) => {
  set.status(302)
  set.headers.set('Location', 'https://example.com')
  return null
})
```

#### `set.status(code)`

Sets the HTTP status code.

#### `set.headers.set(key, value)`

Sets a response header.

#### `set.headers.add(key, value)`

Appends to an existing header (comma-separated).

#### `set.headers.delete(key)`

Removes a response header.

#### `set.cookies.set(name, value, options?)`

Sets a cookie.

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.post('/login', ({ set }) => {
  set.cookies.set('session', 'token-value', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
  })
  return { ok: true }
})
```

#### `set.cookies.delete(name)`

Deletes a cookie by setting its expiry to the past.

### `route`

The matched route path string.

### `method`

The HTTP method of the request.

### `publish`

The publish function for WebSocket subscriptions. See [Subscriptions](/framework/subscriptions).

## Returning Responses

Handlers can return:

- **A plain object** → serialized as JSON
- **A string** → sent as `text/plain`
- **A `Response` object** → returned as-is
- **A `Uint8Array`** → sent as raw binary
- **A `Blob`** → streamed to the client
- **A `FormData`** → multipart response

```typescript
// JSON (auto)
app.get('/json', () => ({ hello: 'world' }))

// Plain text
app.get('/text', () => 'Hello!')

// Custom status (simplified)
app.get('/custom', ({ set }) => {
  set.status(404)
  return 'Not Found'
})

// Custom Response (manual)
app.get('/manual', () =>
  new Response('Not Found', { status: 404 })
)
```
