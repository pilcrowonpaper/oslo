import { createAuthorizationURL, validateAuthorizationCode } from "../core.js";

import type { OAuth2Provider } from "../core.js";

interface GitHubConfig {
	clientId: string;
	clientSecret: string;
	scope?: string[];
	redirectURI?: string;
}

export class GitHub implements OAuth2Provider<GitHubTokens> {
	private options: GitHubConfig;

	constructor(options: GitHubConfig) {
		this.options = options;
	}

	public async createAuthorizationURL(): Promise<
		readonly [url: URL, state: string]
	> {
		return await createAuthorizationURL({
			endpoint: "https://github.com/login/oauth/authorize",
			clientId: this.options.clientId,
			scope: this.options.scope ?? [],
			redirectURI: this.options.redirectURI
		});
	}

	public async validateCallback(code: string): Promise<GitHubTokens> {
		const tokens = await validateAuthorizationCode<AccessTokenResponseBody>(
			code,
			{
				tokenEndpoint: "https://github.com/login/oauth/access_token",
				clientId: this.options.clientId,
				clientPassword: {
					clientSecret: this.options.clientSecret,
					authenticateWith: "client_secret"
				}
			}
		);
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

interface BaseAccessTokenResponseBody {
	access_token: string;
}

interface AccessTokenResponseBodyWithRefreshToken
	extends BaseAccessTokenResponseBody {
	refresh_token: string;
	expires_in: number;
	refresh_token_expires_in: number;
}

type AccessTokenResponseBody =
	| BaseAccessTokenResponseBody
	| AccessTokenResponseBodyWithRefreshToken;
