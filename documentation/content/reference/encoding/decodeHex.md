---
type: "function"
---

Decodes hex-encoded strings. Use [`encodeHex()`](ref:crypto) to encode into hex strings.

```ts
function decodeHex(encoded: string): Uint8Array;
```

- `encoded`

## Example

```ts
import { decodeHex } from "oslo/encoding";

const data = decodeHex(encoded);
const text = new TextDecoder().decode(data);
```
