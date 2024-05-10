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
  return localStorage.getItem('token') ? true : false;
}

//路由守卫
router.beforeEach((to, from, next) => {
  if (hasToken()){
    if(to.path === '/' || to.path === '/login'){
      next('/posts')
    }else{
      next()
    }
  }else{
    if(to.path === '/login'){
      next()
    }else{
      next('/login')
    }

  }
});

export default router
