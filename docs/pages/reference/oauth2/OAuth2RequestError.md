---
title: "OAuth2RequestError"
extends: "Error"
---

# `OAuth2RequestError`

Thrown when the endpoint returns the error response as defined in [RFC 6749 section 5.2](https://datatracker.ietf.org/doc/html/rfc6749#section-5.2).

## Definition

```ts
interface OAuth2RequestError extends Error {
	request: Request;
	description: string | null;
}
```

### Properties

- `message`: OAuth 2.0 error message
- `request`: The original request
- `description`: OAuth 2.0 error description
