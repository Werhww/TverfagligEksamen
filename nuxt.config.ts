// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["nuxt-quasar-ui", "@vueuse/nuxt"],
  quasar: {
    plugins: [
      "Loading",
      "Notify",
      "Dialog"
    ],

    iconSet: "material-symbols-rounded",
    extras: {
      fontIcons: [
        "material-symbols-rounded",
        "material-symbols-outlined",
        "material-symbols-sharp",
        "material-icons-outlined",
        "material-icons-round",
        "material-icons-sharp",
        "material-icons",
        "line-awesome",
        "fontawesome-v6"
      ],

      svgIcons: [
        "material-symbols-rounded",
        "material-symbols-outlined",
        "material-symbols-sharp",
        "material-icons-outlined",
        "material-icons-round",
        "material-icons-sharp",
        "material-icons",
        "line-awesome",
        "fontawesome-v6"
      ],
    },

    config: {
      dark: true,
      brand: {
        primary: '#252525',
        secondary: '#FFFFFF',
        accent: '#2E2E2E',
        dark: '#252525',
        "dark-page": '#252525',

        positive: '#21BA45',
        negative: '#C10015',
        info: '#31CCEC',
        warning: '#F2C037'
      },
    },
  },
})