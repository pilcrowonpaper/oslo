export function verifyRequestOrigin(options: {
	origin: string | null | undefined;
	host: string | null | undefined;
	allowedSubdomains?: string[] | "*";
}): boolean {
	if (!options.origin || !options.host) return false;
	const originHost = new URL(options.origin).host;
	let host: string;
	if (
		options.host.startsWith("https//") ||
		options.host.startsWith("https://")
	) {
		host = new URL(options.host).host;
	} else {
		host = options.host.split(":")[0]!;
	}
	if (originHost.endsWith("." + host) && options.allowedSubdomains) {
		if (options.allowedSubdomains === "*") {
			return true;
		}
		for (const allowedSubdomain of options.allowedSubdomains) {
			if (originHost === allowedSubdomain + "." + host) {
				return true;
			}
		}
	}
	return originHost === host;
}
