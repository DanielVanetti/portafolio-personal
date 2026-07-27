/**
 * Datos de identidad del sitio.
 * Solo información pública: el teléfono personal y los datos de referencias
 * del CV quedan deliberadamente fuera.
 */
export const SITE = {
  name: 'Daniel González Picado',
  shortName: 'Daniel González',
  role: 'Desarrollador Full Stack',
  tagline: 'Full Stack Developer — Costa Rica',
  email: 'danielgonzalezpicado@gmail.com',
  location: 'Liberia, Guanacaste, CR',
  coordinates: '10.63°N, 85.44°W'
} as const

export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/DanielVanetti' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/daniel-gonzález-picado' }
] as const

/** Franja de skills del marquee. */
export const SKILLS = [
  'C#', 'Python', 'PHP', 'JavaScript', 'React', 'Angular', 'Django',
  'WordPress', 'SQL Server', 'Firebase', 'Docker', 'Git', 'Power BI', 'SCRUM'
] as const
