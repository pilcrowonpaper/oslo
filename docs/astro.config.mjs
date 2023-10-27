import { defineConfig } from "astro/config";
import codeBlockRehype from "./plugins/code-block.rehype";
import codeBlockRemark from "./plugins/code-block.remark";
import codeRefLinkRemark from "./plugins/code-ref-link.remark";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind()],
	markdown: {
		rehypePlugins: [codeBlockRehype],
		remarkPlugins: [codeBlockRemark, codeRefLinkRemark],
		syntaxHighlight: false
	}
});
