---
title: "RSASSAPKCS1v1_5"
---

# `RSASSAPKCS1v1_5`

Helper for RSASSA-PKCS1-v1_5.

## Constructor

```ts
//$ SHAHash=/reference/crypto/SHAHash
function constructor(hash: $$SHAHash): this;
```

### Parameters

- `hash`

## Method

- [`generateKeyPair()`](/reference/crypto/RSASSAPKCS1v1_5/generateKeyPair)
- [`sign()`](/reference/crypto/RSASSAPKCS1v1_5/sign)
- [`verify()`](/reference/crypto/RSASSAPKCS1v1_5/verify)

## Example

```ts
import { RSASSAPKCS1v1_5 } from "oslo/crypto";

const rs256 = new RSASSAPKCS1v1_5("SHA-256");

const { publicKey, privateKey } = await rs256.generateKeyPair();
const data = new TextEncoder().encode("hello, world");

const signature = await rs256.sign(privateKey, data);

const validSignature = await rs256.verify(publicKey, signature, data);
```
