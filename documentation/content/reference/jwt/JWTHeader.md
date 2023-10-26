---
type: "interface"
---

# `JWTHeader`

Represents a JWT header.

```ts
//$ JWTAlgorithm:jwt
interface JWT {
	typ: "JWT";
	alg: $$JWTAlgorithm;
	[claim: string]: unknown;
}
```

- `type`
- `alg`: Algorithm used
- `[claim]`: Custom claims