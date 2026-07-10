<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import site from '@/data/site'

const showTop = ref(false)
const onScroll = () => {
  showTop.value = window.scrollY > 600
}

const scrollTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

const year = new Date().getFullYear()

const hasFunding = !!(site.funding?.intro || site.funding?.disclaimer)
</script>

<template>
  <footer id="contact" class="border-t border-slate-200 bg-white">
    <div class="container-page py-12 sm:py-14">
      <div class="grid gap-10 md:grid-cols-3">
        <!-- Brand -->
        <div>
          <router-link to="/" class="flex items-center gap-2">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary-700 text-white font-semibold text-sm">
              qP
            </span>
            <span class="text-base font-semibold tracking-tight text-slate-900">{{ site.shortName }}</span>
          </router-link>
          <p class="mt-3 text-sm text-slate-600 max-w-xs">
            {{ site.tagline }}
          </p>
          <p class="mt-3 text-xs text-slate-500">
            {{ site.labName }} · {{ site.department }}<br />
            {{ site.school || site.institution }}
          </p>
        </div>

        <!-- Contact -->
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Contact
          </h2>
          <ul class="mt-3 space-y-2 text-sm">
            <li v-if="site.contact?.person">
              <div class="text-slate-700">
                <span class="font-medium text-slate-900">{{ site.contact.person.name }}</span>
                <span v-if="site.contact.role" class="ml-1 text-slate-500">· {{ site.contact.role }}</span>
              </div>
              <a
                v-if="site.contact.website"
                :href="site.contact.website"
                target="_blank"
                rel="noopener noreferrer"
                class="link-academic inline-flex items-center gap-1 mt-0.5"
              >
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                Faculty profile
              </a>
            </li>
            <li v-if="site.contact?.email">
              <a :href="`mailto:${site.contact.email}`" class="link-academic inline-flex items-center gap-2">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                {{ site.contact.email }}
              </a>
            </li>
            <li v-if="site.labUrl">
              <a :href="site.labUrl" target="_blank" rel="noopener noreferrer" class="link-academic inline-flex items-center gap-2">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                SPORTLab Homepage
              </a>
            </li>
            <li v-if="site.githubUrl">
              <a :href="site.githubUrl" target="_blank" rel="noopener noreferrer" class="link-academic inline-flex items-center gap-2">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path
                    d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1-.01-1.96-3.2.69-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.74 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.18a10.94 10.94 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.57.23 2.73.11 3.02.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55C20.21 21.39 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5Z"
                  />
                </svg>
                GitHub Repository
              </a>
            </li>
          </ul>
        </div>

        <!-- Navigation -->
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Navigation
          </h2>
          <ul class="mt-3 grid grid-cols-2 gap-y-2 text-sm">
            <li v-for="link in site.navigation" :key="link.id">
              <router-link :to="link.to" class="link-academic">{{ link.label }}</router-link>
            </li>
          </ul>
        </div>
      </div>

      <!-- Funding / acknowledgements -->
      <div
        v-if="hasFunding"
        class="mt-10 pt-6 border-t border-slate-200"
      >
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Funding &amp; Acknowledgements
        </h2>
        <p
          v-if="site.funding?.intro"
          class="mt-2 text-xs text-slate-600 leading-relaxed"
        >
          {{ site.funding.intro }}
        </p>
        <p
          v-if="site.funding?.disclaimer"
          class="mt-2 text-xs text-slate-500 leading-relaxed italic"
        >
          {{ site.funding.disclaimer }}
        </p>
      </div>

      <div class="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500">
        <p>
          © {{ year }} {{ site.labName }}. All rights reserved.
        </p>
        <p>
          Last updated: <time :datetime="site.lastUpdated">{{ site.lastUpdated }}</time>
        </p>
      </div>
    </div>

    <!-- Back to top -->
    <transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <button
        v-show="showTop"
        type="button"
        class="fixed bottom-6 right-6 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-700 text-white shadow-card hover:bg-primary-800"
        aria-label="Back to top"
        @click="scrollTop"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>
    </transition>
  </footer>
</template>
