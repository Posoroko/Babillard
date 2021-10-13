<template>
    <div class="tool-box">
        <span class="nav-btn" @click="goBack">arrow_back</span>
        <h1>{{title}}</h1>
      
      
    </div>
    <div class="babillard full parent3d" id="babillard" @dblclick="requestNewCard" @mousemove="moving" @mouseup="letGo">

      <div  class="tile pointer lift card" 
        v-for="card in cardBundle" 
        :id="card.id"
        :key="card.id" 
        
        @mousedown="selectCard" >
        <h3>{{ card.title }}</h3>
        <p>{{ card.content }}</p>        
      </div>

       
      
      <transition name="fade">  
        <div class="requestPanel lift" v-if="requestPanelIsOn" :style="{left: posX, top: posY }"  key="1">
          
        <div class="newCardType full flex column" v-if="page === 'type'">
            <span class="close-btn-request icons" @click="requestPanelIsOn = false">close</span>
            <div class="new-card-title width">Quel type de carte voulez-vous créer</div>
            <div class="grid-center">
                <div  class="tiny-tile card-type pointer lift" 
                    @click="newCardType = 'note'"
                    :class="{ 'selected plus': (newCardType == 'note')}"
                    >note
                </div>
                <div class="flex width">
                    <span class="nav-btn pointer auto-left" @click="page = 'info'">arrow_forward</span>
                </div>
                    
            </div>
        </div>


        <div class="newNote" v-if="page === 'info'">
            
            <div class="flex width">
                <span class="nav-btn pointer" @click="page='type'">arrow_back</span>
            </div>
            <h1>Créer une nouvelle note</h1>
            <input class="new-card-input" type="text" v-model="newCardTitle" placeholder="Titre">
            <textarea cols="5" rows="5" placeholder="notez ici vos idées..." v-model="newCardContent"></textarea>
            <div class="flex width nav-btn-box eric">
                <span class="nav-btn pointer auto-left"  @click="createNewCard">save</span>
            </div>
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
    
    /* code pour un babillard position absolute   :style="{left: card.posX, top: card.posY }"  */ 
    const { user } = getUser()
    const document = ref(null)
    const cardBundle = ref(null)
    const page = ref(null)
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
        title: newCardTitle.value,
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
            })

            } else {
            let newArr = new Array(newCard)
            projectFirestore.collection('users/' + user.value.uid + '/babillards').doc(id.value).update({cardList: newArr})
            cardBundle.value = newArr
          }
          newCardTitle.value = null
          newCardType.value = null
          newCardContent.value = null
          posX.value = null
          posY.value = null
        })
      }
    
    

    const requestNewCard = (e) => {
      if(!requestPanelIsOn.value){
        var pos =e.target.getBoundingClientRect()
        posX.value = e.clientX - pos.left + 'px'
        posY.value = e.clientY - pos.top + 'px'
        requestPanelIsOn.value = true
        page.value = 'type'
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
    posX, posY, newCardTitle, createNewCard, newCardType, newCardContent, cardBundle, page }
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
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
}
.requestPanel{
  width: 400px;
  padding: 20px;
  background-color: white;
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 10000;
}
.new-card-title{
  font-size: 16px;
  padding: 20px;
}
.card-type{
  display: grid;
  place-items: center;
  background-color: var(--secondary);
}
.type-next{
  font-size: 30px;
  padding: 20px;
  margin-left: auto;
}
.close-btn-request{
  font-size: 30px;
  padding: 20px;
}
.close-btn-request:hover{
  cursor: pointer;
}

.card{
  background-color: white;
  
  padding: 20px;
}
.card:active{
  cursor: grabbing;
}
</style>