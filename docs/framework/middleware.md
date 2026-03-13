# Middleware

Hedystia has a lifecycle-based middleware system. Rather than a single `next()` function chain, it offers dedicated hooks for each stage of request processing.

## Lifecycle Hooks

A request passes through the following stages:

```
onRequest → onParse → onTransform → onBeforeHandle → Handler → onMapResponse → onAfterHandle → Response
                                                                                              ↓
                                                                                       onAfterResponse
```

Errors at any point fire `onError`.

## `onRequest`

Runs before any parsing or validation. Receives the raw `Request` and must return a (possibly modified) `Request`.

```typescript
app.onRequest((req) => {
  // Add a custom header before processing
  const modified = new Request(req.url, {
    ...req,
    headers: new Headers({
      ...Object.fromEntries(req.headers.entries()),
      'x-request-id': crypto.randomUUID(),
    }),
  })
  return modified
})
```

## `onParse`

Provides a custom body parser. If the handler returns a value, that value becomes `ctx.body`. Return `undefined` to fall through to the built-in parser.

```typescript
app.onParse(async (req) => {
  const contentType = req.headers.get('content-type') ?? ''
  if (contentType.includes('text/csv')) {
    const text = await req.text()
    return text.split('\n').map((line) => line.split(','))
  }
  // Return undefined to use default parsing
})
```

## `onTransform`

Runs after parsing, before the handler. Used to augment the context object with derived data. Return an object to merge into `ctx`.

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.onTransform(async (ctx) => {

  const ip = ctx.req.headers.get('x-forwarded-for') ?? 'unknown'
  return { clientIp: ip }
})
```

## `onBeforeHandle`

Middleware that runs before the main handler. Receives `ctx` and a `next` function. Call `next()` to proceed; return a `Response` to short-circuit.

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.onBeforeHandle(async (ctx, next) => {

  const auth = ctx.req.headers.get('authorization')
  if (!auth || !auth.startsWith('Bearer ')) {
    ctx.set.status(401)
    return { message: 'Unauthorized' }
  }
  return next()
})
```

Multiple `onBeforeHandle` handlers are chained in registration order.

## `onAfterHandle`

Runs after the handler returns a Response. Can inspect or modify the response.

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.onAfterHandle((response, ctx) => {

  // Add a custom header to every response
  const newHeaders = new Headers(response.headers)
  newHeaders.set('x-powered-by', 'Hedystia')
  // Return the original response with new headers
  return new Response(response.body, {
    status: response.status,
    headers: newHeaders,
  })
})

:::tip
While you can manually construct a `new Response()`, it's usually easier to modify the context or return plain values.
:::
```

## `onMapResponse`

Transforms the raw handler return value into a `Response`. Runs before `onAfterHandle`.

```typescript
app.onMapResponse((result, ctx) => {
  if (typeof result === 'string') {
    ctx.set.headers.set('Content-Type', 'text/plain; charset=utf-8')
    return result
  }
})
```

Return a `Response` to intercept; otherwise the default serialization applies.

## `onAfterResponse`

Fires asynchronously after the response is sent. Use this for logging, analytics, or cleanup. Does not affect the response.

```typescript
app.onAfterResponse((response, ctx) => {
  console.log(
    `[${ctx.method}] ${ctx.route} → ${response.status} (${Date.now()}ms)`
  )
})
```

## `onError`

Catches all errors thrown during request processing. Return a `Response` to handle the error; otherwise the default error JSON is returned.

```typescript
app.onError((error, ctx) => {
  console.error('Request error:', error)

  const status = error.statusCode ?? 500
  const message = error.message ?? 'Internal Server Error'

  ctx.set.status(status)
  return { error: message }
})
```

## Macros

Macros are reusable context augmenters that attach to specific routes via schema flags.

### Defining a Macro

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
// ---cut---
const app = new Hedystia()
  .macro({
    auth: () => ({
      resolve: async (ctx) => {

        const token = ctx.req.headers.get('authorization')?.substring(7)
        if (!token) ctx.error(401, 'Unauthorized')

        // The returned object is merged into ctx for this route
        return { userId: 1, token }
      },
    }),
  })
```

### Using a Macro on a Route

Enable a macro by passing its name as `true` in the route schema:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia().macro({ auth: () => ({ resolve: async (ctx) => ({ userId: 1, token: '' }) }) })
// ---cut---
  app.get(
    '/me',
    async (ctx) => {
      const { userId, token } = await ctx.auth

      return { userId, token }
    },
    {
      auth: true,   // ← enables the macro
      response: h.object({
        userId: h.number(),
        token: h.string(),
      }),
    }
  )
```

### Macros in Groups

Apply macros to all routes in a group via the third argument to `.group()`:

```typescript
app.group(
  '/admin',
  (app) => app.get('/stats', () => ({ requests: 1000 })),
  { auth: true }   // ← applies to all routes in this group
)
```

## Subscription Lifecycle

Subscriptions (WebSocket/SSE) have their own lifecycle hooks:

### `onSubscriptionOpen`

Fires when a client subscribes to a topic.

```typescript
app.onSubscriptionOpen(({ path, subscriptionId }) => {
  console.log(`Subscription opened: ${path} (${subscriptionId})`)
})
```

### `onSubscriptionClose`

Fires when a subscription ends.

```typescript
app.onSubscriptionClose(({ path, subscriptionId, reason }) => {
  console.log(`Subscription closed: ${path} — reason: ${reason}`)
})
```

### `onSubscriptionMessage`

Fires when a message arrives from a subscribed client.

```typescript
app.onSubscriptionMessage(({ path, message, sendData }) => {
  console.log('Message from', path, ':', message)
})
```
