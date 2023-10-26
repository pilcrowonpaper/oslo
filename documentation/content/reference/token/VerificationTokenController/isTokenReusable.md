---
type: "method"
---

# `VerificationTokenController.isTokenReusable()`

Checks if a token stored in a database can be reused. This is useful for tokens for email verification as you can re-use and send an unused token stored in the database instead of creating a new token. See [VerificationTokenController]() for a full example.

## Definition

```ts
//$ VerificationToken=ref:token
function isTokenReusable(expiresAt: Date): $$VerificationToken;
```

### Parameters

- `expiresAt`
