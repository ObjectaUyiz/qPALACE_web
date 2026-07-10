/**
 * Base URL handling.
 *
 * When deployed to a sub-path (e.g. https://user.github.io/qpalace/),
 * Vite sets `base: '/qpalace/'`. All in-repo links that begin with `/`
 * (e.g. `/papers/example.pdf`) must be prefixed with that base so they
 * resolve correctly on the deployed site.
 *
 * Use `withBase(path)` everywhere instead of writing paths directly.
 */

const BASE = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '/')

/**
 * Prefix a relative path with the Vite base URL.
 *
 * - Returns external URLs (http://, https://, mailto:, etc.) unchanged.
 * - Returns hash-only (`#...`) and query-only (`?...`) fragments unchanged.
 * - Returns paths that already include the base unchanged.
 * - Otherwise prepends the base.
 */
export function withBase(path: string): string {
  if (!path) return path

  // External / protocol links
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path

  // Hash or query only — keep as-is so Vue Router / anchors work
  if (path.startsWith('#') || path.startsWith('?')) return path

  // Already prefixed
  if (BASE !== '/' && path.startsWith(BASE)) return path

  if (path.startsWith('/')) {
    // Strip trailing slash from base, then prepend
    return BASE.replace(/\/$/, '') + path
  }

  return BASE + path
}

/**
 * Build a Vue Router `to` location with the base URL applied.
 *
 *   routeTo('/papers')            -> '/qpalace/papers'
 *   routeTo('/papers', { p: 2 })  -> { path: '/qpalace/papers', query: { p: 2 } }
 */
export function routeTo(path: string, query?: Record<string, string | number>) {
  if (!query) return withBase(path)
  const q: Record<string, string> = {}
  for (const [k, v] of Object.entries(query)) q[k] = String(v)
  return { path: withBase(path), query: q }
}