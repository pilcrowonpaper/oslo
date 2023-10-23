export async function sha1(data: ArrayBufferLike): Promise<ArrayBuffer> {
	return await crypto.subtle.digest("SHA-1", data);
}

export async function sha256(data: ArrayBufferLike): Promise<ArrayBuffer> {
	return await crypto.subtle.digest("SHA-256", data);
}

export async function sha384(data: ArrayBufferLike): Promise<ArrayBuffer> {
	return await crypto.subtle.digest("SHA-384", data);
}

export async function sha512(data: ArrayBufferLike): Promise<ArrayBuffer> {
	return await crypto.subtle.digest("SHA-512", data);
}
