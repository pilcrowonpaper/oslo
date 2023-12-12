---
title: "Bcrypt.hash()"
---

# `Bcrypt.hash()`

Hashes the provided password with bcrypt.

## Definition

```ts
function hash(password: string): Promise<string>;
```

### Parameters

- `password`

## Example

```ts
//$ bcrypt=/reference/password/Bcrypt
const hash = await $$bcrypt.hash(password);
```
