---
title: Store
description: Nested reactive state management with store, patch, reset, and snap.
---

# Store

The store system provides nested reactive state. Each leaf value becomes a signal, while nested objects become proxy nodes you can traverse with dot access.

## `store<T>(initial)`

Create a reactive store from an initial state object:

```tsx
import { store, val, set } from "@hedystia/view";

const app = store({
  user: {
    name: "Alice",
    age: 30,
  },
  theme: "dark",
});
```

### Accessing Values

Nested keys resolve to signals. Read them with `val()` and write with `set()`:

```tsx
val(app.theme);           // "dark"
val(app.user.name);       // "Alice"

set(app.theme, "light");
set(app.user.name, "Bob");
```

## `patch(node, partial)`

Deep partial update of a store node. Only the specified keys are updated:

```tsx
import { patch } from "@hedystia/view";

patch(app.user, { name: "Charlie", age: 25 });
// app.user.name → "Charlie", app.user.age → 25
```

## `reset(store, initial)`

Reset a store to its initial values:

```tsx
import { reset } from "@hedystia/view";

reset(app, {
  user: { name: "Alice", age: 30 },
  theme: "dark",
});
```

## `snap(node)`

Create a plain object snapshot of a store node (non-reactive):

```tsx
import { snap } from "@hedystia/view";

const snapshot = snap(app);
// { user: { name: "Alice", age: 30 }, theme: "dark" }

const userSnap = snap(app.user);
// { name: "Alice", age: 30 }
```

## JSX Example

```tsx
import { store, val, set, patch, mount } from "@hedystia/view";

function UserProfile() {
  const state = store({
    user: {
      name: "Alice",
      email: "alice@example.com",
      role: "admin",
    },
    editing: false,
  });

  return (
    <div>
      <h2>{() => val(state.user.name)}</h2>
      <p>Email: {() => val(state.user.email)}</p>
      <p>Role: {() => val(state.user.role)}</p>

      <button onClick={() => set(state.editing, !val(state.editing))}>
        {() => val(state.editing) ? "Cancel" : "Edit"}
      </button>

      <button
        onClick={() =>
          patch(state.user, {
            name: "Bob",
            email: "bob@example.com",
          })
        }
      >
        Update User
      </button>
    </div>
  );
}

mount(UserProfile, document.getElementById("root")!);
```
