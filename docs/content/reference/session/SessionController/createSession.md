---
type: "method"
---

# `SessionController.createSession()`

Creates a new session to be stored in your database. See [`oslo/session`](/reference/session) for a full example.

## Definition

```ts
//$ Session=ref:session
function createSession(sessionId: string): $$Session;
```

### Parameters

- `sessionId`

## Example

```ts
//$ sessionController=/reference/session/SessionController
const sessionId = "x3lPE3nFfl";
const session = $$sessionController.createSession(sessionId);
```
