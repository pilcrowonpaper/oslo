---
type: "class"
---

# `SessionCookie`

Represents a session cookie.

## Constructor

```ts
//$ CookieAttributes=ref:cookie
function constructor(name: string, value: string, attributes?: $$CookieAttributes): this;
```

### Parameters

- `name`: Cookie name
- `value`: Session id
- `attributes`: Cookie attributes

## Methods

- [`serialize()`](ref:session/SessionCookie)

## Properties

```ts
//$ CookieAttributes=ref:cookie
interface Properties {
	name: string;
	value: string;
	attributes: $$CookieAttributes;
}
```

- `name`: Cookie name
- `value`: Session id
- `attributes`: Cookie attributes

## Example

```ts
import { SessionCookie } from "oslo/session";

const cookie = new SessionCookie(name, value);
const response = new Response();

response.headers.set("Set-Cookie", cookie.serialize());
```

If your framework provides an API for setting cookies:

```ts
import { SessionCookie } from "oslo/session";

const cookie = new SessionCookie(name, value);

setCookie(cookie.name, cookie.value, cookie.attributes);
```
