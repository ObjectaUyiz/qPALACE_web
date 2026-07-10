<script setup lang="ts">
interface NewsItem {
  date: string
  title: string
  url?: string
}

defineProps<{
  items: NewsItem[]
}>()

const formatDate = (d: string) => {
  if (!d) return ''
  const date = new Date(d)
  if (isNaN(date.getTime())) return d
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <section v-if="items.length > 0" class="py-12 sm:py-14 border-b border-slate-200/80 bg-slate-50/40">
    <div class="container-page">
      <div class="mx-auto max-w-3xl text-center">
        <p class="text-xs font-semibold uppercase tracking-wider text-primary-700">Updates</p>
        <h2 class="mt-2 section-title">Latest News</h2>
        <p class="section-subtitle mx-auto">
          Recent releases, talks, and announcements from the qPALACE project.
        </p>
      </div>

      <ul class="mt-8 mx-auto max-w-3xl divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-soft">
        <li
          v-for="(item, idx) in items"
          :key="idx"
          class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 px-5 sm:px-6 py-4"
        >
          <time
            :datetime="item.date"
            class="shrink-0 text-xs font-medium uppercase tracking-wider text-slate-500 sm:w-32"
          >
            {{ formatDate(item.date) }}
          </time>
          <p class="text-sm sm:text-base text-slate-800">
            <a
              v-if="item.url"
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-primary-700 hover:underline underline-offset-2"
            >
              {{ item.title }}
            </a>
            <span v-else>{{ item.title }}</span>
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>