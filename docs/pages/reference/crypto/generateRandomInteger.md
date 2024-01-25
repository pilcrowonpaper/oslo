---
title: "generateRandomInteger()"
---

# `generateRandomInteger()`

Generates a random integer between 0 (inclusive) and a positive integer (exclusive). Uses cryptographically strong random values.

## Definition

```ts
function generateRandomInteger(max: number): number;
```

### Parameters

- `max`

## Example

```ts
import { generateRandomInteger } from "oslo/crypto";

// random number from 0 to 9
generateRandomInteger(10);
```
