---
type: "method"
---

# `SessionCookie.serialize()`

Serializes cookie for `Set-Cookie` header.

```ts
function serialize(): string;
```

## Example

```ts
//$ sessionCookie=/reference/session/SessionCookie
response.headers.set("Set-Cookie", $$sessionCookie.serialize());
```
