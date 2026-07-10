<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    page: number            // 1-indexed current page
    pageSize: number        // items per page
    total: number           // total item count
    siblingCount?: number   // pages to show on each side of current (default 1)
    showSizeChanger?: boolean
    pageSizeOptions?: number[]
  }>(),
  {
    siblingCount: 1,
    showSizeChanger: false,
    pageSizeOptions: () => [5, 10, 20, 50],
  },
)

const emit = defineEmits<{
  (e: 'update:page', v: number): void
  (e: 'update:pageSize', v: number): void
}>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

// Build a compact list: 1, …, p-1, p, p+1, …, last
const pages = computed<(number | '…')[]>(() => {
  const total = totalPages.value
  const current = props.page
  const siblings = props.siblingCount
  const includeLeft = current - siblings
  const includeRight = current + siblings

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const result: (number | '…')[] = []
  // Always show first
  result.push(1)

  // Left ellipsis
  if (includeLeft > 2) result.push('…')

  // Middle window
  for (let i = Math.max(2, includeLeft); i <= Math.min(total - 1, includeRight); i++) {
    result.push(i)
  }

  // Right ellipsis
  if (includeRight < total - 1) result.push('…')

  // Always show last
  if (total > 1) result.push(total)

  return result
})

const startItem = computed(() => (props.total === 0 ? 0 : (props.page - 1) * props.pageSize + 1))
const endItem = computed(() => Math.min(props.page * props.pageSize, props.total))

const goTo = (p: number) => {
  if (p < 1 || p > totalPages.value || p === props.page) return
  emit('update:page', p)
}

const onSizeChange = (e: Event) => {
  const v = Number((e.target as HTMLSelectElement).value)
  if (!Number.isNaN(v) && v > 0) {
    emit('update:pageSize', v)
    emit('update:page', 1) // reset to first page when size changes
  }
}

const baseBtn =
  'inline-flex items-center justify-center h-9 min-w-[2.25rem] px-2 rounded-md text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
</script>

<template>
  <nav
    v-if="total > 0"
    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    aria-label="Pagination"
  >
    <!-- Info -->
    <p class="text-sm text-slate-500">
      Showing
      <span class="font-medium text-slate-700">{{ startItem }}</span>
      –
      <span class="font-medium text-slate-700">{{ endItem }}</span>
      of
      <span class="font-medium text-slate-700">{{ total }}</span>
    </p>

    <div class="flex items-center gap-2 flex-wrap">
      <!-- Page size -->
      <label v-if="showSizeChanger" class="flex items-center gap-2 text-sm text-slate-600">
        <span class="hidden sm:inline">Per page</span>
        <select
          :value="pageSize"
          @change="onSizeChange"
          class="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
          aria-label="Items per page"
        >
          <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </label>

      <!-- First -->
      <button
        type="button"
        :class="[baseBtn, 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50']"
        :disabled="page <= 1"
        @click="goTo(1)"
        aria-label="First page"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="11 17 6 12 11 7" />
          <polyline points="18 17 13 12 18 7" />
        </svg>
      </button>
      <!-- Prev -->
      <button
        type="button"
        :class="[baseBtn, 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50']"
        :disabled="page <= 1"
        @click="goTo(page - 1)"
        aria-label="Previous page"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <!-- Page numbers -->
      <template v-for="(p, idx) in pages" :key="idx">
        <span
          v-if="p === '…'"
          class="inline-flex h-9 items-center justify-center px-1 text-slate-400"
          aria-hidden="true"
        >…</span>
        <button
          v-else
          type="button"
          :class="[
            baseBtn,
            p === page
              ? 'bg-primary-700 text-white border border-primary-700'
              : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
          ]"
          :aria-current="p === page ? 'page' : undefined"
          @click="goTo(p)"
        >
          {{ p }}
        </button>
      </template>

      <!-- Next -->
      <button
        type="button"
        :class="[baseBtn, 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50']"
        :disabled="page >= totalPages"
        @click="goTo(page + 1)"
        aria-label="Next page"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      <!-- Last -->
      <button
        type="button"
        :class="[baseBtn, 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50']"
        :disabled="page >= totalPages"
        @click="goTo(totalPages)"
        aria-label="Last page"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="13 17 18 12 13 7" />
          <polyline points="6 17 11 12 6 7" />
        </svg>
      </button>
    </div>
  </nav>
</template>