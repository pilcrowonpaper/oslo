---
type: "interface"
---

# `VerificationToken`

Represents a verification token for email verification and password reset.

## Definition

```ts
interface VerificationToken {
	value: string;
	expiresAt: Date;
	userId: string;
}
```

### Properties

- `value`
- `expiresAt`
- `userId`
