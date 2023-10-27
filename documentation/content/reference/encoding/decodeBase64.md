---
type: "function"
---

# `decodeBase64()`

Decodes base64 strings. This does not check the length and ignores padding.Use [`encodeBase64()`](ref:crypto) to encode into base64 strings.

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
