import {
  createOAuth2AuthorizationUrl,
  validateOAuth2AuthorizationCode,
} from "../core.js";

import type { OAuth2Provider } from "../core.js";

export interface GoogleConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope?: string[];
  accessType?: "online" | "offline";
}

export class Google implements OAuth2Provider<GoogleTokens> {
  private config: GoogleConfig;

  constructor(config: GoogleConfig) {
    this.config = config;
  }

  public createAuthorizationURL = async (): Promise<
    readonly [url: URL, state: string]
  > => {
    const scopeConfig = this.config.scope ?? [];
    const [url, state] = await createOAuth2AuthorizationUrl(
      "https://accounts.google.com/o/oauth2/v2/auth",
      {
        clientId: this.config.clientId,
        redirectUri: this.config.redirectUri,
        scope: [
          "https://www.googleapis.com/auth/userinfo.profile",
          ...scopeConfig,
        ],
      }
    );
    const accessType = this.config.accessType ?? "online"; // ( default ) online
    url.searchParams.set("access_type", accessType);
    return [url, state];
  };

  public validateCallback = async (code: string): Promise<GoogleTokens> => {
    const tokens = await validateOAuth2AuthorizationCode<{
      access_token: string;
      refresh_token?: string;
      expires_in: number;
    }>(code, {
      tokenEndpoint: "https://oauth2.googleapis.com/token",
      clientId: this.config.clientId,
      redirectUri: this.config.redirectUri,
      clientPassword: {
        clientSecret: this.config.clientSecret,
        authenticateWith: "client_secret",
      },
    });

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? null,
      accessTokenExpiresIn: tokens.expires_in,
    };
  };
}

export interface GoogleTokens {
  accessToken: string;
  refreshToken: string | null;
  accessTokenExpiresIn: number;
}
