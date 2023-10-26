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

- `hash`
- `curve`

## Method

- [`generateKeyPair()`](/referece/crypto/ECDSA/generateKeyPair)
- [`sign()`](/referece/crypto/ECDSA/sign)
- [`verify()`](/referece/crypto/ECDSA/verify)

## Example

```ts
import { ECDSA } from "oslo/crypto";

const es256 = new ECDSA("SHA-256", "P-256");

const { publicKey, privateKey } = await es256.generateKeyPair();
const data = new TextEncoder().encode("hello, world");

const signature = await es256.sign(privateKey, data);

const validSignature = await es256.verify(publicKey, signature, data);
```
