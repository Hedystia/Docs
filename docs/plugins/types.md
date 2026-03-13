# Types Plugin

The `@hedystia/types` package provides standalone type generation for use with any web framework. This allows you to get Hedystia's powerful type inference with Express, Hono, Fastify, or any other framework.

## Installation

```bash
bun add @hedystia/types
```

## Why Use Hedystia Types?

- **Type-safe clients** — Generate a fully-typed client that mirrors your API
- **Framework-agnostic** — Works with any framework
- **IDE autocomplete** — Full IntelliSense support
- **Type inference** — Automatic inference from your route definitions
- **No runtime overhead** — Pure TypeScript definitions

## Basic Usage

Define your routes as plain objects and generate types:

```typescript
import { generateTypes } from '@hedystia/types'

const routes = [
  {
    method: 'GET',
    path: '/users/:id',
    params: { id: 'number' },
    response: { id: 'number', name: 'string', email: 'string' },
  },
  {
    method: 'POST',
    path: '/users',
    body: { name: 'string', email: 'string' },
    response: { id: 'number', name: 'string', email: 'string' },
  },
]

// Generate TypeScript definition file
await generateTypes(routes, './api.d.ts')
```

## With Express

Set up Express routes and generate types:

```typescript
// server.ts
import express from 'express'
import { generateTypes } from '@hedystia/types'

const routes = [
  {
    method: 'GET',
    path: '/api/posts/:id',
    params: { id: 'number' },
    response: { id: 'number', title: 'string', content: 'string' },
  },
]

await generateTypes(routes, './api.d.ts')

const app = express()

app.get('/api/posts/:id', (req, res) => {
  res.json({ id: 1, title: 'Hello', content: 'World' })
})

app.listen(3000)
```

Then use with the Hedystia client:

```typescript
// client.ts
import { createClient } from '@hedystia/client'

type AppRoutes = [
  { method: 'GET'; path: '/api/posts/:id'; response: { id: number; title: string; content: string } }
]

const client = createClient<AppRoutes>('http://localhost:3000/api')
const { data } = await client.posts.id(1).get()

console.log(data?.title) // Fully typed!
```

## With Hono

Use with Hono's lightweight runtime:

```typescript
// server.ts
import { Hono } from 'hono'
import { generateTypes } from '@hedystia/types'

const routes = [
  {
    method: 'GET',
    path: '/users',
    response: [{ id: 'number'; name: 'string' }],
  },
  {
    method: 'POST',
    path: '/users',
    body: { name: 'string'; email: 'string' },
    response: { id: 'number'; name: 'string'; email: 'string' },
  },
]

await generateTypes(routes, './types.d.ts')

const app = new Hono()

app.get('/users', (c) => {
  return c.json([{ id: 1, name: 'Alice' }])
})

app.post('/users', async (c) => {
  const body = await c.req.json()
  return c.json({ id: 2, ...body })
})

export default app
```

## Route Definition Format

```typescript
interface RouteDefinition {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  params?: Record<string, string | number | boolean>
  query?: Record<string, string | number | boolean>
  body?: any
  headers?: Record<string, string>
  response: any
  data?: any
  error?: any
}
```

## Type Inference

The generated types support full type inference:

```typescript
type AppRoutes = [
  {
    method: 'GET'
    path: '/users/:id'
    params: { id: number }
    query: { include?: 'posts' | 'comments' }
    response: { id: number; name: string; email: string }
  },
]

const client = createClient<AppRoutes>('http://localhost:3000')

// Full type safety
const { data } = await client.users.id(1).get({
  query: { include: 'posts' }, // Autocomplete + validation
})

if (data) {
  console.log(data.id)    // ✓ Known
  console.log(data.name)  // ✓ Known
  // console.log(data.unknown) // ✗ TypeScript error
}
```

## Advanced Patterns

### Dynamic Route Generation

Generate types from your framework's routes:

```typescript
import { generateTypes } from '@hedystia/types'
import { createServer } from './server'

const app = createServer()

// Extract routes from your framework and generate types
const routes = app.routes.map(route => ({
  method: route.method,
  path: route.path,
  response: route.responseType,
}))

await generateTypes(routes, './api.d.ts')
```

### Build-Time Generation

Integrate type generation into your build process:

```json
{
  "scripts": {
    "build:types": "bun build-types.ts",
    "build": "bun build:types && bun build server.ts",
    "dev": "bun build:types && bun --watch server.ts"
  }
}
```

```typescript
// build-types.ts
import { generateTypes } from '@hedystia/types'
import routes from './routes'

await generateTypes(routes, './api.d.ts')
console.log('✓ Types generated')
```

## Benefits Over REST Documentation

- **Compile-time safety** — Catch typos and breaking changes at build time
- **Automatic updates** — Types always match your server
- **No context switching** — IDE autocomplete instead of API docs
- **Refactoring** — Rename endpoints and find all usages
- **Team productivity** — Frontend devs get instant feedback
