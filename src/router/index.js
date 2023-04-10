import { createRouter, createWebHistory } from 'vue-router'
import MapVisual from '../views/MapVisual.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MapVisual
    },
  ]
})

export default router
