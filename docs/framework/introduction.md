# Introduction

Hedystia is a modern TypeScript backend framework designed around end-to-end type safety, real-time communication, and a fluid developer experience.

Unlike frameworks that bolt on type safety as an afterthought, Hedystia makes it a first-class concern. Your route schemas, handler contexts, and client types are all derived from a single source of truth — the route definition itself.

## What is Hedystia?

Hedystia provides:

- **A typed server** — define routes with inline schema validation
- **A typed client** — consume your API with full TypeScript inference
- **Real-time subscriptions** — WebSocket and SSE-based pub/sub built in
- **A validation library** — `h` schemas for input/output typing
- **Swagger/OpenAPI** — auto-generated API documentation via plugin

Hedystia runs on [Bun](https://bun.sh), a fast JavaScript runtime, and is designed to be productive for solo developers as well as teams building production-grade services.

## Philosophy

### One Source of Truth

Every route in Hedystia carries its own schema. The params, body, query, headers, and response types are all declared together, in the same place. The same schema that validates incoming data also drives TypeScript inference in your handler.

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'

const app = new Hedystia()
  .get(
    '/users/:id',
    ({ params }) => {
      return { id: params.id, name: 'Jane Doe' }
    },
    {
      params: h.object({ id: h.number().coerce() }),
      response: h.object({ id: h.number(), name: h.string() }),
    }
  )
  .listen(3000)
```

### End-to-End Type Safety

Hedystia derives client types directly from the server instance. You export `typeof app` and feed it to `createClient` — no code generation step, no schema sync, no drift.

```ts twoslash
// @filename: server.ts
// @noErrors
import Hedystia, { h } from 'hedystia'

export const app = new Hedystia()
  .get('/ping', () => ({ pong: true }), {
    response: h.object({ pong: h.boolean() }),
  })
  .listen(3000)

// @filename: client.ts
// @noErrors
// ---cut---
import { createClient } from '@hedystia/client'
import type { app } from './server'

const client = createClient<typeof app>('http://localhost:3000')
const { data } = await client.ping.get()
```

### Real-Time From Day One

WebSocket subscriptions and SSE streams are not separate APIs bolted on — they live alongside HTTP routes and share the same schema, validation, and lifecycle system.

## Package Overview

Hedystia is organized into focused packages:

| Package | Description |
|---|---|
| `hedystia` | Core server framework |
| `@hedystia/client` | Type-safe HTTP and subscription client |
| `@hedystia/validations` | The `h` schema builder |
| `@hedystia/swagger` | Swagger/OpenAPI documentation plugin |
| `@hedystia/adapter` | Run Hedystia outside Bun (Node.js, etc.) |

## What's Next?

- [**Getting Started**](/framework/getting-started) — install and run your first server
- [**Routing**](/framework/routing) — define HTTP routes with params, body, and response types
- [**Validation**](/validations/start) — use the `h` schema builder
- [**Middleware**](/framework/middleware) — lifecycle hooks and request transforms
