import { encodeBase64, encodeBase64url } from "../encoding/index.js";
import { authorizationHeader, createURL } from "./request.js";

export interface OAuth2Tokens {
	accessToken: string;
}

export interface OAuth2Provider<_Tokens extends OAuth2Tokens> {
	createAuthorizationURL(state?: string): Promise<URL>;
	validateAuthorizationCode(code: string): Promise<_Tokens>;
}

export interface OAuth2ProviderWithPKCE<_Tokens extends OAuth2Tokens> {
	createAuthorizationURL(codeVerifier: string, state?: string): Promise<URL>;
	validateAuthorizationCode(code: string, codeVerifier: string): Promise<_Tokens>;
}

export class OAuth2Controller {
	private clientId: string;
	private authorizeEndpoint: string;
	private tokenEndpoint: string;
	private redirectURI: string | null;

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
		this.redirectURI = options?.redirectURI ?? null;
	}

	public async createAuthorizationURL(options?: {
		state?: string;
		codeVerifier?: string;
		scope?: string[];
	}): Promise<URL> {
		const scope = options?.scope ?? [];
		const authorizationUrl = createURL(this.authorizeEndpoint, {
			response_type: "code",
			client_id: this.clientId,
			scope: scope.join(" "),
			state: options?.state,
			redirect_uri: this.redirectURI
		});

		if (options?.codeVerifier !== undefined) {
			const codeChallengeBuffer = await crypto.subtle.digest(
				"SHA-256",
				new TextEncoder().encode(options.codeVerifier)
			);
			const codeChallenge = encodeBase64url(codeChallengeBuffer);
			authorizationUrl.searchParams.set("code_challenge_method", "ES256");
			authorizationUrl.searchParams.set("code_challenge", codeChallenge);
		}
		return authorizationUrl;
	}

	public async validateAuthorizationCode<_TokenResponseBody extends TokenResponseBody>(
		authorizationCode: string,
		options?: {
			codeVerifier?: string;
			credentials?: string;
			authenticateWith?: "http_basic_auth" | "request_body";
		}
	): Promise<_TokenResponseBody> {
		const body = createURLSearchParams({
			code: authorizationCode,
			client_id: this.clientId,
			grant_type: "authorization_code",
			redirect_uri: this.redirectURI,
			code_verifier: options?.codeVerifier
		});
		const headers = new Headers({
			"Content-Type": "application/x-www-form-urlencoded",
			Accept: "application/json"
		});

		if (options?.credentials !== undefined) {
			const authenticateWith = options?.authenticateWith ?? "http_basic_auth";
			if (authenticateWith === "http_basic_auth") {
				const encodedCredentials = encodeBase64(
					new TextEncoder().encode(`${this.clientId}:${options.credentials}`)
				);
				headers.set("Authorization", authorizationHeader("basic", encodedCredentials));
			} else {
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
		// github returns status 200 for errors
		if (!("access_token" in result) && "error" in result) {
			throw new AccessTokenRequestError(request, result);
		} else if (!response.ok) {
			throw new AccessTokenRequestError(request, {});
		}
		return result;
	}
}

export function generateCodeVerifier(): string {
	const randomValues = new Uint8Array(32);
	crypto.getRandomValues(randomValues);
	return encodeBase64url(randomValues);
}

export function generateState(): string {
	const randomValues = new Uint8Array(32);
	crypto.getRandomValues(randomValues);
	return encodeBase64url(randomValues);
}

export function verifyState(
	state1: string | null | undefined,
	state2: string | null | undefined
): boolean {
	if (!state1 || !state2) return false;
	return state1 === state2;
}

function createURLSearchParams(
	params: Record<string, string | number | undefined | null>
): URLSearchParams {
	const base = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value === null || value === undefined) {
			continue;
		}
		base.set(key, value.toString());
	}
	return base;
}

export class AccessTokenRequestError extends Error {
	public request: Request;
	public description: string | null;
	constructor(request: Request, body: Partial<TokenErrorResponseBody>) {
		super(body.error ?? "");
		this.request = request;
		this.description = body.error_description ?? null;
	}
}

interface TokenErrorResponseBody {
	error: string;
	error_description?: string;
}

interface TokenResponseBody {
	access_token: string;
}
