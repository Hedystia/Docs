# Adapter Plugin

The `@hedystia/adapter` package lets you run Hedystia outside of Bun — on Node.js, Cloudflare Workers, or any environment that supports the standard Fetch API.

## Installation

```bash
bun add @hedystia/adapter
```

## Node.js

Hedystia can be used with Node.js built-in `http` module via the `toNodeHandler` adapter:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
import { adapter } from '@hedystia/adapter'
import { createServer } from 'node:http'

const app = new Hedystia()
  .get('/hello', () => ({ message: 'Hello from Node.js!' }), {
    response: h.object({ message: h.string() }),
  })

const handler = adapter(app).toNodeHandler()

createServer(handler).listen(3000)

console.log('Listening on http://localhost:3000')
```

## Cloudflare Workers

For Cloudflare Workers, use the `toCloudflareWorker` adapter:

```ts twoslash
// @noErrors
import Hedystia from 'hedystia'
import { adapter } from '@hedystia/adapter'

const app = new Hedystia()
  .get('/edge', () => ({ runtime: 'cloudflare' }))

export default adapter(app).toCloudflareWorker()
```

## Deno

For Deno, the `toDeno` adapter returns a function compatible with `Deno.serve`:

```ts twoslash
// @noErrors
import Hedystia from 'hedystia'
import { adapter } from '@hedystia/adapter'

const app = new Hedystia()
  .get('/', () => 'Hello Deno')

Deno.serve(adapter(app).toDeno())
```

## Vercel

Vercel (Serverless Functions) can use the `toVercel` adapter:

```ts
import Hedystia from 'hedystia'
import { adapter } from '@hedystia/adapter'

const app = new Hedystia()
  .get('/api/hello', () => ({ message: 'Hello from Vercel' }))

export default adapter(app).toVercel()
```

## Custom Fetch Handler

If you need to handle the `Request` manually in any Fetch API compatible environment, you can still use `app.fetch`:

```ts twoslash
// @noErrors
import Hedystia from 'hedystia'

const app = new Hedystia()
  .get('/ping', () => ({ pong: true }))

// Manually handling a request:
const response = await app.fetch(new Request('http://localhost/ping'))
const json = await response.json()
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
