import { sha256 } from "../crypto/index.js";
import { base64, base64url } from "../encoding/index.js";
import { TimeSpan, addToDate } from "../index.js";

export class OAuth2Client {
	public clientId: string;

	public authorizeEndpoint: string;
	public tokenEndpoint: string;

	private redirectURI: string | null;
	private authenticateWith: "http_basic_auth" | "request_body" = "http_basic_auth";

	constructor(
		clientId: string,
		authorizeEndpoint: string,
		tokenEndpoint: string,
		options?: {
			redirectURI?: string;
			authenticateWith?: "http_basic_auth" | "request_body";
		}
	) {
		this.clientId = clientId;
		this.authorizeEndpoint = authorizeEndpoint;
		this.tokenEndpoint = tokenEndpoint;
		this.redirectURI = options?.redirectURI ?? null;
		if (options?.authenticateWith !== undefined) {
			this.authenticateWith = options?.authenticateWith;
		}
	}

	public createAuthorizationURL(options?: {
		state?: string;
		codeVerifier?: string;
		codeChallengeMethod?: "S256" | "plain";
		scopes?: string[];
	}): URL {
		const scopes = Array.from(new Set(options?.scopes ?? [])); // remove duplicates
		const authorizationUrl = new URL(this.authorizeEndpoint);
		authorizationUrl.searchParams.set("response_type", "code");
		authorizationUrl.searchParams.set("client_id", this.clientId);
		if (options?.state !== undefined) {
			authorizationUrl.searchParams.set("state", options.state);
		}
		if (scopes.length > 0) {
			authorizationUrl.searchParams.set("scope", scopes.join(" "));
		}
		if (this.redirectURI !== null) {
			authorizationUrl.searchParams.set("redirect_uri", this.redirectURI);
		}
		if (options?.codeVerifier !== undefined) {
			const codeChallengeMethod = options?.codeChallengeMethod ?? "S256";
			if (codeChallengeMethod === "S256") {
				const codeChallengeBuffer = sha256(new TextEncoder().encode(options.codeVerifier));
				const codeChallenge = base64url.encode(codeChallengeBuffer, {
					includePadding: false
				});
				authorizationUrl.searchParams.set("code_challenge", codeChallenge);
				authorizationUrl.searchParams.set("code_challenge_method", "S256");
			} else if (codeChallengeMethod === "plain") {
				authorizationUrl.searchParams.set("code_challenge", options.codeVerifier);
				authorizationUrl.searchParams.set("code_challenge_method", "plain");
			} else {
				throw new TypeError(`Invalid value for 'codeChallengeMethod': ${codeChallengeMethod}`);
			}
		}
		return authorizationUrl;
	}

	public async validateAuthorizationCode<_TokenResponseBody extends TokenResponseBody>(
		authorizationCode: string,
		options?: {
			codeVerifier?: string;
			credentials?: string;
		}
	): Promise<_TokenResponseBody> {
		const body = new URLSearchParams();
		body.set("code", authorizationCode);
		body.set("client_id", this.clientId);
		body.set("grant_type", "authorization_code");

		if (this.redirectURI !== null) {
			body.set("redirect_uri", this.redirectURI);
		}
		if (options?.codeVerifier !== undefined) {
			body.set("code_verifier", options.codeVerifier);
		}
		return await this.sendTokenRequest<_TokenResponseBody>(body, options);
	}

	public async refreshAccessToken<_TokenResponseBody extends TokenResponseBody>(
		refreshToken: string,
		options?: {
			credentials?: string;
			scopes?: string[];
		}
	): Promise<_TokenResponseBody> {
		const body = new URLSearchParams();
		body.set("refresh_token", refreshToken);
		body.set("client_id", this.clientId);
		body.set("grant_type", "refresh_token");

		const scopes = options?.scopes ?? [];
		if (scopes.length > 0) {
			body.set("scope", scopes.join(" "));
		}

		return await this.sendTokenRequest<_TokenResponseBody>(body, options);
	}

	private async sendTokenRequest<_TokenResponseBody extends TokenResponseBody>(
		body: URLSearchParams,
		options?: {
			credentials?: string;
		}
	): Promise<_TokenResponseBody> {
		const headers = new Headers();
		headers.set("Content-Type", "application/x-www-form-urlencoded");
		headers.set("Accept", "application/json");
		headers.set("User-Agent", "oslo");

		if (options?.credentials !== undefined) {
			const encodedCredentials = base64.encode(
				new TextEncoder().encode(`${this.clientId}:${options.credentials}`)
			);
			headers.set("Authorization", `Basic ${encodedCredentials}`);
			if (this.authenticateWith === "http_basic_auth") {
				const encodedCredentials = base64.encode(
					new TextEncoder().encode(`${this.clientId}:${options.credentials}`)
				);
				headers.set("Authorization", `Basic ${encodedCredentials}`);
			} else if (this.authenticateWith === "request_body") {
				body.set("client_secret", options.credentials);
			}
		}

		const request = new Request(this.tokenEndpoint, {
			method: "POST",
			headers,
			body
		});
		const response = await fetch(request);
		const result: _TokenResponseBody | TokenErrorResponseBody = await response.json();

		// providers are allowed to return non-400 status code for errors
		if (!("access_token" in result) && "error" in result) {
			throw new OAuth2RequestError(request, result);
		} else if (!response.ok) {
			throw new OAuth2RequestError(request, {});
		}
		return result;
	}
}

export class OAuth2TokenRevocationClient {
	public clientId: string;
	public tokenRevocationEndpoint: string;

	private authenticateWith: "http_basic_auth" | "request_body" = "http_basic_auth";

	constructor(
		clientId: string,
		tokenRevocationEndpoint: string,
		options?: {
			authenticateWith?: "http_basic_auth" | "request_body";
		}
	) {
		this.clientId = clientId;
		this.tokenRevocationEndpoint = tokenRevocationEndpoint;
		if (options?.authenticateWith !== undefined) {
			this.authenticateWith = options.authenticateWith;
		}
	}

	public async revokeAccessToken(
		accessToken: string,
		options?: {
			credentials?: string;
		}
	): Promise<void> {
		const body = new URLSearchParams();
		body.set("token", accessToken);
		body.set("token_type_hint", "access_token");
		await this.sendRevocationRequest(body, options);
	}

	public async revokeRefreshToken(
		refreshToken: string,
		options?: {
			credentials?: string;
		}
	): Promise<void> {
		const body = new URLSearchParams();
		body.set("token", refreshToken);
		body.set("token_type_hint", "refresh_token");
		await this.sendRevocationRequest(body, options);
	}

	private async sendRevocationRequest(
		body: URLSearchParams,
		options?: {
			credentials?: string;
		}
	): Promise<void> {
		const headers = new Headers();
		headers.set("Content-Type", "application/x-www-form-urlencoded");
		headers.set("Accept", "application/json");
		headers.set("User-Agent", "oslo");

		if (options?.credentials !== undefined) {
			const encodedCredentials = base64.encode(
				new TextEncoder().encode(`${this.clientId}:${options.credentials}`)
			);
			headers.set("Authorization", `Basic ${encodedCredentials}`);
			if (this.authenticateWith === "http_basic_auth") {
				const encodedCredentials = base64.encode(
					new TextEncoder().encode(`${this.clientId}:${options.credentials}`)
				);
				headers.set("Authorization", `Basic ${encodedCredentials}`);
			} else if (this.authenticateWith === "request_body") {
				body.set("client_secret", options.credentials);
			}
		}

		const request = new Request(this.tokenRevocationEndpoint, {
			method: "POST",
			headers,
			body
		});
		const response = await fetch(request);

		if (response.status === 503) {
			const retryAfterHeader = response.headers.get("Retry-After");
			if (retryAfterHeader === null) {
				throw new OAuth2TokenRevocationRetryError();
			}
			const retryAfterNumber = parseInt(retryAfterHeader);
			if (!Number.isNaN(retryAfterNumber)) {
				throw new OAuth2TokenRevocationRetryError({
					retryAfter: addToDate(new Date(), new TimeSpan(retryAfterNumber, "s"))
				});
			}
			const retryAfterDate = parseDateString(retryAfterHeader);
			if (retryAfterDate !== null) {
				throw new OAuth2TokenRevocationRetryError({
					retryAfter: retryAfterDate
				});
			}
			throw new OAuth2TokenRevocationRetryError();
		}

		const result: TokenErrorResponseBody = await response.json();
		if (!("access_token" in result) && "error" in result) {
			throw new OAuth2RequestError(request, result);
		} else if (!response.ok) {
			throw new OAuth2RequestError(request, {});
		}
	}
}

export function generateCodeVerifier(): string {
	const randomValues = new Uint8Array(32);
	crypto.getRandomValues(randomValues);
	return base64url.encode(randomValues, {
		includePadding: false
	});
}

export function generateState(): string {
	const randomValues = new Uint8Array(32);
	crypto.getRandomValues(randomValues);
	return base64url.encode(randomValues, {
		includePadding: false
	});
}

export class OAuth2RequestError extends Error {
	public request: Request;
	public description: string | null;
	constructor(request: Request, body: Partial<TokenErrorResponseBody>) {
		super(body.error ?? "");
		this.request = request;
		this.description = body.error_description ?? null;
	}
}

export class OAuth2TokenRevocationRetryError extends Error {
	public retryAfter: Date | null;
	constructor(options?: { retryAfter?: Date }) {
		super("retry revocation");
		this.retryAfter = options?.retryAfter ?? null;
	}
}

interface TokenErrorResponseBody {
	error: string;
	error_description?: string;
}

export interface TokenResponseBody {
	access_token: string;
	token_type: string;
	expires_in?: number;
	refresh_token?: string;
	scope?: string;
}

function parseDateString(dateString: string): Date | null {
	try {
		return new Date(dateString);
	} catch {
		return null;
	}
}
