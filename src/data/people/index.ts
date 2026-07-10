/**
 * People data loader.
 *
 * Uses Vite's import.meta.glob to import every JSON file in the people/
 * directory at build time. Adding a new person = creating a new .json file
 * in src/data/people/ - no code changes needed.
 *
 * Each file must have at minimum:
 *   - slug: string       (kebab-case, used as the URL path)
 *   - firstName: string
 *   - lastName: string
 *   - type: "pi" | "member"
 */

export interface Person {
  type: 'pi' | 'member'
  slug: string
  lastName: string
  firstName: string
  /** Computed display/citation name: "First Last". */
  name: string
  title?: string
  appointments?: string[]
  department?: string
  school?: string
  institution?: string
  email?: string
  phone?: string
  website?: string
  profiles?: Record<string, string | undefined>
  office?: {
    room?: string
    building?: string
    street?: string
    city?: string
    mailCode?: string
  } | null
  avatar?: string
  bio?: string
  researchInterests?: string[]
  education?: Array<{ degree: string; field?: string; institution: string; year?: string | number }>
  awards?: Array<{ title: string; year?: string | number; org?: string; url?: string }>
  news?: Array<{ date: string; title: string; url?: string }>
  additionalPapers?: any[]
  highlightsAuthorInPapers?: boolean
  featuredAuthorPosition?: 'first' | 'last'
}

type GlobModule = { default: Record<string, unknown> }

// Import all JSON files in the people/ directory
const globModules = import.meta.glob<GlobModule>('./*.json', { eager: true })

const rawRecords: Record<string, unknown>[] = Object.values(globModules).map((mod) => mod.default)

const allPeople: Person[] = rawRecords
  .filter((r): r is Record<string, unknown> => r != null && typeof r === 'object')
  .map((r) => {
    const type = r.type === 'pi' ? 'pi' : 'member'
    const lastName = String(r.lastName || '')
    const firstName = String(r.firstName || '')
    // Use the standard U.S. display format: given name followed by family name.
    const name = `${firstName} ${lastName}`.trim()
    return { ...r, type, lastName, firstName, name } as unknown as Person
  })

/** Look up a person by slug. Returns undefined if not found. */
export function getPersonBySlug(slug: string): Person | undefined {
  return allPeople.find((p) => p.slug === slug)
}

/** All people, with the PI first (if present) followed by members. */
export function getAllPeople(): Person[] {
  const pi = allPeople.filter((p) => p.type === 'pi')
  const members = allPeople.filter((p) => p.type === 'member')
  return [...pi, ...members]
}

/** Only the PI(s). */
export function getPIs(): Person[] {
  return allPeople.filter((p) => p.type === 'pi')
}

/** Only the team members (non-PI). */
export function getMembers(): Person[] {
  return allPeople.filter((p) => p.type === 'member')
}

/** Build a name -> slug lookup for co-author linking. */
export function getSlugByNameMap(): Map<string, string> {
  const map = new Map<string, string>()
  for (const p of allPeople) {
    map.set(p.name, p.slug)
  }
  return map
}
