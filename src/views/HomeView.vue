<script setup lang="ts">
import site from '@/data/site'
import featuresData from '@/data/features.json'
import newsData from '@/data/news.json'

import HeroSection from '@/components/home/HeroSection.vue'
import ImageCarousel from '@/components/home/ImageCarousel.vue'
import FeatureSection from '@/components/home/FeatureSection.vue'
import LatestNews from '@/components/home/LatestNews.vue'

const features = featuresData
const newsCount = site.home.newsCount ?? 5
const news = (newsData as Array<{ date: string; title: string; url?: string }>).slice(0, newsCount)
</script>

<template>
  <div>
    <HeroSection />
    <ImageCarousel />
    <FeatureSection :features="features" />
    <LatestNews v-if="site.home.showNews" :items="news" />
  </div>
</template>
