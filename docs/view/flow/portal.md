---
title: Portal
description: Render children outside the component hierarchy with Portal.
---

# Portal

`Portal` renders its children into a different part of the DOM, outside the component's normal hierarchy. Useful for modals, tooltips, and overlays.

## Props

| Prop | Type | Description |
|------|------|-------------|
| `mount` | `HTMLElement` | Target element. Defaults to `document.body` |
| `children` | `JSX.Element` | Content to render into the target |

## Example

```tsx
import { sig, val, set, mount, Portal, Show } from "@hedystia/view";

function App() {
  const showModal = sig(false);

  return (
    <div>
      <button onClick={() => set(showModal, true)}>Open Modal</button>

      <Show when={() => val(showModal)}>
        <Portal>
          <div
            style={{
              position: "fixed",
              inset: "0",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => set(showModal, false)}
          >
            <div
              style={{
                background: "white",
                padding: "24px",
                borderRadius: "8px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Modal</h2>
              <p>This is rendered in document.body via Portal.</p>
              <button onClick={() => set(showModal, false)}>Close</button>
            </div>
          </div>
        </Portal>
      </Show>
    </div>
  );
}

mount(App, document.getElementById("root")!);
```

### Custom Mount Target

```tsx
<Portal mount={document.getElementById("tooltip-root")!}>
  <div class="tooltip">Tooltip content</div>
</Portal>
```

When the Portal is disposed, its children are automatically removed from the mount target.
