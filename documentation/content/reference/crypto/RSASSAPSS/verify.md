---
type: "method"
---

# `sign()`

Verifies a signature with a public key and returns `true` if the signature is valid. See [`RSASSAPSS`](/reference/crypto/RSASSAPSS) for an example.

```ts
function sign(publicKey: ArrayBuffer, signature: ArrayBuffer, data: ArrayBuffer): Promise<boolean>;
```

- `publicKey`: Public key in SPKI format
- `signature`
- `data`: The original signed data
