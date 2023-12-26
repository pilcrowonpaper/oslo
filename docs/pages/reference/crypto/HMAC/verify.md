---
title: "HMAC.verify()"
---

# `HMAC.verify()`

Verifies a signature with a public key and returns `true` if the signature is valid. See [`HMAC`](/reference/crypto/HMAC) for an example.

## Definition

```ts
function sign(
	secretKey: ArrayBuffer | TypedArray,
	signature: ArrayBuffer | TypedArray,
	data: ArrayBuffer | TypedArray
): Promise<boolean>;
```

### Parameters

- `secretKey`: Secret key in raw format
- `signature`
- `data`: The original signed data
