<template>
    <div class="tool-box">
      <div class="nav-btn_box">
          <span class="nav-btn nav-btn-on pointer"  @click="goBack">arrow_back</span>
      </div>
        <h1>{{title}}</h1>
    </div>

<!-- Babillard     --> 

    <div class="babillard width parent3d" id="babillard" 
          @dblclick="requestNewCard" 
          @mousemove="moving" 
          @click="babiHeight"
          @mouseup="letGo"
          ref="babi_div"
          :style="{ 
            backgroundImage: 'url(' + wallpaper + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: color,
            height: babiHeight + 'px',
          }" >



<!-- cards     --> 
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

<!-- page = type     -->             
        <div class="newCardType full flex column" v-if="page === 'type'">
            <div class="flex width">
                <div class="nav-btn nav-btn_box">
                    <span class="nav-btn nav-btn-on pointer" @click="requestPanelIsOn = false">close</span>
                </div>
            </div>

         
            <div class="new-card-title width">Quel type de carte voulez-vous créer</div>
              <div class="grid-center">
                  <div  class="tiny-tile card-type pointer lift" 
                      @click="newCardType = 'note'"
                      :class="{ 'selected plus': (newCardType == 'note')}"
                      >note
                  </div>
                  <div class="flex width">
                      <div class="nav-btn nav-btn_box auto-left">
                          <span class="nav-btn nav-btn-on pointer"  @click="page='info'">arrow_forward</span>
                      </div>
                  </div>     
              </div>
        </div>

<!-- page = info     -->   
        <div class="newNote" v-if="page === 'info'">
            <div class="flex width">
                <div class="nav-btn nav-btn_box">
                    <span class="nav-btn nav-btn-on pointer"  @click="page='type'">arrow_back</span>
                </div>
            </div>    
            <h1>Créer une nouvelle note</h1>
            <input class="new-card-input" type="text" v-model="newCardTitle" placeholder="Titre">
            <textarea cols="5" rows="5" placeholder="notez ici vos idées..." v-model="newCardContent"></textarea>
            <div class="flex width">
                <div class="nav-btn nav-btn_box auto-left">
                    <span class="nav-btn nav-btn-on pointer"  @click="createNewCard">save navigate_next</span>
                </div>
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
    const title = ref(null)
    const description = ref(null)
    const wallpaper = ref(null)
    const miniature = ref(null)
    const color = ref(null)
    const cardBundle = ref(null)
    const type = ref(null)


    
    const page = ref(null)
    
    const router = useRouter()
    const requestPanelIsOn = ref(false)
    const newCardTitle = ref('')
    const newCardType = ref(null)
    const newCardContent = ref('')
    const posX = ref()
    const posY = ref()
    const id = ref(props.id)

    const babi_div = ref(null)

    const babiHeight = ref(null)

    


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
        if(e.clientX - pos.left < 200) {
          posX.value = '200px'
        } else {
          posX.value = e.clientX - pos.left + 'px'
        }
        if(e.clientY - pos.top < 200) {
          posY.value = '200px'
        } else {
          posY.value = e.clientY - pos.top + 'px'
        }
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
        title.value = doc.data().title
        description.value = doc.data().description
        type.value = doc.data().type
        color.value = doc.data().value
        wallpaper.value = doc.data().wallpaper
        miniature.value = doc.data().miniature
        babiHeight.value = window.innerHeight - babi_div.value.offsetTop
        } else{
        console.log('it prints here')
      }
    })

    

    return { document, title, goBack, requestNewCard, requestPanelIsOn, 
    posX, posY, newCardTitle, createNewCard, newCardType, newCardContent, cardBundle, page, wallpaper, miniature, color, type, babi_div, babiHeight }
  }
}
</script>

<style scoped>

.tool-box{
  padding: 1vh 0 1vh 5vw;
  background-color: rgb(255, 192, 120);
  display: flex;
  align-items: center;
}

.babillard{
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  overflow: auto;
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