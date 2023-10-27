---
type: "method"
---

# `SessionCookieController.createSessionCookie()`

Creates a new session cookie. Use [`SessionCookieController.createBlankSessionCookie()`](ref:session) to remove the cookie. See [`oslo/session`](/reference/session) for a full example.

## Definition

```ts
//$ SessionCookie=ref:session
function createSessionCookie(sessionId: string): $$SessionCookie;
```

### Parameters

- `sessionId`
