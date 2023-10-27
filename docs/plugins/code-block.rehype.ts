import { getHighlighter } from "shiki";

import type { Root, Element, Text, ElementContent } from "hast";

export default (): Transformer => {
	return transformer;
};

type Transformer = (root: Root) => void;

function transformer(root: Root): void {
	walkTree(root);
}

const highlighter = await getHighlighter({
	theme: "css-variables",
	langs: ["ts"]
});

function walkTree(node: Element | Root): void {
	for (let i = 0; i < node.children.length; i++) {
		const childNode = node.children[i];
		if (childNode.type === "element") {
			if (childNode.tagName === "pre") {
				const grandChildNode = childNode.children[0];
				if (isCodeBlockCodeElement(grandChildNode)) {
					let rawCodeHTML = highlighter.codeToHtml(grandChildNode.children[0].value, {
						lang: "ts"
					});
					for (const codeRef of grandChildNode.data.meta.refs) {
						rawCodeHTML = rawCodeHTML.replaceAll(
							"$$" + codeRef.name,
							`<a href="${codeRef.link}">${codeRef.name}</a>`
						);
					}
					node.children[i] = {
						type: "raw",
						value: rawCodeHTML
					};
					continue;
				}
			}
			walkTree(childNode);
		}
	}
}

function isCodeBlockCodeElement(node: ElementContent): node is CodeBlockCodeElement {
	return (
		node.type === "element" &&
		node.tagName === "code" &&
		typeof node.data?.meta === "object" &&
		node.data.meta !== null &&
		"codeBlock" in node.data.meta &&
		node.data.meta.codeBlock === true
	);
}

interface CodeBlockCodeElement extends Element {
	data: {
		meta: {
			refs: CodeRef[];
			codeBlock: true;
		};
	};
	children: [Text];
}

interface CodeRef {
	name: string;
	link: string;
}
