---
title: "Bcrypt.verify()"
---

# `Bcrypt.verify()`

Verifies the password with the hash using bcrypt.

## Definition

```ts
function verify(hash: string, password: string): Promise<boolean>;
```

### Parameters

- `hash`
- `password`

## Example

```ts
//$ bcrypt=/reference/password/Bcrypt
const validPassword = await $$bcrypt.verify(hash, password);
```
