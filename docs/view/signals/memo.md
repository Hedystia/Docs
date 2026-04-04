---
title: Memo
description: Computed/derived signals with memo.
---

# Memo

`memo` creates a derived reactive signal that recomputes lazily when its dependencies change. It only recalculates when read after a dependency has been updated.

## `memo<T>(fn)`

```tsx
import { sig, val, set, memo } from "@hedystia/view";

const count = sig(2);
const doubled = memo(() => val(count) * 2);
const quadrupled = memo(() => val(doubled) * 2);
```

## Lazy Evaluation

Memos are **lazy** — they don't recompute immediately when a dependency changes. Instead, they mark themselves as stale and only recompute the next time their value is read (via `val`).

```tsx
import { sig, val, set, memo } from "@hedystia/view";

const count = sig(0);
const expensive = memo(() => {
  console.log("recomputing"); // only runs when `val(expensive)` is called
  return val(count) * 100;
});

set(count, 5); // does NOT trigger recompute yet
val(expensive); // NOW recomputes → 500
```

## Chaining Memos

Memos can depend on other memos, forming a chain of derived values:

```tsx
import { sig, val, set, memo } from "@hedystia/view";

const price = sig(100);
const taxRate = sig(0.2);

const tax = memo(() => val(price) * val(taxRate));
const total = memo(() => val(price) + val(tax));
```

## JSX Example

Components run once — memos integrate naturally with reactive JSX:

```tsx
import { sig, val, set, memo, mount } from "@hedystia/view";

function Calculator() {
  const count = sig(1);
  const doubled = memo(() => val(count) * 2);
  const quadrupled = memo(() => val(doubled) * 2);

  return (
    <div>
      <button onClick={() => set(count, val(count) + 1)}>
        Increment
      </button>
      <p>Count: {() => val(count)}</p>
      <p>Doubled: {() => val(doubled)}</p>
      <p>Quadrupled: {() => val(quadrupled)}</p>
    </div>
  );
}

mount(Calculator, document.getElementById("root")!);
```

## Reading a Memo

`memo` returns a `Computed<T>` which is read with `val()`, just like a signal:

```tsx
const derived = memo(() => val(count) + 1);
console.log(val(derived)); // reads the derived value
```
