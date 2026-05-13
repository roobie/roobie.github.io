import { defineConfig, envField, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import {
	transformerNotationDiff,
	transformerNotationHighlight,
	transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { SITE } from "./src/config";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import cloudflare from "@astrojs/cloudflare";

function buildPostDateMap(): Map<string, string> {
	const blogDir = join(import.meta.dirname, "src/data/blog");
	const dateMap = new Map<string, string>();
	const files = readdirSync(blogDir).filter((f) => f.endsWith(".md"));
	for (const file of files) {
		const content = readFileSync(join(blogDir, file), "utf-8");
		const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
		if (!fmMatch) continue;
		const fm = fmMatch[1];
		const slug = file.replace(/\.md$/, "");
		// Prefer modDatetime, fall back to pubDatetime
		const modMatch = fm.match(/^modDatetime:\s*(.+)$/m);
		const pubMatch = fm.match(/^pubDatetime:\s*(.+)$/m);
		// modDatetime can be null/empty, so check for actual date value
		const modVal = modMatch?.[1]?.trim();
		const pubVal = pubMatch?.[1]?.trim();
		const dateStr =
			modVal && modVal !== "null" && modVal !== "" ? modVal : pubVal;
		if (dateStr) {
			dateMap.set(slug, new Date(dateStr).toISOString());
		}
	}
	return dateMap;
}

const postDateMap = buildPostDateMap();

// https://astro.build/config
export default defineConfig({
	site: SITE.website,
	adapter: cloudflare({ prerenderEnvironment: "node" }),
	integrations: [
		sitemap({
			filter: (page) => SITE.showArchives || !page.endsWith("/archives"),
			serialize(item) {
				// Match blog post URLs: .../posts/{slug}/
				const postMatch = item.url.match(/\/posts\/([^/]+)\/?$/);
				if (postMatch) {
					const slug = postMatch[1];
					const lastmod = postDateMap.get(slug);
					if (lastmod) {
						item.lastmod = lastmod;
					}
				}
				return item;
			},
		}),
	],
	markdown: {
		remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
		shikiConfig: {
			// For more themes, visit https://shiki.style/themes
			themes: { light: "min-light", dark: "night-owl" },
			defaultColor: false,
			wrap: false,
			transformers: [
				transformerFileName({ style: "v2", hideDot: false }),
				transformerNotationHighlight(),
				transformerNotationWordHighlight(),
				transformerNotationDiff({ matchAlgorithm: "v3" }),
			],
		},
	},
	vite: {
		plugins: [
			// Vite version skew between @tailwindcss/vite (peer: ^5||^6||^7)
			// and astro 6 (which pulls vite 8). May or may not trigger
			// depending on resolved transitive shapes — keeping @ts-ignore
			// for resilience. Tracked upstream:
			// https://github.com/withastro/astro/issues/14030
			// @ts-ignore
			tailwindcss(),
			{
				// Externalize @resvg/resvg-js native binary from the server bundle.
				// OG images are prerendered at build time so resvg runs via Node,
				// not inside the Workers runtime. The Cloudflare adapter forces
				// ssr.noExternal=true, so we use resolveId to externalize instead.
				name: "externalize-resvg",
				enforce: "pre",
				resolveId(id) {
					if (id === "@resvg/resvg-js") {
						return { id, external: true };
					}
				},
			},
		],
		optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
		server: {
			allowedHosts: ["blog.localdev"],
		},
	},
	image: {
		responsiveStyles: true,
		layout: "constrained",
	},
	env: {
		schema: {
			PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
				access: "public",
				context: "client",
				optional: true,
			}),
		},
	},
	fonts: [
		{
			name: "Google Sans Code",
			cssVariable: "--font-google-sans-code",
			provider: fontProviders.google(),
			fallbacks: ["monospace"],
			weights: [300, 400, 500, 600, 700],
			styles: ["normal", "italic"],
		},
		{
			name: "Source Serif 4",
			cssVariable: "--font-source-serif-4",
			provider: fontProviders.google(),
			fallbacks: ["Georgia", "serif"],
			weights: [300, 400, 500, 600],
			styles: ["normal", "italic"],
		},
	],
	//   experimental: {
	//     preserveScriptOrder: true,
	//   },
});
