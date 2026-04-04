---
title: Text Measurement
description: Measure and layout text with prepare, layout, and reactiveLayout.
---

# Text Measurement

The text module provides a pipeline for measuring text dimensions using the Canvas API. This is useful for components that need to know text size before rendering (e.g., auto-sizing containers, virtual lists, chart labels).

## `prepare(text, font)`

Measure a text string with a given CSS font and return a `PreparedText` handle:

```tsx
import { prepare } from "@hedystia/view";

const measured = prepare("Hello, world!", "16px sans-serif");
```

The `PreparedText` object stores the text, font, and measured dimensions internally.

## `layout(prepared, maxWidth, lineHeight)`

Compute line-wrapping layout for prepared text at a given width:

```tsx
import { prepare, layout } from "@hedystia/view";

const text = prepare("A long paragraph of text...", "14px Arial");
const result = layout(text, 300, 20);

console.log(result.lineCount); // number of wrapped lines
console.log(result.height);    // total height in pixels
```

### LayoutResult

```tsx
interface LayoutResult {
  lineCount: number;
  height: number;
}
```

## `reactiveLayout(source, getPrepared, maxWidth, lineHeight)`

Create a reactive memo that recomputes layout when the source changes:

```tsx
import { sig, val, set, reactiveLayout, prepare, mount } from "@hedystia/view";

interface TextItem {
  content: string;
  font: string;
}

function TextPreview() {
  const item = sig<TextItem>({ content: "Hello, world!", font: "16px sans-serif" });
  const width = sig(300);

  const result = reactiveLayout(
    () => val(item),
    (i) => prepare(i.content, i.font),
    val(width),
    20,
  );

  return (
    <div>
      <input
        type="range"
        min="100"
        max="600"
        value={() => val(width)}
        onInput={(e) => set(width, Number((e.target as HTMLInputElement).value))}
      />
      <p>Width: {() => val(width)}px</p>
      <p>Lines: {() => result().lineCount}</p>
      <p>Height: {() => result().height}px</p>
      <div
        style={() => ({
          width: `${val(width)}px`,
          border: "1px solid #ccc",
          padding: "8px",
          font: val(item).font,
        })}
      >
        {() => val(item).content}
      </div>
    </div>
  );
}

mount(TextPreview, document.getElementById("root")!);
```
