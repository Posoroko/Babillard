<template>
    <h3>Créer un lien http</h3>
    <div>
        <input type="text" v-model="inputLink" placeholder="adresse http">
    
        <div class="nav-btn nav-btn_box auto-left">
            <span class="nav-btn nav-btn-on pointer" v-if="!isPending" @click="getLinkPreview">save navigate_next</span>
            <span class="nav-btn nav-btn-on pointer" v-else>pending</span>
        </div>

    </div>
    <div class="previewBox width grid-center" v-if="linkData">
        <h3  v-if="linkData.title">{{linkData.title}}</h3>
        <h3  v-if="!linkData.title">{{linkData.siteName}}</h3>
        <img :src="linkData.image" alt="" class="width" v-if="!linkData.favicon">
        <img :src="linkData.favicon" alt="" class="" v-else>
        <h3>{{linkData.description}}</h3>
        <span class="nav-btn nav-btn-on pointer" v-if="!isPending" @click="handleClick">save navigate_next</span>
        <span class="nav-btn nav-btn-on pointer" v-else>pending</span>
    </div>
    

</template>

<script setup>
    import { ref } from 'vue'
    import { projectFunctions } from '@/firebase/config'
    import { httpsCallable } from 'firebase/functions'
    import processLinkData from '@/composables/processLinkData'
    const emit = defineEmits([ 'createLinkCard' ])

    const error = ref(null)
    const isPending = ref(false)
    const inputLink = ref('http://')
    const linkData = ref(null)
    const getMetadata = httpsCallable(projectFunctions, 'getMetadata')
   
    //submit input link to fetch metadata
    const getLinkPreview = async () =>{
        error.value = null
        isPending.value = true
        getMetadata({link: inputLink.value}).then((result) => {
            console.log(result.data)
            linkData.value = processLinkData(result.data)
            console.log(linkData.value)
            isPending.value = false
        }).catch((err) => {
            console.log(err.message)
            error.value = "Vérifiez que l'adresse soit bien valide. :-)"
            console.log(error.value)
            isPending.value = false
        })
    }

    //create new card one the metadata is fetched
    const handleClick = () => {
      if(!error.value && linkData.value) {
        isPending.value = true
        emit('createLinkCard', linkData.value)
        isPending.value = false
      }
    }


</script>

<style scoped>
.previewBox img{
    width: 50%;
}

</style>