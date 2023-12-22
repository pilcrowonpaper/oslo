---
title: "CookieController"
---

# `CookieController`

Provides methods for handling cookies.

## Constructor

```ts
//$ CookieAttributes=/reference/cookie/CookieAttributes
//$ TimeSpan=/reference/cookie/TimeSpan
function constructor(
	cookieName: string,
	baseCookieAttributes: $$CookieAttributes,
	cookieOptions?: {
		expiresIn?: $$TimeSpan;
	}
): this;
```

### Parameters

- `cookieName`
- `baseCookieAttributes`: `expires` and `maxAge` will be overridden
- `cookieOptions`
  - `expiresIn`

## Methods

- [`createCookie()`](/reference/session/CookieController)
- [`createBlankCookie()`](/reference/session/CookieController)
- [`parse()`](/reference/session/CookieController)

## Properties

```ts
interface Properties {
	cookieName: string;
}
```

- `cookieName`

## Example

```ts
//$ TimeSpan=/reference/main/TimeSpan
import { SessionCookieController } from "oslo/session";
import { $$TimeSpan } from "oslo";

import type { CookieAttributes } from "oslo/cookie";

const baseSessionCookieAttributes: CookieAttributes = {
	httpOnly: true
};
const sessionCookieController = new CookieController(cookieName, baseSessionCookieAttributes, {
	expiresIn: new TimeSpan(30, "d")
});
```
