import { OAuth2Controller } from "../core.js";
import { createES256SignedJWT } from "../jwt.js";

import type { OAuth2Provider } from "../core.js";

export interface AppleCredentials {
	clientId: string;
	teamId: string;
	keyId: string;
	certificate: string;
}

export class Apple implements OAuth2Provider<AppleTokens> {
	private credentials: AppleCredentials;
	private responseMode: "query" | "form_post";
	private scope: string[];

	private controller: OAuth2Controller;

	constructor(
		credentials: AppleCredentials,
		redirectURI: string,
		options?: {
			responseMode?: "query" | "form_post";
			scope?: string[];
		}
	) {
		this.credentials = credentials;
		this.responseMode = options?.responseMode ?? "query";
		this.scope = options?.scope ?? [];

		this.controller = new OAuth2Controller(
			credentials.clientId,
			"https://appleid.apple.com/auth/authorize",
			"https://appleid.apple.com/auth/token",
			{
				redirectURI
			}
		);
	}

	public async createAuthorizationURL(state: string): Promise<URL> {
		const url = await this.controller.createAuthorizationURL({
			state,
			scope: this.scope
		});
		url.searchParams.set("response_mode", this.responseMode);
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<AppleTokens> {
		const clientSecret = await createSecret(this.credentials);
		const tokens = await this.controller.validateAuthorizationCode<TokenResponseBody>(code, {
			credentials: clientSecret,
			authenticateWith: "request_body"
		});

		return {
			accessToken: tokens.access_token,
			refreshToken: tokens.refresh_token ?? null,
			accessTokenExpiresIn: tokens.expires_in,
			idToken: tokens.id_token
		};
	}
}

async function createSecret(credentials: AppleCredentials): Promise<string> {
	const now = Math.floor(Date.now() / 1000);
	const payload = {
		iss: credentials.teamId,
		iat: now,
		exp: now + 60 * 3,
		aud: "https://appleid.apple.com",
		sub: credentials.clientId
	};
	const privateKey = parsePKCS8(credentials.certificate);
	const jwt = await createES256SignedJWT(
		{
			alg: "ES256",
			kid: credentials.keyId
		},
		payload,
		privateKey
	);
	return jwt;
}

export interface AppleTokens {
	accessToken: string;
	refreshToken: string | null;
	accessTokenExpiresIn: number;
	idToken: string;
}

function parsePKCS8(pkcs8: string): string {
	return [
		"\n",
		pkcs8.replace(/-----BEGIN PRIVATE KEY-----/, "").replace(/-----END PRIVATE KEY-----/, ""),
		"\n"
	].join("");
}

interface TokenResponseBody {
	access_token: string;
	refresh_token?: string;
	expires_in: number;
	id_token: string;
}
