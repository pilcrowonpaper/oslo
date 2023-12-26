---
title: "sha1()"
---

# `sha1()`

Generates a SHA-1 hash.

## Definition

```ts
function sha1(data: ArrayBuffer | TypedArray): Promise<ArrayBuffer>;
```

### Parameters

- `data`

## Example

```ts
import { sha1 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";

const data = new TextEncoder().encode("hello, world");
const hash = await sha1(data);
const hexHash = encodeHex(hash);
```
