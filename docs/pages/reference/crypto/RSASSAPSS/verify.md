---
title: "RSASSAPSS.verify()"
---

# `RSASSAPSS.verify()`

Verifies a signature with a public key and returns `true` if the signature is valid. See [`RSASSAPSS`](/reference/crypto/RSASSAPSS) for an example.

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
