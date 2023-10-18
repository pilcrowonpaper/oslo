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
	constructor(config: Argon2idConfig = {}) {
		this.config = config;
	}

	private config: Argon2idConfig;

	public async hash(password: string): Promise<string> {
		return await hash(password.normalize("NFKC"), {
			memoryCost: this.config.memorySize ?? 19456,
			timeCost: this.config.iterations ?? 2,
			outputLen: this.config.tagLength,
			parallelism: this.config.parallelism ?? 1,
			version: this.config.version,
			secret: this.config.secret
		});
	}

	public async verify(hash: string, password: string): Promise<boolean> {
		return await verify(hash, password.normalize("NFKC"), {
			memoryCost: this.config.memorySize,
			timeCost: this.config.iterations,
			outputLen: this.config.tagLength,
			parallelism: this.config.parallelism,
			version: this.config.version,
			secret: this.config.secret
		});
	}
}
