---
title: JSX Setup & Basics
description: How JSX works in @hedystia/view — compilation, events, refs, and more.
---

# JSX Setup & Basics

`@hedystia/view` uses a custom JSX runtime that creates real DOM nodes directly — no Virtual DOM. Components are plain functions that run once.

## TypeScript Configuration

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@hedystia/view"
  }
}
```

## How JSX Compiles

JSX is transformed at build time:

```tsx
// This JSX:
<div class="card">Hello</div>

// Compiles to:
jsx("div", { class: "card", children: "Hello" });
```

Function components are called directly — they return DOM nodes:

```tsx
// This JSX:
<MyComponent title="Hi" />

// Compiles to:
jsx(MyComponent, { title: "Hi" });

// Which calls:
MyComponent({ title: "Hi" }); // returns an HTMLElement
```

## Fragments

Use `<>...</>` to group elements without a wrapper:

```tsx
function List() {
  return (
    <>
      <p>First</p>
      <p>Second</p>
    </>
  );
}
```

## Event Handlers

Event handler props start with `on` followed by the event name. The event name after `on` is lowercased:

```tsx
<button onClick={(e) => console.log("clicked", e)}>Click</button>
<input onInput={(e) => console.log((e.target as HTMLInputElement).value)} />
<div onKeyDown={(e) => console.log(e.key)} />
<form onSubmit={(e) => e.preventDefault()} />
```

## `ref` Prop

Use `ref` to get a reference to the underlying DOM element. The callback runs after the element is inserted:

```tsx
import { mount } from "@hedystia/view";

function AutoFocus() {
  return (
    <input
      ref={(el) => {
        el.focus();
      }}
    />
  );
}

mount(AutoFocus, document.getElementById("root")!);
```

## Boolean Attributes

Boolean `true` sets the attribute (empty string); `false` omits it:

```tsx
<button disabled={true}>Can't click</button>
<input readonly={false} />
```

## `class` and `className`

Both `class` and `className` work and set the element's `className`:

```tsx
<div class="card">Using class</div>
<div className="card">Using className</div>
```

## Style

Style accepts a string, an object, or a function (for reactive styles):

```tsx
<div style="color: red;">String style</div>
<div style={{ color: "red", fontSize: "16px" }}>Object style</div>
<div style={() => ({ color: val(active) ? "red" : "blue" })}>Reactive style</div>
```

See [Reactive JSX Patterns](/view/jsx/reactive) for more on reactive props and children.
