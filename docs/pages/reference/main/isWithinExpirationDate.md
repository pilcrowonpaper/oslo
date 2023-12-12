---
title: "isWithinExpirationDate()"
---

# `isWithinExpirationDate()`

Checks if the current time is before the provided expiration `Date`.

## Definition

```ts
//$ TimeSpan=/reference/main/TimeSpan
function isWithinExpirationDate(expirationDate: Date): boolean;
```

### Parameters

- `expirationDate`

## Example

```ts
import { createDate, TimeSpan, isWithinExpirationDate } from "oslo";

const tomorrow = createDate(new TimeSpan(1, "d"));
const yesterday = createDate(new TimeSpan(-1, "d"));

isWithinExpirationDate(tomorrow); // true
isWithinExpirationDate(yesterday); // false
```
