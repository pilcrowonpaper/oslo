---
title: "RSASSAPSS"
---

# `RSASSAPSS`

Helper for RSASSA-PSS.

## Constructor

```ts
//$ SHAHash=/reference/crypto/SHAHash
function constructor(hash: $$SHAHash): this;
```

### Parameters

- `hash`

## Method

- [`generateKeyPair()`](/reference/crypto/RSASSAPSS/generateKeyPair)
- [`sign()`](/reference/crypto/RSASSAPSS/sign)
- [`verify()`](/reference/crypto/RSASSAPSS/verify)

## Example

```ts
import { RSASSAPSS } from "oslo/crypto";

const ps256 = new RSASSAPSS("SHA-256");

const { publicKey, privateKey } = await ps256.generateKeyPair();
const data = new TextEncoder().encode("hello, world");

const signature = await ps256.sign(privateKey, data);

const validSignature = await ps256.verify(publicKey, signature, data);
```
