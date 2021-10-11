<template>
    <div class="tool-box">
        <span class="close-btn" @click="goBack">arrow_back</span>
        <h1>{{title}}</h1>
      
      
    </div>
    <div class="babillard full parent3d" @dblclick="requestNewCard">

       
      
      <transition name="fade">  
        <div class="requestPanel lift" v-if="requestPanelIsOn" :style="{left: left, top: top}"  key="1">
          
        <div class="newCardType" v-if="typeOfNewCard === null">
          <span class="close-btn-request">close</span>
          <h1 class="new-card-title">Quel type de carte voulez-vous créer</h1>
          <div class="btn-box flex-row-centered">
            <button @click="typeOfNewCard = 'note'">note</button>
          </div>

        </div>
        <div class="newNote" v-if="typeOfNewCard === 'note'">
          <div class="close-btn-request-box"><span class="close-btn-request" @click="typeOfNewCard =  null">arrow_back</span></div>
          <h1>Créer une nouvelle note</h1>
          <input class="new-card-input" type="text" v-model="newCardTitle" placeholder="Titre">
          <textarea cols="5" rows="5" placeholder="notez ici vos idées..." v-model="newCardNote"></textarea>
          <button class="new-post-btn" @click="createNewCard">créer</button>
        </div>
      
        </div>
      </transition> 

    </div>

    
</template>

<script>

import{ projectFirestore } from '@/firebase/config'
import getUser from '@/composables/getUser'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

export default {
  props: [ 'id' ],
  setup(props){
    
    const { user } = getUser()
    const document = ref(null)
    const title = ref()
    const description = ref()
    const router = useRouter()
    const requestPanelIsOn = ref(false)

    const typeOfNewCard = ref(null)

    const newCardTitle = ref('')
    const newCardNote = ref('')
    const left = ref()
    const top = ref()
    const id = ref(props.id)

    const requestNewCard = (e) => {
      var pos =e.target.getBoundingClientRect()
      left.value = e.clientX - pos.left + 'px'
      top.value = e.clientY - pos.top + 'px'
      requestPanelIsOn.value = true
      
    }

    const goBack  = () => {
      console.log('eroc')
      router.push( { name: 'EspacePerso'} )
    } 

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

    return { document, check, title, goBack, requestNewCard, requestPanelIsOn, left, top, newCardTitle, newCardNote, typeOfNewCard }
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

.babillard{
  width: 100%;
  height: 100%;
  background-color: rgb(196, 245, 226);
  position: relative;
}
.requestPanel{
  width: 400px;
  height: 500px;
  padding: 10px;
  background-color: white;
  position: absolute;
  transform: translate(-50%, -50%);
}
.new-card-title{
  font-size: 16px;
  padding: 10px 0;
}


.close-btn-request{
  font-family: 'Material Icons';
  font-size: 30px;
  padding: 0px;
}
.close-btn-request:hover{
  cursor: pointer;
}
.test{
  width: 400px;
  height: 400px;
  background-color: red;
}

</style>