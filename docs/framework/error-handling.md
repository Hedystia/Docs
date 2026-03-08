# Error Handling

Hedystia provides multiple mechanisms to handle errors — both expected errors (validation failures, business logic errors) and unexpected ones (runtime exceptions).

## Throwing Errors from a Handler

Every handler context includes an `error` helper that throws a typed HTTP error:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'

const app = new Hedystia()
  .get('/error', ({ error }) => {
    return error(418, "I'm a teapot")
  })
```

<script setup>
import Response from '../components/nearl/response.vue'
</script>

Calling `error()` throws internally. The framework catches it and serializes it as:

<Response :json="{ message: 'User not found', code: 404 }" />

## Typed Error Responses

Declare the shape of your error response with the `error` schema field. This drives client-side type inference.

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.get(
  '/users/:id',
  ({ params, error }) => {
    if (params.id === 0) error(404, 'User not found')
    return { id: params.id }
  },
  {
    params: h.object({ id: h.number().coerce() }),
    response: h.object({ id: h.number() }),
    error: h.object({
      message: h.string(),
      code: h.number(),
    }),
  }
)
```

On the client side:

```ts twoslash
// @filename: server.ts
// @noErrors
import Hedystia, { h } from 'hedystia'
export const app = new Hedystia().get('/users/:id', () => ({ id: 1}), { error: h.object({ message: h.string(), code: h.number() })})
// @filename: client.ts
// ---cut---
import { createClient } from '@hedystia/client'
import type { app } from './server'

const client = createClient<typeof app>('http://localhost:3000')

const { data, error } = await client.users.id(0).get()
if (error) {
  console.log(error.message)  // typed as string
  console.log(error.code)     // typed as number
}
```

## Static Error Constructor

You can also use the static `Hedystia.error()` method from outside a handler context:

```typescript
import Hedystia from 'hedystia'

function requireAuth(token?: string) {
  if (!token) {
    throw { statusCode: 401, message: 'Missing authorization token' }
  }
}
```

## Global Error Handler

Use `onError` to catch all uncaught errors and return a custom response:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
// ---cut---
const app = new Hedystia()
  .onError((error, ctx) => {
    if (error.statusCode === 401) {
      return { error: 'You shall not pass' }
    }

    const status = error.statusCode ?? 500
    const message = error.message ?? 'Something went wrong'

    return Response.json({ error: message, status }, { status })
  })
  .get('/crash', () => {
    throw new Error('Unexpected failure')
  })
  .listen(3000)
```

## Validation Errors

When request data fails schema validation, Hedystia automatically responds with a `400` error before invoking your handler:

| Scenario | Status |
|---|---|
| Invalid path params | 400 |
| Invalid query params | 400 |
| Invalid request body | 400 |
| Invalid headers | 400 |

You do not need to handle validation errors manually.

## Subscription Errors

In subscriptions, use `sendError` to push a typed error to the client without closing the connection:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.subscription(
  '/notifications/:userId',
  async ({ params, sendData, sendError }) => {
    if (params.userId === 'banned') {
      sendError({ reason: 'Account suspended', severity: 'high' })
      return
    }
    sendData({ message: 'Welcome back!', timestamp: Date.now() })
  },
  {
    params: h.object({ userId: h.string() }),
    data: h.object({
      message: h.string(),
      timestamp: h.number(),
    }),
    error: h.object({
      reason: h.string(),
      severity: h.options(h.literal('low'), h.literal('high')),
    }),
  }
)
```

## CORS and Preflight

CORS errors are handled automatically when CORS is enabled:

```typescript
const app = new Hedystia({ cors: true })
```

Or with fine-grained control:

```typescript
const app = new Hedystia({
  cors: {
    origin: ['https://app.example.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
})
```

Preflight (`OPTIONS`) requests are handled automatically — no extra routes needed.
