import {
  createOAuth2AuthorizationUrl,
  validateOAuth2AuthorizationCode,
} from "../core.js";
import type { OAuth2Provider } from "../core.js";

export interface GitHubConfig {
  clientId: string;
  clientSecret: string;
  scope?: string[];
  redirectUri?: string;
}

export class GitHub implements OAuth2Provider<GitHubTokens> {
  private config: GitHubConfig;

  constructor(config: GitHubConfig) {
    this.config = config;
  }

  public async createAuthorizationURL(): Promise<
    readonly [url: URL, state: string]
  > {
    return await createOAuth2AuthorizationUrl(
      "https://github.com/login/oauth/authorize",
      {
        clientId: this.config.clientId,
        scope: this.config.scope ?? [],
        redirectUri: this.config.redirectUri,
      }
    );
  }

  public validateCallback = async (code: string): Promise<GitHubTokens> => {
    const tokens =
      await validateOAuth2AuthorizationCode<AccessTokenResponseBody>(code, {
        tokenEndpoint: "https://github.com/login/oauth/access_token",
        clientId: this.config.clientId,
        clientPassword: {
          clientSecret: this.config.clientSecret,
          authenticateWith: "client_secret",
        },
      });
    if ("refresh_token" in tokens) {
      return {
        accessToken: tokens.access_token,
        accessTokenExpiresIn: tokens.expires_in,
        refreshToken: tokens.refresh_token,
        refreshTokenExpiresIn: tokens.refresh_token_expires_in,
      };
    }
    return {
      accessToken: tokens.access_token,
      accessTokenExpiresIn: null,
    };
  };
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
