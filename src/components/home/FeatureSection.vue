<script setup lang="ts">
import { withBase } from '@/utils/paths'

interface Feature {
  id: string
  title: string
  description: string
  learnMoreUrl?: string
  thumbnail?: string
}

defineProps<{
  features: Feature[]
}>()
</script>

<template>
  <section class="py-12 sm:py-16 lg:py-20 border-b border-slate-200/80">
    <div class="container-page">
      <div class="mx-auto max-w-3xl text-center">
        <p class="text-xs font-semibold uppercase tracking-wider text-primary-700">Features</p>
        <h2 class="mt-2 section-title">What qPALACE does</h2>
        <p class="section-subtitle mx-auto">
          qPALACE is organized around a small set of stages that map closely to the SFQ design flow.
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
</template>