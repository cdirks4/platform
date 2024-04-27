// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  build: {
    transpile: [],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxtjs/tailwindcss"],
  vite: {
    server: {
      hmr: {
        overlay: false, // Disable HMR overlay
      },
    },
  },
});
