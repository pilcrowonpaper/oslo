import { decodeBase64url } from "../encoding/index.js";

const decoder = new TextDecoder();

/**Parses an OIDC ID token and returns the payload. Throws if the ID token is invalid. */
export function parseIdToken<_Claims extends object>(
	idToken: string
): BaseIdTokenPayload & _Claims {
	const idTokenParts = idToken.split(".");
	if (idTokenParts.length !== 3) throw new Error("Invalid ID Token");
	const base64UrlPayload = idTokenParts[1]!;
	const payload: unknown = JSON.parse(decoder.decode(decodeBase64url(base64UrlPayload)));
	if (!payload || typeof payload !== "object") {
		throw new Error("Invalid ID Token");
	}
	return payload as BaseIdTokenPayload & _Claims;
}

export interface BaseIdTokenPayload {
	iss: string;
	aud: string;
	exp: number;
}
