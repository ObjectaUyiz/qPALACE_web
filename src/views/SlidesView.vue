<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import slidesData from '@/data/slides.json'
import SlideCard, { type Slide } from '@/components/SlideCard.vue'
import Pagination from '@/components/common/Pagination.vue'

const slides = slidesData as Slide[]
const route = useRoute()
const router = useRouter()

const DEFAULT_PAGE_SIZE = 6

const filter = ref<'all' | 'public' | 'internal'>(
  (route.query.vis as any) || 'all',
)
const page = ref<number>(Math.max(1, Number(route.query.p ?? 1)))
const pageSize = ref<number>(Math.max(1, Number(route.query.ps ?? DEFAULT_PAGE_SIZE)))

const visible = computed(() => {
  if (filter.value === 'all') return slides
  return slides.filter((s) => s.visibility === filter.value)
})

const sortedVisible = computed<Slide[]>(() => {
  return [...visible.value].sort((a, b) => (a.date < b.date ? 1 : -1))
})

const totalCount = computed(() => sortedVisible.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize.value)))

watch(page, (p) => {
  if (p > totalPages.value) page.value = 1
})

const pagedSlides = computed<Slide[]>(() => {
  const start = (page.value - 1) * pageSize.value
  return sortedVisible.value.slice(start, start + pageSize.value)
})

const counts = computed(() => ({
  all: slides.length,
  public: slides.filter((s) => s.visibility === 'public').length,
  internal: slides.filter((s) => s.visibility === 'internal').length,
}))

const syncUrl = () => {
  const q: Record<string, string | number> = {}
  if (filter.value !== 'all') q.vis = filter.value
  if (page.value > 1) q.p = page.value
  if (pageSize.value !== DEFAULT_PAGE_SIZE) q.ps = pageSize.value
  router.replace({ path: route.path, query: q })
}

watch([filter, page, pageSize], syncUrl)

const onFilterChange = () => {
  page.value = 1
}
</script>

<template>
  <section class="py-12 sm:py-16 lg:py-20 border-b border-slate-200/80">
    <div class="container-page">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="max-w-2xl">
          <p class="text-xs font-semibold uppercase tracking-wider text-primary-700">Slides</p>
          <h1 class="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
            Talks &amp; Presentations
          </h1>
          <p class="mt-3 text-base text-slate-600">
            Presentation slides for talks, lab meetings, and reading groups. Public slides can be viewed and downloaded; internal slides are listed with notes for access.
          </p>
        </div>

        <!-- Visibility filter -->
        <div
          v-if="slides.length > 0"
          class="inline-flex rounded-md border border-slate-300 bg-white p-0.5 text-sm"
          role="tablist"
          aria-label="Slide visibility"
        >
          <button
            v-for="opt in ['all', 'public', 'internal']"
            :key="opt"
            type="button"
            role="tab"
            :aria-selected="filter === opt"
            class="px-3 py-1.5 rounded-md font-medium transition-colors"
            :class="filter === opt ? 'bg-primary-700 text-white' : 'text-slate-600 hover:text-slate-900'"
            @click="filter = opt as any; onFilterChange()"
          >
            <span class="capitalize">{{ opt }}</span>
            <span class="ml-1 text-xs opacity-80">({{ counts[opt as keyof typeof counts] }})</span>
          </button>
        </div>
      </div>

      <div v-if="totalCount === 0" class="mt-10 rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
        <p class="text-slate-600">No slides matching this filter.</p>
      </div>

      <div v-else class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <SlideCard v-for="s in pagedSlides" :key="s.title + s.date" :slide="s" />
      </div>

      <div v-if="totalCount > 0" class="mt-10">
        <Pagination
          :page="page"
          :page-size="pageSize"
          :total="totalCount"
          :show-size-changer="true"
          @update:page="page = $event"
          @update:page-size="(s) => { pageSize = s; page = 1 }"
        />
      </div>
    </div>
  </section>
</template>