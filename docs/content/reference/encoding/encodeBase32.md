---
type: "function"
---

# `encodeBase32()`

Encodes data into base32 string. Use [`decodeBase32()`](ref:encoding) to decode base32 strings.

## Definition

```ts
function encodeBase32(
	data: ArrayBuffer,
	options?: {
		padding?: boolean;
	}
): string;
```

### Parameters

- `data`
- `options.padding` (default: `true`): Set to `false` to remove padding

## Example

```ts
import { encodeBase32 } from "oslo/encoding";

const data = new TextEncoder("hello, world");
const encoded = encodeBase32(data);
```
