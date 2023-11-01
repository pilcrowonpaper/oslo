import { scrypt } from "node:crypto";
import { decodeHex, encodeHex } from "../encoding/index.js";
import { constantTimeEqual } from "../crypto/index.js";

import type { PasswordHashingAlgorithm } from "./index.js";

interface ScryptOptions {
	N?: number;
	r?: number;
	p?: number;
	dkLen?: number;
}

export class Scrypt implements PasswordHashingAlgorithm {
	constructor(options?: ScryptOptions) {
		this.options = options ?? {};
	}

	private options: ScryptOptions;

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
		const dkLen = this.options.dkLen ?? 64;
		return await new Promise<ArrayBuffer>((resolve, reject) => {
			const N = this.options.N ?? 16384;
			const p = this.options.p ?? 1;
			const r = this.options.r ?? 16;
			scrypt(
				password.normalize("NFKC"),
				salt!,
				dkLen,
				{
					N,
					p,
					r,
					// errors when 128 * N * r > `maxmem` (approximately)
					maxmem: 128 * N * r * 2
				},
				(err, buff) => {
					if (err) return reject(err);
					return resolve(buff);
				}
			);
		});
	}
}
