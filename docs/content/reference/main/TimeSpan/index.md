---
type: "class"
---

# `TimeSpan`

Represents a time-span. Supports negative values.

## Constructor

```ts
function constructor(value: number, unit: "ms" | "s" | "m" | "h" | "d" | "w"): this;
```

### Parameters

- `value`
- `unit`: `ms` for milliseconds, `s` for seconds, etc

## Example

```ts
import { TimeSpan } from "oslo";

const halfSeconds = new TimeSpan(500, "ms");
const tenSeconds = new TimeSpan(10, "s");
const halfHour = new TimeSpan(30, "m");
const oneHour = new TimeSpan(1, "h");
const oneDay = new TimeSpan(1, "d");
const oneWeek = new TimeSpan(1, "w");
```
