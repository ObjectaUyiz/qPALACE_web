<script setup lang="ts">
import site from '@/data/site'
import newsData from '@/data/news.json'

import HeroSection from '@/components/home/HeroSection.vue'
import ImageCarousel from '@/components/home/ImageCarousel.vue'
import LatestNews from '@/components/home/LatestNews.vue'

const newsCount = site.home.newsCount ?? 5
const news = (newsData as Array<{ date: string; title: string; url?: string }>).slice(0, newsCount)
</script>

<template>
  <div>
    <HeroSection />
    <ImageCarousel />
    <LatestNews v-if="site.home.showNews" :items="news" />
  </div>
</template>
