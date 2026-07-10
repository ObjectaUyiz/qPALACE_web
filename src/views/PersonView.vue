<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPersonBySlug, getSlugByNameMap, type Person } from '@/data/people/index'
import papersData from '@/data/papers.json'
import { withBase } from '@/utils/paths'
import PaperCitationItem, { type Paper } from '@/components/PaperCitationItem.vue'

interface Education {
  degree: string
  field?: string
  institution: string
  year?: string | number
}

interface Award {
  title: string
  year?: string | number
  org?: string
  url?: string
}

interface NewsItem {
  date: string
  title: string
  url?: string
}

// ---------- Resolve person by slug ----------
const route = useRoute()
const router = useRouter()
const allPapers = papersData as Paper[]

const slug = computed(() => String(route.params.slug || ''))

const person = computed<Person | null>(() => {
  const s = slug.value
  if (!s) return null
  return getPersonBySlug(s) ?? null
})

// ---------- Combine papers: auto-filtered (from papers.json) + person-specific ----------
const projectPapers = computed<Paper[]>(() => {
  const p = person.value
  if (!p) return []
  const name = p.name
  return allPapers
    .filter((paper) => {
      if (paper.authors.includes(name)) return true
      if (p.highlightsAuthorInPapers && (paper.highlightAuthors ?? []).includes(name)) return true
      return false
    })
    .map((paper) => ({ ...paper, isPersonal: false }))
    .sort((a, b) => b.year - a.year)
})

const personalPapers = computed<Paper[]>(() => {
  const p = person.value
  if (!p || !p.additionalPapers) return []
  return p.additionalPapers
    .map((paper) => ({ ...paper, isPersonal: true }))
    .sort((a, b) => b.year - a.year)
})

const allPersonPapers = computed<Paper[]>(() => {
  return [...projectPapers.value, ...personalPapers.value]
})

// ---------- Stats ----------
const stats = computed(() => {
  const papers = allPersonPapers.value
  const total = papers.length
  const position = person.value?.featuredAuthorPosition ?? 'first'
  const leadCount = papers.filter((p) =>
    position === 'first' ? p.authors[0] === person.value?.name : p.authors[p.authors.length - 1] === person.value?.name,
  ).length
  const projectCount = projectPapers.value.length
  const personalCount = personalPapers.value.length
  const venues = new Set(papers.map((p) => p.venue).filter(Boolean))
  const yearsActive = papers.length
    ? Math.max(...papers.map((p) => p.year)) - Math.min(...papers.map((p) => p.year)) + 1
    : 0
  return { total, leadCount, projectCount, personalCount, venueCount: venues.size, yearsActive }
})

// ---------- Featured (lead-authored) papers ----------
const featuredPapers = computed<Paper[]>(() => {
  const p = person.value
  if (!p) return []
  const position = p.featuredAuthorPosition ?? 'first'
  return allPersonPapers.value
    .filter((paper) =>
      position === 'first'
        ? paper.authors[0] === p.name
        : paper.authors[paper.authors.length - 1] === p.name,
    )
    .slice(0, 6) // cap
})

// ---------- Year grouping for "All publications" ----------
const groupedPapers = computed<Record<number, Paper[]>>(() => {
  const map: Record<number, Paper[]> = {}
  for (const paper of allPersonPapers.value) {
    if (!map[paper.year]) map[paper.year] = []
    map[paper.year].push(paper)
  }
  const result: Record<number, Paper[]> = {}
  const keys = Object.keys(map).map(Number).sort((a, b) => b - a)
  for (const k of keys) result[k] = map[k]
  return result
})

// ---------- Co-author network ----------
const coAuthors = computed<{ name: string; count: number; slug: string | null }[]>(() => {
  const p = person.value
  if (!p) return []
  const counts = new Map<string, number>()
  for (const paper of allPersonPapers.value) {
    for (const a of paper.authors) {
      if (a === p.name) continue
      counts.set(a, (counts.get(a) ?? 0) + 1)
    }
  }
  // Build lookup of all known people (pi + members) by name -> slug
  const slugByName = getSlugByNameMap()
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count, slug: slugByName.get(name) ?? null }))
})

// ---------- Bibtex toggle ----------
const openBibtexTitle = ref<string | null>(null)
const toggleBibtex = (title: string) => {
  openBibtexTitle.value = openBibtexTitle.value === title ? null : title
}
const closeBibtex = () => {
  openBibtexTitle.value = null
}

// ---------- UI helpers ----------
const initials = (p: { firstName?: string; lastName?: string }) => {
  const name = `${p.firstName || ''} ${p.lastName || ''}`.trim()
  return name
    .replace(/^(Prof\.|Dr\.|Mr\.|Ms\.|Mrs\.)\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

const formatDate = (d: string) => {
  if (!d) return ''
  const date = new Date(d)
  if (isNaN(date.getTime())) return d
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const hasResearchInterests = computed(() => (person.value?.researchInterests?.length ?? 0) > 0)
const hasEducation = computed(() => (person.value?.education?.length ?? 0) > 0)
const hasAwards = computed(() => (person.value?.awards?.length ?? 0) > 0)
const hasNews = computed(() => (person.value?.news?.length ?? 0) > 0)
const hasAppointments = computed(() => (person.value?.appointments?.length ?? 0) > 0)
const hasPapers = computed(() => allPersonPapers.value.length > 0)
const hasFeatured = computed(() => featuredPapers.value.length > 0)
const hasCoAuthors = computed(() => coAuthors.value.length > 0)
const hasBio = computed(() => !!person.value?.bio && person.value.bio.trim().length > 0)

// ---------- Profile platforms (academic / professional accounts) ----------
interface ProfilePlatform {
  key: string
  label: string
  // Render as an inline SVG path
  iconPath: string
  // 'mastodon' uses a different viewBox so we keep the viewBox per-platform here
  viewBox?: string
}

const PROFILE_PLATFORMS: ProfilePlatform[] = [
  {
    key: 'email',
    label: 'Email',
    viewBox: '0 0 24 24',
    iconPath: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22,6 L12,13 L2,6 Z',
  },
  {
    key: 'phone',
    label: 'Phone',
    viewBox: '0 0 24 24',
    iconPath: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  },
  {
    key: 'googleScholar',
    label: 'Google Scholar',
    viewBox: '0 0 24 24',
    iconPath:
      'M12 3 L3 9 L12 11 L21 9 Z M5 11.5 V15.5 C5 17 8 18.5 12 18.5 C16 18.5 19 17 19 15.5 V11.5 L12 14.5 Z M12 21 L9 19 L12 17.5 L15 19 Z',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    viewBox: '0 0 24 24',
    iconPath:
      'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3-.02-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21h-4V9z',
  },
  {
    key: 'github',
    label: 'GitHub',
    viewBox: '0 0 24 24',
    iconPath:
      'M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1-.01-1.96-3.2.69-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.74 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.18a10.94 10.94 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.57.23 2.73.11 3.02.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55C20.21 21.39 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5Z',
  },
  {
    key: 'personalWebsite',
    label: 'Website',
    viewBox: '0 0 24 24',
    iconPath:
      'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.93 6h-2.95a15.7 15.7 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.93 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14a8.05 8.05 0 0 1 0-4h3.38a16.6 16.6 0 0 0 0 4H4.26zm.81 2h2.95c.32 1.25.78 2.45 1.38 3.56A8.03 8.03 0 0 1 5.07 16zm2.95-8H5.07a8.03 8.03 0 0 1 4.33-3.56A15.7 15.7 0 0 0 8.02 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66a14.77 14.77 0 0 1 0-4h4.68a14.77 14.77 0 0 1 0 4zm.26 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14a16.6 16.6 0 0 0 0-4h3.38a8.05 8.05 0 0 1 0 4h-3.38z',
  },
]

// Build the resolved list of profiles the person has set, in display order.
// Shows ALL platforms — ones with a URL are clickable, ones without are disabled.
// Email and Phone are handled specially: they read from person.email/person.phone.
const personProfiles = computed(() => {
  const p = person.value
  const profiles = p?.profiles
  const result: { platform: ProfilePlatform; url: string; available: boolean }[] = []
  for (const platform of PROFILE_PLATFORMS) {
    let url = ''
    let available = false
    if (platform.key === 'email') {
      url = p?.email || ''
      available = !!(url && typeof url === 'string' && url.trim().length > 0)
    } else if (platform.key === 'phone') {
      url = p?.phone || ''
      available = !!(url && typeof url === 'string' && url.trim().length > 0)
    } else {
      url = profiles?.[platform.key] || ''
      available = !!(url && typeof url === 'string' && url.trim().length > 0)
    }
    result.push({ platform, url, available })
  }
  return result
})

const profileLink = (p: { platform: ProfilePlatform; url: string; available: boolean }) => {
  if (!p.available) return undefined
  if (p.platform.key === 'email') return `mailto:${p.url}`
  if (p.platform.key === 'phone') return `tel:${p.url.replace(/\s+/g, '')}`
  return p.url
}

// Featured abstracts are collapsible: track which are expanded
const expandedAbstracts = ref<Set<string>>(new Set())
const toggleAbstract = (title: string) => {
  const next = new Set(expandedAbstracts.value)
  if (next.has(title)) next.delete(title)
  else next.add(title)
  expandedAbstracts.value = next
}

// 404
const notFound = computed(() => !!slug.value && !person.value)

if (notFound.value) {
  setTimeout(() => router.replace('/team'), 50)
}
</script>

<template>
  <section v-if="person" class="py-12 sm:py-16 lg:py-20 border-b border-slate-200/80">
    <div class="container-page">
      <!-- Back link -->
      <div class="mb-6">
        <router-link to="/team" class="link-academic text-sm font-medium inline-flex items-center gap-1">
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to team
        </router-link>
      </div>

      <!-- Header card -->
      <header class="card overflow-hidden">
        <div class="grid lg:grid-cols-12 gap-0">
          <!-- Avatar -->
          <div class="lg:col-span-3 bg-slate-50/40 flex items-center justify-center p-8 border-b lg:border-b-0 lg:border-r border-slate-200">
            <img
              v-if="person.avatar"
              :src="withBase(person.avatar)"
              :alt="person.name"
              class="h-32 w-32 lg:h-40 lg:w-40 rounded-full object-cover border border-slate-200 bg-white"
              loading="lazy"
              @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')"
            />
            <div
              v-else
              class="h-32 w-32 lg:h-40 lg:w-40 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-semibold text-3xl border border-primary-200"
              aria-hidden="true"
            >
              {{ initials(person) }}
            </div>
          </div>

          <!-- Identity -->
          <div class="lg:col-span-9 p-6 sm:p-8">
            <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
              {{ person.firstName }} {{ person.lastName }}
            </h1>
            <p v-if="person.title" class="mt-1 text-base text-primary-700 font-medium">
              {{ person.title }}
            </p>
            <p v-if="person.department" class="mt-1 text-sm text-slate-600">
              {{ person.department }}
              <template v-if="person.school"> · {{ person.school }}</template>
              <template v-if="person.institution"> · {{ person.institution }}</template>
            </p>

            <ul v-if="hasAppointments" class="mt-3 flex flex-wrap gap-1.5">
              <li v-for="(a, i) in person.appointments" :key="i" class="tag">
                {{ a }}
              </li>
            </ul>

            <p v-if="hasBio" class="mt-4 text-sm sm:text-base text-slate-700 leading-relaxed">
              {{ person.bio }}
            </p>
          </div>
        </div>
      </header>

      <!-- Research interests -->
      <section v-if="hasResearchInterests" class="mt-10">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Research Interests
        </h2>
        <ul class="mt-3 flex flex-wrap gap-2">
          <li
            v-for="(r, i) in person.researchInterests"
            :key="i"
            class="tag-primary"
          >
            {{ r }}
          </li>
        </ul>
      </section>

      <!-- Profiles & links (Email, Google Scholar, LinkedIn, GitHub, etc.) — show all, disabled if empty -->
      <section class="mt-10">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Profiles &amp; Links
        </h2>
        <ul class="mt-3 flex flex-wrap gap-2">
          <li v-for="p in personProfiles" :key="p.platform.key">
            <a
              v-if="profileLink(p)"
              :href="profileLink(p)!"
              :target="p.platform.key === 'email' ? undefined : '_blank'"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-primary-700 transition-colors"
            >
              <svg
                class="h-3.5 w-3.5 text-slate-500"
                :viewBox="p.platform.viewBox || '0 0 24 24'"
                fill="currentColor"
                aria-hidden="true"
              >
                <path :d="p.platform.iconPath" />
              </svg>
              {{ p.platform.label }}
              <svg v-if="p.platform.key !== 'email' && p.platform.key !== 'phone'" class="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
            <span
              v-else
              class="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-300 cursor-not-allowed"
              :title="`${p.platform.label} (not available)`"
            >
              <svg
                class="h-3.5 w-3.5 text-slate-300"
                :viewBox="p.platform.viewBox || '0 0 24 24'"
                fill="currentColor"
                aria-hidden="true"
              >
                <path :d="p.platform.iconPath" />
              </svg>
              {{ p.platform.label }}
            </span>
          </li>
        </ul>
      </section>

      <!-- Stats summary -->
      <section v-if="hasPapers" class="mt-10">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500">
          At a Glance
        </h2>
        <dl class="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="card p-4">
            <dt class="text-xs text-slate-500">Publications</dt>
            <dd class="mt-1 text-2xl font-semibold text-slate-900">{{ stats.total }}</dd>
            <p v-if="stats.personalCount > 0" class="mt-1 text-[11px] text-slate-500">
              {{ stats.projectCount }} on the qPALACE list · {{ stats.personalCount }} personal
            </p>
          </div>
          <div class="card p-4">
            <dt class="text-xs text-slate-500">
              {{ (person.featuredAuthorPosition ?? 'first') === 'last' ? 'Senior-author' : 'Lead-author' }} papers
            </dt>
            <dd class="mt-1 text-2xl font-semibold text-slate-900">{{ stats.leadCount }}</dd>
          </div>
          <div class="card p-4">
            <dt class="text-xs text-slate-500">Venues</dt>
            <dd class="mt-1 text-2xl font-semibold text-slate-900">{{ stats.venueCount }}</dd>
          </div>
          <div class="card p-4">
            <dt class="text-xs text-slate-500">Years active</dt>
            <dd class="mt-1 text-2xl font-semibold text-slate-900">{{ stats.yearsActive }}</dd>
          </div>
        </dl>
      </section>

      <!-- Education -->
      <section v-if="hasEducation" class="mt-10">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Education
        </h2>
        <ul class="mt-3 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-soft">
          <li
            v-for="(e, i) in person.education"
            :key="i"
            class="px-5 sm:px-6 py-3 flex flex-wrap items-baseline gap-x-3 gap-y-1"
          >
            <span class="font-medium text-slate-900 text-sm sm:text-base">
              <template v-if="e.degree">{{ e.degree }}</template><template v-if="e.degree && e.field"> in </template><template v-if="e.field">{{ e.field }}</template>
            </span>
            <span class="text-sm text-slate-600">{{ e.institution }}</span>
            <span v-if="e.year" class="text-xs text-slate-500 sm:ml-auto">{{ e.year }}</span>
          </li>
        </ul>
      </section>

      <!-- Awards -->
      <section v-if="hasAwards" class="mt-10">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Awards &amp; Honors
        </h2>
        <ul class="mt-3 space-y-2">
          <li
            v-for="(a, i) in person.awards"
            :key="i"
            class="card p-4 text-sm"
          >
            <div class="flex flex-wrap items-baseline justify-between gap-2">
              <a
                v-if="a.url"
                :href="a.url"
                target="_blank"
                rel="noopener noreferrer"
                class="font-medium text-slate-900 link-academic"
              >{{ a.title }}</a>
              <span v-else class="font-medium text-slate-900">{{ a.title }}</span>
              <span v-if="a.year" class="text-xs text-slate-500">{{ a.year }}</span>
            </div>
            <p v-if="a.org" class="mt-0.5 text-xs text-slate-500">{{ a.org }}</p>
          </li>
        </ul>
      </section>

      <!-- Featured (lead-authored) papers with abstracts -->
      <section v-if="hasFeatured" class="mt-10">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {{ (person.featuredAuthorPosition ?? 'first') === 'last' ? 'Senior-Author Papers' : 'Lead-Author Papers' }}
        </h2>
        <p class="mt-1 text-xs text-slate-500">
          Up to 6 most recent lead-authored papers.
        </p>

        <div class="mt-3 space-y-3">
          <article
            v-for="paper in featuredPapers"
            :key="paper.title"
            class="card p-5 sm:p-6"
          >
            <h3 class="text-base sm:text-lg font-semibold leading-snug">
              <a
                v-if="paper.paperUrl || paper.arxivUrl"
                :href="withBase((paper.paperUrl || paper.arxivUrl)!)"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary-800 hover:text-primary-900 hover:underline underline-offset-2"
              >{{ paper.title }}</a>
              <span v-else class="text-primary-800">{{ paper.title }}</span>
              <span v-if="paper.isPersonal" class="ml-2 align-middle tag-warn text-[10px]">Personal</span>
            </h3>

            <p class="mt-1 text-sm text-slate-700">
              <template v-for="(a, idx) in paper.authors" :key="a + idx">
                <span :class="a === person.name ? 'font-semibold text-slate-900' : ''">{{ a }}</span><span v-if="idx < paper.authors.length - 1">, </span>
              </template>
            </p>

            <p class="mt-1 text-sm text-slate-500">
              <span>{{ paper.venue }}</span><span>, {{ paper.year }}</span>
              <span v-if="paper.status && paper.status.toLowerCase() !== 'published'" class="ml-1">
                · <span class="tag-warn">{{ paper.status }}</span>
              </span>
              <span class="ml-1">· <span class="tag">{{ paper.type }}</span></span>
            </p>

            <p
              v-if="paper.abstract"
              class="mt-3 text-sm text-slate-600 leading-relaxed"
              :class="expandedAbstracts.has(paper.title) ? '' : 'line-clamp-3'"
            >
              {{ paper.abstract }}
            </p>

            <div class="mt-3 flex flex-wrap items-center gap-2">
              <button
                v-if="paper.abstract"
                type="button"
                class="text-xs font-medium text-primary-700 hover:text-primary-900"
                @click="toggleAbstract(paper.title)"
              >
                {{ expandedAbstracts.has(paper.title) ? 'Show less' : 'Show full abstract' }}
              </button>
              <a
                v-if="paper.paperUrl"
                :href="withBase(paper.paperUrl)"
                target="_blank"
                rel="noopener noreferrer"
                class="citation-link"
              >[PDF]</a>
              <a
                v-if="paper.arxivUrl"
                :href="withBase(paper.arxivUrl)"
                target="_blank"
                rel="noopener noreferrer"
                class="citation-link"
              >[arXiv]</a>
              <a
                v-if="paper.codeUrl"
                :href="withBase(paper.codeUrl)"
                target="_blank"
                rel="noopener noreferrer"
                class="citation-link"
              >[Code]</a>
              <a
                v-if="paper.projectUrl"
                :href="withBase(paper.projectUrl)"
                target="_blank"
                rel="noopener noreferrer"
                class="citation-link"
              >[Project]</a>
              <a
                v-if="paper.slidesUrl"
                :href="withBase(paper.slidesUrl)"
                target="_blank"
                rel="noopener noreferrer"
                class="citation-link"
              >[Slides]</a>
              <button
                v-if="paper.bibtex"
                type="button"
                class="citation-link"
                :aria-expanded="openBibtexTitle === paper.title"
                @click="toggleBibtex(paper.title)"
              >[BibTeX]</button>
            </div>

            <PaperCitationItem
              v-if="paper.bibtex && openBibtexTitle === paper.title"
              :paper="{ ...paper, isPersonal: paper.isPersonal }"
              :bibtex-open="true"
              class="mt-2"
              @close-bibtex="closeBibtex"
            />
          </article>
        </div>
      </section>

      <!-- Co-authors -->
      <section v-if="hasCoAuthors" class="mt-10">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Co-Authors
        </h2>
        <p class="mt-1 text-xs text-slate-500">
          Auto-derived from the publications listed on this site. The count after each name is the number of joint publications. Linked names have a profile page; others are external collaborators.
        </p>
        <ul class="mt-3 flex flex-wrap gap-2">
          <li v-for="c in coAuthors" :key="c.name">
            <router-link
              v-if="c.slug"
              :to="`/people/${c.slug}`"
              class="tag-primary hover:bg-primary-100 transition-colors"
            >
              {{ c.name }}
              <span class="ml-1 text-primary-500 text-[10px]">×{{ c.count }}</span>
            </router-link>
            <span v-else class="tag">
              {{ c.name }}
              <span class="ml-1 text-slate-400 text-[10px]">×{{ c.count }}</span>
            </span>
          </li>
        </ul>
      </section>

      <!-- News -->
      <section v-if="hasNews" class="mt-10">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500">
          News
        </h2>
        <ul class="mt-3 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-soft">
          <li
            v-for="(n, i) in person.news"
            :key="i"
            class="px-5 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4"
          >
            <time
              :datetime="n.date"
              class="shrink-0 text-xs font-medium uppercase tracking-wider text-slate-500 sm:w-32"
            >
              {{ formatDate(n.date) }}
            </time>
            <p class="text-sm sm:text-base text-slate-800">
              <a
                v-if="n.url"
                :href="n.url"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-primary-700 hover:underline underline-offset-2"
              >{{ n.title }}</a>
              <span v-else>{{ n.title }}</span>
            </p>
          </li>
        </ul>
      </section>

      <!-- All publications (combined) -->
      <section v-if="hasPapers" class="mt-10">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500">
              All Publications
            </h2>
            <p class="mt-1 text-xs text-slate-500">
              {{ stats.total }} total
              <template v-if="stats.personalCount > 0">
                · <span class="text-amber-700">{{ stats.personalCount }} personal (pre-qPALACE)</span>
              </template>
            </p>
          </div>
          <router-link to="/papers" class="link-academic text-sm font-medium inline-flex items-center gap-1">
            View the full qPALACE list
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </router-link>
        </div>
        <div class="mt-3 rounded-lg border border-slate-200 bg-white shadow-soft overflow-hidden">
          <div v-for="(items, yr) in groupedPapers" :key="yr">
            <h3 class="px-5 sm:px-6 py-2 text-sm font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/70 border-y border-slate-200/80">
              {{ yr }}
            </h3>
            <div class="px-5 sm:px-6 py-2 divide-y divide-slate-200">
              <PaperCitationItem
                v-for="paper in items"
                :key="paper.title"
                :paper="paper"
                :bibtex-open="openBibtexTitle === paper.title"
                @toggle-bibtex="toggleBibtex"
                @close-bibtex="closeBibtex"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>

  <section v-else class="py-20">
    <div class="container-page text-center">
      <p class="text-slate-600">Person not found.</p>
      <router-link to="/team" class="btn-outline mt-4 inline-flex">Back to team</router-link>
    </div>
  </section>
</template>