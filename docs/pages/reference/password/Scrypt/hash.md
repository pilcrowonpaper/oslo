---
title: "Scrypt.hash()"
---

# `Scrypt.hash()`

Hashes the provided password with scrypt. The output hash is a combination of the scrypt hash and the 32-bytes salt, in the format of `<salt>:<hash>`.

## Definition

```ts
function hash(password: string): Promise<string>;
```

### Parameters

- `password`

## Example

```ts
//$ argon2id=/reference/password/scrypt
const hash = await $$scrypt.hash(password);
```
