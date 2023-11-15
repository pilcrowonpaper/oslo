---
type: "function"
---

# `encodeHex()`

Encodes data into hex string. Use [`decodeHex()`](ref:encoding) to decode hex strings.

## Definition

```ts
function encodeHex(data: ArrayBuffer): string;
```

### Parameters

- `data`

## Example

```ts
import { encodeHex } from "oslo/encoding";

const data = new TextEncoder("hello, world");
const encoded = encodeHex(data);
```
