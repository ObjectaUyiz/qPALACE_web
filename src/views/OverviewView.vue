<script setup lang="ts">
import { withBase } from '@/utils/paths'
import featuresData from '@/data/features.json'

interface Feature {
  id: string
  title: string
  description: string
  learnMoreUrl?: string
  thumbnail?: string
}

const features = featuresData as Feature[]

const overviewItems = [
  {
    title: 'Background',
    description:
      'qPALACE (Physical and Logical Aware Compiler Engine for Single Flux Quantum Logic) is a compiler toolchain that maps high-level SFQ circuit descriptions to placed-and-routed layouts.',
    icon: 'background',
  },
  {
    title: 'Objectives',
    description:
      'Our goal is to provide an open, automated flow for SFQ design — from HDL input to layout output — enabling researchers and practitioners to design and verify SFQ circuits efficiently.',
    icon: 'objectives',
  },
  {
    title: 'Research Focus',
    description:
      'Our work spans logic synthesis, placement, clock tree synthesis, routing, timing analysis, and circuit-level simulation for SFQ logic, with an emphasis on reproducible, open research.',
    icon: 'focus',
  },
]
</script>

<template>
  <section class="py-12 sm:py-16 lg:py-20 border-b border-slate-200/80">
    <div class="container-page">
      <!-- Header -->
      <div class="max-w-2xl">
        <p class="text-xs font-semibold uppercase tracking-wider text-primary-700">Overview</p>
        <h1 class="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
          About qPALACE
        </h1>
        <p class="mt-3 text-base text-slate-600">
          An open-source compiler toolchain for Single Flux Quantum (SFQ) circuit design automation.
        </p>
      </div>

      <!-- Overview cards -->
      <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <article v-for="item in overviewItems" :key="item.title" class="card p-6">
          <div class="flex items-start gap-4">
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700"
              aria-hidden="true"
            >
              <svg v-if="item.icon === 'background'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <svg v-else-if="item.icon === 'objectives'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <svg v-else-if="item.icon === 'focus'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M3 12h3M18 12h3M12 3v3M12 18v3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
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
    </div>
  </section>

  <!-- What qPALACE Does -->
  <section class="py-12 sm:py-16 lg:py-20 border-b border-slate-200/80 bg-slate-50/40">
    <div class="container-page">
      <div class="mx-auto max-w-3xl text-center">
        <p class="text-xs font-semibold uppercase tracking-wider text-primary-700">Capabilities</p>
        <h2 class="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
          What qPALACE Does
        </h2>
        <p class="mt-3 text-base text-slate-600 mx-auto max-w-2xl">
          qPALACE is organized around a set of stages that map closely to the SFQ design flow — from logic synthesis to final layout.
        </p>
      </div>

      <div class="mt-12 mx-auto max-w-4xl space-y-12 sm:space-y-16">
        <article
          v-for="(f, idx) in features"
          :key="f.id"
          class="grid items-center gap-6 sm:gap-8 md:grid-cols-12"
          :class="idx % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''"
        >
          <!-- Text -->
          <div class="md:col-span-7">
            <h3 class="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
              {{ f.title }}
            </h3>
            <p class="mt-3 text-base text-slate-600 leading-relaxed">
              {{ f.description }}
            </p>
            <a
              v-if="f.learnMoreUrl"
              :href="f.learnMoreUrl.startsWith('/') ? withBase(f.learnMoreUrl) : f.learnMoreUrl"
              :target="f.learnMoreUrl.startsWith('/') ? undefined : '_blank'"
              rel="noopener noreferrer"
              class="mt-4 inline-flex items-center gap-1 link-academic text-sm font-medium"
            >
              Learn more
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>

          <!-- Thumbnail -->
          <div class="md:col-span-5">
            <div class="aspect-[4/3] rounded-xl border border-slate-200 bg-gradient-to-br from-primary-50 via-white to-accent-100 overflow-hidden shadow-soft">
              <img
                v-if="f.thumbnail"
                :src="withBase(f.thumbnail)"
                :alt="`${f.title} thumbnail`"
                class="h-full w-full object-cover"
                loading="lazy"
                @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')"
              />
              <div
                v-else
                class="h-full w-full flex items-center justify-center text-primary-700 text-sm font-medium"
                aria-hidden="true"
              >
                {{ f.title }}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="py-12 sm:py-16 lg:py-20 border-b border-slate-200/80">
    <div class="container-page">
      <div class="card p-6 sm:p-8 bg-gradient-to-br from-primary-50 to-white">
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
