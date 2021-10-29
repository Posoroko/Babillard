<template>
    <h3>Créer un lien http</h3>
    <div class="eric">
        <input type="text" v-model="inputLink" placeholder="adresse http">
    
        <div class="nav-btn nav-btn_box auto-left">
            <span class="nav-btn nav-btn-on pointer" v-if="!isPending" @click="getLinkPreview">save navigate_next</span>
            <span class="nav-btn nav-btn-on pointer" v-else>pending</span>
        </div>

    </div>
    <div class="width eric" v-if="linkData">
        <h3  v-if="linkData.title">{{linkData.title}}</h3>
        <h3  v-if="!linkData.title">{{linkData.siteName}}</h3>
        <img :src="linkData.images[0]" alt="" class="width" v-if="linkData.images[0]">
        <img :src="linkData.favicons[0]" alt="" class="" v-if="!linkData.images[0]">
        <h3>{{linkData.description}}</h3>
    </div>
    

</template>

<script setup>
    import { ref } from 'vue'
    import { projectFunctions } from '@/firebase/config'
    import { httpsCallable } from 'firebase/functions'

    const inputLink = ref('http://')
    const linkData = ref(null)
    const getMetadata = httpsCallable(projectFunctions, 'getMetadata')

    const getLinkPreview = async () =>{

        getMetadata({link: inputLink.value}).then((result) => {
            linkData.value = result.data
            console.log(linkData.value)
        })
    }

</script>

<style>

</style>