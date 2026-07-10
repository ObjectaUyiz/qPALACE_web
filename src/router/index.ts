import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Home' },
  },
  {
    path: '/overview',
    name: 'overview',
    component: () => import('@/views/OverviewView.vue'),
    meta: { title: 'Overview' },
  },
  {
    path: '/papers',
    name: 'papers',
    component: () => import('@/views/PapersView.vue'),
    meta: { title: 'Papers' },
  },
  {
    path: '/slides',
    name: 'slides',
    component: () => import('@/views/SlidesView.vue'),
    meta: { title: 'Slides' },
  },
  {
    path: '/team',
    name: 'team',
    component: () => import('@/views/TeamView.vue'),
    meta: { title: 'Team' },
  },
  {
    path: '/people/:slug',
    name: 'person',
    component: () => import('@/views/PersonView.vue'),
    meta: { title: 'People' },
  },
  {
    path: '/resources',
    name: 'resources',
    component: () => import('@/views/ResourcesView.vue'),
    meta: { title: 'Resources' },
  },
  {
    path: '/libraries-license',
    name: 'libraries-license',
    component: () => import('@/views/LibrariesLicenseView.vue'),
    meta: { title: 'Libraries & Licenses' },
  },
  // Catch-all redirects to home
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

// Update document.title from route meta
router.afterEach((to) => {
  const base = 'qPALACE'
  const t = (to.meta?.title as string | undefined) || ''
  document.title = t ? `${t} · ${base}` : base
})

export default router