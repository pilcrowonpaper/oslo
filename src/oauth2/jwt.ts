import { ECDSA } from "../crypto/index.js";
import { encodeBase64url } from "../encoding/index.js";

const encoder = new TextEncoder();

export interface JWTHeader {
	alg: "ES256";
	kid?: string;
}

export async function createES256SignedJWT(
	payload: Record<any, any>,
	privateKey: ArrayBufferLike,
	options?: {
		keyId?: string;
	}
): Promise<string> {
	const header: JWTHeader = {
		alg: "ES256",
		kid: options?.keyId
	};
	const base64UrlHeader = encodeBase64url(encoder.encode(JSON.stringify(header)));
	const base64UrlPayload = encodeBase64url(encoder.encode(JSON.stringify(payload)));
	const signatureBody = [base64UrlHeader, base64UrlPayload].join(".");
	const es256 = new ECDSA("SHA-256", "P-256");
	const signatureBuffer = await es256.sign(privateKey, encoder.encode(signatureBody));
	const signature = encodeBase64url(signatureBuffer);
	const jwt = [signatureBody, signature].join(".");
	return jwt;
}
