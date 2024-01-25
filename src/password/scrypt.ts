import { scrypt } from "node:crypto";
import { decodeHex, encodeHex } from "../encoding/index.js";
import { constantTimeEqual } from "../crypto/index.js";

import type { PasswordHashingAlgorithm } from "./index.js";

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
