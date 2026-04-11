---
title: watch — Concise Reactive Effects
description: Create a reactive effect with a concise API using watch().
---

# watch — Concise Reactive Effects

`watch` is a shorthand for `on` that accepts a signal directly instead of a track function.

## `watch<T>(signal, run)`

```tsx
import { watch } from "@hedystia/view";

const dispose = watch(
  count,                            // signal to track
  (value, prevValue) => {           // runs untracked
    console.log(value, prevValue);
    return () => { /* cleanup */ };
  },
);
```

### Parameters

| Parameter | Description |
|-----------|-------------|
| `signal` | A `Signal` or `Computed` signal to track |
| `run` | Callback receiving `(value, prevValue)`. Runs untracked. May return a cleanup function |

### Return Value

Returns a `dispose` function that stops the effect and runs any pending cleanup.

## Comparison with `on`

```tsx
// Before — on()
on(
  () => val(count),
  (value, prev) => console.log(value, prev),
);

// After — watch()
watch(count, (value, prev) => console.log(value, prev));
```

## Example: Sync to localStorage

```tsx
import { sig, set, watch, mount } from "@hedystia/view";

function Settings() {
  const theme = sig(localStorage.getItem("theme") ?? "light");

  watch(theme, (t) => localStorage.setItem("theme", t));

  return (
    <div>
      <p>Theme: {() => val(theme)}</p>
      <button onClick={() => set(theme, val(theme) === "light" ? "dark" : "light")}>
        Toggle
      </button>
    </div>
  );
}

mount(Settings, document.getElementById("root")!);
```

## How It Works

`watch(signal, run)` is equivalent to `on(() => val(signal), run)`. It tracks the given signal and calls `run` untracked whenever the signal changes.
