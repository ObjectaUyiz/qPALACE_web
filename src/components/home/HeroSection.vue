<script setup lang="ts">
import site from '@/data/site'

interface Cta {
  label: string
  href?: string
  to?: string
}

interface Hero {
  eyebrow?: string
  title: string
  subtitle?: string
  description?: string
  primaryCta?: Cta
  secondaryCta?: Cta
}

const hero = site.hero as Hero

const ctaHref = (cta?: Cta): string => {
  if (!cta) return '#'
  return cta.href || cta.to || '#'
}

const isExternal = (url: string) =>
  url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('//')

const isInternal = (url: string) => !isExternal(url)
</script>

<template>
  <section
    id="home"
    class="section-anchor relative overflow-hidden border-b border-slate-200/80 bg-white"
  >
    <div class="container-page">
      <div class="mx-auto max-w-3xl text-center py-16 sm:py-20 lg:py-24">
        <!-- Eyebrow -->
        <p
          v-if="hero.eyebrow"
          class="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700"
        >
          {{ hero.eyebrow }}
        </p>

        <!-- Wordmark -->
        <h1 class="mt-4 text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-slate-900 text-balance">
          {{ hero.title }}
        </h1>

        <!-- Subtitle -->
        <p
          v-if="hero.subtitle"
          class="mt-5 text-lg sm:text-xl text-slate-600 text-balance"
        >
          {{ hero.subtitle }}
        </p>

        <!-- Description -->
        <p
          v-if="hero.description"
          class="mt-4 text-base text-slate-600 max-w-2xl mx-auto text-balance"
        >
          {{ hero.description }}
        </p>

        <!-- CTAs -->
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <a
            v-if="hero.primaryCta"
            :href="ctaHref(hero.primaryCta)"
            :target="isExternal(ctaHref(hero.primaryCta)) ? '_blank' : undefined"
            rel="noopener noreferrer"
            class="btn-primary"
          >
            {{ hero.primaryCta.label }}
            <svg
              v-if="isInternal(ctaHref(hero.primaryCta))"
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
            <svg
              v-else
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </a>
          <router-link
            v-if="hero.secondaryCta"
            :to="ctaHref(hero.secondaryCta)"
            class="btn-outline"
          >
            {{ hero.secondaryCta.label }}
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>
