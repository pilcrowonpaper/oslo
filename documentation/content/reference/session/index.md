## Example

```ts
import { SessionController } from "oslo/session";
import { TimeSpan } from "oslo";

const sessionController = new SessionController(new TimeSpan(30, "d"));
const sessionCookieController = sessionController.sessionCookieController("session");
```

### Create a session

```ts
const session = sessionController.createSession(userId);

await db.storeSession({
	id: session.sessionId,
	expires: session.expiresAt,
	user_id: userId
});

const cookie = sessionCookieController.createSessionCookie(session.sessionId);
```

### Validate a session

```ts
const sessionCookie: string;

const storedSession = await db.getSession(sessionCookie);
if (storedSession) {
	throw new Error("Invalid session");
}

const sessionState = sessionController.validateSessionState(
	storedSession.id,
	storedSession.expires
);
// check if session expiration was updated
if (sessionState.fresh) {
	await db.updateSession(sessionState.sessionId, {});
}
```
