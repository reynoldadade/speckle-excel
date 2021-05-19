import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'streams',
    component: () => import('../views/Streams.vue')
  },
  {
    path: '/add',
    name: 'add',
    component: () => import('../views/Add.vue')
  },
  {
    path: '/streams/:streamId/commits/:commitId',
    name: 'commit',
    meta: {
      title: 'Commit | Speckle'
    },
    component: () => import('../views/Commit.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/logout',
    name: 'logout'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.query.access_code) {
    window.Office.context.ui.messageParent(to.query.access_code)
  }

  await store.restored
  if (to.name !== 'login' && !store.getters.isAuthenticated) {
    let loggedIn = await store.dispatch('hasValidToken')
    if (loggedIn) next(to)
    else next('/login')
  } else if (to.name === 'logout') {
    await store.dispatch('logout')
    next('/login')
  } else next()
})
export default router
