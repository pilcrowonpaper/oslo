import type { SHAHash } from "./sha.js";

export class HMAC {
	private hash: SHAHash;
	constructor(hash: SHAHash) {
		this.hash = hash;
	}

	public async verify(
		key: ArrayBuffer,
		signature: ArrayBuffer,
		data: ArrayBuffer
	): Promise<boolean> {
		const cryptoKey = await crypto.subtle.importKey(
			"raw",
			key,
			{
				name: "HMAC",
				hash: this.hash
			},
			false,
			["verify"]
		);
		return await crypto.subtle.verify("HMAC", cryptoKey, signature, data);
	}

	public async sign(key: ArrayBuffer, data: ArrayBuffer): Promise<ArrayBuffer> {
		const cryptoKey = await crypto.subtle.importKey(
			"raw",
			key,
			{
				name: "HMAC",
				hash: this.hash
			},
			false,
			["sign"]
		);
		const signature = await crypto.subtle.sign("HMAC", cryptoKey, data);
		return signature;
	}

	public async generateKey(): Promise<ArrayBuffer> {
		const cryptoKey: CryptoKey = await crypto.subtle.generateKey(
			{
				name: "HMAC",
				hash: this.hash
			},
			true,
			["sign"]
		);
		const key = await crypto.subtle.exportKey("raw", cryptoKey);
		return key;
	}
}
