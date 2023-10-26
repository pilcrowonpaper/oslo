---
type: "interface"
---

# `JWTHeader`

Represents a JWT header.

## Definition

```ts
//$ JWTAlgorithm=ref:jwt
interface JWT {
	typ: "JWT";
	alg: $$JWTAlgorithm;
	[claim: string]: unknown;
}
```

### Properties

- `type`
- `alg`: Algorithm used
- `[claim]`: Custom claims
