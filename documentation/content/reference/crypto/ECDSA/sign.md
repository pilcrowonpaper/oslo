---
type: "method"
---

# `sign()`

Signs data with a private key and returns the signature. See [`ECDSA`](/reference/crypto/ECDSA) for an example.

## Definition

```ts
function sign(privateKey: ArrayBuffer, data: ArrayBuffer): Promise<ArrayBuffer>;
```

### Parameters

- `privateKey`: Private key in PKCS#8 format
- `data`: Data to sign
