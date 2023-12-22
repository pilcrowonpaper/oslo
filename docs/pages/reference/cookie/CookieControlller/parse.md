---
title: "CookieController.parse()"
---

# `CookieController.parse()`

Parses a `Cookie` header and returns the session cookie value.

## Definition

```ts
function parse(header: string): string | null;
```

### Parameters

- `header`: `Cookie` header

## Example

```ts
//$ TimeSpan=/reference/main/TimeSpan
import { $$TimeSpan } from "oslo";

const cookieName = "session";
const controller = new CookieController("session", {});

// "abc"
const sessionId = controller.parseCookies("session=abc");
```
