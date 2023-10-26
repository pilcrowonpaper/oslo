---
type: "function"
---

# `alphabet()`

Generates a string with all the characters defined in the provided pattern. Mostly used for [generateRandomString](ref:random). Ignores duplicates.

- `a-z`: `abcdefghijklmnopqrstuvwxyz`
- `A-Z`: `ABCDEFGHIJKLMNOPqRSTUVWXYZ`
- `0-9`: `0123456789`
- `-`: Character `-`
- `_`: Character `_`

```ts
function alphabet(...patterns: "a-z" | "A-Z" | "0-9" | "-" | "_"): string;
```

- `patterns`

## Example

```ts
import { alphabet } from "oslo/random";

// "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPqRSTUVWXYZ0123456789"
alphabet("a-z", "A-Z", "0-9");

// "0123456789"
alphabet("0-9", "0-9");
```
