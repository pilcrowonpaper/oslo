---
type: "function"
---

# `generateRandomNumber()`

Generates a random integer between 2 integers (including negatives). Uses cryptographically strong random values.

```ts
function generateRandomNumber(min: number, max: number): number;
```

- `min`: Inclusive
- `max`: Exclusive

## Example

```ts
import { generateRandomNumber } from "oslo/random";

// random number from 0 to 9 
generateRandomNumber(0, 10);
```
