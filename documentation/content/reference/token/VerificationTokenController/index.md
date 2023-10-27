---
type: "class"
---

# `VerificationTokenController`

Provides methods for handling verification tokens fo password reset and email verification. This is intended to be used alongside your database.

## Constructor

```ts
function constructor(expiresIn: TimeSpan): this;
```

### Parameters

- `expiresIn`

## Methods

- [`createToken()`](ref:token/VerificationTokenController)
- [`isTokenReusable()`](ref:token/VerificationTokenController)

## Example

```ts
import { VerificationTokenController } from "oslo/token";
import { isWithinExpirationDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/random";

import type { VerificationToken } from "oslo/token";

// tokens expire in 2 hours
const verificationTokenController = new VerificationTokenController(new TimeSpan(2, "h"));

async function generatePasswordResetToken(userId: string): Promise<VerificationToken> {
	// check if an unused token already exists
	const storedUserTokens = await db
		.table("password_reset_token")
		.where("user_id", "=", userId)
		.getAll();
	if (storedUserTokens.length > 0) {
		// if exists, check the expiration
		const reusableStoredToken = storedUserTokens.find((token) => {
			// returns true if there's 1 hour left (1/2 of 2 hours)
			return verificationTokenController.isTokenReusable(token.expires);
		});
		// reuse token if it exists
		if (reusableStoredToken) return reusableStoredToken.id;
	}
	// generate a new token and store it
	const token = verificationTokenController.createToken(
		generateRandomString(63, alphabet("a-z", "0-9")),
		userId
	);
	await db
		.insertInto("password_reset_token")
		.values({
			id: token.value,
			expires: token.expiresAt,
			user_id: token.userId
		})
		.executeTakeFirst();
	return token;
}

async function validatePasswordResetToken(token: string): Promise<string> {
	const storedToken = await db.transaction().execute(async (trx) => {
        // run transaction
		// get token from db
		const storedToken = await trx.table("password_reset_token").where("id", "=", token).get();
		if (!storedToken) return null;
		await trx.table("password_reset_token").where("id", "=", token).delete();
		return storedToken;
	});
	if (!storedToken) throw new Error("Invalid token");
	// check for expiration
	if (!isWithinExpirationDate(storedToken.expires)) {
		throw new Error("Expired token");
	}
	// return owner
	return storedToken.user_id;
}
```

```ts
const token = await generatePasswordResetToken(session.userId);
// send password reset email with link (page with form for inputting new password)
await sendEmail(`http://localhost:3000/reset-password/${token.value}`);
```
