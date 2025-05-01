// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightDocSearch from "@astrojs/starlight-docsearch";

// https://astro.build/config
export default defineConfig({
	site: "https://docs.hedystia.com",
	prefetch: true,
	integrations: [
		starlight({
			title: "Docs",
			customCss: ["./src/styles/custom.css"],
			favicon: "/favicon.ico",
			prerender: true,
			social: [
				{
					href: "https://github.com/Zastinian",
					icon: "github",
					label: "GitHub",
				},
				{
					href: "https://discord.gg/aXvuUpvRQs",
					icon: "discord",
					label: "Discord",
				},
			],
			sidebar: [
				{
					label: "Welcome",
					link: "/welcome",
				},
				{
					label: "Billing",
					collapsed: true,
					items: [
						{
							label: "Start",
							link: "/billing/start",
						},
						{
							label: "Installation",
							autogenerate: {
								directory: "billing/installation",
								collapsed: true,
							},
						},
						{
							label: "Upgrade",
							autogenerate: {
								directory: "billing/upgrade",
								collapsed: true,
							},
						},
						{
							label: "Admin",
							autogenerate: {
								directory: "billing/admin",
								collapsed: true,
							},
						},
						{
							label: "Extensions",
							autogenerate: {
								directory: "billing/extensions",
								collapsed: true,
							},
						},
					],
				},
				{
					label: "Builders",
					collapsed: true,
					items: [
						{
							label: "Start",
							link: "/builders/start",
						},
						{
							label: "Builder",
							autogenerate: {
								directory: "builders/builder",
								collapsed: true,
							},
						},
						{
							label: "Normal",
							autogenerate: {
								directory: "builders/normal",
								collapsed: true,
							},
						},
						{
							label: "Util",
							autogenerate: {
								directory: "builders/util",
								collapsed: true,
							},
						},
					],
				},
				{
					label: "Cache",
					collapsed: true,
					items: [
						{
							label: "Start",
							link: "/cache/start",
						},
						{
							label: "Methods",
							link: "/cache/methods",
						},
					],
				},
				{
					label: "DataBase",
					collapsed: true,
					items: [
						{
							label: "Start",
							link: "/db/start",
						},
						{
							label: "Example",
							link: "/db/example",
						},
					],
				},
				{
					label: "DataBase Rust",
					collapsed: true,
					items: [
						{
							label: "Start",
							link: "/dbrs/start",
						},
						{
							label: "Example",
							link: "/dbrs/example",
						},
					],
				},
				{
					label: "Github Stats",
					collapsed: true,
					items: [
						{
							label: "Start",
							link: "/stats/start",
						},
						{
							label: "Usage",
							link: "/stats/usage",
						},
						{
							label: "Themes",
							link: "/stats/themes",
						},
					],
				},
				{
					label: "StrangeApi",
					collapsed: true,
					items: [
						{
							label: "Start",
							link: "/strange/start",
						},
						{
							label: "Api",
							link: "/strange/api",
						},
						{
							label: "Filters",
							link: "/strange/filters",
						},
						{
							label: "Generators",
							link: "/strange/generators",
						},
						{
							label: "Overlays",
							link: "/strange/overlays",
						},
						{
							label: "Utils",
							link: "/strange/utils",
						},
					],
				},
				{
					label: "Hedystia.js",
					collapsed: true,
					items: [
						{
							label: "Start",
							link: "/client/start",
						},
						{
							label: "Client",
							link: "/client/client",
						},
						{
							label: "Builders",
							autogenerate: {
								directory: "client/builders",
								collapsed: true,
							},
						},
						{
							label: "Managers",
							autogenerate: {
								directory: "client/managers",
								collapsed: true,
							},
						},
						{
							label: "Structures",
							autogenerate: {
								directory: "client/structures",
								collapsed: true,
							},
						},
						{
							label: "Util",
							autogenerate: {
								directory: "client/util",
								collapsed: true,
							},
						},
					],
				},
				{
					label: "Useful",
					collapsed: true,
					items: [
						{
							label: "Start",
							link: "/useful/start",
						},
						{
							label: "Color",
							autogenerate: {
								directory: "useful/color",
								collapsed: true,
							},
						},
						{
							label: "Gen",
							autogenerate: {
								directory: "useful/gen",
								collapsed: true,
							},
						},
						{
							label: "Utils",
							autogenerate: {
								directory: "useful/utils",
								collapsed: true,
							},
						},
						{
							label: "Validation",
							autogenerate: {
								directory: "useful/validation",
								collapsed: true,
							},
						},
					],
				},
			],
			plugins: [
				starlightDocSearch({
					appId: process.env.APP_ID,
					apiKey: process.env.SEARCH_API_KEY,
					indexName: process.env.INDEX_NAME,
				}),
			],
		}),
	],
});
