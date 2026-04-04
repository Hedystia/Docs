---
title: Signals
description: Core reactive signals API — sig, val, set, update, peek.
---

# Signals

Signals are the foundation of reactivity in `@hedystia/view`. They hold mutable state with automatic dependency tracking. Components run once — use `() => val(signal)` in JSX to create reactive bindings.

## `sig<T>(value, options?)`

Create a reactive signal with an initial value.

```tsx
import { sig } from "@hedystia/view";

const count = sig(0);
const name = sig("Alice");
const items = sig<string[]>([]);
```

## `val<T>(signal)`

Read the current value of a signal. Inside a reactive context (effects, memos, JSX function children), this registers a dependency so the context re-runs when the signal changes.

```tsx
import { sig, val } from "@hedystia/view";

const count = sig(0);

function Display() {
  return <span>{() => val(count)}</span>;
}
```

## `set<T>(signal, value)`

Write a new value to a signal, notifying all dependents.

```tsx
import { sig, val, set } from "@hedystia/view";

const count = sig(0);

function Counter() {
  return (
    <button onClick={() => set(count, val(count) + 1)}>
      Clicked {() => val(count)} times
    </button>
  );
}
```

## `update<T>(signal, fn)`

Update a signal using a function of the previous value.

```tsx
import { sig, val, update } from "@hedystia/view";

const count = sig(0);

function Counter() {
  return (
    <button onClick={() => update(count, (prev) => prev + 1)}>
      Count: {() => val(count)}
    </button>
  );
}
```

## `peek<T>(signal)`

Read a signal's value **without** registering a dependency. Useful when you need the current value inside an effect but don't want that read to trigger re-runs.

```tsx
import { sig, val, peek } from "@hedystia/view";
import { on } from "@hedystia/view";

const count = sig(0);
const multiplier = sig(2);

// Only re-runs when `count` changes, not when `multiplier` changes
on(
  () => val(count),
  (c) => console.log(c * peek(multiplier)),
);
```

## Signal Options

Pass an options object to customize equality checking:

```tsx
import { sig } from "@hedystia/view";

// Always notify, even if value is the same
const force = sig(0, { equals: false });

// Custom comparator
const obj = sig({ x: 0, y: 0 }, {
  equals: (prev, next) => prev.x === next.x && prev.y === next.y,
});
```

By default, signals use `===` reference equality. Setting `equals: false` means every `set` call triggers dependents. A custom function receives `(prev, next)` and should return `true` if the values are considered equal (skip update).
