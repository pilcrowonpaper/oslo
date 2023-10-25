---
type: "function"
---

# `sha1()`

Generates a SHA-1 hash.

```ts
function sha1(data: ArrayBufferLike): Promise<ArrayBuffer>;
```

- `data`

## Example

```ts
import { sha1 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";

const data = new TextEncoder().encode("hello, world");
const hash = await sha1(data);
const hexHash = encodeHex(hash);
```
