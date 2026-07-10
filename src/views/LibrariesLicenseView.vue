<script setup lang="ts">
import { computed } from 'vue'
import librariesData from '@/data/libraries.json'

interface Library {
  name: string
  version: string
  license: string
  url: string
  author?: string
  description: string
}

const libraries = librariesData as Library[]

const grouped = computed<Record<string, Library[]>>(() => {
  const map: Record<string, Library[]> = {}
  for (const lib of libraries) {
    const key = lib.license || 'Other'
    if (!map[key]) map[key] = []
    map[key].push(lib)
  }
  // Sort libraries within each group alphabetically
  for (const k of Object.keys(map)) {
    map[k].sort((a, b) => a.name.localeCompare(b.name))
  }
  // Order groups in a conventional license order
  const order = ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'BSD-2-Clause', 'ISC', 'MPL-2.0', 'OFL-1.1', 'Other']
  const result: Record<string, Library[]> = {}
  for (const k of order) if (map[k]) result[k] = [...map[k]]
  // Anything not in the canonical order
  for (const k of Object.keys(map)) {
    if (!result[k]) result[k] = map[k]
  }
  return result
})

const totalCount = computed(() => libraries.length)

const licenseBlurb = (key: string): string => {
  switch (key) {
    case 'MIT':
      return 'Permissive license. Requires attribution; allows commercial use, modification, and distribution.'
    case 'Apache-2.0':
      return 'Permissive license. Requires attribution and a NOTICE file; grants an explicit patent license.'
    case 'BSD-3-Clause':
      return 'Permissive license similar to BSD-2-Clause, with an additional clause prohibiting the use of contributors\' names for endorsement.'
    case 'BSD-2-Clause':
      return 'Permissive license. Requires attribution and preserves the copyright notice.'
    case 'ISC':
      return 'Permissive license functionally equivalent to the Simplified BSD license.'
    case 'MPL-2.0':
      return 'Weak copyleft license. Modifications to the covered files must be shared under the same license.'
    case 'OFL-1.1':
      return 'Open Font License. Allows the font to be used, studied, modified, and redistributed freely.'
    default:
      return 'See upstream project for license terms.'
  }
}
</script>

<template>
  <section class="py-12 sm:py-16 lg:py-20 border-b border-slate-200/80">
    <div class="container-page">
      <div class="mx-auto max-w-3xl">
        <p class="text-xs font-semibold uppercase tracking-wider text-primary-700">Libraries</p>
        <h1 class="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
          Libraries &amp; Licenses
        </h1>
        <p class="mt-3 text-base text-slate-600">
          qPALACE and this website are built on top of open-source software. The list below
          acknowledges the third-party projects used in this site and links each one to its
          upstream source for the full license text.
        </p>

        <div class="mt-6 rounded-lg border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
          <h2 class="text-sm font-semibold text-slate-900">Notice</h2>
          <p class="mt-2 text-sm text-slate-600 leading-relaxed">
            All trademarks and registered trademarks are the property of their respective owners.
            References to third-party libraries on this page are for attribution only and do not
            imply endorsement by or affiliation with the qPALACE project or the SPORTLab.
          </p>
        </div>

        <p class="mt-4 text-xs text-slate-500">
          {{ totalCount }} librar{{ totalCount === 1 ? 'y' : 'ies' }} listed.
        </p>
      </div>

      <div class="mt-10 mx-auto max-w-4xl space-y-10">
        <div v-for="(items, license) in grouped" :key="license">
          <header class="flex flex-wrap items-baseline justify-between gap-2 pb-2 border-b border-slate-200">
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-semibold text-slate-900">{{ license }}</h2>
              <span class="tag">{{ items.length }}</span>
            </div>
            <p class="text-xs text-slate-500 max-w-xl">
              {{ licenseBlurb(license as string) }}
            </p>
          </header>

          <ul class="mt-3 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-soft">
            <li
              v-for="lib in items"
              :key="lib.name"
              class="px-5 sm:px-6 py-4"
            >
              <div class="flex flex-wrap items-baseline justify-between gap-2">
                <a
                  :href="lib.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm sm:text-base font-semibold text-primary-800 hover:text-primary-900 hover:underline underline-offset-2"
                >
                  {{ lib.name }}
                  <svg class="inline-block h-3.5 w-3.5 ml-0.5 -mt-0.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
                <span class="text-xs text-slate-500">
                  v{{ lib.version }}
                </span>
              </div>
              <p class="mt-1 text-sm text-slate-600">
                {{ lib.description }}
              </p>
              <p v-if="lib.author" class="mt-1 text-xs text-slate-500">
                © {{ lib.author }}
              </p>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-12 mx-auto max-w-3xl">
        <div class="rounded-lg border border-slate-200 bg-white p-5">
          <h2 class="text-sm font-semibold text-slate-900">Missing a library?</h2>
          <p class="mt-2 text-sm text-slate-600">
            If you believe a third-party dependency is missing from this list or its license
            information is inaccurate, please contact us so we can update this page.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>