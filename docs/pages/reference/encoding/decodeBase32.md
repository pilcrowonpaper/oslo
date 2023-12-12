---
title: "decodeBase32()"
---

# `decodeBase32()`

Decodes base32 strings. This does not check the length and ignores padding. Use [`encodeBase32()`](ref:encoding) to encode into base32 strings.

## Definition

```ts
function decodeBase32(encoded: string): Uint8Array;
```

### Parameters

- `encoded`

## Example

```ts
import { decodeBase32 } from "oslo/encoding";

const data = decodeBase32(encoded);
const text = new TextDecoder().decode(data);
```
