import type { TypedArray } from "../index.js";

export async function sha1(data: ArrayBuffer | TypedArray): Promise<ArrayBuffer> {
	return await crypto.subtle.digest("SHA-1", data);
}

export async function sha256(data: ArrayBuffer | TypedArray): Promise<ArrayBuffer> {
	return await crypto.subtle.digest("SHA-256", data);
}

export async function sha384(data: ArrayBuffer | TypedArray): Promise<ArrayBuffer> {
	return await crypto.subtle.digest("SHA-384", data);
}

export async function sha512(data: ArrayBuffer | TypedArray): Promise<ArrayBuffer> {
	return await crypto.subtle.digest("SHA-512", data);
}

export type SHAHash = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";
