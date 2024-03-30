---
title: "Base64Encoding.decode()"
---

# `Base64Encoding.decode()`

Decodes a base 64 encoded string. By default, strict mode is enabled and the encoded string must include padding. Throws if the encoded string is malformed.

## Definition

```ts
function decode(
	data: string,
	options?: {
		strict?: boolean;
	}
): Uint8Array;
```

### Parameters

- `data`
- `options`
  - `strict` (default: `true`): Requires the input to have padding
