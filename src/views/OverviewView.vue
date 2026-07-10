<script setup lang="ts">
const items = [
  {
    title: 'Background',
    description:
      'qPALACE (Physical and Logical Aware Compiler Engine for Single Flux Quantum Logic) is a compiler toolchain that maps high-level SFQ circuit descriptions to placed-and-routed layouts.',
    icon: 'background',
  },
  {
    title: 'Motivation',
    description:
      'We aim to make our publications, talks, and supporting resources easy to find, easy to cite, and easy to keep up to date — for collaborators, students, and the wider community.',
    icon: 'motivation',
  },
  {
    title: 'Research Focus',
    description:
      'Our work spans logic synthesis, placement, clock tree synthesis, routing, timing analysis, and circuit-level simulation for SFQ logic, with an emphasis on reproducible, open research.',
    icon: 'focus',
  },
  {
    title: 'Current Status',
    description:
      'The project is actively maintained. New papers, slides, and resources are added as they are published or presented. See the Papers and Slides sections for the latest updates.',
    icon: 'status',
  },
]
</script>

<template>
  <section class="py-12 sm:py-16 lg:py-20 border-b border-slate-200/80">
    <div class="container-page">
      <div class="flex flex-wrap items-end justify-between gap-3 mb-8">
        <div class="max-w-2xl">
          <p class="text-xs font-semibold uppercase tracking-wider text-primary-700">Overview</p>
          <h1 class="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
            About qPALACE
          </h1>
          <p class="mt-3 text-base text-slate-600 max-w-2xl">
            A brief introduction to qPALACE — what we work on, why it matters, and where the project stands today.
          </p>
        </div>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <article v-for="item in items" :key="item.title" class="card card-hover p-6">
          <div class="flex items-start gap-4">
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700"
              aria-hidden="true"
            >
              <svg v-if="item.icon === 'background'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <svg v-else-if="item.icon === 'motivation'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V17h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z" />
              </svg>
              <svg v-else-if="item.icon === 'focus'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M3 12h3M18 12h3M12 3v3M12 18v3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
              </svg>
              <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div class="min-w-0">
              <h2 class="text-lg font-semibold text-slate-900">{{ item.title }}</h2>
              <p class="mt-2 text-sm leading-relaxed text-slate-600">
                {{ item.description }}
              </p>
            </div>
          </div>
        </article>
      </div>

      <div class="mt-12 card p-6 sm:p-8 bg-gradient-to-br from-primary-50 to-white">
        <h2 class="text-xl font-semibold text-slate-900">Want to collaborate?</h2>
        <p class="mt-2 text-sm text-slate-600 max-w-2xl">
          We welcome inquiries from students, researchers, and industry collaborators. Reach out via email or check our GitHub for ongoing work.
        </p>
        <div class="mt-4 flex flex-wrap gap-3">
          <router-link to="/team" class="btn-outline">Meet the team</router-link>
          <router-link to="/papers" class="btn-primary">Browse papers</router-link>
        </div>
      </div>
    </div>
  </section>
</template>