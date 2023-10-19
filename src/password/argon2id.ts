import { hash, verify } from "@node-rs/argon2";

import type { PasswordHashingAlgorithm } from "./index.js";

interface Argon2idConfig {
	memorySize?: number;
	iterations?: number;
	tagLength?: number;
	parallelism?: number;
	version?: number;
	secret?: Buffer;
}

export class Argon2id implements PasswordHashingAlgorithm {
	constructor(options: Argon2idConfig = {}) {
		this.options = options;
	}

	private options: Argon2idConfig;

	public async hash(password: string): Promise<string> {
		return await hash(password.normalize("NFKC"), {
			memoryCost: this.options.memorySize ?? 19456,
			timeCost: this.options.iterations ?? 2,
			outputLen: this.options.tagLength,
			parallelism: this.options.parallelism ?? 1,
			version: this.options.version,
			secret: this.options.secret
		});
	}

	public async verify(hash: string, password: string): Promise<boolean> {
		return await verify(hash, password.normalize("NFKC"), {
			memoryCost: this.options.memorySize,
			timeCost: this.options.iterations,
			outputLen: this.options.tagLength,
			parallelism: this.options.parallelism,
			version: this.options.version,
			secret: this.options.secret
		});
	}
}
