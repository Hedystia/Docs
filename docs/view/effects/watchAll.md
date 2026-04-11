---
title: watchAll — Multi-Signal Effects
description: Create a reactive effect that tracks multiple signals with watchAll().
---

# watchAll — Multi-Signal Effects

`watchAll` tracks an array of signals and calls the callback whenever **any** of them change.

## `watchAll<T>(signals, run)`

```tsx
import { watchAll } from "@hedystia/view";

const dispose = watchAll(
  [width, height],                          // signals to track
  ([w, h], [prevW, prevH]) => {             // runs untracked
    console.log(`${w}x${h}`);
    return () => { /* cleanup */ };
  },
);
```

### Parameters

| Parameter | Description |
|-----------|-------------|
| `signals` | An array of `Signal` or `Computed` signals to track |
| `run` | Callback receiving `(values, prevValues)` as tuples matching the signal array. Runs untracked. May return a cleanup function |

### Return Value

Returns a `dispose` function that stops the effect and runs any pending cleanup.

## Example: Derived Dimensions

```tsx
import { sig, set, watchAll, mount } from "@hedystia/view";

function Canvas() {
  const width = sig(800);
  const height = sig(600);

  watchAll([width, height], ([w, h]) => {
    console.log(`Canvas resized to ${w}x${h}`);
  });

  return (
    <div>
      <p>
        {() => val(width)}x{() => val(height)}
      </p>
      <button onClick={() => set(width, val(width) + 100)}>Wider</button>
      <button onClick={() => set(height, val(height) + 100)}>Taller</button>
    </div>
  );
}

mount(Canvas, document.getElementById("root")!);
```

## Example: Form Validation

```tsx
import { sig, val, watchAll } from "@hedystia/view";

const username = sig("");
const password = sig("");

watchAll([username, password], ([u, p]) => {
  const valid = u.length >= 3 && p.length >= 8;
  console.log("Form valid:", valid);
});
```

## How It Works

`watchAll(signals, run)` is equivalent to:

```tsx
on(
  () => signals.map((s) => val(s)),
  (values, prevValues) => run(values, prevValues),
);
```

All signals are read within a single track function, so a change to **any** signal in the array triggers the callback with the full tuple of current and previous values.
