---
type: "method"
---

# `sign()`

Signs data with a private key and returns the signature. See [`RSASSAPSS`](/reference/crypto/RSASSAPSS) for an example.

```ts
function sign(privateKey: ArrayBuffer, data: ArrayBuffer): Promise<ArrayBuffer>;
```

- `privateKey`: Private key in PKCS#8 format
- `data`: Data to sign