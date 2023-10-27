---
type: "interface"
---

# `Session`

Represents a session.

## Definition

```ts
interface Session {
	sessionId: string;
	expiresAt: Date;
	fresh: boolean;
}
```

### Properties

- `sessionId`
- `expiresAt`
- `fresh`: `true` if the session was newly created or updated, and the session stored in the database should be updated
