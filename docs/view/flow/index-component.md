---
title: Index
description: Index-based list rendering with the Index component.
---

# Index

`Index` renders a list tracked by index position. Unlike `For`, which tracks items by key, `Index` reuses DOM nodes at each position and updates their content when the item at that index changes.

## Props

| Prop | Type | Description |
|------|------|-------------|
| `each` | `T[] \| () => T[]` | The array to iterate — static or accessor |
| `children` | `(item: () => T, index: number) => JSX.Element` | Render function receiving an item accessor and a static index |

Note that `index` is a plain number (not an accessor) since the node is always at the same position.

## Example

```tsx
import { sig, val, set, mount, Index } from "@hedystia/view";

function ColorPalette() {
  const colors = sig(["#ff0000", "#00ff00", "#0000ff"]);

  const addColor = () => {
    const hex = "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
    set(colors, [...val(colors), hex]);
  };

  return (
    <div>
      <button onClick={addColor}>Add Color</button>
      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        <Index each={() => val(colors)}>
          {(color, index) => (
            <div
              style={() => ({
                width: "48px",
                height: "48px",
                backgroundColor: val(color),
                borderRadius: "4px",
              })}
              title={`Color ${index}`}
            />
          )}
        </Index>
      </div>
    </div>
  );
}

mount(ColorPalette, document.getElementById("root")!);
```

## When to Use Index vs For

- **`For`** — best when items have unique keys and the list may be reordered. DOM nodes move with their data.
- **`Index`** — best when items are positional (e.g., rows in a grid) and the data at each index may change. DOM nodes stay in place.
