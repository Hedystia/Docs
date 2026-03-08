---
title: Methods
sidebar:
  order: 2
---

## Table of Contents

- [Methods](#methods)
  - [size](#size)
  - [map](#map)
  - [mapVal](#mapval)
  - [first](#first)
  - [find](#find)
  - [filter](#filter)
  - [filterKey](#filterkey)
  - [last](#last)
  - [lastKey](#lastkey)
  - [tap](#tap)
  - [has](#has)
  - [array](#array)
  - [keyArray](#keyarray)
  - [hasAll](#hasall)
  - [hasAny](#hasany)
  - [some](#some)
  - [random](#random)
  - [remove](#remove)
  - [removeByValue](#removebyvalue)
  - [get](#get)
  - [every](#every)
  - [each](#each)
  - [randomKey](#randomkey)
  - [equals](#equals)
  - [difference](#difference)
  - [findKey](#findkey)
  - [sort](#sort)
  - [clear](#clear)
  - [at](#at)
- [Static Methods](#static-methods)
  - [defaultCompareFunction](#defaultcomparefunction)

## Methods

### size

- **Description**: Gets the current size of the cache.
- **Returns**: `number` - The number of key-value pairs in the cache.

### map

- **Description**: Applies a function to each value in the cache and returns an array of the results.
- **Parameters**:
  - `fn`: `(val: V, key: K, map: Cache<K, V>) => U` - The function to apply to each value.
- **Returns**: `U[]` - An array of the results after applying the function.
- **Example**:
  ```typescript
  const cache = new Cache<string, number>();
  cache.set('one', 1).set('two', 2);
  const doubled = cache.map(val => val * 2); // [2, 4]
  ```

### mapVal

- **Description**: Maps values using a function, returning an array of the results.
- **Parameters**:
  - `fn`: `(val: V, key: K, map: Cache<K, V>) => U` - The function to apply to each value.
- **Returns**: `U[]` - An array of the results, excluding undefined values.
- **Example**:
  ```typescript
  const cache = new Cache<string, number>();
  cache.set('one', 1).set('two', 2);
  const even = cache.mapVal(val => val % 2 === 0 ? val : undefined); // [2]
  ```

### first

- **Description**: Retrieves the first value in the cache.
- **Returns**: `V | undefined`

### find

- **Description**: Finds a value that satisfies the given predicate function.
- **Parameters**:
  - `fn`: `(val: V, key: K, map: Cache<K, V>) => boolean` - The predicate function.
- **Returns**: `V | undefined`
- **Example**:
  ```typescript
  const found = cache.find(val => val > 1); // 2
  ```

### filter

- **Description**: Filters entries based on a predicate function and returns a new Cache.
- **Parameters**:
  - `fn`: `(val: V, key: K, map: Cache<K, V>) => boolean` - The predicate function.
- **Returns**: `Cache<K, V>`
- **Example**:
  ```typescript
  const filtered = cache.filter(val => val > 1); // Cache { 'two' => 2 }
  ```

### filterKey

- **Description**: Filters entries based on a key predicate and returns a new Cache.
- **Parameters**:
  - `fn`: `(key: K) => boolean` - The predicate function for keys.
- **Returns**: `Cache<K, V>`
- **Example**:
  ```typescript
  const filtered = cache.filterKey(key => key === 'one'); // Cache { 'one' => 1 }
  ```

### last

- **Description**: Retrieves the last value in the cache.
- **Returns**: `V | undefined`

### lastKey

- **Description**: Retrieves the last key in the cache.
- **Returns**: `K | undefined`

### tap

- **Description**: Executes a function with the cache and returns the cache instance.
- **Parameters**:
  - `fn`: `(map: Cache<K, V>) => void` - The function to execute.
- **Returns**: `Cache<K, V>` - The cache instance.
- **Example**:
  ```typescript
  const cache = new Cache<string, number>();
  cache.tap(map => map.set('one', 1)); // Cache { 'one' => 1 }
  ```

### has

- **Description**: Checks if a key exists in the cache.
- **Parameters**:
  - `k`: `K` - The key to check.
- **Returns**: `boolean` - True if the key exists, false otherwise.
- **Example**:
  ```typescript
  const exists = cache.has('one'); // true
  ```

### array

- **Description**: Returns an array of all values in the cache.
- **Returns**: `V[]` - An array of values.
- **Example**:
  ```typescript
  const values = cache.array(); // [1, 2]
  ```

### keyArray

- **Description**: Returns an array of all keys in the cache.
- **Returns**: `K[]` - An array of keys.
- **Example**:
  ```typescript
  const keys = cache.keyArray(); // ['one', 'two']
  ```

### hasAll

- **Description**: Checks if all provided keys exist in the cache.
- **Parameters**:
  - `...c`: `K[]` - The keys to check.
- **Returns**: `boolean` - True if all keys exist, false otherwise.
- **Example**:
  ```typescript
  const allExist = cache.hasAll('one', 'two'); // true
  ```

### hasAny

- **Description**: Checks if any of the provided keys exist in the cache.
- **Parameters**:
  - `...keys`: `K[]` - The keys to check.
- **Returns**: `boolean` - True if any key exists, false otherwise.
- **Example**:
  ```typescript
  const anyExist = cache.hasAny('one', 'three'); // true
  ```

### some

- **Description**: Checks if any entry satisfies the predicate function.
- **Parameters**:
  - `fn`: `(val: V, key: K, map: Cache<K, V>) => boolean` - The predicate function.
- **Returns**: `boolean` - True if any entry satisfies the predicate, false otherwise.
- **Example**:
  ```typescript
  const hasEven = cache.some(val => val % 2 === 0); // true
  ```

### random

- **Description**: Retrieves a random value from the cache.
- **Returns**: `V | undefined` - A random value or undefined if the cache is empty.
- **Example**:
  ```typescript
  const random = cache.random(); // 1 or 2
  ```

### remove

- **Description**: Removes a key from the cache.
- **Parameters**:
  - `key`: `K` - The key to remove.
- **Returns**: `boolean` - True if the key was removed, false otherwise.
- **Example**:
  ```typescript
  const removed = cache.remove('one'); // true
  ```

### removeByValue

- **Description**: Removes entries based on a predicate function.
- **Parameters**:
  - `fn`: `(val: V, key: K, map: Cache<K, V>) => boolean` - The predicate function.
- **Example**:
  ```typescript
  cache.removeByValue(val => val < 2); // removes 'one'
  ```

### get

- **Description**: Retrieves a value by key.
- **Parameters**:
  - `k`: `K` - The key to retrieve.
- **Returns**: `V | undefined` - The value associated with the key or undefined.
- **Example**:
  ```typescript
  const value = cache.get('one'); // 1
  ```

### every

- **Description**: Checks if all entries satisfy the predicate function.
- **Parameters**:
  - `fn`: `(val: V, key: K, map: Cache<K, V>) => boolean` - The predicate function.
- **Returns**: `boolean` - True if all entries satisfy the predicate, false otherwise.
- **Example**:
  ```typescript
  const allEven = cache.every(val => val % 2 === 0); // false
  ```

### each

- **Description**: Iterates over each entry and executes a function.
- **Parameters**:
  - `fn`: `(val: V, key: K, map: Cache<K, V>) => void` - The function to execute.
- **Returns**: `Cache<K, V>` - The cache instance.
- **Example**:
  ```typescript
  cache.each((val, key) => console.log(key, val)); // 'one 1', 'two 2'
  ```

### randomKey

- **Description**: Retrieves a random key from the cache.
- **Returns**: `K | undefined` - A random key or undefined if the cache is empty.
- **Example**:
  ```typescript
  const randomKey = cache.randomKey(); // 'one' or 'two'
  ```

### equals

- **Description**: Checks if another cache is equal in size and entries.
- **Parameters**:
  - `cache`: `Cache<K, V>` - The cache to compare.
- **Returns**: `boolean` - True if caches are equal, false otherwise.
- **Example**:
  ```typescript
  const isEqual = cache1.equals(cache2); // true
  ```

### difference

- **Description**: Finds keys present in another cache but not in this cache.
- **Parameters**:
  - `cache`: `Cache<K, V>` - The cache to compare.
- **Returns**: `K[] | string` - An array of missing keys or a size difference message.
- **Example**:
  ```typescript
  const difference = cache1.difference(cache2); // ['three']
  ```

### findKey

- **Description**: Finds a key based on a predicate function.
- **Parameters**:
  - `fn`: `(val: V, key: K, map: Cache<K, V>) => boolean` - The predicate function.
- **Returns**: `K | undefined` - The key that satisfies the predicate or undefined.
- **Example**:
  ```typescript
  const keyFound = cache.findKey((val, key) => val > 1); // 'two'
  ```

### sort

- **Description**: Sorts the cache based on a comparison function and updates the cache order.
- **Parameters**:
  - `compareFn`: `CompareFunction<V>` - The comparison function (default is `Cache.defaultCompareFunction`).
- **Returns**: `Cache<K, V>` - The sorted cache instance.
- **Example**:
  ```typescript
  cache.sort((a, b) => a - b); // Order: 'two' (1), 'three' (2), 'one' (3)
  ```

### clear

- **Description**: Clears all entries from the cache.
- **Returns**: `void`
- **Example**:
  ```typescript
  cache.clear(); // Cache is empty
  ```

### at

- **Description**: Retrieves a value at a specific index.
- **Parameters**:
  - `index`: `number` (default is 0) - The index of the value to retrieve.
- **Returns**: `V | undefined` - The value at the specified index or undefined.
- **Example**:
  ```typescript
  const secondValue = cache.at(1); // 2
  ```

## Static Methods

### defaultCompareFunction

- **Description**: The default comparison function for sorting.
- **Parameters**:
  - `a`: `V` - The first value to compare.
  - `b`: `V` - The second value to compare.
- **Returns**: `number` - `-1` if `a < b`, `0` if `a == b`, `1` if `a > b`.
- **Example**:
  ```typescript
  const result = Cache.defaultCompareFunction(2, 1); // 1
  ```
