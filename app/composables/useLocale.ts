import { MESSAGES } from '~/i18n/messages'
import { localeFromPath, pagePath, translatePath, type Locale, type PageKey } from '~/utils/locale'

/**
 * Idioma actual y textos de la interfaz, derivados de la ruta: no hay estado
 * que sincronizar, y el prerender genera cada idioma como páginas distintas.
 */
export function useLocale() {
  const route = useRoute()

  const locale = computed<Locale>(() => localeFromPath(route.path))
  const t = computed(() => MESSAGES[locale.value])
  const otherLocale = computed<Locale>(() => (locale.value === 'es' ? 'en' : 'es'))

  const path = (page: PageKey, slug?: string) => pagePath(locale.value, page, slug)

  /** Enlace a una sección de la landing, desde cualquier página. */
  const section = (id: string) => ({ path: pagePath(locale.value, 'home'), hash: `#${id}` })

  const switchTo = computed(() => translatePath(route.path, otherLocale.value) + (route.hash || ''))

  return { locale, t, otherLocale, path, section, switchTo }
}
