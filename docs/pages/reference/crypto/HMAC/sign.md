---
title: "HMAC.sign()"
---

# `HMAC.sign()`

Signs data with a private key and returns the signature. See [`HMAC`](/reference/crypto/HMAC) for an example.

## Definition

```ts
function sign(
	secretKey: ArrayBuffer | TypedArray,
	data: ArrayBuffer | TypedArray
): Promise<ArrayBuffer>;
```

### Parameters

- `secretKey`: Secret key in raw format
- `data`: Data to sign
