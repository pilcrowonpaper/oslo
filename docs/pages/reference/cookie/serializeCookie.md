---
title: "serializeCookie()"
---

# `serializeCookie()`

Serializes cookie for `Set-Cookie` header. The cookie name and value are URI-component encoded.

## Definition

```ts
//$ CookieAttributes=/reference/cookie/CookieAttributes
function serializeCookie(name: string, value: string, attributes: $$CookieAttributes): string;
```

### Parameters

- `name`
- `value`
- `attributes`

## Example

```ts
import { serializeCookie } from "oslo/cookie";

// // message=hello; Secure; Path=/; Domain=example.com; SameSite=Lax; HttpOnly; Max-Age: 3600; Expires=Thu, 01 Jan 1970 00:00:00 GMT
const serialized = serializeCookie("message", "hello", {
	expires: new Date(),
	maxAge: 60 * 60, // 1 hour
	path: "/",
	httpOnly: true,
	secure: true,
	sameSite: "lax"
});
response.headers.set("Set-Cookie", serialized);
```

The name and value is properly encoded, so you can pass any arbitrary string:

```ts
serializeCookie("! *[~", "$(;:_");
serializeCookie(
	"json",
	JSON.stringify({
		message: "hello"
	})
);
```
