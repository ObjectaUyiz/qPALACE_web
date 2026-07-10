<script setup lang="ts">
import resourcesData from '@/data/resources.json'

interface Resource {
  title: string
  description: string
  url: string
  type: string
}

const resources = resourcesData as Resource[]

const iconFor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'code':
      return 'code'
    case 'docs':
    case 'documentation':
      return 'docs'
    case 'dataset':
      return 'dataset'
    case 'website':
      return 'website'
    default:
      return 'link'
  }
}

const isExternal = (url: string) => /^https?:\/\//i.test(url)
</script>

<template>
  <section class="py-12 sm:py-16 lg:py-20 border-b border-slate-200/80">
    <div class="container-page">
      <div class="max-w-2xl">
        <p class="text-xs font-semibold uppercase tracking-wider text-primary-700">Resources</p>
        <h1 class="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
          Links &amp; Resources
        </h1>
        <p class="mt-3 text-base text-slate-600">
          External links for the project — code, datasets, documentation, and related work.
        </p>
      </div>

      <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <a
          v-for="r in resources"
          :key="r.url"
          :href="r.url"
          :target="isExternal(r.url) ? '_blank' : undefined"
          rel="noopener noreferrer"
          class="card card-hover p-5 group block"
        >
          <div class="flex items-start gap-4">
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700"
              aria-hidden="true"
            >
              <svg v-if="iconFor(r.type) === 'code'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              <svg v-else-if="iconFor(r.type) === 'docs'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <svg v-else-if="iconFor(r.type) === 'dataset'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
                <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" />
              </svg>
              <svg v-else-if="iconFor(r.type) === 'website'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <h2 class="text-sm font-semibold text-slate-900 group-hover:text-primary-700 truncate">
                  {{ r.title }}
                </h2>
                <span class="tag shrink-0">{{ r.type }}</span>
              </div>
              <p class="mt-1 text-sm text-slate-600 line-clamp-2">{{ r.description }}</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>