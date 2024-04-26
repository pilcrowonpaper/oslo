---
title: "Oslo documentation"
---

# Oslo documentation

Oslo provides a bunch of auth utilities, including APIs for:

- `oslo/binary`: Utilities for byte arrays
- `oslo/cookie`: Cookie parsing and serialization
- `oslo/crypto`: Generate hashes, signatures, and random values
- `oslo/encoding`: Encode base64, base64url, base32, hex
- `oslo/jwt`: Create and verify JWTs
- `oslo/oauth2`: OAuth2 helpers
- `oslo/otp`: HOTP, TOTP
- `oslo/password`: Password hashing
- `oslo/webauthn`: Verify Web Authentication API attestations and assertions

It's lightweight, runtime agnostic, and fully typed.

## Installation

```
npm install oslo
```

This module relies on the Web Crypto API, which is not available by default in Node.js 16 and 18 (available in Node.js 20+). Make sure to polyfill them:

```ts
import { webcrypto } from "node:crypto";

globalThis.crypto = webcrypto;
```

Or alternatively, enable the flag when running Node.js:

```
node --experimental-global-webcrypto index.js
```
