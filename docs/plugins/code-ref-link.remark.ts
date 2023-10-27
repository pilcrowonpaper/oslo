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
	if (isLinkNode(node)) {
		const childNode = node.children?.at(0) ?? null;
		if (
			childNode &&
			node.url.startsWith("ref:") &&
			"value" in childNode &&
			typeof childNode.value === "string"
		) {
			node.url =
				"/reference/" +
				node.url.replace("ref:", "") +
				"/" +
				childNode.value.replaceAll(".", "/").replaceAll("()", "");
		}
	}
	if ("children" in node && node.children) {
		for (const childNode of node.children) {
			walkTree(childNode);
		}
	}
}

function isLinkNode(node: Node): node is LinkNode {
	return node.type === "link";
}

interface MarkdownNode extends Node {
	children?: MarkdownNode[];
}

interface LinkNode extends MarkdownNode {
	type: "link";
	url: string;
}
