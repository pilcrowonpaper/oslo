---
title: "Oslo documentation"
---

# Oslo documentation

Oslo provides a bunch of auth utilities, including APIs for:

- Managing sessions
- Creating JWTs
- Handling OAuth 2.0
- Hashing passwords
- Generating cryptographically strong random values
- Signing data
- Verifying WebAuthn responses
- Encoding data
- Lightweight, runtime agnostic, fully typed.

## Installation

```
npm install oslo
```

This module relies on the Web Crypto API, which is not available by default in Node.js 16 and 18. Make sure to polyfill them:

```ts
import { webcrypto } from "node:crypto";

globalThis.crypto = webcrypto;
```

Or alternatively, enable the flag when running Node.js:

```
node --experimental-global-webcrypto index.js
```
