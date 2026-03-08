# Subscriptions

Subscriptions are Hedystia's real-time channel mechanism. They sit alongside regular HTTP routes and share the same schema system, lifecycle hooks, and type safety.

By default, subscriptions use **WebSockets**. You can switch to **Server-Sent Events (SSE)** with a constructor option.

## Defining a Subscription

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'

const app = new Hedystia()
  .subscription(
    '/updates',
    async ({ sendData }) => {
      sendData({ event: 'connected', timestamp: Date.now() })
    },
    {
      data: h.object({
        event: h.string(),
        timestamp: h.number(),
      }),
      error: h.object({
        message: h.string(),
      }),
    }
  )
  .listen(3000)
```

## Subscription Context

Inside the subscription handler, the context includes:

| Property | Description |
|---|---|
| `params` | Path parameters (typed and validated) |
| `query` | Query string (typed and validated) |
| `headers` | Request headers |
| `sendData(data)` | Push data to this client |
| `sendError(error)` | Push an error event to this client |
| `isActive()` | Returns `Promise<boolean>` — whether the client is still connected |
| `subscriptionId` | Unique ID for this subscription |
| `onMessage(handler)` | Register a handler for incoming messages from this client |
| `publish` | Publish to a topic (all subscribers) |

## Dynamic Path Parameters

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
// ---cut---
const app = new Hedystia()
  .subscription(
    '/rooms/:roomId',
    async ({ params, sendData }) => {
      sendData({ joined: params.roomId })
    },
    {
      params: h.object({ roomId: h.string() }),
      data: h.object({ joined: h.string() }),
    }
  )
```

The client matches the path structure:

```ts twoslash
// @noErrors
import { createClient } from '@hedystia/client'
const client = createClient<any>('http://localhost:3000')
client.rooms.roomId('lobby').subscribe(({ data }) => {
  console.log(data?.joined) // 'lobby'
})
```

## Publishing to Subscribers

Use `app.publish(topic, options)` to push data to all clients subscribed to a topic:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
// ---cut---
const app = new Hedystia()
  .subscription('/chat', async () => {}, {
    data: h.object({ message: h.string(), author: h.string() }),
  })
  .post(
    '/chat/send',
    ({ body }) => {
      app.publish('/chat', { data: { message: body.message, author: body.author } })
      return { sent: true }
    },
    {
      body: h.object({ message: h.string(), author: h.string() }),
    }
  )
  .listen(3000)
```

### Tree-Based Publish API

Hedystia also provides a typed tree API via `app.pub`:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// Instead of: app.publish('/chat', { data: { ... } })
// Use:
app.pub.chat({ data: { message: 'hello', author: 'Alice' } })
```

## Receiving Messages from Clients

Use `ctx.onMessage` to register a handler for client→server messages:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()
// ---cut---
app.subscription(
  '/commands',
  async ({ sendData, onMessage }) => {
    onMessage((msg) => {
      console.log('Received command:', msg.action)
      sendData({ received: msg.action })
    })
  },
  {
    message: h.object({ action: h.string() }),
    data: h.object({ received: h.string() }),
  }
)
```

## Subscription Lifecycle Events

```ts twoslash
// @noErrors
import Hedystia from 'hedystia'
const app = new Hedystia()
app
  .onSubscriptionOpen(({ path, subscriptionId }) => {
    console.log(`Opened: ${path} [${subscriptionId}]`)
  })
  .onSubscriptionClose(({ path, subscriptionId, reason }) => {
    console.log(`Closed: ${path} [${subscriptionId}] reason=${reason}`)
  })
  .onSubscriptionMessage(({ path, message, sendData }) => {
    console.log(`Message on ${path}:`, message)
  })
```

## SSE Mode

Switch from WebSocket to Server-Sent Events by setting `sse: true`:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia({ sse: true })
  .subscription('/feed', async ({ sendData }) => {
    sendData({ item: 'first update' })
  }, {
    data: h.object({ item: h.string() }),
  })
  .listen(3000)
```

SSE is useful when clients are browsers that don't support or prefer full WebSocket connections. The client connects via a GET request and receives an event stream.

## Heartbeat and Reconnection

Hedystia automatically sends heartbeat checks every 30 seconds. If no pong is received within 60 seconds, the connection is closed. Reconnecting clients within a 5-second grace period are seamlessly re-attached to their subscription without triggering close handlers.

These values are internal constants — contact the maintainers if you need to adjust them.

## Complete Example

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'

export const app = new Hedystia()
  .subscription(
    '/guild/:id',
    async ({ params }) => {
      return { id: params.id, lang: 'en' }  // initial data sent on connect
    },
    {
      params: h.object({ id: h.string() }),
      data: h.object({
        id: h.string(),
        lang: h.options(h.literal('en'), h.literal('es')),
      }),
      error: h.object({ id: h.string() }),
    }
  )
  .post(
    '/guild/:id/update',
    ({ body, params }) => {
      app.publish(`/guild/${params.id}`, {
        data: { id: params.id, lang: body.lang },
      })
      return { ok: true }
    },
    {
      params: h.object({ id: h.string() }),
      body: h.object({
        lang: h.options(h.literal('en'), h.literal('es')),
      }),
    }
  )
  .listen(3000)
```
