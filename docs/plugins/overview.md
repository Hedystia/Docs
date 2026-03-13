# Plugins Overview

Hedystia's plugin system is simple: a plugin is a Hedystia sub-app (or an object that provides one). Plugins add routes, lifecycle hooks, macros, and middleware to your application.

## Official Plugins

| Plugin | Package | Description |
|---|---|---|
| Swagger | `@hedystia/swagger` | OpenAPI docs and Swagger UI |
| Adapter | `@hedystia/adapter` | Run Hedystia on Node.js and other runtimes |
| Types | `@hedystia/types` | Generate type definitions for any framework |

## Quick Reference

- **[Types Plugin](/plugins/types)** — Generate fully-typed clients for Express, Hono, Fastify, or any framework
- **[Swagger Plugin](/plugins/swagger)** — OpenAPI documentation and Swagger UI
- **[Adapter Plugin](/plugins/adapter)** — Run Hedystia on Node.js and other runtimes

## Mounting Plugins

```ts twoslash
// @noErrors
import Hedystia from 'hedystia'
import { swagger } from '@hedystia/swagger'

const app = new Hedystia()
  /* ... routes ... */

// Mount Swagger at /docs
const swaggerPlugin = swagger({ title: 'My API', version: '1.0.0' })
app.use('/docs', swaggerPlugin.plugin(app))

app.listen(3000)
```

## Swagger Plugin

See the full guide at [Swagger Plugin](/plugins/swagger).

## Adapter Plugin

See the full guide at [Adapter](/plugins/adapter).

## Writing a Plugin

Any Hedystia instance is a valid plugin:

```ts twoslash
// @noErrors
import Hedystia from 'hedystia'
const rateLimit = new Hedystia()
  .onBeforeHandle(async (ctx, next) => {
    const ip = ctx.req.headers.get('x-forwarded-for') ?? 'unknown'
    return next()
  })

// rate-limit.ts
export const plugin = rateLimit
```

Mount it:

```ts twoslash
// @noErrors
import Hedystia from 'hedystia'
const rateLimit = new Hedystia()
const app = new Hedystia()
  .use('/', rateLimit)
  .get('/hello', () => 'Hello!')
  .listen(3000)
```
