---
title: Start
sidebar:
  order: 1
---

## Overview

The Cache class is a generic key-value store that extends the native JavaScript `Map` object, providing additional utility methods for enhanced functionality. This README provides documentation for the Cache class, including method descriptions, parameters, return types, and usage examples.

## Installation

To install the Cache class, you can use npm, yarn, pnpm or bun:

```bash
npm install @hedystia/cache
yarn add @hedystia/cache
pnpm install @hedystia/cache
bun add @hedystia/cache
```

## Usage Examples

### Creating an Instance

```typescript
const cache = new Cache<string, number>();
cache.set('one', 1).set('two', 2);
```

### Using Utility Methods

```typescript
const values = cache.map(val => val * 2); // [2, 4]
const firstValue = cache.first(); // 1
```

## Differences from Standard Map

The Cache class inherits all methods from the standard Map but adds additional utility methods for enhanced functionality, such as `map`, `filter`, and `sort`.

## License

- This project is licensed under the MIT License.
