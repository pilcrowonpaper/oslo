---
type: "method"
---

# `SessionCookieController.createSessionCookie()`

Creates a new session cookie. Use [SessionCookieController.createBlankSessionCookie()](ref:session) to remove the cookie. See [`oslo/session`](/reference/session) for a full example.

```ts
//$ SessionCookie=ref:cookie
function createSessionCookie(sessionId: string): $$SessionCookie;
```

- `sessionId`
