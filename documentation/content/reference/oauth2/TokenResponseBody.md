---
type: "interface"
---

# `TokenResponseBody`

Represents the JSON-parsed success response body from the token endpoint. You can extend this interface to include properties such as `refresh_token`.

## Definition

```ts
interface TokenResponseBody {
	access_token: string;
}
```

### Properties

- `access_token`: The access token
