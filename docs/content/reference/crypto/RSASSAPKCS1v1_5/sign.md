---
type: "method"
---

# `sign()`

Signs data with a private key and returns the signature. See [`RSASSAPKCS1v1_5`](/reference/crypto/RSASSAPKCS1v1_5) for an example.

```ts
function sign(privateKey: ArrayBuffer, data: ArrayBuffer): Promise<ArrayBuffer>;
```

- `privateKey`: Private key in PKCS#8 format
- `data`: Data to sign