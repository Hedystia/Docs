---
title: For
description: Keyed list rendering with the For component.
---

# For

`For` renders a list of items with keyed reconciliation. When the list changes, items are efficiently added, removed, or reordered by key.

## Props

| Prop | Type | Description |
|------|------|-------------|
| `each` | `T[] \| () => T[]` | The array to iterate — static or accessor |
| `key` | `(item: T) => string \| number` | Optional key function. Defaults to index |
| `children` | `(item: () => T, index: () => number) => JSX.Element` | Render function for each item |

The `children` render function receives accessors (not raw values) so individual items can update reactively.

## Example

```tsx
import { sig, val, set, mount, For } from "@hedystia/view";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

function TodoList() {
  const todos = sig<Todo[]>([
    { id: 1, text: "Learn signals", done: false },
    { id: 2, text: "Build an app", done: false },
  ]);

  let nextId = 3;

  const addTodo = () => {
    set(todos, [...val(todos), { id: nextId++, text: `Todo ${nextId}`, done: false }]);
  };

  const removeTodo = (id: number) => {
    set(todos, val(todos).filter((t) => t.id !== id));
  };

  return (
    <div>
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        <For
          each={() => val(todos)}
          key={(todo) => todo.id}
        >
          {(todo, index) => (
            <li>
              {() => `${val(index) + 1}. ${val(todo).text}`}
              <button onClick={() => removeTodo(val(todo).id)}>✕</button>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}

mount(TodoList, document.getElementById("root")!);
```
