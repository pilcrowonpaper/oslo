---
title: "RSASSAPSS.sign()"
---

# `RSASSAPSS.sign()`

Signs data with a private key and returns the signature. See [`RSASSAPSS`](/reference/crypto/RSASSAPSS) for an example.

## Definition

```ts
function sign(
	privateKey: ArrayBuffer | TypedArray,
	data: ArrayBuffer | TypedArray
): Promise<ArrayBuffer>;
```

### Parameters

- `privateKey`: Private key in PKCS#8 format
- `data`: Data to sign
