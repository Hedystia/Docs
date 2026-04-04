---
title: on — Reactive Effects
description: Create reactive side effects with on().
---

# on — Reactive Effects

`on` creates a reactive effect with explicit dependency tracking. The `track` function declares which signals are dependencies; the `run` callback executes untracked whenever those dependencies change.

## `on<T>(track, run)`

```tsx
import { on } from "@hedystia/view";

const dispose = on(
  () => val(signal),              // track: dependencies are tracked here
  (value, prevValue) => {         // run: executes untracked
    console.log(value, prevValue);
    return () => { /* cleanup */ };
  },
);
```

### Parameters

| Parameter | Description |
|-----------|-------------|
| `track` | A function whose signal reads are tracked as dependencies |
| `run` | Callback receiving `(value, prevValue)`. Runs untracked. May return a cleanup function |

### Return Value

Returns a `dispose` function that stops the effect and runs any pending cleanup.

## Cleanup

Return a function from `run` to clean up before the next execution or when disposed:

```tsx
import { sig, val, set, on } from "@hedystia/view";

const query = sig("");

const dispose = on(
  () => val(query),
  (q) => {
    const controller = new AbortController();
    fetch(`/search?q=${q}`, { signal: controller.signal });
    return () => controller.abort();
  },
);
```

## Example: Sync to localStorage

```tsx
import { sig, val, set, on, mount } from "@hedystia/view";

function Settings() {
  const theme = sig(localStorage.getItem("theme") ?? "light");

  on(
    () => val(theme),
    (t) => localStorage.setItem("theme", t),
  );

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

## Example: Window Resize Listener

```tsx
import { sig, val, on, mount } from "@hedystia/view";

function WindowSize() {
  const width = sig(window.innerWidth);

  on(
    () => val(width),
    () => {
      const handler = () => set(width, window.innerWidth);
      window.addEventListener("resize", handler);
      return () => window.removeEventListener("resize", handler);
    },
  );

  return <p>Window width: {() => val(width)}px</p>;
}

mount(WindowSize, document.getElementById("root")!);
```

## How It Works

1. `track()` runs with dependency tracking enabled — any `val()` calls register dependencies.
2. `run(value, prevValue)` executes **untracked**, so signal reads inside `run` don't become dependencies.
3. When a tracked signal changes, the cleanup from the previous run executes, then `run` executes again.
4. Calling the returned `dispose` function stops the effect permanently.
