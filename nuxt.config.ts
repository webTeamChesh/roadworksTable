export default defineNuxtConfig({
  runtimeConfig: {
    accessToken: process.env.accessToken,
    alias: process.env.alias,
    projectId: process.env.projectId,
    public: {
      gtm: {
        id: 'GTM-5ZQX9F',
      },
    },
  },
  modules: ['@zadigetvoltaire/nuxt-gtm', 'cec-vue-lib'],
  devtools: { enabled: false },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: 'favicon.png' },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
        },
        {
          rel: 'stylesheet',
          href: 'https://www.cheshireeast.gov.uk/siteelements/css/bs5/400-cec-styles.css',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700',
        },
      ],
      script: [
        {
          src: 'https://www.browsealoud.com/plus/scripts/3.1.0/ba.js',
          crossorigin: 'anonymous',
          defer: true,
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js',
          defer: true,
        },
        {
          src: 'https://cc.cdn.civiccomputing.com/9/cookieControl-9.x.min.js',
          defer: true,
        },
      ],
    },
    buildAssetsDir: '/cached-assets/',
    baseURL: '/highways-and-roads/roadworks-and-travel-disruption/',
  },
});
