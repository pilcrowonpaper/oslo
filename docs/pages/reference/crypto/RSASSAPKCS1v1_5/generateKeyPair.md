---
title: "RSASSAPKCS1v1_5.generateKeyPair()"
---

# `RSASSAPKCS1v1_5.generateKeyPair()`

Generates a new public/private key pair. The public key is in SPKI format and the private key is in PKCS#8 format. See [`ECDSA`](/reference/crypto/ECDSA) for an example.

## Definition

```ts
//$ KeyPair=/reference/crypto/KeyPair
function generateKeyPair(modulusLength?: 2048 | 4096): Promise<$$KeyPair>;
```

### Parameters

- `modulusLength` (default: `2048`)
