---
title: "generateRandomString()"
---

# `generateRandomString()`

Generates a random string of given length using the provided characters (`alphabet`). See [`alphabet()`](/reference/crypto/alphabet) for creating the alphabet string. Uses cryptographically strong random values.

## Definition

```ts
function generateRandomString(length: number, alphabet: string): string;
```

### Parameters

- `length`
- `alphabet`: A string with all possible characters

## Example

```ts
import { generateRandomString, alphabet } from "oslo/crypto";

// 10-characters long string consisting of the lowercase alphabet and numbers
generateRandomString(10, alphabet("a-z", "0-9"));
```
