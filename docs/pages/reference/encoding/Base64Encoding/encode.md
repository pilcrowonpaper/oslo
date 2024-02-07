---
title: "Base64Encoding.encode()"
---

# `Base64Encoding.encode()`

Encodes data. Includes padding by default.

## Definition

```ts
function encode(
	data: Uint8Array,
	options?: {
		includePadding?: boolean;
	}
): string;
```

### Parameters

- `data`
- `options`
  - `includePadding` (default: `true`)
