import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '@/views/auth/Login.vue'
import Signup from '@/views/auth/Signup'
import EspacePerso from '@/views/EspacePerso'
import Babillard from '@/views/Babillard'
import Test from '@/views/auth/Test'

//route guard
import { projectAuth } from '@/firebase/config'

const requireAuth = (to, from, next ) => {
  let user = projectAuth.currentUser
  if(!user){
    next({ name: 'Home'})
  } else{
    next()
  }
}



const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/espace-perso',
    name: 'EspacePerso',
    component: EspacePerso,
    beforeEnter: requireAuth
  },
  {
    path: '/babillard/:id',
    name: 'Babillard',
    component: Babillard,
    props: true
  },
  {
    path: '/test',
    name: 'Test',
    component: Test
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
