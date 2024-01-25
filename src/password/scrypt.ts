import { scrypt } from "node:crypto";
import { decodeHex, encodeHex } from "../encoding/index.js";

import type { PasswordHashingAlgorithm } from "./index.js";
import type { TypedArray } from "../index.js";

export class Scrypt implements PasswordHashingAlgorithm {
	constructor(options?: { N?: number; r?: number; p?: number; dkLen?: number }) {
		this.N = options?.N ?? 16384;
		this.r = options?.r ?? 16;
		this.p = options?.p ?? 1;
		this.dkLen = options?.dkLen ?? 64;
	}

	private N: number;
	private r: number;
	private p: number;
	private dkLen: number;

	public async hash(password: string): Promise<string> {
		const salt = encodeHex(crypto.getRandomValues(new Uint8Array(16)));
		const key = await this.generateKey(password, salt);
		return `${salt}:${encodeHex(key)}`;
	}

	public async verify(hash: string, password: string): Promise<boolean> {
		const [salt, key] = hash.split(":");
		const targetKey = await this.generateKey(password, salt!);
		return constantTimeEqual(targetKey, decodeHex(key!));
	}

	private async generateKey(password: string, salt: string): Promise<ArrayBuffer> {
		return await new Promise<ArrayBuffer>((resolve, reject) => {
			scrypt(
				password.normalize("NFKC"),
				salt!,
				this.dkLen,
				{
					N: this.N,
					p: this.p,
					r: this.r,
					// errors when 128 * N * r > `maxmem` (approximately)
					maxmem: 128 * this.N * this.r * 2
				},
				(err, buff) => {
					if (err) return reject(err);
					return resolve(buff);
				}
			);
		});
	}
}

function constantTimeEqual(a: ArrayBuffer | TypedArray, b: ArrayBuffer | TypedArray): boolean {
	const aBuffer = new Uint8Array(a);
	const bBuffer = new Uint8Array(b);
	if (aBuffer.length !== bBuffer.length) {
		return false;
	}
	let c = 0;
	for (let i = 0; i < aBuffer.length; i++) {
		c |= aBuffer[i]! ^ bBuffer[i]!; // ^: XOR operator
	}
	return c === 0;
}
