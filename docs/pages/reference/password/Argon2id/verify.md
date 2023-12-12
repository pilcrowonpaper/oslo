---
title: "Argon2id.verify()"
---

# `Argon2id.verify()`

Verifies the password with the hash using argon2id.

## Definition

```ts
function verify(hash: string, password: string): Promise<boolean>;
```

### Parameters

- `hash`
- `password`

## Example

```ts
//$ argon2id=/reference/password/Argon2id
const validPassword = await $$argon2id.verify(hash, password);
```
