---
type: "interface"
---

# `Session`

Represents a session.

```ts
interface Session {
	sessionId: string;
	expiresAt: Date;
	fresh: boolean;
}
```

- `sessionId`
- `expiresAt`
- `fresh`: `true` if the session was newly created or updated, and the session stored in the database should be updated
