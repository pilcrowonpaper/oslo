---
type: "function"
---

# `parseJWT()`

Parses a JWT string. **This does NOT validate the JWT signature and claims** including expiration. Use [validateJWT](ref:jwt) instead.

## Definition

```ts
//$ JWT=ref:jwt
function parseJWT(jwt: string): Promise<$$JWT | null>;
```

### Parameters

- `jwt`: JWT string

## Example

```ts
import { parseJWT } from "oslo/jwt";

const jwt = parseJWT(
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXNzYWdlIjoiaGVsbG8ifQ.yP03DaEblJkk9mR-Y5L7YCMzJgHL-RDPx90aXz-cuAI"
);
const message = jwt.payload.message;
```
