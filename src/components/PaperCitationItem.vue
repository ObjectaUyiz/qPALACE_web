<script setup lang="ts">
import { computed } from 'vue'
import BibtexBlock from './BibtexBlock.vue'
import { withBase } from '@/utils/paths'

export interface Paper {
  title: string
  authors: string[]
  venue: string
  year: number
  type: string
  status: string
  paperUrl?: string
  arxivUrl?: string
  codeUrl?: string
  projectUrl?: string
  slidesUrl?: string
  datasetUrl?: string
  demoUrl?: string
  abstract?: string
  bibtex?: string
  highlightAuthors?: string[]
  /** When true, this paper belongs to the person's personal list (e.g. pre-project work). */
  isPersonal?: boolean
}

const props = defineProps<{
  paper: Paper
  bibtexOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-bibtex', title: string): void
  (e: 'close-bibtex'): void
}>()

const renderAuthors = computed(() => {
  const highlights = new Set(props.paper.highlightAuthors ?? [])
  return props.paper.authors.map((name) => ({
    name,
    isHighlighted: highlights.has(name),
  }))
})

const externalLinks = [
  { key: 'paperUrl',   label: 'PDF',     test: (p: Paper) => !!p.paperUrl },
  { key: 'arxivUrl',   label: 'arXiv',   test: (p: Paper) => !!p.arxivUrl },
  { key: 'codeUrl',    label: 'Code',    test: (p: Paper) => !!p.codeUrl },
  { key: 'projectUrl', label: 'Project', test: (p: Paper) => !!p.projectUrl },
  { key: 'slidesUrl',  label: 'Slides',  test: (p: Paper) => !!p.slidesUrl },
  { key: 'datasetUrl', label: 'Dataset', test: (p: Paper) => !!p.datasetUrl },
  { key: 'demoUrl',    label: 'Demo',    test: (p: Paper) => !!p.demoUrl },
]

const hasBibtex = computed(() => !!props.paper.bibtex && props.paper.bibtex.trim().length > 0)

const visibleLinks = computed(() => externalLinks.filter((l) => l.test(props.paper)))

const titleHref = computed(() => {
  const url = props.paper.paperUrl || props.paper.projectUrl
  return url ? withBase(url) : ''
})

const isExternal = (url: string) => /^https?:\/\//i.test(url)

const statusTagClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'published':
      return 'tag-success'
    case 'preprint':
      return 'tag-accent'
    case 'under review':
      return 'tag-warn'
    default:
      return 'tag'
  }
}
</script>

<template>
  <article class="py-3 first:pt-0">
    <!-- Title row -->
    <h3 class="text-[15px] sm:text-base font-semibold leading-snug">
      <a
        v-if="titleHref"
        :href="titleHref"
        :target="isExternal(titleHref) ? '_blank' : undefined"
        rel="noopener noreferrer"
        class="text-primary-800 hover:text-primary-900 hover:underline underline-offset-2"
      >
        {{ paper.title }}
      </a>
      <span v-else class="text-primary-800">{{ paper.title }}</span>
    </h3>

    <!-- Authors row -->
    <p class="mt-1 text-sm text-slate-700">
      <template v-for="(author, idx) in renderAuthors" :key="author.name">
        <span :class="author.isHighlighted ? 'font-semibold text-slate-900' : ''">{{ author.name }}</span><span v-if="idx < renderAuthors.length - 1">, </span>
      </template>
    </p>

    <!-- Venue + status row -->
    <p class="mt-0.5 text-sm text-slate-500">
      <span>{{ paper.venue }}</span><span>, {{ paper.year }}</span>
      <span v-if="paper.status && paper.status.toLowerCase() !== 'published'" class="ml-1">
        · <span :class="statusTagClass(paper.status)">{{ paper.status }}</span>
      </span>
      <span class="ml-1">
        · <span class="tag">{{ paper.type }}</span>
      </span>
    </p>

    <!-- Action links row -->
    <p class="mt-2 flex flex-wrap gap-x-1 gap-y-1 items-center">
      <template v-for="link in visibleLinks" :key="link.key">
        <a
          :href="withBase((paper as any)[link.key])"
          target="_blank"
          rel="noopener noreferrer"
          class="citation-link"
        >
          [{{ link.label }}]
        </a>
      </template>
      <button
        v-if="hasBibtex"
        type="button"
        class="citation-link"
        :aria-expanded="bibtexOpen"
        @click="emit('toggle-bibtex', paper.title)"
      >
        [BibTeX]
      </button>
    </p>

    <!-- BibTeX expandable -->
    <BibtexBlock
      v-if="hasBibtex && bibtexOpen"
      :bibtex="paper.bibtex!"
      :open="bibtexOpen"
      @close="emit('close-bibtex')"
    />
  </article>
</template>