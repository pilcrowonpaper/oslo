export class OAuth2RequestError extends Error {
	public request: Request;
	public response: Response;
	constructor(request: Request, response: Response) {
		super(response.statusText);
		this.request = request;
		this.response = response;
	}
}

export async function handleRequest<_ResponseBody extends {}>(
	request: Request
): Promise<_ResponseBody> {
	request.headers.set("Accept", "application/json");
	const response = await fetch(request);
	if (!response.ok) {
		throw new OAuth2RequestError(request, response);
	}
	return (await response.json()) as _ResponseBody;
}

export function createURL(
	url: string | URL,
	urlSearchParams: Record<string, string | undefined>
): URL {
	const newUrl = new URL(url);
	for (const [key, value] of Object.entries(urlSearchParams)) {
		if (!value) continue;
		newUrl.searchParams.set(key, value);
	}
	return newUrl;
}

export function authorizationHeader(
	type: "bearer" | "basic",
	token: string
): string {
	if (type === "basic") {
		return ["Basic", token].join(" ");
	}
	if (type === "bearer") {
		return ["Bearer", token].join(" ");
	}
	throw new TypeError("Invalid token type");
}
