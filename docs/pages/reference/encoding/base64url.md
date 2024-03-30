---
title: "base64url"
---

# `base64url`

Implements Base 64 URL encoding based on [RFC 4648 §5](https://datatracker.ietf.org/doc/html/rfc4648#section-5) with [`Base64Encoding`](/reference/encoding/Base64Encoding). Includes padding by default.

```ts
import { base64url } from "oslo/encoding";

const encoded = base64url.encode(message);
const decoded = base64url.decode(encoded);
```
