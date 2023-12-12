---
title: "SessionCookieController.parseCookies()"
---

# `SessionCookieController.parseCookies()`

Parses a `Cookie` header and returns the session cookie value.

## Definition

```ts
//$ SessionCookie=/reference/session/SessionCookie
function parseCookies(header: string): string | null;
```

### Parameters

- `header`: `Cookie` header

## Example

```ts
//$ TimeSpan=/reference/main/TimeSpan
import { SessionCookieController } from "oslo/session";
import { $$TimeSpan } from "oslo";

const cookieName = "session";
const controller = new SessionCookieController(cookieName, new TimeSpan(30, "d"));

// "abc"
const sessionId = controller.parseCookies("session=abc");
```
