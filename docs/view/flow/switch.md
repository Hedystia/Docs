---
title: Switch & Match
description: Multi-way conditional rendering with Switch and Match.
---

# Switch & Match

`Switch` evaluates multiple `Match` conditions and renders the first one that is truthy. If none match, the `fallback` is rendered.

## Switch Props

| Prop | Type | Description |
|------|------|-------------|
| `fallback` | `JSX.Element` | Optional element when no Match conditions are truthy |
| `children` | `Match[]` | One or more `Match` components |

## Match Props

| Prop | Type | Description |
|------|------|-------------|
| `when` | `T \| () => T` | Condition — static or accessor |
| `children` | `JSX.Element` | Content to render when this match is active |

## Example

```tsx
import { sig, val, set, mount, Switch, Match } from "@hedystia/view";

type Status = "loading" | "error" | "success";

function StatusView() {
  const status = sig<Status>("loading");

  return (
    <div>
      <select
        onInput={(e) => set(status, (e.target as HTMLSelectElement).value as Status)}
      >
        <option value="loading">Loading</option>
        <option value="error">Error</option>
        <option value="success">Success</option>
      </select>

      <Switch fallback={<p>Unknown state</p>}>
        <Match when={() => val(status) === "loading"}>
          <p>Loading data...</p>
        </Match>
        <Match when={() => val(status) === "error"}>
          <p style={{ color: "red" }}>Something went wrong!</p>
        </Match>
        <Match when={() => val(status) === "success"}>
          <p style={{ color: "green" }}>Data loaded successfully.</p>
        </Match>
      </Switch>
    </div>
  );
}

mount(StatusView, document.getElementById("root")!);
```

The first `Match` whose `when` condition is truthy wins. When the condition changes, the previous match is removed and the new one is inserted.
