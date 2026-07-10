<script setup lang="ts">
import { computed } from 'vue'
import { getAllPeople, getPIs, type Person } from '@/data/people/index'

const allPeople = getAllPeople()
const pis = getPIs()

const PROFILE_PLATFORMS = [
  { key: 'email',           label: 'Email',            icon: '@' },
  { key: 'phone',           label: 'Phone',            icon: '📞' },
  { key: 'googleScholar',   label: 'Google Scholar',   icon: 'GS' },
  { key: 'linkedin',        label: 'LinkedIn',         icon: 'in' },
  { key: 'github',          label: 'GitHub',           icon: 'GH' },
  { key: 'personalWebsite', label: 'Website',          icon: '🌐' },
]

// Group people by role category
const roleGroups = computed(() => {
  const nonPi = allPeople.filter((p) => p.type !== 'pi')

  const professors: Person[] = []
  const postdocs: Person[] = []
  const phds: Person[] = []
  const ms_ug: Person[] = []

  for (const p of nonPi) {
    const t = (p.title || '').toLowerCase()
    if (t.includes('professor') || t.includes('research scientist')) {
      professors.push(p)
    } else if (t.includes('postdoc')) {
      postdocs.push(p)
    } else if (t.includes('phd') || t.includes('ph.d')) {
      phds.push(p)
    } else {
      ms_ug.push(p)
    }
  }

  return [
    { label: 'Professors & Research Scientists', people: professors },
    { label: 'Postdoctoral Researchers', people: postdocs },
    { label: 'PhD Students', people: phds },
    { label: 'MS & Undergraduate Students', people: ms_ug },
  ].filter((g) => g.people.length > 0)
})

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

function profileUrl(p: Person, key: string): string | undefined {
  if (key === 'email') return p.email || undefined
  if (key === 'phone') return p.phone || undefined
  return p.profiles?.[key] || undefined
}

function profileLink(p: Person, key: string): string | undefined {
  const url = profileUrl(p, key)
  if (!url) return undefined
  if (key === 'email') return `mailto:${url}`
  if (key === 'phone') return `tel:${url.replace(/\s+/g, '')}`
  return url
}
</script>

<template>
  <section class="py-12 sm:py-16 lg:py-20 border-b border-slate-200/80 bg-slate-50/40">
    <div class="container-page">
      <div class="max-w-2xl">
        <p class="text-xs font-semibold uppercase tracking-wider text-primary-700">Team</p>
        <h1 class="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
          People
        </h1>
        <p class="mt-3 text-base text-slate-600">
          The people behind qPALACE — principal investigator, professors, postdocs, and students. Click a card to view a member's full profile.
        </p>
      </div>

      <!-- PI (may also be a professor — shown separately) -->
      <div v-if="pis.length > 0" class="mt-10">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Principal Investigator
        </h2>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <router-link
            v-for="pi in pis"
            :key="pi.slug"
            :to="`/people/${pi.slug}`"
            class="card card-hover p-5 flex flex-col items-center text-center group"
          >
            <div
              class="h-16 w-16 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-semibold text-base border border-primary-200"
              aria-hidden="true"
            >
              {{ initials(pi) }}
            </div>
            <h3 class="mt-3 text-sm font-semibold text-slate-900 group-hover:text-primary-700">
              {{ pi.firstName }} {{ pi.lastName }}
            </h3>
            <p class="mt-0.5 text-xs text-primary-700 font-medium">{{ pi.title }}</p>
            <p class="mt-1 text-xs text-slate-500 line-clamp-2">{{ pi.department }}</p>
            <!-- Profile icons (includes email as first icon) -->
            <div class="mt-3 flex flex-wrap justify-center gap-2">
              <template v-for="pf in PROFILE_PLATFORMS" :key="pf.key">
                <a
                  v-if="profileLink(pi, pf.key)"
                  :href="profileLink(pi, pf.key)!"
                  :target="pf.key === 'email' || pf.key === 'phone' ? undefined : '_blank'"
                  rel="noopener noreferrer"
                  class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 hover:bg-primary-100 hover:text-primary-700 transition-colors"
                  :title="pf.label"
                  :aria-label="`${pi.name} ${pf.label}`"
                  @click.stop
                >{{ pf.icon }}</a>
                <span
                  v-else
                  class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-[10px] font-bold text-slate-300 cursor-not-allowed"
                  :title="pf.label + ' (not available)'"
                  aria-hidden="true"
                >{{ pf.icon }}</span>
              </template>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Role groups -->
      <div v-for="group in roleGroups" :key="group.label" class="mt-10">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          {{ group.label }}
        </h2>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <router-link
            v-for="person in group.people"
            :key="person.slug"
            :to="`/people/${person.slug}`"
            class="card card-hover p-5 flex flex-col items-center text-center group"
          >
            <div
              class="h-16 w-16 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-semibold text-base border border-primary-200"
              aria-hidden="true"
            >
              {{ initials(person) }}
            </div>
            <h3 class="mt-3 text-sm font-semibold text-slate-900 group-hover:text-primary-700">
              {{ person.firstName }} {{ person.lastName }}
            </h3>
            <p class="mt-0.5 text-xs text-primary-700 font-medium">{{ person.title }}</p>
            <p class="mt-1 text-xs text-slate-500 line-clamp-2">{{ person.department }}</p>
            <!-- Profile icons (includes email as first icon) -->
            <div class="mt-3 flex flex-wrap justify-center gap-2">
              <template v-for="pf in PROFILE_PLATFORMS" :key="pf.key">
                <a
                  v-if="profileLink(person, pf.key)"
                  :href="profileLink(person, pf.key)!"
                  :target="pf.key === 'email' || pf.key === 'phone' ? undefined : '_blank'"
                  rel="noopener noreferrer"
                  class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 hover:bg-primary-100 hover:text-primary-700 transition-colors"
                  :title="pf.label"
                  :aria-label="`${person.name} ${pf.label}`"
                  @click.stop
                >{{ pf.icon }}</a>
                <span
                  v-else
                  class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-[10px] font-bold text-slate-300 cursor-not-allowed"
                  :title="pf.label + ' (not available)'"
                  aria-hidden="true"
                >{{ pf.icon }}</span>
              </template>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="allPeople.length === 0" class="mt-12 rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
        <p class="text-slate-600">No people profiles found.</p>
        <p class="mt-2 text-sm text-slate-500">
          Add a JSON file under <code class="font-mono">src/data/people/</code> to get started.
        </p>
      </div>
    </div>
  </section>
</template>