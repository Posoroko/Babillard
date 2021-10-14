<template>
  <div class="navbar">
      <nav>
          <h1><router-link :to="{ name: 'Home' }">Babillard</router-link></h1>
          <div class="links">
            <div v-if="user">
              <router-link class="btn" :to="{ name: 'Test'}">Test</router-link>
              <router-link class="btn" :to="{ name: 'EspacePerso'}">Espace Prosonnel</router-link>
              <button @click="handleClick">déconnexion</button>
            </div>
            <div v-else>

              <router-link class="btn" :to="{ name: 'Signup'}">créer un compte</router-link>
              <router-link class="btn" :to="{ name: 'Login'}">connexion</router-link>
            </div>
            
          </div>
      </nav>
  </div>
</template>

<script>
import useLogout from '@/composables/useLogout'

import { useRouter } from 'vue-router'
import getUser from '@/composables/getUser'


export default {
  setup(){
    const { logout } = useLogout()
    const router = useRouter()
    const { user } = getUser()
    

    const handleClick = async () => {
      await logout()
      console.log('Utilisateur déconnecté')
      
      
      router.push( { name: 'Home'} )
    }



    return { useLogout, handleClick, user }
  }
}
</script>

<style scoped>
.navbar{
  padding: 16px 10px;
  background-color: white;
}
nav{
  display: flex;
  align-items: center;
  width: 100%;
}
nav h1{
  margin-left: 20px;
}
nav .links{
  margin-left: auto;
}
nav .links a, button{
  font-size: 14px;
  margin-left: 16px;
}
</style>