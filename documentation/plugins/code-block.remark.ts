import type { Node } from "unist";
import type { VFile } from "vfile";
import type { TransformCallback, Transformer } from "unified";

export default (): Transformer => {
	return transformer;
};

function transformer(node: MarkdownNode, _file: VFile, next: TransformCallback): void {
	walkTree(node);
	next();
}

function walkTree(node: MarkdownNode): void {
	if (isCodeBlockNode(node)) {
		const result: string[] = [];
		node.meta = {
			refs: [],
			codeBlock: true
		};
		for (const codeLine of node.value.split("\n")) {
			if (codeLine.startsWith("//$")) {
				const [name, link] = codeLine.replace("//$", "").split("=");
				if (link.trim().startsWith("ref:")) {
					node.meta.refs!.push({
						name: name.trim(),
						link: "/reference/" + link.trim().replace("ref:", "") + "/" + name.trim()
					});
				} else {
					node.meta.refs!.push({
						name: name.trim(),
						link: link.trim()
					});
				}
			} else {
				result.push(codeLine);
			}
		}
		node.value = result.join("\n");
	}
	if ("children" in node && node.children) {
		for (const childNode of node.children) {
			walkTree(childNode);
		}
	}
}

function isCodeBlockNode(node: Node): node is CodeBlockNode {
	return node.type === "code";
}

interface MarkdownNode extends Node {
	children?: MarkdownNode[];
}

interface CodeBlockNode extends Node {
	type: "code";
	value: string;
	meta: null | {
		refs?: CodeRef[];
		codeBlock: boolean;
	};
	lang: string;
}

interface CodeRef {
	name: string;
	link: string;
}
