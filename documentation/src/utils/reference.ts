import type { MarkdownInstance } from "astro";

const markdownImports: Record<string, () => Promise<MarkdownInstance<Frontmatter>>> =
	await import.meta.glob("/content/reference/**");
const files = await Promise.all(
	Object.entries(markdownImports).map(([_importPath, resolve]) => {
		return resolve();
	})
);
export const referenceContent: ReferenceContent[] = files.map((val) => {
	const path = val.file.split("/content/reference/")[1].replace("/index.md", "").replace(".md", "");
	const name = path.split("/").at(-1)!;
	const type = getReferenceContentType(val.frontmatter.type, val.file);
	let displayName = name;
	if (type === "function" || type === "method") {
		displayName = displayName + "()";
	}
	if (type === "module") {
		displayName = name === "main" ? "oslo" : "oslo/" + name;
	}
	const module = path.split("/")[0];
	return {
		moduleDisplayName: module === "main" ? "oslo" : "oslo/" + module,
		displayName,
		href: "/reference/" + path,
		name,
		type,
		module,
		path,
		Markdown: val.Content
	};
});

export const moduleMaps: ModuleMap[] = referenceContent
	.filter((val) => val.type === "module")
	.map((val) => {
		const classes: ReferenceLink[] = [];
		const types: ReferenceLink[] = [];
		const interfaces: ReferenceLink[] = [];
		const functions: ReferenceLink[] = [];
		for (const maybeChild of referenceContent) {
			if (maybeChild.module !== val.module) continue;
			const link: ReferenceLink = {
				displayName: maybeChild.displayName,
				href: maybeChild.href,
				name: maybeChild.name,
				path: maybeChild.path
			};
			if (maybeChild.type === "class") {
				classes.push(link);
			}
			if (maybeChild.type === "type") {
				types.push(link);
			}
			if (maybeChild.type === "interface") {
				interfaces.push(link);
			}
			if (maybeChild.type === "function") {
				functions.push(link);
			}
		}
		return {
			type: "module",
			href: "/reference/" + val.module,
			module: val.module,
			classes,
			types,
			interfaces,
			functions
		};
	});

interface Frontmatter {
	type: string;
}

type ReferenceContentType = "module" | "class" | "type" | "interface" | "method" | "function";

export interface ReferenceContent {
	moduleDisplayName: string;
	displayName: string;
	name: string;
	href: string;
	type: ReferenceContentType;
	module: string;
	path: string;
	Markdown: MarkdownInstance<any>["Content"];
}

export interface ModuleMap {
	type: "module";
	module: string;
	href: string;
	interfaces: ReferenceLink[];
	functions: ReferenceLink[];
	classes: ReferenceLink[];
	types: ReferenceLink[];
}

export interface ClassMapItem {
	type: "class";
	methods: ReferenceLink[];
}
interface ReferenceLink {
	displayName: string;
	href: string;
	name: string;
	path: string;
}

function getReferenceContentType(maybeContentType: string, file: string): ReferenceContentType {
	if (
		maybeContentType === "module" ||
		maybeContentType === "class" ||
		maybeContentType === "interface" ||
		maybeContentType === "type" ||
		maybeContentType === "function" ||
		maybeContentType === "method"
	) {
		return maybeContentType;
	}
	throw new Error(`Invalid content type: ${maybeContentType} at ${file}`);
}
