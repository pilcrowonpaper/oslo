import { decodeBase64Url } from "../encoding/index.js";

const decoder = new TextDecoder();

export function parseIdToken<_Claims extends object>(
  idToken: string
): BaseIdTokenPayload & _Claims {
  const idTokenParts = idToken.split(".");
  if (idTokenParts.length !== 3) throw new SyntaxError("Invalid ID Token");
  const base64UrlPayload = idTokenParts[1]!;
  const payload: unknown = JSON.parse(
    decoder.decode(decodeBase64Url(base64UrlPayload))
  );
  if (!payload || typeof payload !== "object") {
    throw new SyntaxError("Invalid ID Token");
  }
  return payload as BaseIdTokenPayload & _Claims;
}

export interface BaseIdTokenPayload {
  iss: string;
  aud: string;
  exp: number;
}
