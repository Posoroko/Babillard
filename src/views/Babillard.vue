<template>
    <div class="tool-box">
        <span class="nav-btn" @click="goBack">arrow_back</span>
        <h1>{{title}}</h1>
      
      
    </div>
    <div class="babillard full parent3d" id="babillard" @dblclick="requestNewCard" @mousemove="moving" @mouseup="letGo">

      <div  class="tile pointer lift absolute card" 
        v-for="card in cardBundle" 
        :id="card.id"
        :key="card.id" 
        :style="{left: card.posX, top: card.posY }" 
        @mousedown="selectCard" >
        <h3>{{ card.title }}</h3>
        <p>{{ card.content }}</p>        
      </div>

       
      
      <transition name="fade">  
        <div class="requestPanel lift" v-if="requestPanelIsOn" :style="{left: posX, top: posY }"  key="1">
          
        <div class="newCardType" v-if="newCardType === null">
          <span class="close-btn-request" @click="requestPanelIsOn = false">close</span>
          <h1 class="new-card-title">Quel type de carte voulez-vous créer</h1>
          <div class="btn-box flex-row-centered">
            <button @click="newCardType = 'note'">note</button>
          </div>

        </div>
        <div class="newNote" v-if="newCardType === 'note'">
          <div class="close-btn-request-box"><span class="close-btn-request" @click="newCardType =  null">arrow_back</span></div>
          <h1>Créer une nouvelle note</h1>
          <input class="new-card-input" type="text" v-model="newCardTitle" placeholder="Titre">
          <textarea cols="5" rows="5" placeholder="notez ici vos idées..." v-model="newCardContent"></textarea>
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
    const cardBundle = ref(null)
    const title = ref()
    const description = ref()
    const router = useRouter()
    const requestPanelIsOn = ref(false)
    const newCardTitle = ref('')
    const newCardType = ref(null)
    const newCardContent = ref('')
    const posX = ref()
    const posY = ref()
    const id = ref(props.id)



    const createNewCard = async () => {
      let time = Date.now().toString()
      const newCard = {
        tile: newCardTitle.value,
        type: newCardType.value,
        content: newCardContent.value,
        id: time,
        posX: posX.value,
        posY: posY.value
      }
      requestPanelIsOn.value = false
      
      getAndModifyField(newCard)
    }
    const getAndModifyField = async (newCard) => {    
        
        projectFirestore.collection('users/' + user.value.uid + '/babillards').doc(id.value).get().then((doc) => {
          if(doc.data().cardList){
            var tempDoc = doc.data().cardList;
            tempDoc.push(newCard)
            projectFirestore.collection('users/' + user.value.uid + '/babillards').doc(id.value).update({ cardList: tempDoc}).then(()=> {
              cardBundle.value = tempDoc
              console.log(cardList.value)
            })

            } else {
            let newArr = new Array(newCard)
            projectFirestore.collection('users/' + user.value.uid + '/babillards').doc(id.value).update({cardList: newArr})
            cardBundle.value = newArr
          }
          
          
        })
      }
    
    

    const requestNewCard = (e) => {
      if(!requestPanelIsOn.value){
        var pos =e.target.getBoundingClientRect()
        posX.value = e.clientX - pos.left + 'px'
        posY.value = e.clientY - pos.top + 'px'
        requestPanelIsOn.value = true
      }
     
      
    }

    const goBack  = () => {
      router.push( { name: 'EspacePerso'} )
    } 

    projectFirestore.collection('users/' + user.value.uid + '/babillards').doc(props.id).get().then((doc) => {
      if(doc.exists){
        document.value = doc.data()
        title.value = document.value.title
        description.value = document.value.description
        cardBundle.value = doc.data().cardList
        } else{
        console.log('it prints here')
      }
    })

    

    return { document, title, goBack, requestNewCard, requestPanelIsOn, 
    posX, posY, newCardTitle, createNewCard, newCardType, newCardContent, cardBundle }
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

.card{
  background-color: white;
}
.card:active{
  cursor: grabbing;
}
</style>