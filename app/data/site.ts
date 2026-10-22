/**
 * Datos de identidad del sitio.
 * Solo información pública: el teléfono personal y los datos de referencias
 * del CV quedan deliberadamente fuera.
 */
export const SITE = {
  name: 'Daniel González Picado',
  shortName: 'Daniel González',
  /* Firma de autoría del pie. Va aparte del nombre legal porque es el
     alias con el que Daniel publica su trabajo. */
  author: 'Daniel Vanetti',
  email: 'danielgonzalezpicado@gmail.com',
  /** Dominio público: lo necesitan los enlaces hreflang, que deben ser absolutos. */
  url: 'https://danielgonzalezportafolio.netlify.app'
} as const

export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/DanielVanetti' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/daniel-gonzález-picado' }
] as const
