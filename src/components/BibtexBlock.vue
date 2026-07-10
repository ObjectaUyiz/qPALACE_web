<script setup lang="ts">
import { ref, nextTick } from 'vue'

const props = defineProps<{
  bibtex: string
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
  (e: 'close'): void
}>()

const copied = ref(false)
const codeRef = ref<HTMLElement | null>(null)
let copyTimer: number | undefined

const copy = async () => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(props.bibtex)
    } else {
      // Fallback: temporary textarea
      const ta = document.createElement('textarea')
      ta.value = props.bibtex
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    copied.value = true
    if (copyTimer) window.clearTimeout(copyTimer)
    copyTimer = window.setTimeout(() => {
      copied.value = false
    }, 1800)
  } catch (err) {
    console.error('Failed to copy BibTeX', err)
  }
}

const selectAll = async () => {
  await nextTick()
  if (codeRef.value) {
    const range = document.createRange()
    range.selectNodeContents(codeRef.value)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
  }
}
</script>

<template>
  <div
    v-if="open"
    class="mt-2 rounded-md border border-slate-200 bg-slate-50"
    role="region"
    aria-label="BibTeX entry"
  >
    <div class="flex items-center justify-between border-b border-slate-200 bg-white/60 px-3 py-1.5">
      <span class="text-xs font-medium text-slate-500">BibTeX</span>
      <div class="flex items-center gap-1">
        <button
          type="button"
          class="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          @click="selectAll"
          aria-label="Select BibTeX text"
        >
          Select
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium text-primary-700 hover:bg-primary-50"
          @click="copy"
          aria-label="Copy BibTeX to clipboard"
        >
          <svg v-if="!copied" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <svg v-else class="h-3.5 w-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {{ copied ? 'Copied' : 'Copy' }}
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          @click="emit('close')"
          aria-label="Close BibTeX"
        >
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
    <pre
      ref="codeRef"
      class="overflow-x-auto p-3 text-xs leading-relaxed text-slate-700 font-mono whitespace-pre"
    ><code>{{ bibtex }}</code></pre>
  </div>
</template>