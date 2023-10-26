---
type: "interface"
---

# `VerificationToken`

Represents a verification token for email verification and password reset.

```ts
interface VerificationToken {
	value: string;
	expiresAt: Date;
	userId: string;
}
```

- `value`
- `expiresAt`
- `userId`
