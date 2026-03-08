---
title: Hedystia - End-to-End Type Safe Framework
layout: page
sidebar: false
head:
    - - meta
      - property: 'og:title'
        content: Hedystia - End-to-End Type Safe Framework

    - - meta
      - name: 'description'
        content: Hedystia is a modern TypeScript backend framework with end-to-end type safety, real-time subscriptions, and an intuitive developer experience. Build type-safe APIs, WebSocket subscriptions, and SSE streams with full TypeScript inference from server to client.

    - - meta
      - property: 'og:description'
        content: Hedystia is a modern TypeScript backend framework with end-to-end type safety, real-time subscriptions, and an intuitive developer experience.
---

<script setup>
    import Landing from './components/landing/landing.vue'
    import { blogs } from './data/blogs'
</script>

<Landing :latestBlog="blogs[0]">
  <template #hero-code>

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'

// Hover over `params` to see inferred types!
const app = new Hedystia()
  .get(
    '/users/:id',
    ({ params }) => {
      return {
        id: params.id,
        name: 'Jane Doe'
      }
    },
    {
      params: h.object({
        id: h.number().coerce()
      })
    }
  )
  .listen(3000)
```

  </template>

  <template #server-code>

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'

export const app = new Hedystia()
  .post(
    '/users',
    ({ body }) => {
      return {
        id: 1,
        name: body.name
      }
    },
    {
      body: h.object({
        name: h.string()
      }),
      response: h.object({
        id: h.number(),
        name: h.string()
      })
    }
  )
  .listen(3000)

export type App = typeof app
```

  </template>

  <template #client-code>

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'

const app = new Hedystia().post('/users', ({ body }) => ({ id: 1, name: body.name }), {
  body: h.object({ name: h.string() }),
  response: h.object({ id: h.number(), name: h.string() })
}).listen(3000)

export type App = typeof app

// ---cut---
import { createClient } from '@hedystia/client'
import type { App } from './backend'

const client = createClient<App>('http://localhost:3000')

const { data, error } = await client.users.post({
  body: { name: 'Alice' }
})
```

  </template>
</Landing>
