# Getting Started

This guide walks you through installing Hedystia and creating your first typed server.

## Prerequisites

Hedystia requires [Bun](https://bun.sh) as its runtime. If you haven't installed it yet:

```bash
curl -fsSL https://bun.sh/install | bash
```

## Installation

Create a new project and install the required packages:

```bash
mkdir my-api && cd my-api
bun init -y
bun add hedystia
```

To use the typed client in a separate project or package:

```bash
bun add @hedystia/client
```

## Your First Server

Create an `index.ts` file:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'

const app = new Hedystia()
  .get('/', () => ({ message: 'Hello from Hedystia!' }), {
    response: h.object({ message: h.string() }),
  })
  .listen(3000)

console.log('Server running at http://localhost:3000')
```

Run the server:

```bash
bun run index.ts
```

<script setup>
import Response from '../components/nearl/response.vue'
</script>

Visit `http://localhost:3000` — you should see:

<Response :json="{ message: 'Hello from Hedystia!' }" />

## Adding a Route with Params

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
      response: h.object({
        id: h.number(),
        name: h.string(),
      }),
    }
  )
  .listen(3000)
```

The `h.number().coerce()` call tells Hedystia to coerce the URL param (which arrives as a string) into a number before passing it to the handler.

## Adding a POST Route

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'

const app = new Hedystia()
  .post(
    '/users',
    ({ body }) => {
      return { id: 1, name: body.name, email: body.email }
    },
    {
      body: h.object({
        name: h.string(),
        email: h.string().email(),
      }),
      response: h.object({
        id: h.number(),
        name: h.string(),
        email: h.string(),
      }),
    }
  )
  .listen(3000)
```

## Using the Client

Once your server is running, create a client with full type inference:

```ts twoslash
// @filename: server.ts
// @noErrors
import Hedystia, { h } from 'hedystia'
export const app = new Hedystia().post('/users', ({ body }) => ({ name: body.name }), {
  body: h.object({ name: h.string(), email: h.string() }),
  response: h.object({ name: h.string() })
})

// @filename: client.ts
// @noErrors
// ---cut---
import { createClient } from '@hedystia/client'
import type { app } from './server'   // import just the type

const client = createClient<typeof app>('http://localhost:3000')

// POST /users
const { data, error } = await client.users.post({
  body: { name: 'Alice', email: 'alice@example.com' },
})

console.log(data?.name)  // 'Alice'
```

The client proxy mirrors your route structure. Nested paths map to chained properties, dynamic params become function calls.

## Next Steps

- [**Routing**](/framework/routing) — full guide to HTTP routes, params, and groups
- [**Context**](/framework/context) — everything available inside a handler
- [**Validation**](/framework/validation) — the `h` schema reference
- [**Error Handling**](/framework/error-handling) — typed errors and custom responses
