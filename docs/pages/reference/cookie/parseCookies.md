---
title: "parseCookies()"
---

# `parseCookies()`

Parses `Cookie` header value and returns a `Map` with the cookie names as the key. Cookie names and values are URI-component decoded.

## Definition

```ts
function parseCookies(cookieHeader: string): Map<string, string>;
```

### Parameters

- `cookieHeader`: `Cookie` HTTP header

## Example

```ts
import { parseCookies } from "oslo/cookie";

const cookies = parseCookies("message=hello");
const message = cookies.get("message");
```

Cookie names and values are URI-component decoded when parsed.

```ts
const cookies = parseCookies("json=%7B%22message%22%3A%22hello%22%7D");
const parsedJSON = JSON.parse(cookies.get("json"));
```
