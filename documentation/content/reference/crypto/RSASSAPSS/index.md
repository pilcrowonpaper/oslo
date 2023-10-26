---
type: "class"
---

# `RSASSAPSS`

Helper for RSASSA-PSS.

## Constructor

```ts
//$ SHAHash=ref:crypto
function constructor(hash: $$SHAHash): this;
```

- `hash`

## Method

- [`generateKeyPair()`](/referece/crypto/RSASSAPSS/generateKeyPair)
- [`sign()`](/referece/crypto/RSASSAPSS/sign)
- [`verify()`](/referece/crypto/RSASSAPSS/verify)

## Example

```ts
import { RSASSAPSS } from "oslo/crypto";

const ps256 = new RSASSAPSS("SHA-256");

const { publicKey, privateKey } = await ps256.generateKeyPair();
const data = new TextEncoder().encode("hello, world");

const signature = await ps256.sign(privateKey, data);

const validSignature = await ps256.verify(publicKey, signature, data);
```
