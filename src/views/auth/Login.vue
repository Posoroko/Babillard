<template>
  <section class="auth-section" @submit.prevent="handleSubmit">
      
      <form class="login-form">
        <h1 class="title login-title">Connectez-vous à votre babillard</h1>
      <input type="email" placeholder="adresse courriel" v-model="email">
      <input type="password" placeholder="mot de passe" v-model="password">
      <div v-if="error" class="error">{{ error }}</div>
      <button class="submit-login" v-if="!isPending">connexion</button>
      <button class="submit-login" v-if="isPending" disabbled>patientez...</button>
  </form>
  </section>
</template>

<script>
import useLogin from '@/composables/useLogin'
import { ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import getUser from '@/composables/getUser'


export default {
    setup(){
        const { error, login, isPending } = useLogin()
        const router = useRouter()
        const email = ref('')
        const password = ref('')

        
        const handleSubmit = async () => {

            const res = await login(email.value, password.value)
            if(!error.value){
                console.log("un utilisateur s'est connecté")
                router.push( { name: 'EspacePerso'} )
            } else{
                console.log(error.value)
            }
        }

        return { email, password, handleSubmit, error, isPending  }
    }
}
</script>

<style scoped>



</style>