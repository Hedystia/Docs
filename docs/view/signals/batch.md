---
title: Batch & Untrack
description: Batching signal updates and untracking dependencies.
---

# Batch & Untrack

## `batch(fn)`

Batch multiple signal updates into a single reactive cycle. Without batching, each `set` call immediately notifies dependents. Inside a `batch`, all notifications are deferred until the batch completes.

```tsx
import { sig, val, set, batch } from "@hedystia/view";

const firstName = sig("Alice");
const lastName = sig("Smith");

// Without batch: effects run twice (once per set)
// With batch: effects run once after both updates
batch(() => {
  set(firstName, "Bob");
  set(lastName, "Jones");
});
```

### When to Use

- Updating multiple related signals at once
- Avoiding intermediate renders during complex state transitions
- Performance-critical update paths

## `untrack<T>(fn)`

Execute a function without tracking any signal reads as dependencies. Reads inside `untrack` won't cause the surrounding effect or memo to re-run when those signals change.

```tsx
import { sig, val, untrack } from "@hedystia/view";
import { on } from "@hedystia/view";

const count = sig(0);
const label = sig("Count");

// Only re-runs when `count` changes, NOT when `label` changes
on(
  () => val(count),
  (c) => {
    const currentLabel = untrack(() => val(label));
    console.log(`${currentLabel}: ${c}`);
  },
);
```

## JSX Example

```tsx
import { sig, val, set, batch, mount } from "@hedystia/view";

function ProfileForm() {
  const name = sig("Alice");
  const email = sig("alice@example.com");
  const status = sig("saved");

  const handleReset = () => {
    batch(() => {
      set(name, "");
      set(email, "");
      set(status, "cleared");
    });
  };

  return (
    <div>
      <input
        value={() => val(name)}
        onInput={(e) => set(name, (e.target as HTMLInputElement).value)}
      />
      <input
        value={() => val(email)}
        onInput={(e) => set(email, (e.target as HTMLInputElement).value)}
      />
      <p>Status: {() => val(status)}</p>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

mount(ProfileForm, document.getElementById("root")!);
```
