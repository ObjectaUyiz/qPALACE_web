<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const countdown = ref(10)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      if (timer) clearInterval(timer)
      router.push('/')
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <section class="py-20 sm:py-24 lg:py-32 min-h-[60vh] flex items-center">
    <div class="container-page">
      <div class="max-w-2xl mx-auto text-center">
        <!-- Icon -->
        <div class="flex justify-center mb-6">
          <div class="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
            <svg class="h-10 w-10 text-primary-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>

        <!-- Message -->
        <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
          Coming Soon
        </h1>
        <p class="mt-4 text-lg text-slate-600">
          This resource is not yet available. We're working on it!
        </p>

        <!-- Countdown -->
        <div class="mt-8">
          <p class="text-sm text-slate-500">
            Redirecting to home page in <span class="font-semibold text-primary-700">{{ countdown }}</span> seconds...
          </p>
          <div class="mt-4 w-full max-w-xs mx-auto bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              class="bg-primary-700 h-full transition-all duration-1000 ease-linear"
              :style="{ width: `${(10 - countdown) * 10}%` }"
            ></div>
          </div>
        </div>

        <!-- Manual navigation -->
        <div class="mt-8 flex flex-wrap gap-3 justify-center">
          <router-link to="/" class="btn-primary">
            Go to Home Now
          </router-link>
          <router-link to="/resources" class="btn-outline">
            Back to Resources
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>
