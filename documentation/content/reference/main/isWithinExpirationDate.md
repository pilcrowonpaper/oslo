---
type: "function"
---

# `isWithinExpirationDate()`

Checks if the current time is before the provided expiration `Date`.

```ts
//$ TimeSpan=ref:main
function isWithinExpirationDate(expirationDate: Date): boolean;
```

- `expirationDate`

## Example

```ts
import { createDate, TimeSpan, isWithinExpirationDate } from "oslo";

const tomorrow = createDate(new TimeSpan(1, "d"));
const yesterday = createDate(new TimeSpan(-1, "d"));

isWithinExpirationDate(tomorrow); // true
isWithinExpirationDate(yesterday); // false
```
