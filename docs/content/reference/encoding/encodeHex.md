---
type: "function"
---

# `encodeHex()`

Encodes data into hex string. Use [`decodeHex()`](ref:crypto) to decode hex strings.

```ts
function encodeHex(data: ArrayBuffer): string;
```

- `data`

## Example

```ts
import { encodeHex } from "oslo/encoding";

const data = new TextEncoder("hello, world");
const encoded = encodeHex(data);
```
