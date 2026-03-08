# Plugins

Plugins in Hedystia are ordinary Hedystia instances — or objects that expose a `plugin` method — that you mount into your main app.

## What Is a Plugin?

A plugin is simply a Hedystia sub-application. Because `.use()` accepts any Hedystia instance, you can package routes, hooks, and macros together and share them across projects.

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'

export const authPlugin = new Hedystia()
  .macro({
    auth: () => ({
      resolve: async (ctx) => {
        const token = ctx.req.headers.get('authorization')?.replace('Bearer ', '')
        if (!token) ctx.error(401, 'Unauthorized')
        return { userId: 1, token }
      },
    }),
  })
  .get(
    '/me',
    async (ctx) => {
      const { userId } = await ctx.auth
      return { userId }
    },
    { auth: true }
  )
```

## Mounting a Plugin

Use `.use(prefix, plugin)` to mount:

```ts twoslash
// @filename: auth-plugin.ts
// @noErrors
import Hedystia from 'hedystia'
export const authPlugin = new Hedystia()

// @filename: index.ts
// @noErrors
// ---cut---
import Hedystia from 'hedystia'
import { authPlugin } from './auth-plugin'

const app = new Hedystia()
  .use('/auth', authPlugin)
  .listen(3000)
```

This makes the `/me` route available at `/auth/me`.

## The Swagger Plugin

The `@hedystia/swagger` package generates an OpenAPI specification and serves an interactive Swagger UI from your route definitions.

### Installation

```bash
bun add @hedystia/swagger
```

### Usage

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
import { swagger } from '@hedystia/swagger'
// ---cut---
const swaggerPlugin = swagger({
  title: 'My API',
  description: 'Documentation for My API',
  version: '1.0.0',
  tags: [
    { name: 'Users', description: 'User management' },
  ],
})

const app = new Hedystia()
  .get('/hello', () => 'Hello!', {
    response: h.string(),
    description: 'Greet the caller',
    tags: ['Users'],
  })
  .post(
    '/users',
    ({ body }) => ({ id: 1, ...body }),
    {
      body: h.object({ name: h.string() }),
      response: h.object({ id: h.number(), name: h.string() }),
      tags: ['Users'],
    }
  )

// Mount Swagger UI at /swagger
app.use('/swagger', swaggerPlugin.plugin(app))
app.listen(3000)
```

Visit `http://localhost:3000/swagger` to see the Swagger UI.

### Swagger Options

| Option | Type | Description |
|---|---|---|
| `title` | `string` | API title in Swagger UI |
| `description` | `string` | API description |
| `version` | `string` | API version |
| `tags` | `Array<{ name, description }>` | Tag groups for organizing routes |

### Adding Route Metadata

```typescript
app.put(
  '/users/:id',
  ({ params, body }) => ({ id: params.id, ...body }),
  {
    params: h.object({ id: h.number().coerce() }),
    body: h.object({ name: h.string() }),
    response: h.object({ id: h.number(), name: h.string() }),
    description: 'Update an existing user by ID',
    tags: ['Users'],
  }
)
```

## Writing Your Own Plugin

Any object or class that returns a Hedystia instance is a valid plugin. Here's a minimal logger plugin example:

```typescript
// logger.ts
import Hedystia from 'hedystia'

export const logger = new Hedystia()
  .onRequest((req) => {
    console.log(`→ ${req.method} ${req.url}`)
    return req
  })
  .onAfterResponse((response, ctx) => {
    console.log(`← ${response.status} ${ctx?.route}`)
  })
```

Mount it in your main app:

```typescript
import Hedystia from 'hedystia'
import { logger } from './logger'

const app = new Hedystia()
  .use('/', logger)
  .get('/hello', () => 'Hello!')
  .listen(3000)
```
