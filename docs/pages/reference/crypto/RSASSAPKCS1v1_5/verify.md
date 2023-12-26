---
title: "RSASSAPKCS1v1_5.verify()"
---

# `RSASSAPKCS1v1_5.verify()`

Verifies a signature with a public key and returns `true` if the signature is valid. See [`RSASSAPKCS1v1_5`](/reference/crypto/RSASSAPKCS1v1_5) for an example.

## Definition

```ts
function sign(
	publicKey: ArrayBuffer | TypedArray,
	signature: ArrayBuffer | TypedArray,
	data: ArrayBuffer | TypedArray
): Promise<boolean>;
```

### Parameters

- `publicKey`: Public key in SPKI format
- `signature`
- `data`: The original signed data
