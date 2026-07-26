import { createRouter, createWebHistory } from 'vue-router'
import ContentPage from '../views/ContentPage.vue'
import ReleasesPage from '../views/ReleasesPage.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'content', component: ContentPage },
    { path: '/releases', name: 'releases', component: ReleasesPage },
  ],
})
