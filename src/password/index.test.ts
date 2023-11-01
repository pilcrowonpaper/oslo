import { test, expect } from "vitest";
import { Argon2id, Bcrypt, Scrypt } from "./index.js";
import { encodeHex } from "../encoding/index.js";

test("Argon2id", async () => {
	const password = encodeHex(crypto.getRandomValues(new Uint8Array(32)));
	const argon2id = new Argon2id();
	const hash = await argon2id.hash(password);
	expect(argon2id.verify(hash, password)).resolves.toBe(true);
});

test("Bcrypt", async () => {
	const password = encodeHex(crypto.getRandomValues(new Uint8Array(32)));
	const bcrypt = new Bcrypt();
	const hash = await bcrypt.hash(password);
	expect(bcrypt.verify(hash, password)).resolves.toBe(true);
});

test("Argon2id", async () => {
	const password = encodeHex(crypto.getRandomValues(new Uint8Array(32)));
	const scrypt = new Scrypt();
	const hash = await scrypt.hash(password);
	expect(scrypt.verify(hash, password)).resolves.toBe(true);
});
