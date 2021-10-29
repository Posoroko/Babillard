<template>
  <h1>{{name}}</h1>
  <button @click="doClick">get metadata</button>
  <button @click="handleClick">say hello</button>
  <div>
    <ul v-if="siteInfo">
      <li>{{siteInfo.url}}</li>
      <li>{{siteInfo.title}}</li>
      <li>{{siteInfo.siteName}}</li>
      <li>{{siteInfo.description}}</li>
      <li>{{siteInfo.contentType}}</li>
      <li>{{siteInfo.mediaType}}</li>
      <li><img :src="siteInfo.images[0]" alt=""></li>
    </ul>
  </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { projectFunctions } from '@/firebase/config'
    import { httpsCallable } from 'firebase/functions'
    
    const getMetadata = httpsCallable(projectFunctions, 'getMetadata')
    const sayHello = httpsCallable(projectFunctions, 'sayHello')
    const siteInfo = ref(null)

    const doClick = async () =>{
      getMetadata().then((result) => {
        console.log(result.data)
        siteInfo.value= result.data
      })
    }
    const handleClick = () => {
      sayHello().then((result) => {
      console.log(result.data)
      
    })
    }


</script>

<style scoped>

</style>