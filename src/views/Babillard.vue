<template>
    <div class="tool-box">
        <span class="close-btn" @click="component = 'home'">arrow_back</span>
        <h1>{{title}}</h1>
      
      <button @click="check">check</button>
    </div>
    <div class="babillard full">

    </div>

    
</template>

<script>
import{ projectFirestore } from '@/firebase/config'
import getUser from '@/composables/getUser'

import { ref } from 'vue'

export default {
  props: [ 'id' ],
  setup(props){
    
    const { user } = getUser()
    const document = ref(null)
    const title = ref()
    const description = ref()

    projectFirestore.collection('users/' + user.value.uid + '/babillards').doc(props.id).get().then((doc) => {
      if(doc.exists){
        document.value = doc.data()
        title.value = document.value.title
        description.value = document.value.description
        } else{
        console.log('it prints here')
      }
    })

    const check = () => {
      console.log(title.value, description.value )
    }

    return { document, check, title }
  }
}
</script>

<style scoped>
.tool-box{
  padding: 1vh 0 1vh 5vw;
  background-color: rgb(120, 255, 203);
  display: flex;
  align-items: center;
}
h1{
  display: inline;
  padding-left: 25px;
  
}
.babillard{
  width: 100%;
  height: 100%;
  background-color: rgb(196, 245, 226);

}
</style>