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

	public hash(password: string): Promise<string> {
		const cost = this.options.cost ?? 10;
		return hash(password.normalize("NFKC"), cost);
	}

	public verify(hash: string, password: string): Promise<boolean> {
		return verify(password.normalize("NFKC"), hash);
	}
}
