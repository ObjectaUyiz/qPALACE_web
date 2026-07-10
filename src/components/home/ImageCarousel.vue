<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import carouselData from '@/data/carousel.json'
import { withBase } from '@/utils/paths'

interface Slide {
  id: string
  title: string
  subtitle?: string
  image: string
  alt: string
  link?: string
  linkLabel?: string
}

const props = withDefaults(
  defineProps<{
    interval?: number   // ms between auto-rotate
    pauseOnHover?: boolean
    aspect?: string     // tailwind aspect-ratio class, e.g. "aspect-[16/9]"
  }>(),
  {
    interval: 5000,
    pauseOnHover: true,
    aspect: 'aspect-[16/9]',
  },
)

const slides = carouselData as Slide[]
const count = computed(() => slides.length)

const index = ref(0)
const paused = ref(false)
const hovered = ref(false)

const current = computed<Slide>(() => slides[index.value])

const reducedMotion = ref(false)

const start = () => {
  if (reducedMotion.value) return
  if (timer) return
  timer = window.setInterval(() => {
    if (!paused.value && !hovered.value) {
      index.value = (index.value + 1) % count.value
    }
  }, props.interval)
}

const stop = () => {
  if (timer) {
    window.clearInterval(timer)
    timer = undefined
  }
}

let timer: ReturnType<typeof setInterval> | undefined

const goTo = (i: number) => {
  const n = count.value
  index.value = ((i % n) + n) % n
  // Restart the timer so a manual click resets the cadence
  stop()
  start()
}

const next = () => goTo(index.value + 1)
const prev = () => goTo(index.value - 1)

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') next()
  else if (e.key === 'ArrowLeft') prev()
}

const onVisibility = () => {
  // Pause when tab is hidden
  paused.value = document.hidden
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    reducedMotion.value = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  }
  start()
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('visibilitychange', onVisibility)
})

onBeforeUnmount(() => {
  stop()
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('visibilitychange', onVisibility)
})

watch(count, (n) => {
  if (index.value >= n) index.value = 0
})

const imageSrc = computed(() => withBase(current.value.image))
const pdfSrc = computed(() => {
  // Append #toolbar=0 to hide the PDF viewer toolbar (prevents download/print)
  const base = imageSrc.value
  return base.includes('?') ? `${base}&toolbar=0` : `${base}#toolbar=0`
})
const hasImage = computed(() => !!current.value.image)
const isPdf = computed(() => {
  const ext = current.value.image?.toLowerCase()
  return ext?.endsWith('.pdf') ?? false
})

const onImgError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

<template>
  <section
    v-if="count > 0"
    class="py-12 sm:py-14 border-b border-slate-200/80"
    aria-roledescription="carousel"
    aria-label="qPALACE capabilities"
  >
    <div class="container-page">
      <div
        class="relative mx-auto max-w-5xl select-none"
        @contextmenu.prevent
        @mouseenter="hovered = true"
        @mouseleave="hovered = false"
      >
        <!-- Slide viewport -->
        <div
          class="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-soft"
          role="group"
          aria-roledescription="slide"
          :aria-label="`Slide ${index + 1} of ${count}: ${current.title}`"
        >
          <!-- Image stage -->
          <div :class="['relative w-full', aspect]">
            <!-- PDF embed (no toolbar = no download/print buttons) -->
            <embed
              v-if="hasImage && isPdf"
              :src="pdfSrc"
              type="application/pdf"
              class="absolute inset-0 h-full w-full"
              :title="current.alt"
              aria-label="PDF: " + current.alt
            />
            <!-- Regular image (SVG, PNG, JPG) — disable right-click save -->
            <img
              v-else-if="hasImage"
              :src="imageSrc"
              :alt="current.alt"
              class="absolute inset-0 h-full w-full object-contain p-2 select-none"
              :key="current.id"
              loading="lazy"
              draggable="false"
              @contextmenu.prevent
              @error="onImgError"
            />
            <!-- Fallback when image missing or fails -->
            <div
              v-else
              class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-100 text-primary-700"
              aria-hidden="true"
            >
              <div class="text-center px-6">
                <div class="text-2xl sm:text-3xl font-semibold tracking-tight">
                  {{ current.title }}
                </div>
                <div v-if="current.subtitle" class="mt-2 text-sm sm:text-base text-slate-600 max-w-md mx-auto">
                  {{ current.subtitle }}
                </div>
              </div>
            </div>

            <!-- Caption overlay (only when image is shown; translucent for PDFs) -->
            <div
              v-if="hasImage"
              class="absolute inset-x-0 bottom-0 p-3 sm:p-4"
              :class="isPdf ? 'bg-white/90' : 'bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent'"
            >
              <div :class="isPdf ? 'text-slate-800' : 'text-white'">
                <div class="text-sm sm:text-base font-semibold tracking-tight">
                  {{ current.title }}
                </div>
                <div v-if="current.subtitle" class="mt-0.5 text-xs sm:text-sm" :class="isPdf ? 'text-slate-600' : 'text-white/85'">
                  {{ current.subtitle }}
                </div>
                <a
                  v-if="current.link"
                  :href="current.link.startsWith('/') ? withBase(current.link) : current.link"
                  :target="current.link.startsWith('/') ? undefined : '_blank'"
                  rel="noopener noreferrer"
                  class="mt-2 inline-flex items-center gap-1 text-xs sm:text-sm font-medium underline-offset-2 hover:underline"
                  :class="isPdf ? 'text-primary-700' : 'text-white'"
                >
                  {{ current.linkLabel || 'Learn more' }}
                  <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Prev / Next buttons -->
          <button
            type="button"
            class="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-soft hover:bg-white"
            aria-label="Previous slide"
            @click="prev"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-soft hover:bg-white"
            aria-label="Next slide"
            @click="next"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <!-- Dots -->
        <div class="mt-4 flex items-center justify-center gap-2" role="tablist" aria-label="Choose slide">
          <button
            v-for="(s, i) in slides"
            :key="s.id"
            type="button"
            role="tab"
            :aria-selected="i === index"
            :aria-label="`Go to slide ${i + 1}: ${s.title}`"
            class="h-2 rounded-full transition-all"
            :class="i === index ? 'w-6 bg-primary-700' : 'w-2 bg-slate-300 hover:bg-slate-400'"
            @click="goTo(i)"
          ></button>
        </div>

        <p class="sr-only" aria-live="polite">
          Slide {{ index + 1 }} of {{ count }}: {{ current.title }}
        </p>
      </div>
    </div>
  </section>
</template>