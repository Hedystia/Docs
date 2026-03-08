# Best Practices

This guide collects patterns and conventions that work well when building production APIs with Hedystia.

## Project Structure

For small projects, a single file works fine. As your app grows, consider organizing by feature:

```
src/
  index.ts          ← entry point, starts the server
  routes/
    users.ts        ← user routes
    auth.ts         ← auth routes
    products.ts     ← product routes
  plugins/
    auth.ts         ← auth macro / middleware
    logger.ts       ← request logger
  schemas/
    user.ts         ← reusable h.object() schemas
```

## Define Schemas Once

Define reusable schemas in a shared module and import them where needed:

```typescript
// schemas/user.ts
import { h } from 'hedystia'

export const UserSchema = h.object({
  id: h.number(),
  name: h.string(),
  email: h.string().email(),
})

export const CreateUserSchema = h.object({
  name: h.string().minLength(1),
  email: h.string().email(),
})
```

```typescript
// routes/users.ts
import { UserSchema, CreateUserSchema } from '../schemas/user'

app.post('/users', ({ body }) => body, {
  body: CreateUserSchema,
  response: UserSchema,
})
```

## Keep Handlers Small

Move business logic out of route handlers into service functions:

```typescript
// services/users.ts
export async function createUser(data: { name: string; email: string }) {
  // database logic here
  return { id: 1, ...data }
}

// routes/users.ts
import { createUser } from '../services/users'

app.post('/users', ({ body }) => createUser(body), {
  body: h.object({ name: h.string(), email: h.string().email() }),
})
```

## Use Groups for Organization

Group related routes together and apply shared macros through the group:

```typescript
const app = new Hedystia()
  .macro({
    auth: () => ({ resolve: async (ctx) => { /* ... */ return { userId: 1 } } }),
  })
  .group(
    '/admin',
    (app) =>
      app
        .get('/users', () => [{ id: 1 }])
        .delete('/users/:id', ({ params }) => ({ deleted: params.id }), {
          params: h.object({ id: h.number().coerce() }),
        }),
    { auth: true }   // ← applies to all admin routes
  )
```

## Export `typeof app` for the Client

When splitting server and client code, export the type of your app:

```typescript
// server.ts
export const app = new Hedystia()
  .get(/* ... */)
  .listen(3000)

export type App = typeof app
```

```typescript
// client.ts
import { createClient } from '@hedystia/client'
import type { App } from './server'

const client = createClient<App>('http://localhost:3000')
```

Alternatively, use `buildTypes()` to generate a `.d.ts` file for clients in other runtimes:

```typescript
await app.buildTypes('./server.d.ts')
```

Then in the client:

```typescript
import type { AppRoutes } from './server.d'
const client = createClient<AppRoutes>('http://localhost:3000')
```

## Use CORS Thoughtfully

Don't enable `cors: true` in production without specifying origins:

```typescript
// Development
const app = new Hedystia({ cors: true })

// Production
const app = new Hedystia({
  cors: {
    origin: ['https://app.example.com'],
    credentials: true,
  },
})
```

## Error Handling Strategy

Define a global error handler early and handle edge cases explicitly:

```typescript
const app = new Hedystia()
  .onError((error, ctx) => {
    // Log unexpected errors
    if (!error.statusCode || error.statusCode >= 500) {
      console.error('[UNHANDLED]', error)
    }

    return Response.json(
      { error: error.message ?? 'Internal Server Error' },
      { status: error.statusCode ?? 500 }
    )
  })
```

## Type-Safe Subscriptions

Define both `data` and `error` schemas on every subscription:

```typescript
app.subscription(
  '/updates/:resource',
  async ({ sendData }) => {
    sendData({ event: 'connected', timestamp: Date.now() })
  },
  {
    params: h.object({ resource: h.string() }),
    data: h.object({
      event: h.string(),
      timestamp: h.number(),
    }),
    error: h.object({
      message: h.string(),
      code: h.number(),
    }),
  }
)
```

This ensures both the client and subscription lifecycle handlers have full type information.

## Avoid Returning `undefined`

Returning `undefined` from a handler results in an empty `200 OK` response, which can confuse clients. Prefer explicit returns:

```typescript
// ✗ Avoid
app.delete('/items/:id', ({ params }) => {
  deleteItem(params.id)
  // implicit undefined return
})

// ✓ Better
app.delete('/items/:id', ({ params }) => {
  deleteItem(params.id)
  return { deleted: params.id }
})
```
