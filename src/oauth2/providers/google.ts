import { OAuth2Controller } from "../core.js";

import type { OAuth2Provider } from "../core.js";

export class Google implements OAuth2Provider<GoogleTokens> {
	private clientSecret: string;
	private scope: string[];
	private accessType: "online" | "offline";

	private controller: OAuth2Controller;

	constructor(
		clientId: string,
		clientSecret: string,
		redirectURI: string,
		options?: {
			scope?: string[];
			accessType?: "online" | "offline";
		}
	) {
		this.clientSecret = clientId;
		this.scope = options?.scope ?? [];
		this.accessType = options?.accessType ?? "online";
		this.controller = new OAuth2Controller(
			clientId,
			"https://accounts.google.com/o/oauth2/v2/auth",
			"https://oauth2.googleapis.com/token",
			{
				redirectURI: redirectURI
			}
		);
	}

	public async createAuthorizationURL(state: string): Promise<URL> {
		const url = await this.controller.createAuthorizationURL({
			state,
			scope: this.scope
		});
		url.searchParams.set("access_type", this.accessType);
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<GoogleTokens> {
		const tokens = await this.controller.validateAuthorizationCode<TokenResponseBody>(code, {
			credentials: this.clientSecret,
			authenticateWith: "request_body"
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

interface TokenResponseBody {
	access_token: string;
	refresh_token?: string;
	expires_in: number;
}
