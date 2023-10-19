import { encodeBase64, encodeBase64url } from "../encoding/index.js";
import { alphabet, generateRandomString } from "../random/index.js";
import { authorizationHeader, createURL } from "./request.js";

export interface OAuth2Tokens {
	accessToken: string;
}

export interface OAuth2Provider<_Tokens extends OAuth2Tokens> {
	createAuthorizationURL(): Promise<readonly [url: URL, state: string]>;
	validateCallback(code: string): Promise<_Tokens>;
}

export interface OAuth2ProviderWithPKCE<_Tokens extends OAuth2Tokens> {
	createAuthorizationURL(): Promise<
		readonly [url: URL, state: string, codeVerifier: string]
	>;
	validateCallback(code: string, codeVerifier: string): Promise<_Tokens>;
}

export async function createAuthorizationURL(options: {
	endpoint: string | URL;
	clientId: string;
	scope: string[];
	redirectURI?: string;
}): Promise<readonly [authorizationUrl: URL, state: string]> {
	const state = generateState();
	const authorizationUrl = createURL(options.endpoint, {
		response_type: "code",
		client_id: options.clientId,
		scope: options.scope.join(" "),
		state,
		redirect_uri: options.redirectURI
	});
	return [authorizationUrl, state] as const;
}

export async function createAuthorizationURLWithPKCE(options: {
	endpoint: string | URL;
	clientId: string;
	scope: string[];
	codeChallengeMethod: "S256";
	redirectURI?: string;
}): Promise<
	readonly [authorizationUrl: URL, codeVerifier: string, state: string]
> {
	const codeVerifier = generateRandomString(
		96,
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_.~"
	);
	const codeChallenge = await generatePKCECodeChallenge("S256", codeVerifier);
	const state = generateState();
	const authorizationUrl = createURL(options.endpoint, {
		response_type: "code",
		client_id: options.clientId,
		scope: options.scope.join(" "),
		state,
		redirect_uri: options.redirectURI,
		code_challenge_method: "S256",
		code_challenge: codeChallenge
	});
	return [authorizationUrl, codeVerifier, state] as const;
}

export function generateState() {
	return generateRandomString(43, alphabet("a-z", "A-Z", "0-9"));
}

export async function generatePKCECodeChallenge(
	method: "S256",
	verifier: string
) {
	if (method === "S256") {
		const verifierBuffer = new TextEncoder().encode(verifier);
		const challengeBuffer = await crypto.subtle.digest(
			"SHA-256",
			verifierBuffer
		);
		return encodeBase64url(challengeBuffer);
	}
	throw new TypeError("Invalid PKCE code challenge method");
}

export async function validateAuthorizationCode<
	_ResponseBody extends AccessTokenResponseBody
>(
	authorizationCode: string,
	options: {
		tokenEndpoint: string | URL;
		clientId: string;
		redirectURI?: string;
		codeVerifier?: string;
		clientPassword?: {
			clientSecret: string;
			authenticateWith: "client_secret" | "http_basic_auth";
		};
	}
): Promise<_ResponseBody> {
	const body = new URLSearchParams({
		code: authorizationCode,
		client_id: options.clientId,
		grant_type: "authorization_code"
	});
	if (options.redirectURI) {
		body.set("redirect_uri", options.redirectURI);
	}
	if (options.codeVerifier) {
		body.set("code_verifier", options.codeVerifier);
	}
	if (
		options.clientPassword &&
		options.clientPassword.authenticateWith === "client_secret"
	) {
		body.set("client_secret", options.clientPassword.clientSecret);
	}

	const headers = new Headers({
		"Content-Type": "application/x-www-form-urlencoded",
		Accept: "application/json"
	});
	if (
		options.clientPassword &&
		options.clientPassword.authenticateWith === "http_basic_auth"
	) {
		headers.set(
			"Authorization",
			authorizationHeader(
				"basic",
				encodeBase64(
					new TextEncoder().encode(
						`${options.clientId}:${options.clientPassword.clientSecret}`
					)
				)
			)
		);
	}

	const request = new Request(new URL(options.tokenEndpoint), {
		method: "POST",
		headers,
		body
	});
	const response = await fetch(request);
	const result: _ResponseBody | AccessTokenErrorResponseBody =
		await response.json();
	// github returns status 200 for errors
	if (!("access_token" in result) && "error" in result) {
		throw new AccessTokenRequestError(request, result);
	} else if (!response.ok) {
		throw new AccessTokenRequestError(request, {});
	}
	return result;
}

export class AccessTokenRequestError extends Error {
	public request: Request;
	public description: string | null;
	constructor(request: Request, body: Partial<AccessTokenErrorResponseBody>) {
		super(body.error ?? "");
		this.request = request;
		this.description = body.error_description ?? null;
	}
}

interface AccessTokenErrorResponseBody {
	error: string;
	error_description?: string;
}

interface AccessTokenResponseBody {
	access_token: string;
}

export function verifyState(
	state1: string | null | undefined,
	state2: string | null | undefined
): boolean {
	if (!state1 || !state2) return false;
	return state1 === state2;
}
