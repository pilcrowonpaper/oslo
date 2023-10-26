---
type: "method"
---

# `SessionController.validateSessionState()`

Validates the state of a stored session and returns `null` if the session is invalid. The session expiration may be updated in which case, the session stored in the database should be updated. See [`oslo/session`](/reference/session) for a full example.

```ts
//$ Session=ref:session
function validateSessionState(sessionId: string, expiresAt: Date): Session | null
```

- `sessionId`
- `expiresAt`: Session expiration