<script setup lang="ts">
import { computed } from 'vue'
import type { Paper } from './PaperCitationItem.vue'

const props = defineProps<{
  papers: Paper[]
  query: string
  year: string
  type: string
  status: string
}>()

const emit = defineEmits<{
  (e: 'update:query', v: string): void
  (e: 'update:year', v: string): void
  (e: 'update:type', v: string): void
  (e: 'update:status', v: string): void
  (e: 'reset'): void
}>()

const years = computed(() => {
  const set = new Set<number>()
  for (const p of props.papers) set.add(p.year)
  return Array.from(set).sort((a, b) => b - a)
})

const types = computed(() => {
  const set = new Set<string>()
  for (const p of props.papers) if (p.type) set.add(p.type)
  return Array.from(set).sort()
})

const statuses = computed(() => {
  const set = new Set<string>()
  for (const p of props.papers) if (p.status) set.add(p.status)
  return Array.from(set).sort()
})

const activeFilterCount = computed(() => {
  let n = 0
  if (props.query) n++
  if (props.year) n++
  if (props.type) n++
  if (props.status) n++
  return n
})

const baseSelect =
  'h-9 rounded-md border border-slate-300 bg-white px-2.5 text-sm text-slate-700 hover:border-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none'
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <!-- Search input -->
      <div class="relative flex-1 max-w-md">
        <label for="paper-search" class="sr-only">Search papers</label>
        <svg
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          id="paper-search"
          type="search"
          :value="query"
          @input="emit('update:query', ($event.target as HTMLInputElement).value)"
          placeholder="Search title, author, venue..."
          class="h-9 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
        />
      </div>

      <!-- Filter selects -->
      <div class="flex flex-wrap items-center gap-2">
        <select
          aria-label="Filter by year"
          :class="baseSelect"
          :value="year"
          @change="emit('update:year', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">All years</option>
          <option v-for="y in years" :key="y" :value="String(y)">{{ y }}</option>
        </select>

        <select
          aria-label="Filter by type"
          :class="baseSelect"
          :value="type"
          @change="emit('update:type', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">All types</option>
          <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
        </select>

        <select
          aria-label="Filter by status"
          :class="baseSelect"
          :value="status"
          @change="emit('update:status', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">All statuses</option>
          <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
        </select>

        <button
          v-if="activeFilterCount > 0"
          type="button"
          class="inline-flex items-center gap-1 h-9 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-600 hover:bg-slate-50"
          @click="emit('reset')"
        >
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
          Clear ({{ activeFilterCount }})
        </button>
      </div>
    </div>
  </div>
</template>