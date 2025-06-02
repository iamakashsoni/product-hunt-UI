import tsconfigPaths from "vite-tsconfig-paths";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  css: ["@/assets/css/tailwind.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  components: {
    dirs: [
      "~/components",
      {
        path: "~/components/ui",
        pathPrefix: false,
        global: false,
        extensions: ["vue"],
        prefix: "Shad",
        ignore: ["**/index.ts"],
      },
    ],
  },

  modules: ["@nuxt/icon"],
  vite: {
    plugins: [tsconfigPaths()],
  },
});
