---
type: "interface"
---

# `JWTPayload`

Represents a JWT payload.

## Definition

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

### Properties

- `exp`
- `iss`
- `aud`
- `jti`
- `nbf`
- `sub`
- `iat`
- `[claim]`: Custom claims
