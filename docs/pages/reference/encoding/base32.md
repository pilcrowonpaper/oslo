---
title: "base32"
---

# `base32`

Implements Base 32 based on [RFC 4648 §6](https://datatracker.ietf.org/doc/html/rfc4648#section-6) with [`Base32Encoding`](/reference/encoding/Base32Encoding).

```ts
import { base32 } from "oslo/encoding";

const encoded = base32.encode(message);
const decoded = base32.decode(encoded);
```
