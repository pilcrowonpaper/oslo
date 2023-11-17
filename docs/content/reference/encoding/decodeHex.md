---
type: "function"
---

# `decodeHex()`

Decodes hex-encoded strings. Use [`encodeHex()`](ref:encoding) to encode into hex strings.

## Definition

```ts
function decodeHex(encoded: string): Uint8Array;
```

### Parameters

- `encoded`

## Example

```ts
import { decodeHex } from "oslo/encoding";

const data = decodeHex(encoded);
const text = new TextDecoder().decode(data);
```
