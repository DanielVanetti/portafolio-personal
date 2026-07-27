// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/fonts'],

  css: ['~/assets/css/tokens.css', '~/assets/css/base.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#FAF9F6' }
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      script: [
        {
          /**
           * Marca el documento antes del primer pintado. Solo con estas clases
           * el CSS oculta los elementos que se van a animar y muestra el
           * preloader, así que sin JS —o con reduced-motion— el contenido
           * queda visible desde el inicio y no hay cortina que levantar.
           */
          innerHTML:
            "try{var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('js-motion');if(!sessionStorage.getItem('dg-preloader'))d.classList.add('js-preloader')}}catch(e){}",
          tagPosition: 'head'
        }
      ]
    },
    // Transicion entre rutas: fade sobrio, sin desplazamientos largos.
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  fonts: {
    families: [
      { name: 'Fraunces', provider: 'google', weights: [300, 600] },
      { name: 'Space Grotesk', provider: 'google', weights: [400, 500] }
    ],
    defaults: { fallbacks: { serif: ['Georgia'], 'sans-serif': ['Helvetica Neue'] } }
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/404.html']
    }
  }
})
