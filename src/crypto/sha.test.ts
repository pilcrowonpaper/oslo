import { expect, test } from "vitest";
import { sha1, sha256, sha384, sha512 } from "./sha.js";
import { encodeHex } from "../encoding/index.js";

const data = new TextEncoder().encode("hello world");

test("sha1()", async () => {
	const result = await sha1(data);
	expect(encodeHex(result)).toBe("2aae6c35c94fcfb415dbe95f408b9ce91ee846ed");
});

test("sha256()", async () => {
	const result = await sha256(data);
	expect(encodeHex(result)).toBe(
		"b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
	);
});

test("sha384()", async () => {
	const result = await sha384(data);
	expect(encodeHex(result)).toBe(
		"fdbd8e75a67f29f701a4e040385e2e23986303ea10239211af907fcbb83578b3e417cb71ce646efd0819dd8c088de1bd"
	);
});

test("sha512()", async () => {
	const result = await sha512(data);
	expect(encodeHex(result)).toBe(
		"309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f"
	);
});
