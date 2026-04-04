---
title: Rendering
description: Mount components to the DOM with mount() and render to strings with renderToString().
---

# Rendering

## `mount(component, target)`

Mount a component to a DOM element. Returns a `ViewApp` with a `dispose` method to unmount and clean up:

```tsx
import { mount } from "@hedystia/view";

function App() {
  return <h1>Hello, world!</h1>;
}

const app = mount(App, document.getElementById("root")!);
```

### ViewApp

```tsx
interface ViewApp {
  dispose: () => void;
  root: Owner | null;
}
```

Calling `dispose()` runs all cleanup callbacks, removes children from the target element, and tears down the reactive graph:

```tsx
// Mount
const app = mount(App, document.getElementById("root")!);

// Unmount later
app.dispose();
```

### Re-mounting

Mounting clears the target element first, so you can re-mount to the same target:

```tsx
mount(PageA, root);
// Later...
mount(PageB, root); // clears PageA, mounts PageB
```

## `renderToString(component)`

Render a component to an HTML string for server-side rendering (SSR):

```tsx
import { renderToString } from "@hedystia/view";

function Page() {
  return (
    <html>
      <head><title>SSR</title></head>
      <body><h1>Hello from the server</h1></body>
    </html>
  );
}

const html = renderToString(Page);
// "<html><head><title>SSR</title></head><body><h1>Hello from the server</h1></body></html>"
```

> **Note:** `renderToString` creates a one-time snapshot. Signals and effects are not active in the resulting string.
