import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/homeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView // 這裡應該直接引用 Vue 組件
    },
    {
      path: '/login',
      name: 'loginformView',
      component: () => import('../views/loginformView.vue')
    },
    {
      path: '/register',
      name: 'registerView',
      component: () => import('../views/registerView.vue')
    },
    {
      path: '/todolist',
      name: 'TodoListView',
      component: () => import('../views/TodoListView.vue')
    }
  ]
})

export default router
