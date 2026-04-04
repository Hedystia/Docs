---
title: Reactive JSX Patterns
description: How to make JSX reactive in @hedystia/view — the most important patterns to understand.
---

# Reactive JSX Patterns

This is the most important concept in `@hedystia/view`. **Components run once.** Reactivity comes from wrapping expressions in functions. The JSX runtime detects function children and function props, creating effects that update only the specific DOM nodes that need to change.

## Static vs Reactive

The critical distinction:

```tsx
import { sig, val, set } from "@hedystia/view";

const count = sig(0);

// ❌ STATIC — captures the value once, never updates
<span>{val(count)}</span>

// ✅ REACTIVE — creates an effect, updates when count changes
<span>{() => val(count)}</span>
```

The first example reads `count` at component creation time and inserts that number as a static text node. The second wraps the read in a function — the JSX runtime creates an effect that re-runs the function and updates the text node whenever `count` changes.

## Reactive Text

Use a function child to create reactive text content:

```tsx
import { sig, val, set, mount } from "@hedystia/view";

function Greeting() {
  const name = sig("world");

  return (
    <div>
      <h1>Hello, {() => val(name)}!</h1>
      <input
        value={() => val(name)}
        onInput={(e) => set(name, (e.target as HTMLInputElement).value)}
      />
    </div>
  );
}

mount(Greeting, document.getElementById("root")!);
```

## Reactive Style

Pass a function to `style` to make it reactive:

```tsx
import { sig, val, set, mount } from "@hedystia/view";

function ToggleColor() {
  const active = sig(false);

  return (
    <div
      style={() => ({
        color: val(active) ? "green" : "gray",
        fontWeight: val(active) ? "bold" : "normal",
      })}
      onClick={() => set(active, !val(active))}
    >
      {() => val(active) ? "Active" : "Inactive"}
    </div>
  );
}

mount(ToggleColor, document.getElementById("root")!);
```

## Reactive Props

Any non-event prop that receives a function becomes reactive:

```tsx
import { sig, val, set, mount } from "@hedystia/view";

function DynamicInput() {
  const text = sig("");

  return (
    <div>
      <input
        value={() => val(text)}
        onInput={(e) => set(text, (e.target as HTMLInputElement).value)}
      />
      <p class={() => val(text).length > 10 ? "long" : "short"}>
        {() => val(text).length} characters
      </p>
    </div>
  );
}

mount(DynamicInput, document.getElementById("root")!);
```

## Reactive List

Return an array from a function child to render a reactive list:

```tsx
import { sig, val, set, mount } from "@hedystia/view";

function TodoList() {
  const items = sig(["Buy milk", "Walk dog"]);

  const addItem = () => {
    set(items, [...val(items), `Item ${val(items).length + 1}`]);
  };

  return (
    <div>
      <ul>
        {() => val(items).map((item) => <li>{item}</li>)}
      </ul>
      <button onClick={addItem}>Add</button>
    </div>
  );
}

mount(TodoList, document.getElementById("root")!);
```

For keyed, efficient list rendering, use the [`For`](/view/flow/for) component instead.

## Reactive Conditional

Return different elements from a function child for conditional rendering:

```tsx
import { sig, val, set, mount } from "@hedystia/view";

function Toggle() {
  const show = sig(true);

  return (
    <div>
      <button onClick={() => set(show, !val(show))}>Toggle</button>
      {() => val(show)
        ? <p>Content is visible</p>
        : <p style={{ color: "gray" }}>Content is hidden</p>
      }
    </div>
  );
}

mount(Toggle, document.getElementById("root")!);
```

For cleaner conditional rendering, use the [`Show`](/view/flow/show) component.

## Summary

| Pattern | Syntax | Creates Effect? |
|---------|--------|----------------|
| Static text | `{val(count)}` | No — read once |
| Reactive text | `{() => val(count)}` | Yes |
| Static style | `style={{ color: "red" }}` | No |
| Reactive style | `style={() => ({ color: val(c) })}` | Yes |
| Static prop | `value={val(text)}` | No — set once |
| Reactive prop | `value={() => val(text)}` | Yes |
| Reactive list | `{() => val(items).map(...)}` | Yes |
| Reactive cond | `{() => val(show) ? <A /> : <B />}` | Yes |
