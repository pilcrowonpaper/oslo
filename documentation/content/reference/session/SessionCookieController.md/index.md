---
type: "class"
---

# `SessionCookieController`

Provides methods for handling session cookies. We recommend initializing this with [SessionController.sessionCookieController](ref:session). By default, session cookies have a `Secure` flag. This should be disabled when developing locally.

## Constructor

```ts
function constructor(
	cookieName: string,
	sessionExpiresIn: TimeSpan,
	options?: {
		expires?: boolean;
		secure?: boolean;
		path?: string;
		domain?: string;
		sameSite?: "lax" | "strict";
	}
): this;
```

- `cookieName`
- `sessionExpiresIn`
- `options`
  - `expires` (default: `false`): Set to `true` to set cookies expiration to indefinite
  - `secure` (default: `true`): `Secure` cookie attribute
  - `path` (default: `/`): `Path` cookie attribute
  - `domain`: `Domain` cookie attribute
  - `sameSite` (default: `"lax"`): `SameSite` cookie attribute

## Methods

- [SessionCookieController.createBlankSessionCookie()](ref:session)
- [SessionCookieController.createSessionCookie()](ref:session)
- [SessionCookieController.parseCookies()](ref:session)

## Example

```ts
import { SessionCookieController } from "oslo/session";
import { TimeSpan } from "oslo";

const controller = new SessionCookieController(cookieName, new TimeSpan(30, "d"), {
	secure: false // for localhost
});
```
