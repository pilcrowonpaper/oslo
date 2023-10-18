export interface PasswordHashingAlgorithm {
	hash(password: string): Promise<string>;
	verify(hash: string, password: string): Promise<boolean>;
}

export { Argon2id } from "./argon2id.js";

export { Scrypt } from "./scrypt.js";

export { Bcrypt } from "./bcrypt.js";
