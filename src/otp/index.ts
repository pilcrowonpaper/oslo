import { encodeBase32 } from "../encoding/index.js";

import type { TimeSpan } from "../index.js";

export { generateHOTP } from "./hotp.js";
export { TOTP } from "./totp.js";

export function createKeyURI(config: TOTPKeyURIConfig | HOTPKeyURIConfig) {
	const encodedIssuer = encodeURIComponent(config.issuer);
	const encodedAccountName = encodeURIComponent(config.accountName);
	let result = `otpauth://${config.type}/${encodedIssuer}:${encodedAccountName}`;
	let secretBytes: Uint8Array;
	if (typeof config.secret === "string") {
		secretBytes = new TextEncoder().encode(config.secret);
	} else {
		secretBytes = new Uint8Array(config.secret);
	}
	const params = new URLSearchParams({
		secret: encodeBase32(secretBytes, {
			padding: false
		}),
		issuer: encodedIssuer
	});
	if (config.digits !== undefined) {
		params.set("digits", config.digits.toString());
	}
	if (config.algorithm) {
		params.set("algorithm", config.algorithm);
	}
	if (config.type === "hotp" && config.counter !== undefined) {
		params.set("counter", config.counter.toString());
	}
	if (config.type === "totp" && config.period !== undefined) {
		params.set("period", config.period.seconds().toString());
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
