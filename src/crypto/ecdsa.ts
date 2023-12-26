import type { TypedArray } from "../index.js";
import type { KeyPair } from "./index.js";
import type { SHAHash } from "./sha.js";

export type ECDSACurve = "P-256" | "P-384" | "P-521";

export class ECDSA {
	private hash: SHAHash;
	private curve: ECDSACurve;

	constructor(hash: SHAHash, curve: ECDSACurve) {
		this.hash = hash;
		this.curve = curve;
	}

	public async sign(
		privateKey: ArrayBuffer | TypedArray,
		data: ArrayBuffer | TypedArray
	): Promise<ArrayBuffer> {
		const cryptoKey = await crypto.subtle.importKey(
			"pkcs8",
			privateKey,
			{
				name: "ECDSA",
				namedCurve: this.curve
			},
			false,
			["sign"]
		);
		const signature = await crypto.subtle.sign(
			{
				name: "ECDSA",
				hash: this.hash
			},
			cryptoKey,
			data
		);
		return signature;
	}

	public async verify(
		publicKey: ArrayBuffer | TypedArray,
		signature: ArrayBuffer | TypedArray,
		data: ArrayBuffer | TypedArray
	): Promise<boolean> {
		const cryptoKey = await crypto.subtle.importKey(
			"spki",
			publicKey,
			{
				name: "ECDSA",
				namedCurve: this.curve
			},
			false,
			["verify"]
		);
		return await crypto.subtle.verify(
			{
				name: "ECDSA",
				hash: this.hash
			},
			cryptoKey,
			signature,
			data
		);
	}

	public async generateKeyPair(): Promise<KeyPair> {
		const cryptoKeyPair = await crypto.subtle.generateKey(
			{
				name: "ECDSA",
				namedCurve: this.curve
			},
			true,
			["sign"]
		);
		const privateKey = await crypto.subtle.exportKey("pkcs8", cryptoKeyPair.privateKey);
		const publicKey = await crypto.subtle.exportKey("spki", cryptoKeyPair.publicKey);
		return {
			privateKey,
			publicKey
		};
	}
}
