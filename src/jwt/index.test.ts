import { describe, test, expect } from "vitest";
import { createJWT, parseJWT, validateJWT } from "./index.js";

import { HMAC } from "../crypto/hmac.js";
import { ECDSA } from "../crypto/ecdsa.js";
import { RSASSAPKCS1v1_5, RSASSAPSS } from "../crypto/rsa.js";
import { TimeSpan } from "../index.js";

test.each(["ES256", "ES384", "ES512"] as const)(
	"Create and validate JWT with %s",
	async (algorithm) => {
		const { publicKey, privateKey } = await new ECDSA(
			ecdsaDictionary[algorithm].hash,
			ecdsaDictionary[algorithm].curve
		).generateKeyPair();
		const jwt = await createJWT(algorithm, privateKey, {
			message: "hello"
		});
		const validatedJWT = await validateJWT(algorithm, publicKey, jwt);
		expect(validatedJWT.algorithm).toBe(algorithm);
		expect(validatedJWT.header).toStrictEqual({
			typ: "JWT",
			alg: algorithm
		});
		expect(validatedJWT.payload).toStrictEqual({
			message: "hello"
		});
	}
);

test.each(["RS256", "RS384", "RS512"] as const)(
	"Create and validate JWT with %s",
	async (algorithm) => {
		const { publicKey, privateKey } = await new RSASSAPKCS1v1_5(
			rsassapkcs1v1_5Dictionary[algorithm]
		).generateKeyPair();
		const jwt = await createJWT(algorithm, privateKey, {
			message: "hello"
		});
		const validatedJWT = await validateJWT(algorithm, publicKey, jwt);
		expect(validatedJWT.algorithm).toBe(algorithm);
		expect(validatedJWT.header).toStrictEqual({
			typ: "JWT",
			alg: algorithm
		});
		expect(validatedJWT.payload).toStrictEqual({
			message: "hello"
		});
	}
);

test.each(["PS256", "PS384", "PS512"] as const)(
	"Create and validate JWT with %s",
	async (algorithm) => {
		const { publicKey, privateKey } = await new RSASSAPSS(
			rsassapssDictionary[algorithm]
		).generateKeyPair();
		const jwt = await createJWT(algorithm, privateKey, {
			message: "hello"
		});
		const validatedJWT = await validateJWT(algorithm, publicKey, jwt);
		expect(validatedJWT.algorithm).toBe(algorithm);
		expect(validatedJWT.header).toStrictEqual({
			typ: "JWT",
			alg: algorithm
		});
		expect(validatedJWT.payload).toStrictEqual({
			message: "hello"
		});
	}
);

test.each(["HS256", "HS384", "HS512"] as const)(
	"Create and validate JWT with %s",
	async (algorithm) => {
		const secretKey = await new HMAC(hmacDictionary[algorithm]).generateKey();
		const jwt = await createJWT(algorithm, secretKey, {
			message: "hello"
		});
		const validatedJWT = await validateJWT(algorithm, secretKey, jwt);
		expect(validatedJWT.algorithm).toBe(algorithm);
		expect(validatedJWT.header).toStrictEqual({
			typ: "JWT",
			alg: algorithm
		});
		expect(validatedJWT.payload).toStrictEqual({
			message: "hello"
		});
	}
);

describe("createJWT()", () => {
	test("Creates the correct JWT value", async () => {
		const secretKey = new Uint8Array([
			8, 138, 53, 76, 210, 41, 194, 216, 13, 70, 56, 196, 237, 57, 69, 41, 152, 114, 223, 150, 169,
			154, 191, 89, 202, 118, 249, 18, 34, 208, 18, 101, 70, 236, 76, 178, 117, 129, 106, 71, 253,
			79, 99, 9, 64, 208, 102, 50, 118, 72, 107, 46, 120, 2, 240, 217, 103, 66, 63, 52, 248, 23,
			140, 46
		]);
		const result = await createJWT(
			"HS256",
			secretKey,
			{
				message: "hello",
				count: 100
			},
			{
				audiences: ["_audience"],
				issuer: "_issuer",
				subject: "_subject",
				jwtId: "_jwtId"
			}
		);
		const expected =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXNzYWdlIjoiaGVsbG8iLCJjb3VudCI6MTAwLCJhdWQiOlsiX2F1ZGllbmNlIl0sInN1YiI6Il9zdWJqZWN0IiwiaXNzIjoiX2lzc3VlciIsImp0aSI6Il9qd3RJZCJ9.cKi5L4ZV79IHtpC-rXRwjnQIeWdswAvv1KavDSM_vds";
		expect(result).toBe(expected);
	});
});

test("parseJWT()", async () => {
	const secretKey = await new HMAC("SHA-256").generateKey();
	const currDateSeconds = Math.floor(Date.now() / 1000);
	const jwt = await createJWT(
		"HS256",
		secretKey,
		{
			message: "hello"
		},
		{
			audiences: ["_audience"],
			issuer: "_issuer",
			subject: "_subject",
			jwtId: "_jwtId",
			expiresIn: new TimeSpan(1, "h"),
			notBefore: new Date(),
			includeIssuedTimestamp: true,
			headers: {
				kid: "_kid"
			}
		}
	);
	expect(parseJWT(jwt)).toEqual({
		algorithm: "HS256",
		expiresAt: new Date((currDateSeconds + new TimeSpan(1, "h").seconds()) * 1000),
		notBefore: new Date(currDateSeconds * 1000),
		issuedAt: new Date(currDateSeconds * 1000),
		audiences: ["_audience"],
		issuer: "_issuer",
		subject: "_subject",
		jwtId: "_jwtId",
		value: jwt,
		parts: jwt.split("."),
		header: {
			kid: "_kid",
			typ: "JWT",
			alg: "HS256"
		},
		payload: {
			message: "hello",
			aud: ["_audience"],
			iss: "_issuer",
			sub: "_subject",
			jti: "_jwtId",
			exp: currDateSeconds + new TimeSpan(1, "h").seconds(),
			iat: currDateSeconds,
			nbf: currDateSeconds
		}
	});
});

describe("validateJWT", () => {
	test("Checks expiration", async () => {
		const secretKey = await new HMAC("SHA-256").generateKey();
		const jwt1 = await createJWT(
			"HS256",
			secretKey,
			{},
			{
				expiresIn: new TimeSpan(-1, "s")
			}
		);
		const jwt2 = await createJWT(
			"HS256",
			secretKey,
			{},
			{
				expiresIn: new TimeSpan(0, "s")
			}
		);
		await expect(validateJWT("HS256", secretKey, jwt1)).rejects.toThrowError();
		await expect(validateJWT("HS256", secretKey, jwt2)).rejects.toThrowError();
	});
	test("Checks not before time", async () => {
		const secretKey = await new HMAC("SHA-256").generateKey();
		const jwt1 = await createJWT(
			"HS256",
			secretKey,
			{},
			{
				notBefore: new Date(Date.now() + 1000)
			}
		);
		const jwt2 = await createJWT(
			"HS256",
			secretKey,
			{},
			{
				notBefore: new Date()
			}
		);
		await expect(validateJWT("HS256", secretKey, jwt1)).rejects.toThrowError();
		await expect(validateJWT("HS256", secretKey, jwt2)).resolves.not.toThrowError();
	});
	test("Throws on invalid algorithm", async () => {
		const secretKey = await new HMAC("SHA-256").generateKey();
		const jwt = await createJWT(
			"HS256",
			secretKey,
			{},
			{
				notBefore: new Date(Date.now() + 1000)
			}
		);
		await expect(validateJWT("HS512", secretKey, jwt)).rejects.toThrowError();
	});
	test("Throws on invalid signature", async () => {
		const secretKey = await new HMAC("SHA-256").generateKey();
		const jwt = await createJWT(
			"HS256",
			secretKey,
			{},
			{
				notBefore: new Date(Date.now() + 1000)
			}
		);
		const invalidKey = await new HMAC("SHA-256").generateKey();
		await expect(validateJWT("HS512", invalidKey, jwt)).rejects.toThrowError();
	});
	test("Throws on invalid JWT", async () => {
		const secretKey = await new HMAC("SHA-256").generateKey();
		await expect(validateJWT("HS256", secretKey, "huhuihdeuihdiheud")).rejects.toThrowError();
		await expect(
			validateJWT("HS256", secretKey, "huhuihdeuihdiheudheiuhdehd.dededed.deded")
		).rejects.toThrowError();
	});
});

const ecdsaDictionary = {
	ES256: {
		hash: "SHA-256",
		curve: "P-256"
	},
	ES384: {
		hash: "SHA-384",
		curve: "P-384"
	},
	ES512: {
		hash: "SHA-512",
		curve: "P-521"
	}
} as const;

const hmacDictionary = {
	HS256: "SHA-256",
	HS384: "SHA-384",
	HS512: "SHA-512"
} as const;

const rsassapkcs1v1_5Dictionary = {
	RS256: "SHA-256",
	RS384: "SHA-384",
	RS512: "SHA-512"
} as const;

const rsassapssDictionary = {
	PS256: "SHA-256",
	PS384: "SHA-384",
	PS512: "SHA-512"
} as const;
