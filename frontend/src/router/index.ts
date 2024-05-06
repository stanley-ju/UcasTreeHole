import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LoginPage from '../views/login/LoginPage.vue'
import PostPage from '../views/post/PostPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/posts',
    name: 'posts',
    component: PostPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

function hasToken() {
  // 这里应该是实际检查token的逻辑，例如从localStorage或cookie中获取
  return localStorage.getItem('token') ? true : false;
}

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    if (hasToken()) {
      // 如果有token，跳转到/index
      next('/posts');
    } else {
      // 如果没有token，跳转到/login
      next('/login');
    }
  } else {
    // 其他路由正常跳转
    next();
  }
});

export default router
