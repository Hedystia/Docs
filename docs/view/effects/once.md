---
title: once — One-Time Effects
description: Create a one-time reactive effect with once().
---

# once — One-Time Effects

`once` creates a reactive effect that runs exactly once, then automatically stops. It uses the same `(track, run)` signature as `on`.

## `once<T>(track, run)`

```tsx
import { once } from "@hedystia/view";

const dispose = once(
  () => val(signal),    // track dependencies
  (value) => {          // runs once, then stops
    console.log("Initial value:", value);
  },
);
```

### Parameters

| Parameter | Description |
|-----------|-------------|
| `track` | A function whose signal reads are tracked |
| `run` | Callback receiving the tracked value. Executes only once |

### Return Value

Returns a `dispose` function to cancel before it runs (if it hasn't yet).

## Use Cases

- One-time initialization when a signal is first available
- Initial data sync
- First-render side effects

## Example

```tsx
import { sig, val, set, once, mount } from "@hedystia/view";

function App() {
  const userId = sig<number | null>(null);

  once(
    () => val(userId),
    (id) => {
      if (id !== null) {
        console.log("User loaded for the first time:", id);
      }
    },
  );

  return (
    <div>
      <p>User: {() => val(userId) ?? "none"}</p>
      <button onClick={() => set(userId, 42)}>Load User</button>
    </div>
  );
}

mount(App, document.getElementById("root")!);
```
