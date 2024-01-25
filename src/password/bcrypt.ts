import { hash, verify } from "@node-rs/bcrypt";

import type { PasswordHashingAlgorithm } from "./index.js";

export class Bcrypt implements PasswordHashingAlgorithm {
	constructor(options?: { cost?: number }) {
		this.cost = options?.cost ?? 10;
	}

	private cost: number;

	public async hash(password: string): Promise<string> {
		return await hash(password.normalize("NFKC"), this.cost);
	}

	public async verify(hash: string, password: string): Promise<boolean> {
		return await verify(password.normalize("NFKC"), hash);
	}
}
