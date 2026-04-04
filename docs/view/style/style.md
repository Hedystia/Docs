---
title: Style Utilities
description: Create, merge, and convert style objects with style, merge, and toCssString.
---

# Style Utilities

Utility functions for working with style objects in `@hedystia/view`.

## `style(base)`

Create a reusable computed style. Accepts a static object or an accessor function:

```tsx
import { sig, val, style } from "@hedystia/view";

// Static style — returns a constant accessor
const card = style({
  padding: "16px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
});

// Reactive style — creates a memo that recomputes when signals change
const active = sig(false);
const highlight = style(() => ({
  color: val(active) ? "green" : "gray",
  fontWeight: val(active) ? "bold" : "normal",
}));
```

Use in JSX:

```tsx
<div style={card()}>Static card</div>
<div style={highlight}>Reactive highlight</div>
```

## `merge(...styles)`

Merge multiple style objects. Later objects override earlier ones:

```tsx
import { merge } from "@hedystia/view";

const base = { padding: "8px", color: "black" };
const accent = { color: "blue", fontWeight: "bold" };

const combined = merge(base, accent);
// { padding: "8px", color: "blue", fontWeight: "bold" }
```

`undefined` and `null` entries are safely skipped:

```tsx
const result = merge(base, undefined, accent, null);
```

## `toCssString(style)`

Convert a style object to a CSS string (useful for SSR or inline style attributes):

```tsx
import { toCssString } from "@hedystia/view";

const css = toCssString({
  fontSize: "16px",
  backgroundColor: "#f0f0f0",
  marginTop: "8px",
});
// "font-size: 16px; background-color: #f0f0f0; margin-top: 8px;"
```

Property names are automatically converted from camelCase to kebab-case.

## Example

```tsx
import { sig, val, set, style, merge, mount } from "@hedystia/view";

function ThemedCard() {
  const dark = sig(false);

  const baseStyle = style({
    padding: "16px",
    borderRadius: "8px",
    transition: "all 0.2s",
  });

  return (
    <div
      style={() =>
        merge(baseStyle(), {
          backgroundColor: val(dark) ? "#1a1a1a" : "#ffffff",
          color: val(dark) ? "#ffffff" : "#1a1a1a",
        })
      }
    >
      <p>Themed card content</p>
      <button onClick={() => set(dark, !val(dark))}>
        Toggle theme
      </button>
    </div>
  );
}

mount(ThemedCard, document.getElementById("root")!);
```
