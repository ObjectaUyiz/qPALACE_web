<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from '@/utils/paths'

export interface Slide {
  title: string
  event: string
  date: string
  speaker: string
  description: string
  fileUrl?: string
  pptxUrl?: string
  type: string
  visibility: 'public' | 'internal'
  notes?: string
}

const props = defineProps<{
  slide: Slide
}>()

const isPublic = computed(() => props.slide.visibility === 'public')
const hasFile = computed(() => isPublic.value && !!props.slide.fileUrl)
const hasPptx = computed(() => isPublic.value && !!props.slide.pptxUrl)

const fileHref = computed(() => (props.slide.fileUrl ? withBase(props.slide.fileUrl) : ''))
const pptxHref = computed(() => (props.slide.pptxUrl ? withBase(props.slide.pptxUrl) : ''))

const formatDate = (d: string) => {
  if (!d) return ''
  try {
    const date = new Date(d)
    if (isNaN(date.getTime())) return d
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return d
  }
}
</script>

<template>
  <article class="card card-hover p-5 sm:p-6 h-full flex flex-col">
    <header class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h3 class="text-base font-semibold text-slate-900 leading-snug">
          {{ slide.title }}
        </h3>
        <p class="mt-1 text-sm text-slate-500">
          {{ slide.event }}
        </p>
      </div>
      <span
        v-if="slide.visibility === 'public'"
        class="tag-success shrink-0"
      >Public</span>
      <span
        v-else
        class="tag-warn shrink-0"
      >Internal</span>
    </header>

    <dl class="mt-4 grid grid-cols-2 gap-3 text-xs">
      <div>
        <dt class="text-slate-400 uppercase tracking-wider">Date</dt>
        <dd class="mt-0.5 text-slate-700 font-medium">{{ formatDate(slide.date) }}</dd>
      </div>
      <div>
        <dt class="text-slate-400 uppercase tracking-wider">Speaker</dt>
        <dd class="mt-0.5 text-slate-700 font-medium truncate" :title="slide.speaker">{{ slide.speaker }}</dd>
      </div>
      <div class="col-span-2">
        <dt class="text-slate-400 uppercase tracking-wider">Format</dt>
        <dd class="mt-0.5 text-slate-700 font-medium">{{ slide.type }}</dd>
      </div>
    </dl>

    <p class="mt-3 text-sm text-slate-600 leading-relaxed">
      {{ slide.description }}
    </p>

    <p
      v-if="!isPublic && slide.notes"
      class="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded px-2 py-1.5"
    >
      {{ slide.notes }}
    </p>

    <footer class="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
      <a
        v-if="hasFile"
        :href="fileHref"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-outline"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
        View PDF
      </a>
      <a
        v-if="hasPptx"
        :href="pptxHref"
        download
        class="btn-ghost"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download PPTX
      </a>
      <span
        v-if="!hasFile && !hasPptx"
        class="text-xs text-slate-500 inline-flex items-center"
      >
        No downloadable file
      </span>
    </footer>
  </article>
</template>