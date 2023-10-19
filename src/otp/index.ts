import { encodeBase32 } from "../encoding/index.js";

import type { TimeSpan } from "../index.js";

export { generateHOTP } from "./hotp.js";
export { TOTPController } from "./totp.js";

export function createKeyURI(options: TOTPKeyURIConfig | HOTPKeyURIConfig) {
	const encodedIssuer = encodeURIComponent(options.issuer);
	const encodedAccountName = encodeURIComponent(options.accountName);
	let result = `otpauth://${options.type}/${encodedIssuer}:${encodedAccountName}`;
	let secretBytes: Uint8Array;
	if (typeof options.secret === "string") {
		secretBytes = new TextEncoder().encode(options.secret);
	} else {
		secretBytes = new Uint8Array(options.secret);
	}
	const params = new URLSearchParams({
		secret: encodeBase32(secretBytes, {
			padding: false
		}),
		issuer: encodedIssuer
	});
	if (options.digits !== undefined) {
		params.set("digits", options.digits.toString());
	}
	if (options.algorithm) {
		params.set("algorithm", options.algorithm);
	}
	if (options.type === "hotp" && options.counter !== undefined) {
		params.set("counter", options.counter.toString());
	}
	if (options.type === "totp" && options.period !== undefined) {
		params.set("period", options.period.seconds().toString());
	}
	result += "?" + params.toString();
	return result;
}

export interface BaseKeyURIConfig {
	secret: string | ArrayBufferLike;
	accountName: string;
	issuer: string;
	digits?: number;
	algorithm?: "SHA1" | "SHA256" | "SHA512";
}

export interface TOTPKeyURIConfig extends BaseKeyURIConfig {
	type: "totp";
	period?: TimeSpan;
}

export interface HOTPKeyURIConfig extends BaseKeyURIConfig {
	type: "hotp";
	counter: number;
}
