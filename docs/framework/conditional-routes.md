# Conditional Routes

Hedystia provides the `.if()` method to conditionally register routes at runtime based on feature flags, environment variables, or any other runtime condition.

## Basic Usage

Use `.if()` to wrap a callback that registers routes:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'

const ENABLE_BETA = process.env.ENABLE_BETA === 'true'

const app = new Hedystia()
  .get('/status', () => ({ ok: true }), {
    response: h.object({ ok: h.boolean() }),
  })
  .if((app) => {
    if (ENABLE_BETA) {
      return app.get('/beta', () => ({ beta: true }), {
        response: h.object({ beta: h.boolean() }),
      })
    }
  })
  .listen(3000)
```

## Type Safety

Routes registered inside `.if()` are fully type-safe. The returned `app` instance includes the types of all conditionally-registered routes:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
import { createClient } from '@hedystia/client'

const ENABLE_ADMIN = true

const app = new Hedystia()
  .if((app) => {
    if (ENABLE_ADMIN) {
      return app.get('/admin/users', () => [{ id: 1 }], {
        response: h.object({ id: h.number() }).array(),
      })
    }
  })
  .listen(3000)

const client = createClient<typeof app>('http://localhost:3000')

// Fully typed - knows about /admin/users
const { data } = await client.admin.users.get()
```

## Multiple Conditions

Stack multiple `.if()` calls for different conditions:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'

const ENABLE_CACHE = true
const ENABLE_LOGS = true

const app = new Hedystia()
  .get('/', () => 'Hello')
  .if(() => {
    if (ENABLE_CACHE) {
      // Register cache routes
      return new Hedystia()
        .get('/cache/clear', () => ({ cleared: true }), {
          response: h.object({ cleared: h.boolean() }),
        })
    }
  })
  .if(() => {
    if (ENABLE_LOGS) {
      // Register log routes
      return new Hedystia()
        .get('/logs', () => [], {
          response: h.string().array(),
        })
    }
  })
  .listen(3000)
```

## With Request Handlers and Lifecycle

Conditional routes support the full Hedystia feature set:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'

const ENABLE_AUTH = true

const app = new Hedystia()
  .if((app) => {
    if (ENABLE_AUTH) {
      return app
        .post('/login', ({ body }) => ({ token: 'abc123' }), {
          body: h.object({ email: h.string(), password: h.string() }),
          response: h.object({ token: h.string() }),
        })
        .post('/logout', () => ({ ok: true }), {
          response: h.object({ ok: h.boolean() }),
        })
    }
  })
  .listen(3000)
```

## When to Use `.if()`

Use `.if()` for:

- **Feature flags** — Enable/disable features for A/B testing
- **Environment-specific routes** — Different endpoints for dev/prod
- **Plugin-based routing** — Optional extension routes
- **Tier-based APIs** — Premium vs free tier routes
- **Gradual rollouts** — Deploy code but disable routes until ready

## Best Practices

1. **Keep routes modular** — Group related conditional routes together
2. **Type your conditions** — Use TypeScript enums for feature flags
3. **Document conditions** — Explain why routes are conditional
4. **Test both paths** — Test with condition true and false

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'

enum Features {
  ENABLE_V2_API = 'ENABLE_V2_API',
  ENABLE_WEBHOOKS = 'ENABLE_WEBHOOKS',
}

const isFeatureEnabled = (feature: Features) =>
  process.env[feature] === 'true'

const app = new Hedystia()
  .if((app) => {
    if (isFeatureEnabled(Features.ENABLE_V2_API)) {
      return app.get('/v2/users', () => [], {
        response: h.object({ id: h.number() }).array(),
      })
    }
  })
  .listen(3000)
```
