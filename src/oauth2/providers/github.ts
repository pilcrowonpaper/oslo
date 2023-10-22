import { OAuth2Controller } from "../core.js";

import type { OAuth2Provider } from "../core.js";

export class GitHub implements OAuth2Provider<GitHubTokens> {
	private clientSecret: string;
	private scope: string[];

	private controller: OAuth2Controller;

	constructor(
		clientId: string,
		clientSecret: string,
		options?: {
			scope?: string[];
			redirectURI?: string;
		}
	) {
		this.clientSecret = clientSecret;
		this.scope = options?.scope ?? [];

		this.controller = new OAuth2Controller(
			clientId,
			"https://github.com/login/oauth/authorize",
			"https://github.com/login/oauth/access_token",
			{
				redirectURI: options?.redirectURI
			}
		);
	}

	public async createAuthorizationURL(state: string): Promise<URL> {
		return await this.controller.createAuthorizationURL({
			state,
			scope: this.scope
		});
	}

	public async validateAuthorizationCode(code: string): Promise<GitHubTokens> {
		const tokens = await this.controller.validateAuthorizationCode<TokenResponseBody>(code, {
			credentials: this.clientSecret,
			authenticateWith: "request_body"
		});
		if ("refresh_token" in tokens) {
			return {
				accessToken: tokens.access_token,
				accessTokenExpiresIn: tokens.expires_in,
				refreshToken: tokens.refresh_token,
				refreshTokenExpiresIn: tokens.refresh_token_expires_in
			};
		}
		return {
			accessToken: tokens.access_token,
			accessTokenExpiresIn: null
		};
	}
}

export type GitHubTokens = BaseGitHubTokens | GitHubTokensWithRefreshToken;

interface BaseGitHubTokens {
	accessToken: string;
	accessTokenExpiresIn: null;
}

interface GitHubTokensWithRefreshToken {
	accessToken: string;
	accessTokenExpiresIn: number;
	refreshToken: string;
	refreshTokenExpiresIn: number;
}

interface BaseTokenResponseBody {
	access_token: string;
}

interface TokenResponseBodyWithRefreshToken extends BaseTokenResponseBody {
	refresh_token: string;
	expires_in: number;
	refresh_token_expires_in: number;
}

type TokenResponseBody = BaseTokenResponseBody | TokenResponseBodyWithRefreshToken;
