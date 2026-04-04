---
title: JSX Setup & Basics
description: JSX basics in Hedystia View.
---

# JSX Setup & Basics

`@hedystia/view` uses a custom JSX runtime that creates real DOM nodes directly — no Virtual DOM. Components are plain functions that run once.

## TypeScript Configuration

<div v-pre>

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@hedystia/view"
  }
}
```

</div>

## How JSX Compiles

JSX is transformed at build time:

<div v-pre>

```tsx
// This JSX:
<div class="card">Hello</div>

// Compiles to:
jsx("div", { class: "card", children: "Hello" });
```

</div>

Function components are called directly — they return DOM nodes:

<div v-pre>

```tsx
// This JSX:
<MyComponent title="Hi" />

// Compiles to:
jsx(MyComponent, { title: "Hi" });

// Which calls:
MyComponent({ title: "Hi" }); // returns an HTMLElement
```

</div>

## Fragments

Use `<>...</>` to group elements without a wrapper:

<div v-pre>

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

</div>

## Event Handlers

Event handler props start with `on` followed by the event name. The event name after `on` is lowercased:

<div v-pre>

```tsx
<button onClick={(e) => console.log("clicked", e)}>Click</button>
<input onInput={(e) => console.log((e.target as HTMLInputElement).value)} />
<div onKeyDown={(e) => console.log(e.key)} />
<form onSubmit={(e) => e.preventDefault()} />
```

</div>

## `ref` Prop

Use `ref` to get a reference to the underlying DOM element. The callback runs after the element is inserted:

<div v-pre>

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

</div>

## Boolean Attributes

Boolean `true` sets the attribute (empty string); `false` omits it:

<div v-pre>

```tsx
<button disabled={true}>Can't click</button>
<input readonly={false} />
```

</div>

## `class` and `className`

Both `class` and `className` work and set the element's `className`:

<div v-pre>

```tsx
<div class="card">Using class</div>
<div className="card">Using className</div>
```

</div>

## Style

Style accepts a string, an object, or a function (for reactive styles):

<div v-pre>

```tsx
<div style="color: red;">String style</div>
<div style={{ color: "red", fontSize: "16px" }}>Object style</div>
<div style={() => ({ color: val(active) ? "red" : "blue" })}>Reactive style</div>
```

</div>

See [Reactive JSX Patterns](/view/jsx/reactive) for more on reactive props and children.
