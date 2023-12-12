---
title: "ECDSA.generateKeyPair()"
---

# `ECDSA.generateKeyPair()`

Generates a new public/private key pair. The public key is in SPKI format and the private key is in PKCS#8 format. See [`ECDSA`](/reference/crypto/ECDSA) for an example.

## Definition

```ts
//$ KeyPair=/reference/crypto/KeyPair
function generateKeyPair(): Promise<$$KeyPair>;
```
