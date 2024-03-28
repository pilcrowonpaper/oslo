---
title: "Base32Encoding.encode()"
---

# `Base32Encoding.encode()`

Encodes data with base 32. Includes padding by default.

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
