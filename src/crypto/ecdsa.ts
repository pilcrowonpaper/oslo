import type { KeyPair } from "./index.js";

type Hash = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";
type ECDSACurve = "P-256" | "P-384" | "P-521";

export class ECDSA {
	private hash: Hash;
	private curve: ECDSACurve;

	constructor(hash: Hash, curve: ECDSACurve) {
		this.hash = hash;
		this.curve = curve;
	}

	public async sign(privateKey: ArrayBufferLike, data: ArrayBufferLike): Promise<ArrayBuffer> {
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
		publicKey: ArrayBufferLike,
		signature: ArrayBufferLike,
		data: ArrayBufferLike
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

	public async generateKey(): Promise<KeyPair> {
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
