---
type: "method"
---

# `milliseconds()`

Returns the time-span in milliseconds.

```ts
function milliseconds(): number;
```

## Example

```ts
// 60 * 1000 = 60,000 ms
new TimeSpan("60", "s").milliseconds();
```
