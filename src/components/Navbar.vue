<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import site from '@/data/site.json'

const route = useRoute()

const open = ref(false)
const scrolled = ref(false)

const links = computed(() => site.navigation)

const isActive = (to: string) => {
  if (to === '/') return route.path === '/' || route.path === ''
  return route.path === to || route.path.startsWith(to + '/')
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 8
}

const closeMobile = () => {
  open.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header
    class="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur transition-shadow"
    :class="scrolled ? 'shadow-soft' : ''"
  >
    <div class="container-page flex h-16 items-center justify-between">
      <!-- Brand -->
      <router-link
        to="/"
        class="flex items-center gap-2 text-slate-900 hover:text-primary-700"
        aria-label="qPALACE home"
      >
        <span
          class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary-700 text-white font-semibold text-sm"
        >
          qP
        </span>
        <span class="text-base font-semibold tracking-tight">{{ site.shortName }}</span>
      </router-link>

      <!-- Desktop navigation -->
      <nav class="hidden md:flex items-center gap-1" aria-label="Primary">
        <router-link
          v-for="link in links"
          :key="link.id"
          :to="link.to"
          class="px-3 py-2 text-sm font-medium rounded-md transition-colors"
          :class="
            isActive(link.to)
              ? 'text-primary-700 bg-primary-50'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          "
        >
          {{ link.label }}
        </router-link>
      </nav>

      <!-- GitHub link (desktop) -->
      <a
        :href="site.githubUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="hidden md:inline-flex btn-outline"
        aria-label="qPALACE on GitHub"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path
            d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1-.01-1.96-3.2.69-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.74 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.18a10.94 10.94 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.57.23 2.73.11 3.02.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55C20.21 21.39 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5Z"
          />
        </svg>
        GitHub
      </a>

      <!-- Mobile menu button -->
      <button
        type="button"
        class="md:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100"
        :aria-expanded="open"
        aria-controls="mobile-menu"
        aria-label="Toggle navigation menu"
        @click="open = !open"
      >
        <svg
          v-if="!open"
          class="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
        <svg
          v-else
          class="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <div
      v-show="open"
      id="mobile-menu"
      class="md:hidden border-t border-slate-200 bg-white"
    >
      <nav class="container-page py-3 flex flex-col gap-1" aria-label="Mobile">
        <router-link
          v-for="link in links"
          :key="link.id"
          :to="link.to"
          class="px-3 py-2 text-sm font-medium rounded-md"
          :class="
            isActive(link.to)
              ? 'text-primary-700 bg-primary-50'
              : 'text-slate-700 hover:bg-slate-100'
          "
          @click="closeMobile"
        >
          {{ link.label }}
        </router-link>
        <a
          :href="site.githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md inline-flex items-center gap-2"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1-.01-1.96-3.2.69-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.74 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.18a10.94 10.94 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.57.23 2.73.11 3.02.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55C20.21 21.39 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5Z"
            />
          </svg>
          GitHub
        </a>
      </nav>
    </div>
  </header>
</template>