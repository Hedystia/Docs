# Route Testing

Hedystia provides an integrated testing framework that lets you test your routes inline with your route definitions. This allows you to verify your endpoints work correctly without setting up separate test files.

## Basic Test Example

Add a `test` property to your route schema to define assertions:

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()

app.get('/users/:id', ({ params }) => ({ id: params.id, name: 'John' }), {
  params: h.object({ id: h.number().coerce() }),
  response: h.object({ id: h.number(), name: h.string() }),
  test: async ({ createRequest, expect }) => {
    const { response, statusCode } = await createRequest({
      params: { id: 123 },
    })
    expect(response.id).toBe(123)
    expect(response.name).toBe('John')
    expect(statusCode).toBe(200)
  },
})
```

## Test Context API

The `test` callback receives a fully typed context with the following utilities:

### `createRequest(data)`

Make a request to your route with optional parameters, query string, body, and headers:

```typescript
const { response, statusCode, ok } = await createRequest({
  params: { id: 123 },
  query: { include: 'posts' },
  body: { name: 'Alice' },
  headers: { 'X-Custom': 'value' },
})
```

Returns:
- `response` — The parsed response (typed based on your schema)
- `statusCode` — HTTP status code
- `ok` — Whether status is 2xx

### `expect(value)`

Create assertion chains for type-safe comparisons:

```typescript
expect(42).toBe(42)
expect({ id: 1 }).toEqual({ id: 1 })
expect([1, 2, 3]).toContain(2)
expect('hello').toMatch(/ello/)
expect(value).toBeTruthy()
expect(null).toBeNull()
expect(value).toBeDefined()
expect(value).toBeUndefined()
expect(5).toBeGreaterThan(3)
expect(5).toBeLessThan(10)
expect(5).toBeGreaterThanOrEqual(5)
expect(5).toBeLessThanOrEqual(10)
expect(3.14).toBeCloseTo(3.1, 1)
expect(obj).toBeInstanceOf(MyClass)
expect(arr).toHaveLength(3)
expect(obj).toHaveProperty('name')
expect(() => {}).not.toThrow()
```

### Assertion Methods Reference

| Method | Description |
|--------|-------------|
| `toBe(expected)` | Strict equality (===) |
| `toEqual(expected)` | Deep equality |
| `toStrictEqual(expected)` | Very strict deep equality |
| `toBeTruthy()` | Truthy value |
| `toBeFalsy()` | Falsy value |
| `toBeDefined()` | Not undefined |
| `toBeUndefined()` | Is undefined |
| `toBeNull()` | Is null |
| `toBeNaN()` | Is NaN |
| `toBeFinite()` | Is finite number |
| `toBeInfinite()` | Is infinite number |
| `toContain(item)` | Array/string contains |
| `toHaveLength(num)` | Array/string length |
| `toHaveProperty(key)` | Object has property |
| `toMatch(pattern)` | String matches regex |
| `toThrow()` | Function throws |
| `toBeGreaterThan(num)` | Greater than |
| `toBeLessThan(num)` | Less than |
| `toBeGreaterThanOrEqual(num)` | Greater or equal |
| `toBeLessThanOrEqual(num)` | Less or equal |
| `toBeCloseTo(num, decimals)` | Close to number |
| `toBeInstanceOf(Class)` | Instance of class |
| `toHaveBeenCalled()` | Function was called |
| `toHaveBeenCalledWith(...args)` | Called with args |
| `toHaveBeenCalledTimes(num)` | Called N times |
| `toHaveReturnedWith(value)` | Returned value |
| `toHaveReturnedTimes(num)` | Returned N times |

### Using `not`

Chain `.not` to negate any assertion:

```typescript
expect(5).not.toBe(10)
expect(value).not.toBeNull()
expect(arr).not.toContain(99)
```

### `assert(condition, message?)`

Simple boolean assertion:

```typescript
assert(value > 0, 'Value must be positive')
assert(Array.isArray(data))
```

### `assertEqual(actual, expected, message?)`

Deep equality check with optional message:

```typescript
assertEqual(result, expectedValue)
assertEqual(response.status, 'ok', 'Status should be ok')
```

### `assertThrows(fn)`

Verify a function throws an error:

```typescript
await assertThrows(async () => {
  throw new Error('Expected error')
})
```

## Complete Testing Example

```ts twoslash
// @noErrors
import Hedystia, { h } from 'hedystia'
const app = new Hedystia()

app
  .post('/users', ({ body }) => ({ id: 1, ...body }), {
    body: h.object({ name: h.string(), email: h.string() }),
    response: h.object({
      id: h.number(),
      name: h.string(),
      email: h.string(),
    }),
    test: async ({ createRequest, expect }) => {
      const { response, statusCode } = await createRequest({
        body: { name: 'Alice', email: 'alice@example.com' },
      })
      
      expect(statusCode).toBe(200)
      expect(response.id).toBeGreaterThan(0)
      expect(response.name).toBe('Alice')
      expect(response.email).toMatch(/alice@/)
      expect(response).toHaveProperty('id')
    },
  })
  .delete('/users/:id', () => ({ ok: true }), {
    params: h.object({ id: h.number().coerce() }),
    response: h.object({ ok: h.boolean() }),
    test: async ({ createRequest, expect }) => {
      const { response, statusCode } = await createRequest({
        params: { id: 123 },
      })
      
      expect(statusCode).toBe(200)
      expect(response.ok).toBe(true)
    },
  })
```

## Running Tests

Execute all route tests at once:

```typescript
const results = await app.runTests()

// Print formatted report
console.log(results.report)

// Log results
console.log(`Passed: ${results.passed}`)
console.log(`Failed: ${results.failed}`)
console.log(`Total: ${results.total}`)

// Access individual test results
results.results.forEach(result => {
  console.log(`${result.method} ${result.path}: ${result.passed ? '✓' : '✗'}`)
  if (result.error) console.log(`  Error: ${result.error}`)
  console.log(`  Duration: ${Math.round(result.duration)}ms`)
  console.log(`  Assertions: ${result.assertions}`)
})
```

The report includes:
- Status (✅ or ❌)
- HTTP method and path
- Assertion count
- Execution duration in milliseconds
- Error messages for failed tests

## Test Results Structure

```typescript
interface TestResults {
  passed: number          // Number of passing tests
  failed: number          // Number of failing tests
  total: number           // Total tests run
  report: string          // Formatted report text
  results: TestResult[]   // Individual test results
}

interface TestResult {
  path: string            // Route path
  method: string          // HTTP method
  passed: boolean         // Test passed
  error?: string          // Error message if failed
  duration: number        // Execution time in milliseconds
  assertions: number      // Count of assertions run
}
```

## Best Practices

### 1. Test Multiple Scenarios

```typescript
test: async ({ createRequest, expect }) => {
  // Test valid input
  const { response } = await createRequest({
    params: { id: 123 },
  })
  expect(response.id).toBe(123)
  
  // Multiple assertions
  expect(response).toHaveProperty('name')
  expect(response.name).not.toBeNull()
}
```

### 2. Test Error Cases

```typescript
test: async ({ createRequest, expect }) => {
  const { statusCode } = await createRequest({
    params: { id: -1 },
  })
  expect(statusCode).toBe(400)
}
```

### 3. Validate Response Structure

```typescript
test: async ({ createRequest, expect }) => {
  const { response } = await createRequest({})
  expect(response).toHaveProperty('id')
  expect(response).toHaveProperty('name')
  expect(response).toHaveProperty('email')
  expect(response).toContain('example.com')
}
```

### 4. Check Status Codes

```typescript
test: async ({ createRequest, expect }) => {
  const { statusCode, ok } = await createRequest({})
  expect(statusCode).toBe(200)
  expect(ok).toBe(true)
}
```

## When to Use Route Tests

- **Validation** — Verify request validation works
- **Business Logic** — Test calculations and transformations
- **Edge Cases** — Test boundary conditions
- **Status Codes** — Verify correct HTTP status codes
- **Response Shape** — Ensure response structure is correct
- **Happy Path** — Test the main successful flow

## When to Use Separate Test Files

For complex scenarios, integration tests, or multiple test suites, use a separate test file with your testing framework (Bun, Vitest, Jest, etc.) to maintain clarity and organization.
