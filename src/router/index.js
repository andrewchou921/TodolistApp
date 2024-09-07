import { createRouter, createWebHistory } from 'vue-router'
import LoginFormView from '../views/loginformView.vue' // 將主頁改為登入頁面

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginFormView // 將首頁組件改為登入頁面
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
