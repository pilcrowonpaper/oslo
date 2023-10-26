---
type: "function"
---

# `createJWT()`

Creates a new JWT. Supports the following algorithms:

- HMAC: `HS256`, `HS384`, `HS512`
- ECDSA: `ES256`, `ES384`, `ES512`
- RSASSA-PKCS1-v1_5: `RS256`, `RS384`, `RS512`
- RSASSA-PSS: `PS256`, `PS384`, `PS512`

Claims are not included by default and must by defined with `options`.

```ts
//$ JWTAlgorithm:jwt
//$ TimeSpan:main
//$ JWT:jwt
function createJWT(
	algorithm: $$JWTAlgorithm,
	key: ArrayBuffer,
	payload: Record<any, any>,
	options?: {
		headers?: Record<any, any>;
		expiresIn?: $$TimeSpan;
		issuer?: string;
		subject?: string;
		audience?: string;
		notBefore?: Date;
		includeIssuedTimestamp?: boolean;
		jwtId?: string;
	}
): Promise<$$JWT>;
```

- `algorithm`
- `key`: Secret key for HMAC, and private key for ECDSA and RSA
- `payload`
- `options`:
  - `headers`: Custom headers
  - `expiresIn`: How long the JWT is valid for (for `exp` claim)
  - `issuer`: `iss` claim
  - `subject`: `sub` claim
  - `audience`: `aud` claim
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

// supports HMAC, ECDSA, RSASSA-PKCS1-v1_5, RSASSA-PSS
const jwt = await createJWT("HS256", secret, payload, {
	// optional
	headers: {
		// custom headers
		kid
	},
	expiresIn: new TimeSpan("30", d),
	issuer,
	subject,
	audience,
	includeIssuedTimestamp: true,
});
```
