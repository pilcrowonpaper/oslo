---
type: "function"
---

# `createDate()`

Creates a new `Date` by adding the provided time-span to the current time. Mostly for defining expiration times. Supports negative time span.

```ts
//$ TimeSpan=ref:main
function createDate(timeSpan: $$TimeSpan): Date;
```

- `timeSpan`

## Example

```ts
import { createDate, TimeSpan } from "oslo";

const tomorrow = createDate(new TimeSpan(1, "d"));
```
