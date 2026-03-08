# Adapter Plugin

The `@hedystia/adapter` package lets you run Hedystia outside of Bun — on Node.js, Cloudflare Workers, or any environment that supports the standard Fetch API.

## Installation

```bash
bun add @hedystia/adapter
```

## Node.js

Hedystia's `fetch` method is compatible with node's built-in `http` module via the `@hedystia/adapter`:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
import { serve } from '@hedystia/adapter/node'

const app = new Hedystia()
  .get('/hello', () => ({ message: 'Hello from Node.js!' }), {
    response: h.object({ message: h.string() }),
  })

serve(app, { port: 3000 })

console.log('Listening on http://localhost:3000')
```

## Using the `fetch` Handler Directly

For custom integrations, use the `.fetch()` method:

```ts twoslash
// @noErrors
import Hedystia from 'hedystia'

const app = new Hedystia()
  .get('/ping', () => ({ pong: true }))

// In any Fetch API-compatible environment:
const response = await app.fetch(new Request('http://localhost/ping'))
const json = await response.json()
console.log(json) // { pong: true }
```

## Edge Runtimes

Because Hedystia uses standard `Request` and `Response` objects, it is compatible with edge runtimes like Cloudflare Workers:

```ts twoslash
// @noErrors
import Hedystia from 'hedystia'

const app = new Hedystia()
  .get('/edge', () => ({ runtime: 'cloudflare' }))

export default {
  fetch: (req: Request) => app.fetch(req),
}
```

## Testing Without a Running Server

Use `app.fetch()` to write unit tests without starting a network listener:

```ts twoslash
// @noErrors
import { expect, test } from 'bun:test'
import Hedystia, { h } from 'hedystia'

const app = new Hedystia()
  .get('/greet', () => ({ hello: 'world' }), {
    response: h.object({ hello: h.string() }),
  })

test('GET /greet returns expected data', async () => {
  const res = await app.fetch(new Request('http://localhost/greet'))
  const body = await res.json()

  expect(res.status).toBe(200)
  expect(body.hello).toBe('world')
})
```

This pattern is useful for verifying route behavior, response shapes, and error handling — all without binding to a port.
