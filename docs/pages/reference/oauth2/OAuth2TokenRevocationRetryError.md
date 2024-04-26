---
title: "OAuth2TokenRevocationRetryError"
extends: "Error"
---

# `OAuth2TokenRevocationRetryError`

Error indicating that the token wasn't revoked.

## Definition

```ts
interface OAuth2TokenRevocationRetryError extends Error {
	retryAfter: Date | null;
}
```

### Properties

- `retryAfter`
