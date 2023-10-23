export function authorizationHeader(type: "bearer" | "basic", token: string): string {
	if (type === "basic") {
		return ["Basic", token].join(" ");
	}
	if (type === "bearer") {
		return ["Bearer", token].join(" ");
	}
	throw new TypeError("Invalid token type");
}
