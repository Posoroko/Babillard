<template>
  <section class="auth-section" @submit.prevent="handleSubmit">
        
        <form class="signup-form">
        <h1 class="title signup-title">Créer votre babillard</h1>
        <input type="text" placeholder="nom d'utilisateur" v-model="displayName">
        <input type="email" placeholder="adresse courriel" v-model="email">
        <input type="password" placeholder="mot de passe" v-model="password">
        <div v-if="error" class="error">{{ error }}</div>
        <button class="submit-signup" v-if="!isPending">connexion</button>
        <button class="submit-signup" v-if="isPending" disabbled>patientez...</button>
  </form>
  </section>
</template>

<script>
import useSignup from '@/composables/useSignup'
import { ref } from '@vue/reactivity'
import { useRouter, onMounted } from 'vue-router'

export default {
    setup(){
        const { error, signup, isPending } = useSignup()
        const router = useRouter()

        const email = ref('')
        const password = ref('')
        const displayName= ref('')

        const handleSubmit = async () => {
            const res = await signup(email.value, password.value, displayName.value)
            if(!error.value){
                console.log('Votre compte a bien été crée')
                router.push( { name: 'EspacePerso'} )
            } else {
                console.log('Un problème est survenu. Vou pouvez essayer à nouveau')
            }
            
        }

        return { email, password, displayName, handleSubmit, error, isPending  }
    }
}
</script>

<style>

</style>