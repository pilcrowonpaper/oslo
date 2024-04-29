import { sha256 } from "../crypto/index.js";
import { base64, base64url } from "../encoding/index.js";
import { addToDate, TimeSpan } from "../index.js";

export class OAuth2Client {
	public clientId: string;

	public authorizeEndpoint: string;
	public tokenEndpoint: string;

	private redirectURI: string | null = null;

	constructor(
		clientId: string,
		authorizeEndpoint: string,
		tokenEndpoint: string,
		options?: {
			redirectURI?: string;
		}
	) {
		this.clientId = clientId;
		this.authorizeEndpoint = authorizeEndpoint;
		this.tokenEndpoint = tokenEndpoint;
		if (options !== undefined && options.redirectURI !== undefined) {
			this.redirectURI = options.redirectURI;
		}
	}

	public createAuthorizationURL(): OAuth2AuthorizationURL {
		const url = new OAuth2AuthorizationURL(this.authorizeEndpoint, this.clientId);
		if (this.redirectURI !== null) {
			url.setRedirectURI(this.redirectURI);
		}
		return url;
	}

	public createAccessTokenRequest(authorizationCode: string): OAuth2AccessTokenRequest {
		const request = new OAuth2AccessTokenRequest(
			this.tokenEndpoint,
			this.clientId,
			authorizationCode
		);
		if (this.redirectURI !== null) {
			request.setRedirectURI(this.redirectURI);
		}
		return request;
	}

	public createRefreshTokenRequest(refreshToken: string): OAuth2RefreshTokenRequest {
		const request = new OAuth2RefreshTokenRequest(this.tokenEndpoint, this.clientId, refreshToken);
		return request;
	}

	public async sendTokenRequest<_TokenResponseBody extends TokenResponseBody>(
		request: OAuth2Request
	): Promise<_TokenResponseBody> {
		const response = await fetch(request.createFetchRequest());
		const result: _TokenResponseBody | TokenErrorResponseBody = await response.json();
		if ("access_token" in result) {
			return result as _TokenResponseBody;
		}
		if ("error_description" in result) {
			throw new OAuth2RequestError(request, {
				message: result.error,
				description: result.error_description
			});
		}
		throw new OAuth2RequestError(request, {
			message: result.error
		});
	}
}

export class OAuth2TokenRevocationClient {
	public clientId: string;
	public tokenRevocationEndpoint: string;

	constructor(clientId: string, tokenRevocationEndpoint: string) {
		this.clientId = clientId;
		this.tokenRevocationEndpoint = tokenRevocationEndpoint;
	}

	public createAccessTokenRevocationRequest(accessToken: string): OAuth2TokenRevocationRequest {
		const request = new OAuth2TokenRevocationRequest(
			this.clientId,
			this.tokenRevocationEndpoint,
			accessToken
		);
		request.setTokenTypeHint("access_token");
		return request;
	}

	public createRefreshTokenRevocationRequest(refreshToken: string): OAuth2TokenRevocationRequest {
		const request = new OAuth2TokenRevocationRequest(
			this.clientId,
			this.tokenRevocationEndpoint,
			refreshToken
		);
		request.setTokenTypeHint("refresh_token");
		return request;
	}

	public async sendTokenRevocationRequest(request: OAuth2TokenRevocationRequest): Promise<void> {
		const response = await fetch(request.createFetchRequest());
		if (response.status === 200) {
			return;
		}
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
		if ("error_description" in result) {
			throw new OAuth2RequestError(request, {
				message: result.error,
				description: result.error_description
			});
		}
		throw new OAuth2RequestError(request, {
			message: result.error
		});
	}
}

export class OAuth2AuthorizationURL extends URL {
	constructor(url: string, clientId: string) {
		super(url);
		this.searchParams.set("response_type", "code");
		this.searchParams.set("client_id", clientId);
	}

	public setRedirectURI(redirectURI: string): this {
		this.searchParams.set("redirect_uri", redirectURI);
		return this;
	}

	public setScopes(...scopes: string[]): this {
		let scopeValue = scopes.join(" ");
		const existingScopes = this.searchParams.get("scope");
		if (existingScopes !== null) {
			scopeValue = " " + existingScopes;
		}
		this.searchParams.set("scope", scopeValue);
		return this;
	}

	public setState(state: string): this {
		this.searchParams.set("state", state);
		return this;
	}

	public setS256CodeChallenge(codeVerifier: string): this {
		const codeChallengeBytes = sha256(new TextEncoder().encode(codeVerifier));
		const codeChallenge = base64url.encode(codeChallengeBytes, {
			includePadding: false
		});
		this.searchParams.set("code_challenge", codeChallenge);
		this.searchParams.set("code_challenge_method", "S256");
		return this;
	}

	public setPlainCodeChallenge(codeVerifier: string): this {
		this.searchParams.set("code_challenge", codeVerifier);
		this.searchParams.set("code_challenge_method", "plain");
		return this;
	}
}

export class OAuth2Request {
	public method = "POST";
	public body = new URLSearchParams();
	public headers = new Headers();

	public url: string;
	public clientId: string;

	constructor(url: string, clientId: string) {
		this.url = url;
		this.clientId = clientId;
		this.body.set("client_id", clientId);
		this.headers.set("Content-Type", "application/x-www-form-urlencoded");
		this.headers.set("Accept", "application/json");
		this.headers.set("User-Agent", "oslo");
	}

	public authenticateWithRequestBody(clientSecret: string): this {
		this.body.set("client_secret", clientSecret);
		return this;
	}

	public authenticateWithHTTPBasicAuth(clientPassword: string): this {
		const authorizationHeader = base64.encode(
			new TextEncoder().encode(`${this.clientId}:${clientPassword}`)
		);
		this.headers.set("Authorization", authorizationHeader);
		return this;
	}

	public createFetchRequest(): Request {
		return new Request(this.url, {
			method: "POST",
			body: this.body,
			headers: this.headers
		});
	}
}

export class OAuth2AccessTokenRequest extends OAuth2Request {
	constructor(url: string, clientId: string, code: string) {
		super(url, clientId);
		this.body.set("grant_type", "authorization_code");
		this.body.set("code", code);
	}

	public setCodeVerifier(codeVerifier: string): this {
		this.body.set("code_verifier", codeVerifier);
		return this;
	}

	public setRedirectURI(redirectURI: string): this {
		this.body.set("redirect_uri", redirectURI);
		return this;
	}
}

export class OAuth2RefreshTokenRequest extends OAuth2Request {
	constructor(url: string, clientId: string, code: string) {
		super(url, clientId);
		this.body.set("grant_type", "refresh_token");
		this.body.set("code", code);
	}

	public setScopes(...scopes: string[]): this {
		let scopeValue = scopes.join(" ");
		const existingScopes = this.body.get("scope");
		if (existingScopes !== null) {
			scopeValue = " " + existingScopes;
		}
		this.body.set("scope", scopeValue);
		return this;
	}
}

export class OAuth2TokenRevocationRequest extends OAuth2Request {
	constructor(url: string, clientId: string, token: string) {
		super(url, clientId);
		this.body.set("token", token);
	}

	public setTokenTypeHint(tokenTypeHint: "access_token" | "refresh_token"): this {
		this.body.set("token_type_hint", tokenTypeHint);
		return this;
	}
}

export class OAuth2RequestError extends Error {
	public request: OAuth2Request;
	public description: string | null;
	constructor(
		request: OAuth2Request,
		options?: {
			message?: string;
			description?: string;
		}
	) {
		super(options?.message ?? "Unknown error");
		this.request = request;
		this.description = options?.description ?? null;
	}
}

export class OAuth2TokenRevocationRetryError extends Error {
	public retryAfter: Date | null;
	constructor(options?: { retryAfter?: Date }) {
		super("retry revocation");
		this.retryAfter = options?.retryAfter ?? null;
	}
}

export interface TokenResponseBody {
	access_token: string;
	token_type: string;
	expires_in?: number;
	refresh_token?: string;
	scope?: string;
}

interface TokenErrorResponseBody {
	error: string;
	error_description?: string;
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

function parseDateString(dateString: string): Date | null {
	try {
		return new Date(dateString);
	} catch {
		return null;
	}
}
