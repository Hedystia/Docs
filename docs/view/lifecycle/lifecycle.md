---
title: Lifecycle Hooks
description: Component lifecycle with onMount, onCleanup, and onReady.
---

# Lifecycle Hooks

Lifecycle hooks let you run code at specific points in a component's life. Since components run once, these hooks execute during that single run.

## `onMount(fn)`

Runs when the component mounts. If the callback returns a function, it is registered as cleanup:

```tsx
import { onMount, mount } from "@hedystia/view";

function Timer() {
  onMount(() => {
    const id = setInterval(() => console.log("tick"), 1000);
    return () => clearInterval(id); // cleanup on unmount
  });

  return <p>Timer is running (check console)</p>;
}

mount(Timer, document.getElementById("root")!);
```

## `onCleanup(fn)`

Registers a cleanup callback that runs when the component's reactive scope is disposed:

```tsx
import { onCleanup, mount } from "@hedystia/view";

function Listener() {
  const handler = () => console.log("resize");
  window.addEventListener("resize", handler);

  onCleanup(() => {
    window.removeEventListener("resize", handler);
  });

  return <p>Listening for resize events</p>;
}

mount(Listener, document.getElementById("root")!);
```

## `onReady(fn)`

Runs after the component's first render, via `queueMicrotask`. Useful for DOM measurements or focus calls after the element is in the document:

```tsx
import { onReady, mount } from "@hedystia/view";

function MeasureBox() {
  let box: HTMLElement | undefined;

  onReady(() => {
    if (box) {
      console.log("Box dimensions:", box.getBoundingClientRect());
    }
  });

  return <div ref={(el) => { box = el; }} style={{ width: "200px", height: "100px" }}>Box</div>;
}

mount(MeasureBox, document.getElementById("root")!);
```

## When Each Hook Runs

| Hook | Timing | Use Case |
|------|--------|----------|
| `onMount` | During component execution | Setup timers, subscriptions, side effects |
| `onCleanup` | When reactive scope disposes | Remove event listeners, cancel requests |
| `onReady` | After first render (microtask) | DOM measurements, auto-focus |

## Cleanup Patterns

`onMount` with a return value and `onCleanup` are complementary. Use whichever style is cleaner:

```tsx
// Style 1: onMount returns cleanup
onMount(() => {
  const ws = new WebSocket("ws://localhost");
  return () => ws.close();
});

// Style 2: Separate onCleanup
onMount(() => {
  const ws = new WebSocket("ws://localhost");
  onCleanup(() => ws.close());
});
```
