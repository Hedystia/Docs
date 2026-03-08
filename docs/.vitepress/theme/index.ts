import { toRefs } from "vue";
import { useData, useRoute, type EnhanceAppContext, type Theme } from "vitepress";
import { createPinia } from "pinia";

import DefaultTheme from "vitepress/theme-without-fonts";

import Layout from "./layout.vue";

import TwoslashFloatingVue from "@shikijs/vitepress-twoslash/client";
import "@shikijs/vitepress-twoslash/style.css";

import "../../tailwind.css";

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }: EnhanceAppContext) {
    const pinia = createPinia();

    app.use(pinia);
    app.use(TwoslashFloatingVue);
  },
} satisfies Theme;
