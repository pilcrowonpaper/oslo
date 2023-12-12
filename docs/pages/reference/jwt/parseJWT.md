---
title: "parseJWT()"
---

# `parseJWT()`

Parses a JWT string. **This does NOT validate the JWT signature and claims** including expiration. Use [`validateJWT()`](/reference/jwt/validateJWT) instead.

## Definition

```ts
//$ JWT=/reference/jwt/JWT
function parseJWT(jwt: string): $$JWT | null;
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
