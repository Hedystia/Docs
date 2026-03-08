import { defineConfig } from "vitepress";

import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import { createFileSystemTypesCache } from "@shikijs/vitepress-twoslash/cache-fs";

import lightbox from "vitepress-plugin-lightbox";

import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { comlink } from "vite-plugin-comlink";
import { fileURLToPath } from "url";

const description =
  "Hedystia is a modern TypeScript backend framework with end-to-end type safety, real-time subscriptions, and an intuitive developer experience.";

export default defineConfig({
  lang: "en-US",
  title: "Hedystia",
  description,
  ignoreDeadLinks: true,
  lastUpdated: false,
  sitemap: {
    hostname: "https://docs.hedystia.com",
  },
  markdown: {
    theme: {
      light: "github-light",
      dark: "github-dark",
    },
    codeTransformers: [
      transformerTwoslash({
        typesCache: createFileSystemTypesCache(),
      }),
    ],
    languages: ["js", "ts", "javascript", "typescript", "jsx", "tsx", "bash", "vue", "json", "yml"],
    config: (md) => {
      md.use(lightbox, {});
    },
  },
  buildEnd() {
    process.exit(0);
  },
  head: [
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
    [
      "link",
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
    ],
    [
      "link",
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: "",
      },
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=ABeeZee:ital@0;1&family=Days+One&display=swap",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        href: "/logo.png",
      },
    ],
    [
      "meta",
      {
        property: "og:image",
        content: "https://docs.hedystia.com/logo.png",
      },
    ],
    [
      "meta",
      {
        property: "og:title",
        content: "Hedystia - End-to-End Type Safe Framework",
      },
    ],
    [
      "meta",
      {
        property: "og:description",
        content: description,
      },
    ],
    [
      "meta",
      {
        property: "twitter:card",
        content: "summary_large_image",
      },
    ],
    [
      "link",
      {
        rel: "canonical",
        href: "https://docs.hedystia.com",
      },
    ],
  ],
  vite: {
    clearScreen: false,
    server: {
      watch: {
        usePolling: true,
      },
    },
    experimental: {
      enableNativePlugin: false,
    },
    resolve: {
      alias: [
        {
          find: /^.*\/VPNavBarSearch\.vue$/,
          replacement: fileURLToPath(new URL("./theme/navbar-search.vue", import.meta.url)),
        },
      ],
    },
    plugins: [
      nodePolyfills({
        include: ["path", "crypto"],
      }),
      tailwindcss(),
      comlink(),
    ],
    worker: {
      plugins: () => [comlink()],
    },
    optimizeDeps: {
      exclude: [
        "@nolebase/vitepress-plugin-inline-link-preview/client",
        ".vitepress/cache",
        "@rollup/browser",
      ],
    },
    ssr: {
      noExternal: ["@nolebase/vitepress-plugin-inline-link-preview", "@nolebase/ui"],
    },
  },
  themeConfig: {
    search: {
      provider: "local",
      options: {
        detailedView: true,
      },
    },
    logo: "/logo.png",
    nav: [
      {
        text: "Docs",
        link: "/framework/introduction",
      },
      {
        text: "Blog",
        link: "/blog",
      },
    ],
    sidebar: {
      "/": [
        {
          text: "Framework",
          collapsed: false,
          items: [
            { text: "Introduction", link: "/framework/introduction" },
            { text: "Getting Started", link: "/framework/getting-started" },
            { text: "Routing", link: "/framework/routing" },
            { text: "Context", link: "/framework/context" },
            { text: "Validation", link: "/framework/validation" },
            { text: "Middleware", link: "/framework/middleware" },
            { text: "Error Handling", link: "/framework/error-handling" },
            { text: "Plugins", link: "/framework/plugins" },
            { text: "Best Practices", link: "/framework/best-practices" },
          ],
        },
        {
          text: "Server",
          collapsed: false,
          items: [
            { text: "Overview", link: "/server/overview" },
            { text: "Handlers", link: "/server/handlers" },
            { text: "Subscriptions", link: "/server/subscriptions" },
          ],
        },
        {
          text: "Client",
          collapsed: false,
          items: [
            { text: "Overview", link: "/client/overview" },
            { text: "Typed Requests", link: "/client/typed-requests" },
          ],
        },
        {
          text: "Plugins",
          collapsed: false,
          items: [
            { text: "Overview", link: "/plugins/overview" },
            { text: "Swagger", link: "/plugins/swagger" },
            { text: "Adapter", link: "/plugins/adapter" },
          ],
        },
      ],
      "/billing/": [
        {
          text: "Billing",
          items: [
            { text: "Welcome", link: "/billing/start" },
            {
              text: "Installation",
              collapsed: true,
              items: [
                { text: "Requirements", link: "/billing/installation/require" },
                { text: "Install", link: "/billing/installation/install" },
                { text: "Webserver", link: "/billing/installation/webserver" },
                { text: "Pterodactyl", link: "/billing/installation/pterodactyl" },
              ],
            },
            {
              text: "Upgrade",
              collapsed: true,
              items: [{ text: "Updating", link: "/billing/upgrade/update" }],
            },
            {
              text: "Admin",
              collapsed: true,
              items: [{ text: "Admin Area", link: "/billing/admin/admin-area" }],
            },
            {
              text: "Extensions",
              collapsed: true,
              items: [{ text: "Introduction", link: "/billing/extensions/intro" }],
            },
          ],
        },
      ],
      "/cache/": [
        {
          text: "Cache",
          items: [
            { text: "Start", link: "/cache/start" },
            { text: "Methods", link: "/cache/methods" },
          ],
        },
      ],
      "/db/": [
        {
          text: "DataBase",
          items: [
            { text: "Start", link: "/db/start" },
            { text: "Example", link: "/db/example" },
          ],
        },
      ],
      "/stats/": [
        {
          text: "Github Stats",
          items: [
            { text: "Start", link: "/stats/start" },
            { text: "Usage", link: "/stats/usage" },
            { text: "Themes", link: "/stats/themes" },
          ],
        },
      ],
    },
    outline: {
      level: [2, 3],
      label: "On this page",
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/Hedystia/Framework" },
      { icon: "discord", link: "https://hedystia.com/discord" },
    ],
    editLink: {
      text: "Edit this page on GitHub",
      pattern: "https://github.com/Hedystia/Docs/edit/main/docs/:path",
    },
  },
});
