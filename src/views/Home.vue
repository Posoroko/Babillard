<template>
  <div class="home full">
    <div class="content">
      <FullLogo />
      <h1>Créer, organiser et partager les idées</h1>
      <div v-if="user" class="who-is-connected flex JC-center">Vous êtes connecté en tant que {{user.displayName}}</div>
      <div v-else class="width" >
        <router-link class="big-btn lift" :to="{ name: 'Signup'}">créer un compte</router-link>
        <router-link class="big-btn lift" :to="{ name: 'Login'}">connexion</router-link>
      </div>
      
    </div>
  </div>
</template>

<script>
import FullLogo from '@/components/FullLogo'
import getUser from '@/composables/getUser'

export default {
  name: 'Home',
  components: { FullLogo  },
  setup() {
    const { user } = getUser()



    return { user }
  }
}


</script>
<style scoped>
.home{
  display: grid;
  place-items: center;
  background: radial-gradient(circle, rgba(235,235,235,1) 0%, rgba(79,81,90,0.8) 100%);
}
.content{
  width: 40%;
  height: 50%;
}
.content h1{
  display: flex;
  justify-content: center;
}
.content div{
  display: flex;
  justify-content: center;
}
.big-btn { 
  background: var(--secondary);
  border-radius: 4px;
  border: 0;
  padding: 12px 24px;
  margin: 20px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  display: inline-block;
}
.big-btn:hover {
  background: #4f515a63;
  color: white;
}
.who-is-connected{
  padding: 30px;
}
</style>