// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  runtimeConfig: {
    apiSecret: '', // can be overridden by NUXT_API_SECRET environment variable
    public: {
      baseURL: 'localhost:3001',
      apiBase: 'https://api.escuelajs.co/api/v1', // can be overridden by NUXT_PUBLIC_API_BASE environment variable
    }
  },
  imports: {
    dirs: [
      // Scan top-level modules
      'composables',
      // ... or scan modules nested one level deep with a specific name and file extension
      'composables/*/index.{ts,js,mjs,mts}',
      // ... or scan all modules within given directory
      'composables/**'
    ]
  },
  components: [
    {
      path: './components',
      extensions: ['.vue'],
      pathPrefix: false
    }
  ],
  modules: [
    'vuetify-nuxt-module',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/fonts',
    'nuxt-lodash',
    '@vee-validate/nuxt',
  ],
  css: [
    '~/assets/scss/main.scss',
  ],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  lodash: {
    prefix: "_",
    prefixSkip: ["string"],
    upperAfterPrefix: false,
    exclude: ["map"],
    alias: [
      ["camelCase", "stringToCamelCase"], // => stringToCamelCase
      ["kebabCase", "stringToKebab"], // => stringToKebab
      ["isDate", "isLodashDate"], // => _isLodashDate
    ],
  },
  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },
})
