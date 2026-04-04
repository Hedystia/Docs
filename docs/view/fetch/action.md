---
title: action — Mutations
description: Reactive mutation actions with action().
---

# action — Mutations

`action` creates a reactive mutation wrapper for async operations like form submissions, API writes, or any side-effectful async call.

## `action<T, A>(fn)`

```tsx
import { action } from "@hedystia/view";

const saveUser = action(async (data: { name: string; email: string }) => {
  const res = await fetch("/api/users", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
});
```

### Action Properties

| Property | Type | Description |
|----------|------|-------------|
| `run(args)` | `(args: A) => Promise<T>` | Execute the action |
| `loading` | `Signal<boolean>` | Whether the action is in progress |
| `error` | `Signal<Error \| undefined>` | The error, if the action failed |
| `data` | `Signal<T \| undefined>` | The result of the last successful run |

## JSX Example

```tsx
import { sig, val, set, action, mount } from "@hedystia/view";

interface SaveResult {
  id: number;
  saved: boolean;
}

function SaveForm() {
  const name = sig("");
  const email = sig("");

  const save = action(async (data: { name: string; email: string }): Promise<SaveResult> => {
    const res = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    return res.json();
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    save.run({ name: val(name), email: val(email) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={() => val(name)}
        onInput={(e) => set(name, (e.target as HTMLInputElement).value)}
        placeholder="Name"
      />
      <input
        value={() => val(email)}
        onInput={(e) => set(email, (e.target as HTMLInputElement).value)}
        placeholder="Email"
      />
      <button disabled={() => val(save.loading)}>
        {() => val(save.loading) ? "Saving..." : "Save"}
      </button>

      {() => val(save.error)
        ? <p style={{ color: "red" }}>Error: {val(save.error)!.message}</p>
        : null
      }
      {() => val(save.data)
        ? <p style={{ color: "green" }}>Saved successfully!</p>
        : null
      }
    </form>
  );
}

mount(SaveForm, document.getElementById("root")!);
```
