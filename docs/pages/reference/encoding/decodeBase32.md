---
title: "decodeBase32()"
---

# `decodeBase32()`

**Deprecated - Use [`base32`](/reference/encoding/base32) instead.**

Decodes base32 strings. This does not check the length and ignores padding. Use [`encodeBase32()`](/reference/encoding/encodeBase32) to encode into base32 strings.

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
