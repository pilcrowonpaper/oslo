---
type: "interface"
---

# `TokenResponseBody`

Represents the JSON-parsed success response body from the token endpoint. You can extend this interface to include properties such as `refresh_token`.

```ts
interface TokenResponseBody {
	access_token: string;
}
```

- `access_token`: The access token
