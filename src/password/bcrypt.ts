import { hash, verify } from "@node-rs/bcrypt";

import type { PasswordHashingAlgorithm } from "./index.js";

interface BcryptConfig {
	cost?: number;
}

export class Bcrypt implements PasswordHashingAlgorithm {
	constructor(options: BcryptConfig = {}) {
		this.options = options;
	}

	private options: BcryptConfig;

	public async hash(password: string): Promise<string> {
		const cost = this.options.cost ?? 10;
		return await hash(password.normalize("NFKC"), cost);
	}

	public async verify(hash: string, password: string): Promise<boolean> {
		return await verify(password.normalize("NFKC"), hash);
	}
}
