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
  // ����Ӧ����ʵ�ʼ��token���߼��������localStorage��cookie�л�ȡ
  return localStorage.getItem('token') ? true : false;
}

// ·������
router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    if (hasToken()) {
      // �����token����ת��/index
      next('/posts');
    } else {
      // ���û��token����ת��/login
      next('/login');
    }
  } else {
    // ����·��������ת
    next();
  }
});

export default router
