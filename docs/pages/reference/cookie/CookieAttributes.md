---
title: "CookieAttributes"
---

# `CookieAttributes`

Cookie attributes for `Set-Cookie` header.

## Definition

```ts
interface CookieAttributes {
	secure?: boolean;
	path?: string;
	domain?: string;
	sameSite?: "lax" | "strict" | "none";
	httpOnly?: boolean;
	maxAge?: number;
	expires?: Date;
}
```

### Properties

- `secure`
- `path`
- `domain`
- `sameSite`
- `httpOnly`
- `maxAge`: `Max-Age` (seconds)
- `expires`

## Example

```ts
// Secure; Path=/; Domain=example.com; SameSite=Lax; HttpOnly; Max-Age: 3600; Expires=Thu, 01 Jan 1970 00:00:00 GMT
const attributes: CookieAttributes = {
	secure: true,
	path: "/",
	domain: "example.com",
	sameSite: "lax",
	httpOnly: true,
	maxAge: 60 * 60,
	expires: new Date()
};
```
