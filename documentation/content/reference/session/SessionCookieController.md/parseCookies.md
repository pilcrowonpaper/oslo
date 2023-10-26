---
type: "method"
---

# `SessionCookieController.parseCookies()`

Parses a `Cookie` header and returns the session cookie value.

```ts
//$ SessionCookie=ref:cookie
function parseCookies(header: string | null | undefined): string | null
```

## Example

```ts
import { SessionCookieController } from "oslo/session";
import { TimeSpan } from "oslo";

const cookieName = "session"
const controller = new SessionCookieController(cookieName, new TimeSpan(30, "d"));

// "abc"
const sessionId = controller.parseCookies("session=abc")
```