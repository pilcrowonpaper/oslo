---
type: "type"
---

# `SessionState`

Represents a session state.

## Definition

```ts
type SessionState = "expired" | "renewal_required" | "valid";
```

- `"expired"`: Expired
- `"renewal_required"`: Valid, but renew required
- `"valid"`: Valid
