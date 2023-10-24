import type { KeyPair } from "./index.js";

type Hash = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export class RSASSAPKCS1v1_5 {
	private hash: Hash;
	constructor(hash: Hash) {
		this.hash = hash;
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
				name: "RSASSA-PKCS1-v1_5",
				hash: this.hash
			},
			false,
			["verify"]
		);
		return await crypto.subtle.verify("RSASSA-PKCS1-v1_5", cryptoKey, signature, data);
	}

	public async sign(privateKey: ArrayBufferLike, data: ArrayBufferLike): Promise<ArrayBuffer> {
		const cryptoKey = await crypto.subtle.importKey(
			"pkcs8",
			privateKey,
			{
				name: "RSASSA-PKCS1-v1_5",
				hash: this.hash
			},
			false,
			["sign"]
		);
		const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, data);
		return signature;
	}

	public async generateKeyPair(modulusLength?: 2048 | 4096): Promise<KeyPair> {
		const cryptoKeyPair = await crypto.subtle.generateKey(
			{
				name: "RSASSA-PKCS1-v1_5",
				hash: this.hash,
				modulusLength: modulusLength ?? 2048,
				publicExponent: new Uint8Array([0x01, 0x00, 0x01])
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

export class RSASSAPSS {
	private hash: Hash;
	private saltLength: number;
	constructor(hash: Hash) {
		this.hash = hash;
		if (hash === "SHA-1") {
			this.saltLength = 20;
		} else if (hash === "SHA-256") {
			this.saltLength = 32;
		} else if (hash === "SHA-384") {
			this.saltLength = 48;
		} else {
			this.saltLength = 64;
		}
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
				name: "RSA-PSS",
				hash: this.hash
			},
			false,
			["verify"]
		);
		return await crypto.subtle.verify(
			{
				name: "RSA-PSS",
				saltLength: this.saltLength
			},
			cryptoKey,
			signature,
			data
		);
	}

	public async sign(privateKey: ArrayBufferLike, data: ArrayBufferLike): Promise<ArrayBuffer> {
		const cryptoKey = await crypto.subtle.importKey(
			"pkcs8",
			privateKey,
			{
				name: "RSA-PSS",
				hash: this.hash
			},
			false,
			["sign"]
		);
		const signature = await crypto.subtle.sign(
			{
				name: "RSA-PSS",
				saltLength: this.saltLength
			},
			cryptoKey,
			data
		);
		return signature;
	}

	public async generateKeyPair(modulusLength?: 2048 | 4096): Promise<KeyPair> {
		const cryptoKeyPair = await crypto.subtle.generateKey(
			{
				name: "RSA-PSS",
				hash: this.hash,
				modulusLength: modulusLength ?? 2048,
				publicExponent: new Uint8Array([0x01, 0x00, 0x01])
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
