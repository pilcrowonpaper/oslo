---
type: "function"
---

Decodes base64 URL strings. Use [`encodeBase64url()`](ref:crypto) to encode into base64 URL strings.

## Definition

```ts
function decodeBase64url(encoded: string): Uint8Array;
```

### Parameters

- `encoded`

## Example

```ts
import { decodeBase64url } from "oslo/encoding";

const data = decodeBase64url(encoded);
const text = new TextDecoder().decode(data);
```
