<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import papersData from '@/data/papers.json'
import PaperFilters from '@/components/PaperFilters.vue'
import PaperCitationItem, { type Paper } from '@/components/PaperCitationItem.vue'
import Pagination from '@/components/common/Pagination.vue'

const papers = papersData as Paper[]
const route = useRoute()
const router = useRouter()

const DEFAULT_PAGE_SIZE = 8

const query = ref<string>(String(route.query.q ?? ''))
const year = ref<string>(String(route.query.year ?? ''))
const type = ref<string>(String(route.query.t ?? ''))
const status = ref<string>(String(route.query.s ?? ''))
const page = ref<number>(Math.max(1, Number(route.query.p ?? 1)))
const pageSize = ref<number>(Math.max(1, Number(route.query.ps ?? DEFAULT_PAGE_SIZE)))

const openBibtexTitle = ref<string | null>(null)

const filtered = computed<Paper[]>(() => {
  const q = query.value.trim().toLowerCase()
  return papers.filter((p) => {
    if (year.value && String(p.year) !== year.value) return false
    if (type.value && p.type !== type.value) return false
    if (status.value && p.status !== status.value) return false
    if (q) {
      const haystack = [
        p.title,
        p.authors.join(' '),
        p.venue,
        String(p.year),
        p.type,
        p.status,
        ...(p.highlightAuthors ?? []),
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
})

// Sort by year desc, then keep insertion order for ties
const sortedFiltered = computed<Paper[]>(() => {
  return [...filtered.value].sort((a, b) => b.year - a.year)
})

const totalCount = computed(() => sortedFiltered.value.length)

const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize.value)))

watch(page, (p) => {
  if (p > totalPages.value) page.value = 1
})

const pagedPapers = computed<Paper[]>(() => {
  const start = (page.value - 1) * pageSize.value
  return sortedFiltered.value.slice(start, start + pageSize.value)
})

// Group paged items by year for the header rendering
const grouped = computed<Record<number, Paper[]>>(() => {
  const map: Record<number, Paper[]> = {}
  for (const p of pagedPapers.value) {
    if (!map[p.year]) map[p.year] = []
    map[p.year].push(p)
  }
  const result: Record<number, Paper[]> = {}
  const keys = Object.keys(map).map(Number).sort((a, b) => b - a)
  for (const k of keys) result[k] = map[k]
  return result
})

const reset = () => {
  query.value = ''
  year.value = ''
  type.value = ''
  status.value = ''
  page.value = 1
}

// Sync state → URL (replaces history so back button doesn't fill up)
const syncUrl = () => {
  const q: Record<string, string | number> = {}
  if (query.value) q.q = query.value
  if (year.value) q.year = year.value
  if (type.value) q.t = type.value
  if (status.value) q.s = status.value
  if (page.value > 1) q.p = page.value
  if (pageSize.value !== DEFAULT_PAGE_SIZE) q.ps = pageSize.value
  router.replace({ path: route.path, query: q })
}

watch([query, year, type, status, page, pageSize], syncUrl)

const toggleBibtex = (title: string) => {
  openBibtexTitle.value = openBibtexTitle.value === title ? null : title
}

const closeBibtex = () => {
  openBibtexTitle.value = null
}

// Reset to first page when filters change
const onFilterChange = () => {
  page.value = 1
}
</script>

<template>
  <section class="py-12 sm:py-16 lg:py-20 border-b border-slate-200/80 bg-slate-50/40">
    <div class="container-page">
      <div class="max-w-2xl">
        <p class="text-xs font-semibold uppercase tracking-wider text-primary-700">Papers</p>
        <h1 class="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
          Publications
        </h1>
        <p class="mt-3 text-base text-slate-600">
          Publications from the qPALACE project, grouped by year. Use the filters to search by title, author, venue, year, type, or status.
        </p>
      </div>

      <div class="mt-6">
        <PaperFilters
          :papers="papers"
          v-model:query="query"
          v-model:year="year"
          v-model:type="type"
          v-model:status="status"
          @reset="reset"
          @update:query="onFilterChange"
          @update:year="onFilterChange"
          @update:type="onFilterChange"
          @update:status="onFilterChange"
        />
      </div>

      <!-- Result count -->
      <div class="mt-6 text-sm text-slate-500">
        <span class="font-medium text-slate-700">{{ totalCount }}</span>
        paper<span v-if="totalCount !== 1">s</span> match
        <span v-if="query || year || type || status">your filters</span>
        <span v-else>in total</span>
      </div>

      <!-- Citation list -->
      <div class="mt-4">
        <div v-if="totalCount === 0" class="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
          <p class="text-slate-600">No papers match the current filters.</p>
          <button type="button" class="btn-outline mt-4" @click="reset">
            Clear filters
          </button>
        </div>

        <div v-else class="rounded-lg border border-slate-200 bg-white shadow-soft overflow-hidden">
          <div v-for="(items, yr) in grouped" :key="yr">
            <h2
              class="px-5 sm:px-6 py-2 text-sm font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/70 border-y border-slate-200/80"
            >
              {{ yr }}
              <span class="ml-2 text-xs font-normal normal-case text-slate-400">({{ items.length }})</span>
            </h2>
            <div class="px-5 sm:px-6 py-2 divide-y divide-slate-200">
              <PaperCitationItem
                v-for="paper in items"
                :key="paper.title"
                :paper="paper"
                :bibtex-open="openBibtexTitle === paper.title"
                @toggle-bibtex="toggleBibtex"
                @close-bibtex="closeBibtex"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-8">
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