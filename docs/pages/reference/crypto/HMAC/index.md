---
title: "HMAC"
---

# `HMAC`

Helper for HMAC.

## Constructor

```ts
//$ SHAHash=/reference/crypto/SHAHash
function constructor(hash: $$SHAHash): this;
```

### Parameters

- `hash`

## Methods

- [`generateKeyPair()`](/reference/crypto/HMAC/generateKeyPair)
- [`sign()`](/reference/crypto/HMAC/sign)
- [`verify()`](/reference/crypto/HMAC/verify)

## Example

```ts
import { HMAC } from "oslo/crypto";

const hs256 = new HMAC("SHA-256");

const secretKey = await hs256.generateKeyPair();
const data = new TextEncoder().encode("hello, world");

const signature = await hs256.sign(secretKey, data);

const validSignature = await hs256.verify(secretKey, signature, data);
```
