---
title: Scheduler
description: Frame scheduling with tick, nextFrame, and forceFlush.
---

# Scheduler

The scheduler provides `requestAnimationFrame`-based batching for visual updates. Use it when you need to coordinate DOM reads/writes with the browser's paint cycle.

## `tick(fn)`

Schedule a callback for the next animation frame. Multiple `tick` calls in the same frame are batched together:

```tsx
import { tick } from "@hedystia/view";

tick(() => {
  // Runs on next requestAnimationFrame
  element.style.transform = `translateX(${x}px)`;
});
```

## `nextFrame()`

Returns a promise that resolves on the next animation frame:

```tsx
import { nextFrame } from "@hedystia/view";

async function animate() {
  element.classList.add("enter");
  await nextFrame();
  element.classList.add("enter-active");
}
```

## `forceFlush()`

Force all pending RAF callbacks to execute synchronously. Primarily useful for testing:

```tsx
import { tick, forceFlush } from "@hedystia/view";

tick(() => {
  console.log("flushed");
});

await forceFlush(); // runs immediately instead of waiting for RAF
```

## When to Use

| Function | Use Case |
|----------|----------|
| `tick` | DOM mutations that should happen on next paint (animations, layout changes) |
| `nextFrame` | Awaiting the next paint cycle in async code |
| `forceFlush` | Testing — flush pending callbacks without waiting for RAF |

## Example

```tsx
import { sig, val, set, tick, mount } from "@hedystia/view";

function SlideIn() {
  return (
    <div
      ref={(el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "all 0.3s ease";

        tick(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        });
      }}
    >
      <p>I slide in on mount!</p>
    </div>
  );
}

mount(SlideIn, document.getElementById("root")!);
```

In this example, the element starts hidden, and on the next animation frame `tick` updates the styles, triggering the CSS transition.
