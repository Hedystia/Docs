# Hedystia 2.1 - Reactive UI Engine

**Introducing @hedystia/view: A Fine-Grained Reactive UI Framework with No Virtual DOM**

Hedystia 2.1 brings frontend development into the picture with `@hedystia/view`, a brand-new reactive UI engine that lets you build modern, performant user interfaces with the same type-safe developer experience you love from the backend.

## 🎨 @hedystia/view — A New Way to Build UIs

We built `@hedystia/view` from the ground up with a simple philosophy: **components run once, reactivity is surgical**. Instead of re-rendering entire component trees, View updates only the exact DOM nodes that depend on changed values.

```bash
bun add @hedystia/view
```

## ⚡ No Virtual DOM, No Overhead

Unlike traditional UI frameworks, `@hedystia/view` creates real DOM nodes directly. There's no virtual DOM diffing, no reconciliation overhead — just precise, efficient updates exactly where they're needed.

```tsx
import { sig, val, set } from "@hedystia/view";

const count = sig(0);

function Counter() {
  // This component runs ONCE
  // Only the text node updates when count changes
  return (
    <div>
      <p>Count: {() => val(count)}</p>
      <button onClick={() => set(count, val(count) + 1)}>
        Increment
      </button>
    </div>
  );
}
```

The key pattern: `{val(count)}` is static (read once), while `{() => val(count)}` is reactive (creates a fine-grained effect).

## 📡 Signals — The Foundation of Reactivity

At the heart of View lies a powerful signals system that gives you explicit control over reactivity:

```tsx
import { sig, val, set, update, peek, memo } from "@hedystia/view";

// Create a signal
const name = sig("Alice");

// Read and write
console.log(val(name));           // "Alice"
set(name, "Bob");
update(name, (n) => n.toUpperCase());

// Peek without creating dependencies
const snapshot = peek(name);

// Create derived values
const greeting = memo(() => `Hello, ${val(name)}!`);
```

Signals support custom equality comparators, batch updates, and untracked reads for maximum flexibility.

### Batch & Untrack

Control when and how reactivity triggers:

```tsx
import { batch, untrack } from "@hedystia/view";

// Defer notifications until batch completes
batch(() => {
  set(user.name, "Alice");
  set(user.age, 30);
  set(user.email, "alice@example.com");
  // Only ONE reactive cycle triggers
});

// Read without creating dependencies
const copy = untrack(() => val(signal));
```

### Memo — Lazy Derived Values

Memos compute values on-demand and only re-evaluate when dependencies actually change:

```tsx
const items = sig([1, 2, 3, 4, 5]);
const doubled = memo(() => val(items).map((x) => x * 2));
const sum = memo(() => val(doubled).reduce((a, b) => a + b, 0));

// Values are computed lazily when read, not eagerly
console.log(val(sum)); // 30
```

## 🎯 Effects — Reactive Side Effects

Perform reactive operations with explicit control over dependencies and cleanup:

```tsx
import { on, once } from "@hedystia/view";

// Reactive effect with explicit tracking
const dispose = on(
  () => val(userId),
  (id, prevId) => {
    console.log(`User changed from ${prevId} to ${id}`);
    
    // Return cleanup function
    return () => {
      console.log(`Cleaning up user ${id}`);
    };
  }
);

// Run once and auto-dispose
once(
  () => val(initialData),
  (data) => {
    console.log("Initial data loaded:", data);
  }
);
```

## 🧩 JSX — Build UIs with Familiar Syntax

View uses JSX with a custom runtime (`jsxImportSource: "@hedystia/view"`). The same static vs reactive pattern applies everywhere:

```tsx
import { sig, val, set } from "@hedystia/view";
import { Show } from "@hedystia/view";

function App() {
  const visible = sig(true);
  const theme = sig("dark");

  return (
    <div className={() => `theme-${val(theme)}`}>
      {/* Static: evaluated once */}
      <h1>Welcome</h1>

      {/* Reactive: updates when theme changes */}
      <p class={() => val(theme) === "dark" ? "text-white" : "text-black"}>
        Current theme: {() => val(theme)}
      </p>

      {/* Reactive children */}
      <Show when={() => val(visible)}>
        <p>This is visible!</p>
      </Show>

      <button onClick={() => set(visible, !val(visible))}>
        Toggle
      </button>
    </div>
  );
}
```

Event handlers use standard `on<EventName>` syntax, both `class` and `className` work, and `ref` gives you direct DOM access after insertion.

## 🔄 Flow Control — Conditional & List Rendering

### Show — Conditional Rendering

```tsx
<Show when={() => val(isLoggedIn)} fallback={<LoginPrompt />}>
  <Dashboard />
</Show>
```

### For — Keyed List Rendering

DOM nodes move with their data based on key identity:

```tsx
<For each={() => val(users)} key={(user) => user.id}>
  {(user) => (
    <div>
      <span>{user.name}</span>
      <span>{user.email}</span>
    </div>
  )}
</For>
```

### Index — Index-Based List Rendering

DOM nodes stay in place; content updates when data at that index changes:

```tsx
<Index each={() => val(items)}>
  {(item, index) => (
    <div>
      #{index}: {() => val(item)}
    </div>
  )}
</Index>
```

### Switch & Match — Multi-Way Conditionals

```tsx
<Switch>
  <Match when={() => val(status) === "loading"}>
    <Spinner />
  </Match>
  <Match when={() => val(status) === "error"}>
    <ErrorMessage />
  </Match>
  <Match when={() => val(status) === "success"}>
    <DataDisplay />
  </Match>
  <Fallback>
    <UnknownState />
  </Fallback>
</Switch>
```

### Portal — Render Outside Hierarchy

Perfect for modals, tooltips, and dropdowns:

```tsx
<Portal>
  <div class="modal-overlay">
    <div class="modal">Content here</div>
  </div>
</Portal>
```

Defaults to `document.body`, or specify a custom mount point.

## 🏪 Store — Nested Reactive State

Manage complex nested state with an intuitive proxy-based API:

```tsx
import { store, val, set, patch, reset, snap } from "@hedystia/view";

const user = store({
  name: "Alice",
  address: {
    city: "Wonderland",
    zip: "12345",
  },
  preferences: {
    theme: "dark",
    notifications: true,
  },
});

// Access with dot notation (leaf values are signals)
console.log(val(user.name));
console.log(val(user.address.city));

// Set nested values
set(user.name, "Bob");
set(user.address.city, "New York");

// Deep partial update
patch(user.address, { city: "Los Angeles" });
patch(user.preferences, { theme: "light" });

// Snapshot to plain object
const snapshot = snap(user);

// Reset to initial state
reset(user);
```

## 🌐 Context — Dependency Injection

Pass values through the component tree without prop drilling:

```tsx
import { ctx, use, Context } from "@hedystia/view";

const themeCtx = ctx<"light" | "dark">("light");

function App() {
  return (
    <Context.Provider value={themeCtx} value={() => "dark" as const}>
      <Header />
      <Content />
    </Context.Provider>
  );
}

function Header() {
  const theme = use(themeCtx); // "dark"
  return <header class={val(theme)}>Themed Header</header>;
}
```

Contexts are fully typed and throw if consumed without a provider (unless a default is provided).

## 📦 Fetch — Reactive Data Fetching

Built-in utilities for data fetching with loading states, error handling, and auto-refetch:

### Load — Reactive Queries

```tsx
import { sig, val, set, load } from "@hedystia/view";

const userId = sig(1);

function UserProfile() {
  const user = load(
    () => val(userId),
    async () => {
      const res = await fetch(`/api/users/${val(userId)}`);
      return res.json();
    }
  );

  return (
    <Show when={() => val(user.ready)}>
      <div>
        <h2>{() => val(user.data).name}</h2>
        <p>{() => val(user.data).email}</p>
      </div>
    </Show>
  );
}
```

The `load` function provides: `data`, `loading`, `error`, `state` (`pending`/`ready`/`refreshing`/`errored`), and `ready`. It auto-aborts previous fetches when the key changes.

### Action — Reactive Mutations

```tsx
import { sig, val, set, action } from "@hedystia/view";

function CreatePost() {
  const createPost = action(async (postData: PostData) => {
    const res = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify(postData),
    });
    return res.json();
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.run({ title: "New Post", content: "..." });
      }}
    >
      <Show when={() => val(createPost.loading)}>
        <p>Creating post...</p>
      </Show>
      <Show when={() => val(createPost.data)}>
        <p>Post created: {() => val(createPost.data).id}</p>
      </Show>
      <button disabled={val(createPost.loading)}>Create</button>
    </form>
  );
}
```

## 🎭 Lifecycle — Mount, Cleanup, and Ready

Control component lifecycle with precision:

```tsx
import { onMount, onCleanup, onReady } from "@hedystia/view";

function MyComponent() {
  onMount(() => {
    console.log("Component mounted");
    
    // Return cleanup or use onCleanup
    return () => {
      console.log("Component unmounting");
    };
  });

  onCleanup(() => {
    console.log("Cleanup registered");
  });

  onReady(() => {
    // Runs after first render via queueMicrotask
    // Perfect for DOM measurements or auto-focus
    inputRef.focus();
  });

  return <input ref={(el) => (inputRef = el)} />;
}
```

## 🖼️ Rendering — Mount, Dispose, and SSR

```tsx
import { mount, renderToString } from "@hedystia/view";

// Mount to DOM
const app = mount(<App />, document.getElementById("app")!);

// Dispose (unmount)
app.dispose();

// Server-side rendering
const html = renderToString(<App />);
```

`renderToString` produces a one-time HTML snapshot with no reactivity — perfect for SSR.

## 🎨 Style Utilities

Style helpers for computed and merged styles:

```tsx
import { style, merge } from "@hedystia/view";

// Computed style (static or reactive)
const buttonStyle = style({
  padding: "12px 24px",
  borderRadius: "8px",
  background: () => (val(isPrimary) ? "blue" : "gray"),
});

// Merge styles
const merged = merge(baseStyle, buttonStyle, additionalStyle);

<div style={merged}>Styled Element</div>;
```

## 📐 Text Measurement

Measure and layout text reactively using the Canvas API:

```tsx
import { prepare, layout, reactiveLayout } from "@hedystia/view";

// Measure text dimensions
const measured = prepare("Hello, World!", "16px sans-serif");
console.log(measured.width, measured.height);

// Compute line wrapping
const lines = layout(measured, 300, 1.5);

// Reactive layout (memoized)
const reactiveLines = reactiveLayout(
  () => val(textContent),
  () => prepare(val(textContent), "16px sans-serif"),
  300,
  1.5
);
```

## ⏱️ Scheduler — Frame-Aware Updates

Schedule work with requestAnimationFrame for smooth animations:

```tsx
import { tick, nextFrame, forceFlush } from "@hedystia/view";

// Schedule for next animation frame
tick(() => {
  console.log("Running in next frame");
});

// Wait for next frame
await nextFrame();
console.log("After frame");

// Force flush (for testing)
forceFlush();
```

## 🎯 Summary

Hedystia 2.1 introduces a complete reactive UI engine:

1. **No Virtual DOM** — Real DOM nodes with surgical updates
2. **Components Run Once** — No re-rendering, just signal-driven effects
3. **Fine-Grained Reactivity** — Signals, memos, effects, and stores
4. **Full JSX Support** — Custom runtime with reactive patterns
5. **Data Fetching** — Built-in `load` and `action` for queries and mutations
6. **Flow Control** — Show, For, Index, Switch/Match, Portal
7. **Context & Store** — Dependency injection and nested reactive state
8. **SSR Support** — `renderToString` for server rendering
9. **Utilities** — Scheduler, style helpers, text measurement

### The View Philosophy

View is built on a simple principle: **reactivity should be explicit and performant**. Components execute once. Signals track dependencies. Only the DOM nodes that depend on changed values update. There's no virtual DOM diffing, no reconciliation — just direct, efficient updates.

This is the same philosophy Hedystia brings to the backend: type safety, developer experience, and performance without compromise.

### Install

```bash
bun add @hedystia/view
```

### Full Documentation

Explore the complete documentation at [View — Getting Started](/view/start).

---

Thank you to everyone in the Hedystia community for your feedback and support. We're excited to see what you build! 🚀
