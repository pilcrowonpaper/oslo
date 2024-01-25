import { hash, verify } from "@node-rs/argon2";

import type { PasswordHashingAlgorithm } from "./index.js";
import type { TypedArray } from "../index.js";

const v0x13 = 1;

export class Argon2id implements PasswordHashingAlgorithm {
	constructor(options?: {
		memorySize?: number;
		iterations?: number;
		tagLength?: number;
		parallelism?: number;
		secret?: ArrayBuffer | TypedArray;
	}) {
		this.memorySize = options?.memorySize ?? 19456;
		this.iterations = options?.iterations ?? 2;
		this.tagLength = options?.tagLength ?? 32;
		this.parallelism = options?.parallelism ?? 1;
		this.secret = options?.secret ?? null;
	}

	private memorySize?: number;
	private iterations?: number;
	private tagLength?: number;
	private parallelism?: number;
	private secret: ArrayBuffer | TypedArray | null;

	public async hash(password: string): Promise<string> {
		return await hash(password.normalize("NFKC"), {
			memoryCost: this.memorySize,
			timeCost: this.iterations,
			outputLen: this.tagLength,
			parallelism: this.parallelism,
			version: v0x13,
			secret: this.secret ? Buffer.from(this.secret) : undefined
		});
	}

	public async verify(hash: string, password: string): Promise<boolean> {
		return await verify(hash, password.normalize("NFKC"), {
			memoryCost: this.memorySize,
			timeCost: this.iterations,
			outputLen: this.tagLength,
			parallelism: this.parallelism,
			version: v0x13,
			secret: this.secret ? Buffer.from(this.secret) : undefined
		});
	}
}
