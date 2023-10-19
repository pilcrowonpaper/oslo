import { createAuthorizationURL, validateAuthorizationCode } from "../core.js";

import type { OAuth2Provider } from "../core.js";

interface GoogleConfig {
	clientId: string;
	clientSecret: string;
	redirectURI: string;
	scope?: string[];
	accessType?: "online" | "offline";
}

export class Google implements OAuth2Provider<GoogleTokens> {
	private options: GoogleConfig;

	constructor(options: GoogleConfig) {
		this.options = options;
	}

	public async createAuthorizationURL(): Promise<
		readonly [url: URL, state: string]
	> {
		const scopeConfig = this.options.scope ?? [];
		const [url, state] = await createAuthorizationURL({
			endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
			clientId: this.options.clientId,
			redirectURI: this.options.redirectURI,
			scope: [
				"https://www.googleapis.com/auth/userinfo.profile",
				...scopeConfig
			]
		});
		const accessType = this.options.accessType ?? "online"; // ( default ) online
		url.searchParams.set("access_type", accessType);
		return [url, state];
	}

	public async validateCallback(code: string): Promise<GoogleTokens> {
		const tokens = await validateAuthorizationCode<{
			access_token: string;
			refresh_token?: string;
			expires_in: number;
		}>(code, {
			tokenEndpoint: "https://oauth2.googleapis.com/token",
			clientId: this.options.clientId,
			redirectURI: this.options.redirectURI,
			clientPassword: {
				clientSecret: this.options.clientSecret,
				authenticateWith: "client_secret"
			}
		});

		return {
			accessToken: tokens.access_token,
			refreshToken: tokens.refresh_token ?? null,
			accessTokenExpiresIn: tokens.expires_in
		};
	}
}

export interface GoogleTokens {
	accessToken: string;
	refreshToken: string | null;
	accessTokenExpiresIn: number;
}
