---
title: Getting Started
description: Introduction to @hedystia/view — a reactive UI engine with fine-grained signals and no Virtual DOM.
---

# Getting Started

`@hedystia/view` is a reactive UI engine that creates real DOM nodes directly — no Virtual DOM. It uses fine-grained signals for reactivity, meaning **components run once** and only the specific DOM nodes that depend on changed signals are updated.

## Installation

```bash
bun add @hedystia/view
```

## TypeScript Configuration

Configure your `tsconfig.json` to use the `@hedystia/view` JSX runtime:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@hedystia/view",
    "moduleResolution": "bundler",
    "target": "esnext",
    "module": "esnext",
    "strict": true
  }
}
```

## Vite Configuration

```ts
import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    exclude: ["@hedystia/view"],
  },
});
```

## Your First Component

```tsx
import { sig, val, set, mount } from "@hedystia/view";

function Counter() {
  const count = sig(0);

  return (
    <div>
      <p>Count: {() => val(count)}</p>
      <button onClick={() => set(count, val(count) + 1)}>
        Increment
      </button>
    </div>
  );
}

mount(Counter, document.getElementById("root")!);
```

## Key Concepts

**Components run once.** The `Counter` function above executes a single time. After that, only the reactive expressions update the DOM.

- **Reactive text**: Use `{() => val(signal)}` as a child — the function wrapper creates an effect that updates the text node when the signal changes.
- **Reactive style**: Use `style={() => ({ color: val(active) ? "red" : "blue" })}` — the function creates an effect that updates the element's style.
- **Static capture**: `{val(count)}` reads the signal once at component creation and never updates.

## Mounting

`mount` attaches a component to a DOM element and returns a `ViewApp` with a `dispose` method:

```tsx
import { mount } from "@hedystia/view";

const app = mount(App, document.getElementById("root")!);

// Later, to unmount:
app.dispose();
```

## Next Steps

- **[Signals](/view/signals/signals)**: `sig`, `val`, `set`, `update`, `peek`
- **[Memo](/view/signals/memo)**: Derived/computed signals
- **[Effects](/view/effects/on)**: Reactive side effects with `on` and `once`
- **[Reactive JSX](/view/jsx/reactive)**: Patterns for reactive rendering
- **[Flow Components](/view/flow/show)**: `Show`, `For`, `Index`, `Switch`, `Portal`
- **[Data Fetching](/view/fetch/load)**: `load` and `action`
- **[Store](/view/store/store)**: Nested reactive state
- **[Lifecycle](/view/lifecycle/lifecycle)**: `onMount`, `onCleanup`, `onReady`
- **[Context](/view/context/context)**: Dependency injection with `ctx` and `use`
