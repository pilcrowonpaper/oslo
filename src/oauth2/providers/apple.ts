import { createAuthorizationURL, validateAuthorizationCode } from "../core.js";
import { createES256SignedJWT } from "../jwt.js";

import type { OAuth2Provider } from "../core.js";

interface AppleConfig {
	redirectURI: string;
	clientId: string;
	teamId: string;
	keyId: string;
	certificate: string;
	responseMode?: "query" | "form_post";
	scope?: string[];
}

const APPLE_AUD = "https://appleid.apple.com";

export class Apple implements OAuth2Provider<AppleTokens> {
	private options: AppleConfig;

	constructor(options: AppleConfig) {
		this.options = options;
	}

	public async createAuthorizationURL(): Promise<
		readonly [url: URL, state: string]
	> {
		const scopeConfig = this.options.scope ?? [];
		const [url, state] = await createAuthorizationURL({
			endpoint: "https://appleid.apple.com/auth/authorize",
			clientId: this.options.clientId,
			redirectURI: this.options.redirectURI,
			scope: scopeConfig
		});
		url.searchParams.set("response_mode", this.options.responseMode ?? "query");
		return [url, state];
	}

	public async validateCallback(code: string): Promise<AppleTokens> {
		const clientSecret = await createSecretId({
			certificate: this.options.certificate,
			teamId: this.options.teamId,
			clientId: this.options.clientId,
			keyId: this.options.keyId
		});
		const tokens = await validateAuthorizationCode<{
			access_token: string;
			refresh_token?: string;
			expires_in: number;
			id_token: string;
		}>(code, {
			tokenEndpoint: "https://appleid.apple.com/auth/token",
			clientId: this.options.clientId,
			redirectURI: this.options.redirectURI,
			clientPassword: {
				clientSecret,
				authenticateWith: "client_secret"
			}
		});

		return {
			accessToken: tokens.access_token,
			refreshToken: tokens.refresh_token ?? null,
			accessTokenExpiresIn: tokens.expires_in,
			idToken: tokens.id_token
		};
	}
}

async function createSecretId(options: {
	certificate: string;
	teamId: string;
	clientId: string;
	keyId: string;
}): Promise<string> {
	const now = Math.floor(Date.now() / 1000);
	const payload = {
		iss: options.teamId,
		iat: now,
		exp: now + 60 * 3,
		aud: APPLE_AUD,
		sub: options.clientId
	};
	const privateKey = parsePKCS8(options.certificate);
	const jwt = await createES256SignedJWT(
		{
			alg: "ES256",
			kid: options.keyId
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
		pkcs8
			.replace(/-----BEGIN PRIVATE KEY-----/, "")
			.replace(/-----END PRIVATE KEY-----/, ""),
		"\n"
	].join("");
}
