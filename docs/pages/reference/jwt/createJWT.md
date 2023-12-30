---
title: "createJWT()"
---

# `createJWT()`

Creates a new JWT. Claims are not included by default and must by defined with `options`.

## Definition

```ts
//$ JWTAlgorithm=/reference/jwt/JWTAlgorithm
//$ TimeSpan=/reference/main/TimeSpan
function createJWT(
	algorithm: $$JWTAlgorithm,
	key: ArrayBuffer | TypedArray,
	payloadClaims: Record<any, any>,
	options?: {
		headers?: Record<any, any>;
		expiresIn?: $$TimeSpan;
		issuer?: string;
		subject?: string;
		audiences?: string[];
		notBefore?: Date;
		includeIssuedTimestamp?: boolean;
		jwtId?: string;
	}
): Promise<string>;
```

### Parameters

- `algorithm`
- `key`: Secret key for HMAC, and private key for ECDSA and RSA
- `payloadClaims`
- `options`:
  - `headers`: Custom headers
  - `expiresIn`: How long the JWT is valid for (for `exp` claim)
  - `issuer`: `iss` claim
  - `subject`: `sub` claim
  - `audiences`: `aud` claims
  - `notBefore`: `nbf` claim
  - `includeIssuedTimestamp` (default: `false`): Set to `true` to include `iat` claim
  - `jwtId`: `jti` claim

## Example

```ts
import { HMAC } from "oslo/crypto";
import { createJWT, validateJWT, parseJWT } from "oslo/jwt";
import { TimeSpan } from "oslo";

const secret = await new HMAC("SHA-256").generateKey();

const payload = {
	message: "hello, world"
};

const jwt = await createJWT("HS256", secret, payload, {
	headers: {
		kid
	},
	expiresIn: new TimeSpan(30, "d"),
	issuer,
	subject,
	audiences,
	includeIssuedTimestamp: true
});
```
