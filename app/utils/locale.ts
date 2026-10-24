/**
 * Rutas por idioma. El español vive en la raíz y el inglés bajo /en, con sus
 * propias palabras en la URL (/detalles ↔ /en/details).
 *
 * Es deliberadamente pequeño: dos idiomas, tres tipos de página. Un módulo de
 * i18n completo añadiría más configuración que contenido.
 */

export type Locale = 'es' | 'en'
export type PageKey = 'home' | 'details'

export const LOCALES: readonly Locale[] = ['es', 'en']

const BASE: Record<Locale, Record<PageKey, string>> = {
  es: { home: '/', details: '/detalles' },
  en: { home: '/en', details: '/en/details' }
}

export const pagePath = (locale: Locale, page: PageKey, slug?: string) =>
  slug ? `${BASE[locale][page]}/${slug}` : BASE[locale][page]

export const localeFromPath = (path: string): Locale =>
  path === '/en' || path.startsWith('/en/') ? 'en' : 'es'

/** La misma página en el otro idioma; si no hay equivalente, su inicio. */
export const translatePath = (path: string, to: Locale): string => {
  const from = localeFromPath(path)
  const clean = path.replace(/\/+$/, '') || '/'

  for (const page of ['details', 'home'] as PageKey[]) {
    const base = BASE[from][page]
    if (page === 'home' ? clean === base : clean === base || clean.startsWith(`${base}/`)) {
      const rest = page === 'home' ? '' : clean.slice(base.length).replace(/^\//, '')
      return pagePath(to, page, rest || undefined)
    }
  }
  return BASE[to].home
}
