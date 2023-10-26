---
type: "class"
---

# `ECDSA`

Helper for ECDSA.

## Constructor

```ts
//$ SHAHash=ref:crypto
function constructor(hash: $$SHAHash, curve: "P-256" | "P-384" | "P-521"): this;
```

### Parameters

- `hash`
- `curve`

## Method

- [`generateKeyPair()`](ref:crypto/ECDSA)
- [`sign()`](ref:crypto/ECDSA)
- [`verify()`](ref:crypto/ECDSA)

## Example

```ts
import { ECDSA } from "oslo/crypto";

const es256 = new ECDSA("SHA-256", "P-256");

const { publicKey, privateKey } = await es256.generateKeyPair();
const data = new TextEncoder().encode("hello, world");

const signature = await es256.sign(privateKey, data);

const validSignature = await es256.verify(publicKey, signature, data);
```
