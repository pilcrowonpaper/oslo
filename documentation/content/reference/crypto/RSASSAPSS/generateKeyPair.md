---
type: "method"
---

# `generateKeyPair()`

Generates a new public/private key pair. The public key is in SPKI format and the private key is in PKCS#8 format. See [`RSASSAPSS`](/reference/crypto/RSASSAPSS) for an example.

## Definition

```ts
//$ KeyPair=ref:crypto
function generateKeyPair(): Promise<$$KeyPair>;
```
