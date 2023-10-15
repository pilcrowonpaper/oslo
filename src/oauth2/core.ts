import { encodeBase64, encodeBase64Url } from "../encoding/index.js";
import { alphabet, generateRandomString } from "../random/index.js";
import { authorizationHeader, createURL, handleRequest } from "./request.js";

export interface OAuth2Tokens {
  accessToken: string;
}

export interface OAuth2Provider<_Tokens extends OAuth2Tokens> {
  createAuthorizationURL: () => Promise<readonly [url: URL, state: string]>;
  validateCallback: (code: string) => Promise<_Tokens>;
}

export interface OAuth2ProviderWithPKCE<_Tokens extends OAuth2Tokens> {
  createAuthorizationURL: () => Promise<
    readonly [url: URL, state: string, codeVerifier: string]
  >;
  validateCallback: (code: string) => Promise<_Tokens>;
}

export async function createOAuth2AuthorizationUrl(
  url: string | URL,
  options: {
    clientId: string;
    scope: string[];
    redirectUri?: string;
  }
): Promise<readonly [authorizationUrl: URL, state: string]> {
  const state = generateState();
  const authorizationUrl = createURL(url, {
    response_type: "code",
    client_id: options.clientId,
    scope: options.scope.join(" "),
    state,
    redirect_uri: options.redirectUri,
  });
  return [authorizationUrl, state] as const;
}

export async function createOAuth2AuthorizationUrlWithPKCE(
  url: string | URL,
  options: {
    clientId: string;
    scope: string[];
    codeChallengeMethod: "S256";
    redirectUri?: string;
  }
): Promise<
  readonly [authorizationUrl: URL, codeVerifier: string, state: string]
> {
  const codeVerifier = generateRandomString(
    96,
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_.~"
  );
  const codeChallenge = await generatePKCECodeChallenge("S256", codeVerifier);
  const state = generateState();
  const authorizationUrl = createURL(url, {
    response_type: "code",
    client_id: options.clientId,
    scope: options.scope.join(" "),
    state,
    redirect_uri: options.redirectUri,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
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
    return encodeBase64Url(challengeBuffer);
  }
  throw new TypeError("Invalid PKCE code challenge method");
}

export async function validateOAuth2AuthorizationCode<_ResponseBody extends {}>(
  authorizationCode: string,
  options: {
    tokenEndpoint: string | URL;
    clientId: string;
    redirectUri?: string;
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
    grant_type: "authorization_code",
  });
  if (options.redirectUri) {
    body.set("redirect_uri", options.redirectUri);
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
    body,
  });
  return await handleRequest<_ResponseBody>(request);
}

export function verifyOAuth2State(
  state1: string | null | undefined,
  state2: string | null | undefined
): boolean {
  if (!state1 || !state2) return false;
  return state1 === state2;
}
