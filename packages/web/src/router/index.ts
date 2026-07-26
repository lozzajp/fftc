import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import TitlesPage from '../views/TitlesPage.vue'
import ReleasesListPage from '../views/ReleasesListPage.vue'
import ContentPage from '../views/ContentPage.vue'
import ReleasesPage from '../views/ReleasesPage.vue'
import TitlePage from '../views/TitlePage.vue'
import ReleasePage from '../views/ReleasePage.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/titles', name: 'titles', component: TitlesPage },
    { path: '/releases', name: 'releases-list', component: ReleasesListPage },
    { path: '/raw/content', name: 'raw-content', component: ContentPage },
    { path: '/raw/releases', name: 'raw-releases', component: ReleasesPage },
    { path: '/title/:path', name: 'title', component: TitlePage },
    { path: '/release/:path', name: 'release', component: ReleasePage },
  ],
})
