---
title: Context
description: Dependency injection with ctx and use.
---

# Context

Context provides dependency injection for passing values through the component tree without prop drilling.

## `ctx<T>(default?)`

Create a typed context, optionally with a default value:

```tsx
import { ctx } from "@hedystia/view";

interface Theme {
  mode: "dark" | "light";
  accent: string;
}

const ThemeCtx = ctx<Theme>({ mode: "light", accent: "#007bff" });
```

## Provider

Wrap a subtree with `Context.Provider` to supply a value:

```tsx
import { mount } from "@hedystia/view";

function App() {
  return (
    <ThemeCtx.Provider value={{ mode: "dark", accent: "#ff6600" }}>
      <Dashboard />
    </ThemeCtx.Provider>
  );
}

mount(App, document.getElementById("root")!);
```

## `use<T>(context)`

Consume the nearest provided value. Throws if no provider is found and no default exists:

```tsx
import { use } from "@hedystia/view";

function ThemedButton() {
  const theme = use(ThemeCtx);

  return (
    <button
      style={{
        backgroundColor: theme.accent,
        color: theme.mode === "dark" ? "white" : "black",
      }}
    >
      Themed Button
    </button>
  );
}
```

## Full Example

```tsx
import { ctx, use, sig, val, set, mount } from "@hedystia/view";

interface Auth {
  user: string;
  logout: () => void;
}

const AuthCtx = ctx<Auth>();

function UserBadge() {
  const auth = use(AuthCtx);
  return (
    <div>
      <span>Logged in as: {auth.user}</span>
      <button onClick={auth.logout}>Log out</button>
    </div>
  );
}

function App() {
  const user = sig("Alice");

  return (
    <AuthCtx.Provider
      value={{
        user: val(user),
        logout: () => set(user, "Guest"),
      }}
    >
      <UserBadge />
    </AuthCtx.Provider>
  );
}

mount(App, document.getElementById("root")!);
```
