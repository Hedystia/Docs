---
title: Show
description: Conditional rendering with the Show component.
---

# Show

`Show` conditionally renders children based on a reactive condition.

## Props

| Prop | Type | Description |
|------|------|-------------|
| `when` | `T \| () => T` | Condition — can be a static value or an accessor |
| `fallback` | `JSX.Element` | Optional element to render when condition is falsy |
| `children` | `JSX.Element` | Content to render when condition is truthy |

## Example

```tsx
import { sig, val, set, mount, Show } from "@hedystia/view";

function App() {
  const loggedIn = sig(false);

  return (
    <div>
      <button onClick={() => set(loggedIn, !val(loggedIn))}>
        {() => val(loggedIn) ? "Log out" : "Log in"}
      </button>

      <Show
        when={() => val(loggedIn)}
        fallback={<p>Please log in to continue.</p>}
      >
        <div>
          <h2>Welcome back!</h2>
          <p>You are logged in.</p>
        </div>
      </Show>
    </div>
  );
}

mount(App, document.getElementById("root")!);
```

When `loggedIn` becomes truthy, the children are inserted into the DOM. When it becomes falsy, they are removed and the fallback is shown instead.
