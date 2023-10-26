---
type: "function"
---

# `encodeBase64url()`

Encodes data into base64 URL string. Use [`decodeBase64url()`](ref:crypto) to decode base64 URL strings.

```ts
function encodeBase64url(data: ArrayBuffer): string;
```

- `data`

## Example

```ts
import { encodeBase64url } from "oslo/encoding";

const data = new TextEncoder("hello, world");
const encoded = encodeBase64url(data);
```
