type Hash = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export class HMAC {
	private hash: Hash;
	constructor(hash: Hash) {
		this.hash = hash;
	}

	public async verify(
		key: ArrayBufferLike,
		signature: ArrayBufferLike,
		data: ArrayBufferLike
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

	public async sign(key: ArrayBufferLike, data: ArrayBufferLike): Promise<ArrayBuffer> {
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
