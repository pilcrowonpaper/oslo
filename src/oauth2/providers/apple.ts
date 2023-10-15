import {
	createOAuth2AuthorizationUrl,
	validateOAuth2AuthorizationCode
} from "../core.js";
import { createES256SignedJWT } from "../jwt.js";

import type { OAuth2Provider } from "../core.js";

export interface AppleConfig {
	redirectUri: string;
	clientId: string;
	teamId: string;
	keyId: string;
	certificate: string;
	responseMode?: "query" | "form_post";
	scope?: string[];
}

const APPLE_AUD = "https://appleid.apple.com";

export class Apple implements OAuth2Provider<AppleTokens> {
	private config: AppleConfig;

	constructor(config: AppleConfig) {
		this.config = config;
	}

	public createAuthorizationURL = async (): Promise<
		readonly [url: URL, state: string]
	> => {
		const scopeConfig = this.config.scope ?? [];
		const [url, state] = await createOAuth2AuthorizationUrl(
			"https://appleid.apple.com/auth/authorize",
			{
				clientId: this.config.clientId,
				redirectUri: this.config.redirectUri,
				scope: scopeConfig
			}
		);
		url.searchParams.set("response_mode", this.config.responseMode ?? "query");
		return [url, state];
	};

	public validateCallback = async (code: string): Promise<AppleTokens> => {
		const clientSecret = await createSecretId({
			certificate: this.config.certificate,
			teamId: this.config.teamId,
			clientId: this.config.clientId,
			keyId: this.config.keyId
		});
		const tokens = await validateOAuth2AuthorizationCode<{
			access_token: string;
			refresh_token?: string;
			expires_in: number;
			id_token: string;
		}>(code, {
			tokenEndpoint: "https://appleid.apple.com/auth/token",
			clientId: this.config.clientId,
			redirectUri: this.config.redirectUri,
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
	};
}

async function createSecretId(config: {
	certificate: string;
	teamId: string;
	clientId: string;
	keyId: string;
}): Promise<string> {
	const now = Math.floor(Date.now() / 1000);
	const payload = {
		iss: config.teamId,
		iat: now,
		exp: now + 60 * 3,
		aud: APPLE_AUD,
		sub: config.clientId
	};
	const privateKey = parsePKCS8(config.certificate);
	const jwt = await createES256SignedJWT(
		{
			alg: "ES256",
			kid: config.keyId
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
