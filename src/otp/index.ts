import { encodeBase32 } from "../encoding/index.js";

import type { TimeSpan } from "../index.js";

export { generateHOTP } from "./hotp.js";
export { TOTPController } from "./totp.js";

export type HOTPAlgorithm = "SHA1" | "SHA256" | "SHA512";

export function createTOTPKeyURI(
	issuer: string,
	accountName: string,
	secret: ArrayBufferLike,
	options?: {
		digits?: number;
		algorithm?: HOTPAlgorithm;
		period?: TimeSpan;
	}
): string {
	const [baseURI, params] = createKeyURIBase("totp", issuer, accountName, secret, options);
	if (options?.period !== undefined) {
		params.set("period", options.period.seconds().toString());
	}
	return baseURI + "?" + params.toString();
}

export function createHOTPKeyURI(
	issuer: string,
	accountName: string,
	secret: ArrayBufferLike,
	options?: {
		counter?: number;
		digits?: number;
		algorithm?: HOTPAlgorithm;
	}
): string {
	const [baseURI, params] = createKeyURIBase("hotp", issuer, accountName, secret, options);
	const counter = options?.counter ?? 0;
	params.set("counter", counter.toString());
	return baseURI + "?" + params.toString();
}

function createKeyURIBase(
	type: "totp" | "hotp",
	issuer: string,
	accountName: string,
	secret: ArrayBufferLike,
	options?: {
		digits?: number;
		algorithm?: HOTPAlgorithm;
	}
): [baseURI: string, params: URLSearchParams] {
	const encodedIssuer = encodeURIComponent(issuer);
	const encodedAccountName = encodeURIComponent(accountName);
	const baseURI = `otpauth://${type}/${encodedIssuer}:${encodedAccountName}`;
	const params = new URLSearchParams({
		secret: encodeBase32(secret, {
			padding: false
		}),
		issuer: encodedIssuer
	});
	if (options?.digits !== undefined) {
		params.set("digits", options.digits.toString());
	}
	if (options?.algorithm) {
		params.set("algorithm", options.algorithm);
	}
	return [baseURI, params];
}
