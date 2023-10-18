# `oslo`

> This package is _highly_ experimental - use at your own risk

A collection of utilities for auth, including:

- [`oslo/cookie`](#oslocookie): Cookie parsing and serialization
- [`oslo/encoding`](#osloencoding): Encode base64, base64url, base32, hex
- [`oslo/oauth2`](#oslooauth2): OAuth2 helpers
  - [`oslo/oauth2/providers`](#oslooauth2providers): Built in OAuth2 providers (Apple, Github, Google)
- [`oslo/otp`](#oslootp): HOTP, TOTP
- [`oslo/password`](#oslopassword): Password hashing
- [`oslo/random`](#oslorandom): Generate cryptographically random strings and numbers
- [`oslo/token`](#oslotoken): Verification tokens (email verification, password reset, etc)
- [`oslo/request`](#oslorequest): CSRF protection
- [`oslo/session`](#oslosession): Session management
- [`oslo/webauthn`](#oslowebauthn): Verify Web Authentication API attestations and assertions

Aside from `oslo/password`, every module works in any environment, including Node.js, Cloudflare Workers, Deno, and Bun.

## Installation

```
npm i oslo
pnpm add oslo
yarn add oslo
```

## `oslo/cookie`

```ts
import { serializeCookie } from "oslo/cookie";

const cookie = serializeCookie(name, value, {
	// optional
	expires: new Date(),
	maxAge: 60 * 60,
	path: "/",
	httpOnly: true,
	secure: true,
	sameSite: "lax"
});
response.headers.set("Set-Cookie", cookie);

// names and values are URI component encoded
serializeCookie("this is fine =;", "this too =;");
```

```ts
import { parseCookieHeader } from "oslo/cookie";

const cookies = parseCookieHeader("cookie1=hello; cookie2=bye");
const cookie1 = cookies.get("cookie1"); // string | null
const entries = cookies.entries();
```

## `oslo/encoding`

```ts
import { encodeBase64, decodeBase64 } from "oslo/encoding";

const textEncoder = new TextEncoder();
const encoded = encodeBase64(textEncoder.encode("hello world"));
const decoded = decodeBase64(encoded);

import { encodeBase64url, decodeBase64url } from "oslo/encoding";
import { encodeHex, decodeHex } from "oslo/encoding";
import { encodeBase32, decodeBase32 } from "oslo/encoding";
```

## `oslo/oauth2`

```ts
import { createOAuth2AuthorizationURL } from "oslo/oauth2";

const [url, state] = await createOAuth2AuthorizationURL(
	"https://github.com/login/oauth/authorize",
	{
		clientId,
		redirectUri,
		scope: ["user:email"]
	}
);

// see also `oslo/cookie`
setCookie("github_oauth_state", state, {
	httpOnly: true,
	path: "/",
	maxAge: 60 * 60, // 1 hour
	secure: true
});

redirect(url);
```

```ts
import { createOAuth2AuthorizationURLWithPKCE } from "oslo/oauth2";

const [url, codeVerifier, state] = await createOAuth2AuthorizationURLWithPKCE();

// store `codeVerifier` as cookie
```

```ts
import {
	verifyState,
	validateOAuth2AuthorizationCode,
	AccessTokenRequestError
} from "oslo/oauth2";

const storedState = getCookie("github_oauth_state");
const state = url.searchParams.get("state");
if (!verifyState(storedState, state)) {
	// error
}
const code = url.searchParams.get("code");
if (!code) {
	// error
}

try {
	const { accessToken, refreshToken } = await validateOAuth2AuthorizationCode<{
		refreshToken: string;
	}>(code, {
		tokenEndpoint: "https://github.com/login/oauth/access_token",
		clientId: this.config.clientId,
		clientPassword: {
			clientSecret: this.config.clientSecret,
			authenticateWith: "client_secret"
		}
	});
} catch (e) {
	if (e instanceof AccessTokenRequestError) {
		// see https://www.rfc-editor.org/rfc/rfc6749#section-5.2
		const { request, message, description } = e;
	}
	// unknown error
}
```

### `oslo/oauth2/providers`

```ts
import { Github, Apple, Google } from "oslo/oauth2/providers";

const github = new Github({
	clientId,
	clientSecret,
	scope: ["user:email"]
});

// wrapper around `createOAuth2AuthorizationURL()`
const [url, state] = await github.createAuthorizationURL();

// wrapper around `validateOAuth2AuthorizationCode()`
const tokens = await github.validateOAuth2AuthorizationCode(code);
```

## `oslo/oidc`

```ts
import { parseIdToken } from "oslo/oidc";

const { sub, exp, email } = parseIdToken<{ email: string }>(idToken);
```

## `oslo/otp`

```ts
import { generateHOTP } from "oslo/otp";

const secret = new Uint8Array(20);
crypto.getRandomValues(secret);

let counter = 0;

const otp = await generateHOTP(secret, counter); // default 6 digits
const otp = await generateHOTP(secret, counter, 8); // 8 digits (max)
```

```ts
import { TOTPController } from "oslo/otp";
import { TimeSpan } from "oslo";

const totpController = new TOTPController({
	// optional
	period: new TimeSpan(30, "s"), // default: 30s
	digits: 6 // default: 6
});

const secret = new Uint8Array(20);
crypto.getRandomValues(secret);

const otp = await totpController.generate(secret);
const validOTP = await totpController.verify(otp, secret);
```

```ts
import { createKeyURI } from "oslo/otp";

const secret = new Uint8Array(20);
crypto.getRandomValues(secret);

const uri = createKeyURI({
	type: "totp",
	secret,
	issuer: "My website",
	accountName: "user@example.com",
	//optional
	period: new TimeSpan(30, "s"), // default: 30s
	algorithm: "SHA-1", // ignored by google authenticator
	digits: 6 // default: 6
});
const uri = createKeyURI({
	type: "hotp",
	secret,
	issuer: "My website",
	accountName: "user@example.com",
	//optional
	counter, //default: 0
	digits: 6 // default: 6
});

const qr = createQRCode(uri); // example
```

## `oslo/password`

Hash passwords with argon2id, scrypt, and bcrypt using the fastest package available for Node.js.

```ts
import { Argon2id, Scrypt, Bcrypt } from "oslo/password";

// `Scrypt` and `Bcrypt` implement the same methods
const argon2id = new Argon2id(options);
const hash = await argon2id.hash(password);
const matches = await argon2id.verify(hash, password);
```

This specific module only works in Node.js. See these packages for other runtimes:

- [`hash-wasm`](https://github.com/Daninet/hash-wasm): Pure WASM implementation
- [`argon2`](https://deno.land/x/argon2@v0.9.2): Rust-based Deno package

## `oslo/random`

All functions are cryptographically secure.

```ts
import { generateRandomString, alphabet } from "oslo/random";

const id = generateRandomString(16, alphabet("0-9", "a-z", "A-Z")); // alphanumeric
const id = generateRandomString(16, alphabet("0-9", "a-z")); // alphanumeric (lowercase)
const id = generateRandomString(16, alphabet("0-9")); // numbers only
const id = generateRandomString(16, alphabet("0-9", "a-z", "A-Z", "-", "-")); // alphanumeric with `_` and`-`
```

```ts
import { random } from "oslo/random";

const num = random(); // cryptographically secure alternative to `Math.random()`
```

```ts
import { generateRandomNumber } from "oslo/random";

// random integer between 0 (inclusive) and 10 (exclusive)
const num = generateRandomNumber(0, 10);
```

## `oslo/request`

CSRF protection.

```ts
import { verifyRequestOrigin } from "oslo/request";

// only allow same-origin requests
const validRequestOrigin = verifyRequestOrigin(request.headers.get("Origin"), {
	host: request.headers.get("Host")
});
const validRequestOrigin = verifyRequestOrigin(request.headers.get("Origin"), {
	host: request.url
});

if (!validRequestOrigin) {
	// invalid request origin
	return new Response(null, {
		status: 400
	});
}
```

```ts
// true
verifyRequestOrigin("https://example.com", {
	host: "example.com"
});

// true
verifyRequestOrigin("https://foo.example.com", {
	host: "bar.example.com",
	allowedSubdomains: "*" // wild card to allow any subdomains
});

// true
verifyRequestOrigin("https://foo.example.com", {
	host: "bar.example.com",
	allowedSubdomains: ["foo"]
});

// true
verifyRequestOrigin("https://example.com", {
	host: "foo.example.com",
	allowedSubdomains: [null] // `null` to only allow base domain
});
```

## `oslo/session`

```ts
import { SessionController } from "oslo/session";
import { generateRandomString, alphabet } from "oslo/random";
import { TimeSpan } from "oslo";

import type { Session } from "oslo/session";

// implements sliding window expiration
// expires in 30 days unless used within 15 days before expiration (1/2 of expiration)
// in which case the expiration gets pushed back another 30 days
const sessionController = new SessionController(new TimeSpan(30, "d"));

async function validateSession(sessionId: string): Promise<Session | null> {
	const databaseSession = await db.getSession(sessionId);
	if (!databaseSession) {
		return null;
	}
	const session = sessionController.validateSessionState(
		sessionId,
		databaseSession.expires
	);
	if (!session) {
		await db.deleteSession(sessionId);
		return null;
	}
	if (session.fresh) {
		// session expiration was extended
		await db.updateSession(session.sessionId, {
			expires: session.expiresAt
		});
	}
	return session;
}

async function createSession(): Promise<Session> {
	const sessionId = generateRandomString(41, alphabet("a-z", "A-Z", "0-9"));
	const session = sessionController.createSession(sessionId);
	await db.insertSession({
		// you can store any data you want :D
		id: session.sessionId,
		expires: session.expiresAt
	});
	return session;
}

const sessionCookieController = sessionController.sessionCookieController({
	name: "session",
	secure: prod,
	secret
});
```

```ts
const session = await createSession();
// store session
const cookie = sessionCookieController.createSessionCookie(session.sessionId);
```

```ts
// get cookie
const sessionId = sessionCookieController.parseCookieHeader(
	headers.get("Cookie")
);
const sessionId = cookies.get(sessionCookieController.cookieName);

if (!sessionId) {
	// 401
}
const session = await validateSession(sessionId);
if (session.fresh) {
	// session expiration was extended
	const cookie = sessionCookieController.createSessionCookie(session.sessionId);
	// set cookie again
}
```

```ts
// delete session by overriding the current one
const cookie = sessionCookieController.createBlankSessionCookie();
```

## `oslo/token`

For email verification tokens and password reset tokens.

```ts
import { VerificationTokenController } from "oslo/token";
import { isWithinExpirationDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/random";

import type { Token } from "oslo/token";

// expires in 2 hours
const verificationTokenController = new VerificationTokenController(
	new TimeSpan(2, "h")
);

async function generatePasswordResetToken(userId: string): Promise<Token> {
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
		// get token from db
		const storedToken = await trx
			.table("password_reset_token")
			.where("id", "=", token)
			.get();
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

## `oslo/webauthn`

`validateWebAuthnAttestationResponse()` does not validate attestation certificates.

```ts
import { validateWebAuthnAttestationResponse } from "oslo/webauthn";

import type { WebAuthnAttestationResponse } from "oslo/webauthn";

try {
	const response: WebAuthnAttestationResponse = {
		// all `ArrayBufferLike` type (`Uint8Array`, `ArrayBuffer` etc)
		clientDataJSON,
		authenticatorData
	};
	await validateWebAuthnAttestationResponse(response, {
		challenge, //  `ArrayBufferLike`
		origin: "http://localhost:3000" // website origin
	});
} catch {
	// failed to validate attestation response
}
```

`validateWebAuthnAssertionResponse()` currently only supports ECDSA using secp256k1 curve and SHA-256 (algorithm ID `-7`).

```ts
import { validateWebAuthnAssertionResponse } from "oslo/webauthn";

import type { WebAuthnAssertionResponse } from "oslo/webauthn";

try {
	const response: WebAuthnAssertionResponse = {
		// all `ArrayBufferLike` type (`Uint8Array`, `ArrayBuffer` etc)
		clientDataJSON,
		authenticatorData,
		signature
	};
	await validateWebAuthnAssertionResponse(response, {
		algorithm: "ES256K",
		challenge, // `ArrayBufferLike`
		publicKey, // `ArrayBufferLike`
		origin: "http://localhost:3000" // website origin
	});
} catch {
	// failed to validate assertion response
}
```
