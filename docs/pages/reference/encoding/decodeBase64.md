---
title: "decodeBase64()"
---

# `decodeBase64()`

**Deprecated - Use [`base64`](/reference/encoding/base64) instead.**

Decodes base64 strings. This does not check the length and ignores padding. Use [`encodeBase64()`](/reference/encoding/encodeBase64) to encode into base64 strings.

## Definition

```ts
function decodeBase64(encoded: string): Uint8Array;
```

### Parameters

- `encoded`

## Example

```ts
import { decodeBase64 } from "oslo/encoding";

const data = decodeBase64(encoded);
const text = new TextDecoder().decode(data);
```
