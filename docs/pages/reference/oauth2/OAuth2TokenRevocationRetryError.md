---
title: "OAuth2TokenRevocationRetryError"
extends: "Error"
---

# `OAuth2TokenRevocationRetryError`

Error indicating that the token wasn't revoked (see [RFC 7009 section 2.2.1](https://datatracker.ietf.org/doc/html/rfc7009#section-2.2.1)).

## Definition

```ts
interface OAuth2TokenRevocationRetryError extends Error {
	retryAfter: Date | null;
}
```

### Properties

- `retryAfter`
