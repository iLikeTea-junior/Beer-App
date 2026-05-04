import BeersView from '@/views/BeersView.vue'
import ProfileView from '@/views/ProfileView.vue';
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/beers', name: 'beers', component: BeersView },
    { path: '/', redirect: '/beers' },

    { path: '/profile', name: 'profile', component: ProfileView}
  ],
  scrollBehavior() {
    return { top: 0 }
  }
});

export default router;