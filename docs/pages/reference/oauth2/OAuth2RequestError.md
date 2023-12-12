---
title: "OAuth2RequestError"
extends: "Error"
---

# `OAuth2RequestError`

Error thrown by [`OAuth2Client.validateAuthorizationCode()`](/reference/oauth/OAuth2Client2/validateAuthorizationCode) when the token endpoint returns an error response. See [RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749#section-5.2) for a full reference on error messages.

## Definition

```ts
interface Properties extends Error {
	request: Request;
	description: string | null;
}
```

### Properties

- `message`: OAuth 2.0 error message
- `request`: The original request
- `description`: OAuth 2.0 error description
