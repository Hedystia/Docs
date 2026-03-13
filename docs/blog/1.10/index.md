# Hedystia 1.10 - Type Mastery

**Type-Safe Route Testing, Conditional Routes, Real-Time WebSockets, and Framework-Agnostic Type Generation**

Hedystia 1.10 is all about developer experience and type safety. We've introduced powerful new features that make testing routes easier, provide more control over which routes are active, support real-time connections via WebSocket, and enable type-safe APIs with any framework through standalone type generation.

## 🧪 Built-In Route Testing Framework

One of the most requested features was the ability to test routes without leaving your route definitions. Hedystia 1.10 introduces the `test` property for all HTTP methods.

See the complete guide in [Route Testing](/framework/test).

```typescript
const app = new Hedystia()
  .get('/users/:id', ({ params }) => ({ id: params.id, name: 'John' }), {
    params: h.object({ id: h.number().coerce() }),
    response: h.object({ id: h.number(), name: h.string() }),
    test: async ({ createRequest, expect }) => {
      const { response, statusCode } = await createRequest({
        params: { id: 123 },
      })
      expect(response.id).toBe(123)
      expect(statusCode).toBe(200)
    },
  })
```

Run all tests with `await app.runTests()` for a formatted report with timings and assertion counts.

The test context provides:
- `createRequest()` — Make requests to your route with params, query, body, and headers
- `expect()` — Create assertions with rich matchers: `toBe()`, `toEqual()`, `toContain()`, `toBeGreaterThan()`, `toMatch()`, and more
- `assert()`, `assertEqual()`, `assertThrows()` — Additional assertion utilities

## 🎛️ Conditional Route Registration

The new `.if()` method allows you to conditionally register routes at runtime based on feature flags, environment variables, or any other condition.

See the complete guide in [Conditional Routes](/framework/conditional-routes).

```typescript
const ENABLE_BETA = process.env.ENABLE_BETA === 'true'
const ENABLE_ADMIN = process.env.ENABLE_ADMIN === 'true'

const app = new Hedystia()
  .get('/', () => 'Welcome')
  
  .if((app) => {
    if (ENABLE_BETA) {
      return app
        .get('/beta/features', () => ({ features: ['new feature'] }), {
          response: h.object({ features: h.string().array() }),
        })
    }
  })
  
  .if((app) => {
    if (ENABLE_ADMIN) {
      return app
        .get('/admin/users', () => [], {
          response: h.object({ id: h.number() }).array(),
        })
        .post('/admin/users/:id/ban', () => ({ ok: true }), {
          params: h.object({ id: h.number().coerce() }),
          response: h.object({ ok: h.boolean() }),
        })
    }
  })
```

**Type-safe conditional routes**: Routes registered inside `.if()` are still fully type-safe. The client knows about conditionally-registered routes at compile time.

Use cases:
- **Feature flags** — A/B testing and gradual rollouts
- **Environment-specific endpoints** — Dev/staging/production differences
- **Plugin-based routing** — Optional extension routes
- **Tier-based APIs** — Premium vs free tier features

## 🔌 Real-Time WebSocket Support in Client

Hedystia now has first-class WebSocket support. Server-side WebSocket registration works alongside HTTP routes:

```typescript
const app = new Hedystia()
  .ws('/chat', {
    open: (ws) => {
      ws.send('Welcome to chat!')
    },
    message: (ws, msg) => {
      ws.publish('chat', `User sent: ${msg}`)
    },
  })
```

And now the client can connect to WebSockets with full type safety:

```typescript
const client = createClient<typeof app>('http://localhost:3000')

const connection = client.chat.ws((ws) => {
  ws.onConnect(() => {
    console.log('Connected!')
    ws.send('Hello server!')
  })

  ws.onMessage((message) => {
    console.log('Received:', message)
  })

  ws.onError((error) => {
    console.error('Error:', error)
  })

  ws.onDisconnect(() => {
    console.log('Disconnected')
  })
})

// Send messages
connection.ws.send('Hello')

// Disconnect when done
connection.disconnect()
```

The client includes automatic reconnection with exponential backoff, ensuring reliable real-time communication.

## 🏗️ Framework-Agnostic Type Generation

The `@hedystia/types` package provides standalone type generation that works with any framework. This allows you to generate fully-typed Hedystia clients for **any** web framework.

See the complete guide in [Types Plugin](/plugins/types).

```typescript
import { generateTypes } from '@hedystia/types'

const routes = [
  {
    method: 'GET',
    path: '/users/:id',
    params: { id: 'number' },
    response: { id: 'number', name: 'string' },
  },
]

await generateTypes(routes, './api.d.ts')
```

Use your generated types with Express:

```typescript
// express-server.ts
import express from 'express'
import { generateTypes } from '@hedystia/types'

const routes = [
  {
    method: 'GET',
    path: '/users/:id',
    params: { id: 'number' },
    response: { id: 'number', name: 'string' },
  },
]

await generateTypes(routes, './api.d.ts')

const app = express()

app.get('/users/:id', (req, res) => {
  res.json({ id: 1, name: 'John' })
})

app.listen(3000)
```

Then use the typed client:

```typescript
type AppRoutes = [
  { method: 'GET'; path: '/users/:id'; response: { id: number; name: string } }
]

const client = createClient<AppRoutes>('http://localhost:3000')
const { data } = await client.users.id(1).get()

console.log(data?.name) // ✓ Fully typed!
```

This works perfectly with:
- **Express** — Classic Node.js framework
- **Hono** — Modern lightweight framework
- **Fastify** — High-performance alternative
- **Any REST API** — If you can describe it, we can type it

## 📦 Other Notable Changes

### Client Improvements
- WebSocket manager for connection handling
- Improved connection state management
- Better error handling and reconnection logic

### Server Improvements
- `isBunHTMLBundle()` detection for serving Bun HTML imports
- Improved `determineContentType()` for better content negotiation
- Support for returning raw values in static routes (string, JSON, etc.)
- Better handling of async route handlers

### Assertion Methods
The test framework now includes comprehensive assertion methods:
- **Equality**: `toBe()`, `toEqual()`, `toStrictEqual()`
- **Truthiness**: `toBeTruthy()`, `toBeFalsy()`, `toBeNull()`, `toBeDefined()`, `toBeUndefined()`, `toBeNaN()`, `toBeFinite()`, `toBeInfinite()`
- **Numbers**: `toBeGreaterThan()`, `toBeLessThan()`, `toBeGreaterThanOrEqual()`, `toBeLessThanOrEqual()`, `toBeCloseTo()`
- **Containment**: `toContain()`, `toHaveLength()`, `toHaveProperty()`, `toMatch()`
- **Instances**: `toBeInstanceOf()`
- **Functions**: `toThrow()`, `toHaveBeenCalled()`, `toHaveBeenCalledWith()`, `toHaveBeenCalledTimes()`, `toHaveReturnedWith()`
- **Negation**: Chain `.not` to negate any assertion

### Documentation
- New [Route Testing](/framework/test) guide with complete API reference
- [Conditional Routes](/framework/conditional-routes) guide
- [Types Plugin](/plugins/types) documentation
- [WebSocket](/client/overview#websocket-connections) support in client guide

## 🎯 Summary

Hedystia 1.10 focuses on what developers need most:

1. **Easy Testing** — Test routes inline without separate files
2. **Feature Control** — Conditionally register routes for flags and environments
3. **Real-Time Communication** — native WebSocket support with auto-reconnection
4. **Type Portability** — Use Hedystia typing with any framework

We're excited about these additions and how they enable better developer experiences and more maintainable code.

### Upgrade

```bash
bun update hedystia
```

### Breaking Changes

None! This is a fully backward-compatible release.

---

Thank you to everyone in the Hedystia community for your feedback and support. We're excited to see what you build! 🚀
