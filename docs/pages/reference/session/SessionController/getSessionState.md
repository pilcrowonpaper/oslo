---
title: "SessionController.getSessionState()"
---

# `SessionController.getSessionState()`

Validates the state of a stored session and returns a [`SessionState`](/reference/session/SessionState) See [`oslo/session`](/reference/session) for a full example.

## Definition

```ts
//$ SessionState=/reference/session/SessionState
function getSessionState(expiresAt: Date): $$SessionState;
```

### Parameters

- `expiresAt`: Session expiration

## Example

```ts
//$ sessionController=/reference/session/SessionController
const sessionId = "x3lPE3nFfl";
const sessionState = $$sessionController.getSessionState(new Date(unix));
if (sessionState === "valid") {
	// valid session
} else if (sessionState === "idle") {
	// valid but renewal required
} else {
	// invalid session
}
```
