export interface PasswordHashingAlgorithm {
  hash: (password: string) => Promise<string>;
  verify: (hash: string, password: string) => Promise<boolean>;
}

export { Argon2Id } from "./argon2id.js";
export type { Argon2IdConfig } from "./argon2id.js";

export { Scrypt } from "./scrypt.js";
export type { ScryptConfig } from "./scrypt.js";

export { Bcrypt } from "./bcrypt.js";
export type { BcryptConfig } from "./bcrypt.js";
