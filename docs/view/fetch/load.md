---
title: load — Data Fetching
description: Reactive data fetching with load().
---

# load — Data Fetching

`load` creates a reactive resource that automatically fetches data and refetches when its key changes.

## `load<T, K>(key, fetcher)`

```tsx
import { load } from "@hedystia/view";

const resource = load(
  () => val(userId),                      // key: accessor, refetches when it changes
  async (id) => fetch(`/api/users/${id}`).then((r) => r.json()), // fetcher
);
```

### Parameters

| Parameter | Description |
|-----------|-------------|
| `key` | Accessor function `() => K`. When the returned value changes, the fetcher re-runs |
| `fetcher` | `async (key: K) => T` — the fetch function |

### Resource Properties

| Property | Type | Description |
|----------|------|-------------|
| `data` | `Signal<T \| undefined>` | The fetched data |
| `loading` | `Signal<boolean>` | Whether a fetch is in progress |
| `error` | `Signal<Error \| undefined>` | The error, if any |
| `state` | `Signal<string>` | `"pending"`, `"ready"`, `"refreshing"`, or `"errored"` |
| `ready` | `boolean` | Getter — `true` when state is `"ready"` |

### State Transitions

```
"pending" → "ready"      (successful first fetch)
"pending" → "errored"    (failed first fetch)
"ready"   → "refreshing" (key changed, refetching)
"refreshing" → "ready"   (refetch succeeded)
"refreshing" → "errored" (refetch failed)
```

## JSX Example

```tsx
import { sig, val, set, load, mount } from "@hedystia/view";

interface User {
  id: number;
  name: string;
  email: string;
}

function UserCard() {
  const userId = sig(1);

  const user = load(
    () => val(userId),
    async (id): Promise<User> => {
      const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
      return res.json();
    },
  );

  return (
    <div>
      <div>
        <button onClick={() => set(userId, val(userId) - 1)}>Previous</button>
        <button onClick={() => set(userId, val(userId) + 1)}>Next</button>
      </div>

      {() => {
        if (val(user.loading)) return <p>Loading...</p>;
        if (val(user.error)) return <p>Error: {val(user.error)!.message}</p>;

        const data = val(user.data);
        if (!data) return <p>No user</p>;

        return (
          <div>
            <h2>{data.name}</h2>
            <p>{data.email}</p>
          </div>
        );
      }}
    </div>
  );
}

mount(UserCard, document.getElementById("root")!);
```

When `userId` changes, the resource automatically aborts the previous fetch and starts a new one.
