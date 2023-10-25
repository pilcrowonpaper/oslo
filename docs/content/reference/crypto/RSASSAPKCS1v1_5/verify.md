---
type: "method"
---

# `sign()`

Verifies a signature with a public key and returns `true` if the signature is valid. See [`RSASSAPKCS1v1_5`](/reference/crypto/RSASSAPKCS1v1_5) for an example.

```ts
function sign(publicKey: ArrayBuffer, signature: ArrayBuffer, data: ArrayBuffer): Promise<boolean>;
```

- `publicKey`: Public key in SPKI format
- `signature`
- `data`: The original signed data
