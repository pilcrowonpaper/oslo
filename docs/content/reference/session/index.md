---
type: "module"
---

# `oslo/session`

This module provides utilities for creating and validating sessions, as well as reading and setting session cookies. It is intended to be be used alongside your database, and Oslo only handles the validation of stored data. Oslo implements a [sliding window expiration](/reference/session/SessionController) instead of absolute expiration for sessions.

## Classes

- [`SessionController`](ref:session)
- [`SessionCookie`](ref:session)
- [`SessionCookieController`](ref:session)

## Interfaces

- [`Session`](ref:session)

## Example

```ts
//$ SessionController=ref:session
//$ SessionCookieController=ref:session
//$ TimeSpan=ref:main
import { $$SessionController, $$SessionCookieController } from "oslo/session";
import { $$TimeSpan } from "oslo";

const sessionController = new SessionController(new TimeSpan(30, "d"));
const sessionCookieController = new SessionCookieController(
	"session",
	sessionController.expiresIn,
	{
		secure: false // set to false for developing in localhost
	}
);
```

### Create a session

[`SessionController.createExpirationDate()`](ref:session) creates a new expiration date that should be stored in your database alongside the session ID. [`SessionCookieController.createSessionCookie()`](ref:session) can then be used to set session cookies.

```ts
import { generateRandomString, alphabet } from "oslo/random";

const sessionId = generateRandomString(15, alphabet("a-z", "0-9"));
const expirationDate = sessionController.createExpirationDate();

await db.storeSession({
	id: session.sessionId,
	expires: expirationDate,
	user_id: userId
});

const cookie = sessionCookieController.createSessionCookie(session.sessionId);

response.headers.set("Set-Cookie", cookie.serialize());
```

### Validate a session

You can get the session cookie from the `Cookie` header with [`SessionCookieController.parseCookies()`](ref:session). You should get the stored session, and if it exists, validate the state with [`SessionController.getSessionState()`](ref:session). This returns:

- `"expired"` if expired
- `"active"` if valid
- `"idle"` if the session expiration needs to be renewed

If the session needs to be renewed, the session expiration needs to be extended and the database updated. You can get the new expiration date with `SessionController.createExpirationDate()`.

```ts
const sessionCookie = sessionCookieController.parseCookies(request.headers.get("Cookie"));

if (!sessionCookie) {
	throw new Error("Invalid session");
}

const storedSession = await db.getSession(sessionCookie);
if (storedSession) {
	throw new Error("Invalid session");
}

const sessionState = sessionController.validateSessionState(storedSession.expires);
if (sessionState === "expired") {
	// see next section on invalidating session
	await db.deleteSession(storedSession.id);
	const blankCookie = sessionCookieController.createBlankSessionCookie();
	response.headers.set("Set-Cookie", blankCookie.serialize());
	throw new Error("Invalid session");
}

// check if session expiration was updated
if (sessionState === "idle") {
	await db.updateSession(storedSession.id, {
		expires: sessionCookieController.createExpirationDate()
	});
	const updatedCookie = sessionCookieController.createSessionCookie(storedSession.id);
	response.headers.set("Set-Cookie", updatedCookie.serialize());
}

// valid session
```

If you cannot set cookies on every request (due to framework constraints), set `expires` option to `false` when initializing `SessionCookieController`. This will create cookies with long expiration time (2 years).

```ts
const sessionCookieController = new SessionCookieController(
	"session",
	sessionController.expiresIn,
	{
		expires: false
	}
);
```

### Invalidate a session

To invalidate a session, for example on sign out, delete the session from the database and delete the session cookie by creating a new session with [`SessionCookieController.createBlankSessionCookie()`](ref:session).

```ts
await db.deleteSession(sessionId);
const blankCookie = sessionCookieController.createBlankSessionCookie();
response.headers.set("Set-Cookie", blankCookie.serialize());
throw new Error("Invalid session");
```
