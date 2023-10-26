---
type: "interface"
---

# `JWTPayload`

Represents a JWT payload.

```ts
interface JWT {
	exp?: number;
	iss?: string;
	aud?: string;
	jti?: string;
	nbf?: number;
	sub?: string;
	iat?: number;
	[claim: string]: unknown;
}
```

- `exp`
- `iss`
- `aud`
- `jti`
- `nbf`
- `sub`
- `iat`
- `[claim]`: Custom claims