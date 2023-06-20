import { defineConfig, sharpImageService } from "astro/config"
import fs from "node:fs"

import mdx from "@astrojs/mdx"
import netlify from "@astrojs/netlify/functions"
import prefetch from "@astrojs/prefetch"
import sitemap from "@astrojs/sitemap"
import solidJs from "@astrojs/solid-js"
import tailwind from "@astrojs/tailwind"

/* https://docs.netlify.com/configure-builds/environment-variables/#read-only-variables */
const NETLIFY_PREVIEW_SITE =
	process.env.CONTEXT === "dev"
		? "http://localhost:3000"
		: process.env.CONTEXT !== "production" && process.env.DEPLOY_PRIME_URL

// https://astro.build/config
export default defineConfig({
	experimental: {
		assets: true,
	},
	site: NETLIFY_PREVIEW_SITE || "https://astro.build",
	integrations: [
		tailwind({
			config: {
				applyBaseStyles: false,
			},
		}),
		solidJs(),
		mdx(),
		sitemap(),
		prefetch(),
	],
	markdown: {
		shikiConfig: {
			theme: JSON.parse(fs.readFileSync("./houston.theme.json", { encoding: "utf-8" })),
		},
	},
	vite: {
		ssr: {
			noExternal: ["smartypants"],
		},
	},
	image: {
		service: sharpImageService(),
	},
	output: "server",
	adapter: netlify(),
})
