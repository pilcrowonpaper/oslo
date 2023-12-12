---
title: "HMAC"
---

# `HMAC`

Helper for HMAC.

## Constructor

```ts
//$ SHAHash=ref:crypto
function constructor(hash: $$SHAHash): this;
```

### Parameters

- `hash`

## Methods

- [`generateKeyPair()`](ref:crypto/HMAC)
- [`sign()`](ref:crypto/HMAC)
- [`verify()`](ref:crypto/HMAC)

## Example

```ts
import { HMAC } from "oslo/crypto";

const hs256 = new HMAC("SHA-256");

const secretKey = await hs256.generateKeyPair();
const data = new TextEncoder().encode("hello, world");

const signature = await hs256.sign(secretKey, data);

const validSignature = await hs256.verify(secretKey, signature, data);
```
