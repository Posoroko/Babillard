<template>
    <div class="tool-box">
      <div class="nav-btn_box">
          <span class="nav-btn nav-btn-on pointer"  @click="goBack">arrow_back</span>
      </div>
        <h1>{{title}}</h1>
        <button @click="requestNewCard">créer une nouvelle carte</button>
    </div>

<!-- Babillard     --> 

    <div class="babillard width" id="babillard" 
          @dblclick="requestNewCard" 
          @mousemove="moving" 
          @mouseup="letGo"
          ref="babi_div"
          v-bind:style="babiStyles" >



<!-- cards     --> 
    <div class="babillard full parent3d" v-if="cardBundle">
      <div  class=" pointer lift card" 
        v-for="card in cardBundle" 
        :id="card.id"
        :key="card.id" 
        @mousedown="selectCard" >
        <img v-if="card.type == 'import'" :src="card.miniUrl" class="full card-mini">

        <!-- needs more conditions for different types of links -->
        <a v-if="card.type == 'link'" :href="card.linkData.url" target="_blank">
          <img  :src="card.linkData.favicon" class="card-mini">
        </a>


        <div class="card-top-bar width flex JC-space-between">
          <h3 v-if="card.type='link'" class="card-info-border card-title">{{ card.linkData.title.substring(0,25) }}</h3>
          <h3 v-else class="card-info-border card-title">{{ card.title }}</h3>
          <span class="card-info-border pointer card-settings"  @click="goToTypePage">tune</span>
        </div>
        
        <p v-if="card.type == 'note'" class="full  note-content">{{ card.content }}</p>   
        <p v-if="card.type == 'import'" class="card-info-border image-description">{{ card.content }}</p>
        <p v-if="card.type == 'link'" class="card-info-border image-description">{{ card.linkData.description.substring(0,25) }}</p>
        <div class="handle"></div>    


      </div>
    </div>
      

       
      

      <transition name="fade">  
        <div class="requestPanel lift form" v-if="requestPanelIsOn" :style="{left: posX, top: posY }"  key="1">

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
                        @click="newCardType = 'note'" :class="{ 'selected plus': (newCardType == 'note')}">note
                  </div>
                  <div  class="tiny-tile card-type pointer lift" 
                        @click="newCardType = 'import'" :class="{ 'selected plus': (newCardType == 'import')}">importer une photo
                  </div>
                  <div  class="tiny-tile card-type pointer lift" 
                        @click="newCardType = 'http'" :class="{ 'selected plus': (newCardType == 'http')}">lien http
                  </div>

                  <div class="flex width">
                      <div class="nav-btn nav-btn_box auto-left">
                          <span class="nav-btn nav-btn-on pointer"  @click="goToTypePage">arrow_forward</span>
                      </div>
                  </div>     
              </div>
        </div>

<!-- page = info     -->   
        <div class="newNote" v-if="page === 'note'">
            <div class="flex width">
                <div class="nav-btn nav-btn_box">
                    <span class="nav-btn nav-btn-on pointer"  @click="page='type'">arrow_back</span>
                </div>
            </div>    
            <h3 v-if="newCardType == 'note'">Créer une nouvelle note</h3>
            <h3 v-if="newCardType == 'image'">Créer une nouvelle note</h3>
            <input class="new-card-input" type="text" v-model="newCardTitle" placeholder="Titre">
            <textarea cols="5" rows="5" placeholder="notez ici vos idées..." v-model="newCardContent"></textarea>
            <div class="flex width">
                <div class="nav-btn nav-btn_box auto-left">
                    <span class="nav-btn nav-btn-on pointer" v-if="!isPending" @click="createNewCard">save navigate_next</span>
                    <span class="nav-btn nav-btn-on pointer" v-else>pending</span>
                </div>
            </div>  
        </div>

<!-- page = import image     --> 
        <div v-if="page === 'import'">
          <ImportFile @createImageCard='createImageCard' />
        </div>
        <div v-if="page === 'http'">
          <CreateLink @createLinkCard='createLinkCard' />
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
import ImportFile from '@/components/ImportFile'
import CreateLink from '@/components/CreateLink'
import useStorage from '@/composables/useStorage'
// backgroundImage: 'url(' + wallpaper + ')',
// backgroundColor: color,


export default {
  props: [ 'id' ],
  components: { ImportFile, CreateLink },
  setup(props){
    const { imageUrl, miniUrl, storageError, filePath, uploadImage } = useStorage()
    const error = ref(null)
  
    const isPending = ref(false)
    const { user } = getUser()
    const pathRef = 'users/' + user.value.uid + '/babillards/' + props.id + '/'
    const router = useRouter()
    
/* code pour un babillard position absolute   :style="{left: card.posX, top: card.posY }"  */ 

    const document = ref(null)
    const title = ref(null)
    const description = ref(null)
    const wallpaper = ref(null)
    const miniature = ref(null)
    const color = ref(null)
    const babiStyles = ref({})
    const cardBundle = ref(null)
    const type = ref(null)
    const id = ref(props.id)
/*------ Fin des variable du babillard  ----------*/

/*----------- Variable de nouvelle carte ----------*/   
    const page = ref(null)
    const requestPanelIsOn = ref(false)

    const newCardTitle = ref('')
    const newCardType = ref(null)
    const newCardContent = ref('')
    const imageName = ref('')
    const miniName = ref('')
    const posX = ref()
    const posY = ref()
    

/*----------- Variable de nouvelle carte ----------*/
    const babi_div = ref(null)
    const babiHeight = ref(null)

   

    //key is for fireing the function if it is triggered by  createImageCard()

    const createNewCard = (e, key) => {
      if(!isPending.value || key != undefined) {
        isPending.value = true
        let time = Date.now().toString()
        const newCard = {
            title: newCardTitle.value,
            type: newCardType.value,
            content: newCardContent.value,
            id: time,
            posX: posX.value,
            posY: posY.value,
            filePath: filePath.value,
            imageUrl: imageUrl.value,
            miniUrl: miniUrl.value,
            imageName: imageName.value,
            miniName: miniName.value
        }
        
      
        getAndModifyField(newCard)
      }
    }
    const getAndModifyField = async (newCard) => {    
        
        projectFirestore.collection('users/' + user.value.uid + '/babillards').doc(id.value).get().then((doc) => {
          if(doc.data().cardList){
            error.value = null
            var tempDoc = doc.data().cardList;
            tempDoc.push(newCard)
            projectFirestore.collection('users/' + user.value.uid + '/babillards').doc(id.value).update({ cardList: tempDoc})
            .then(()=> { cardBundle.value = tempDoc

            }).catch((err) => {
                error.value = err.message
            })

            } else {
            let newArr = new Array(newCard)
            projectFirestore.collection('users/' + user.value.uid + '/babillards').doc(id.value).update({cardList: newArr})
            .then(() => {
              

            }).catch((err) => {
              error.value = err.message
 
            })
            cardBundle.value = newArr
          }
          isPending.value = false
        }).catch((err) => {
          error.value = err.message
        })
        if(!error.value) {
            newCardTitle.value = null
            newCardType.value = null
            newCardContent.value = null
            posX.value = null
            posY.value = null
            requestPanelIsOn.value = false
        }
      }
    
    

    const requestNewCard = (e) => {
      if(!requestPanelIsOn.value){
          requestPanelIsOn.value = true
          var pos =e.currentTarget.getBoundingClientRect()
          if(e.clientX - pos.left < 200) {
            posX.value = '250px'
          } else {
            posX.value = e.clientX - pos.left + 'px'
          }
          if(e.clientY - pos.top < 200) {
            posY.value = '350px'
          } else {
            posY.value = e.clientY - pos.top + 'px'
          }
          page.value = 'type'
      }
     
      
    }
    const goToTypePage = () => {
      switch(newCardType.value) {
        case 'note': page.value = 'note'
        break
        case 'import': page.value = 'import'
        break
        case 'http': page.value = 'http'
      }
    }

    const goBack  = () => {
      router.push( { name: 'EspacePerso'} )
    } 

    projectFirestore.collection('users/' + user.value.uid + '/babillards').doc(props.id).get()
        .then((doc) => {
            if(doc.exists){
                document.value = doc.data()
                title.value = doc.data().title
                description.value = doc.data().description
                type.value = doc.data().type
                color.value = doc.data().color
                wallpaper.value = doc.data().wallpaper
                miniature.value = doc.data().miniature
                babiHeight.value = window.innerHeight - babi_div.value.offsetTop + 'px'
                cardBundle.value = doc.data().cardList
                console.log(doc.data().color)
                if (doc.data().wallpaper) {
                    babiStyles.value =  { 
                      background: 'url(' + doc.data().wallpaper + ')',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',           
                      height: babiHeight
                    }
                } else if (doc.data().color) {
                  babiStyles.value = { 
                      background: doc.data().color,
                      height: babiHeight 
                  }
                }
            }     
        })
        .catch((err) => {
          error.value = err.message
        })
    
    // pour créer une carte contenant une image, on commence par upload l'image dans Storage
    // createImageCard() est un 'emit' qui arrive du component 'importfile.vue'
    
    const createImageCard = async (pack) => {
        if(!isPending.value) {
          error.value = null
          storageError.value = null
          isPending.value = true
          // upload image and miniature to firebase.storage
          // emit an object containing the image informations
          //title, description, image and miniature
          await uploadImage(pathRef, pack.image)
          await uploadImage(pathRef, pack.miniature)
          newCardTitle.value = pack.title
          newCardContent.value = pack.content
          imageName.value = pack.imageName
          miniName.value = pack.miniName
          if(!storageError.value) {
              createNewCard(null, 'let me in') //
          } else {
            console.log(storageError.value)
          }
        }
    }

    const createLinkCard = async (pack) => {
        if(!isPending.value) {
          error.value = null
          storageError.value = null
          isPending.value = true
          
          let time = Date.now().toString()
          const newCard = {
              type: 'link',
              linkData: pack,
              id: time,
              posX: posX.value,
              posY: posY.value,
          }
        requestPanelIsOn.value = false
      
        getAndModifyField(newCard)

        }
    }


    

    return { document, title, goBack, requestNewCard, requestPanelIsOn, 
    posX, posY, newCardTitle, createNewCard, newCardType, newCardContent, 
    cardBundle, page, wallpaper, miniature, color, type, babi_div, babiHeight,
    createImageCard, goToTypePage, imageUrl, miniUrl, storageError, filePath, uploadImage, isPending, babiStyles, error, createLinkCard }
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
.tool-box button{
  margin-left: 30px;
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
  width: 250px;
  aspect-ratio: 5/4;
  border-radius: 15px;
  margin: 10px;
  background-color: white;
  position: relative;
  padding: 8px;
}
.card:active{
  cursor: grabbing;
}
.card-info-border{
  border: 1px solid var(--funky);
}
.card-title {
  max-width: 80%;
  font-size: 16px;
  font-weight: 300;
  background-color: white;
  padding: 3px 5px;
  border-radius: 0 0 10px 0;
}
.card-top-bar{
  position: absolute;
  top: 0;
  left: 0;
  
}
.card-settings{
  font-family: 'Material Icons';
  font-size: 20px;
  background-color: white;
  padding: 3px 5px;
  border-radius: 0 0 0 10px;
}
.card-mini{
  object-fit: cover;
}
.image-description{
  max-width: 100%;
  font-size: 14px;
  background-color: white;
  padding: 5px 3px;
  border-radius: 0 10px 0 0;
  position: absolute;
  bottom: 0;
  left: 0;
}
.note-content{
  font-size: 16px;
  background-color: white;
  padding: 25px;
}
.handle{
  width: 3px;
  height: 100%;
  background-color: red;
  position: absolute;
  top: 0;
  right: 0;
}
.handle:hover{
  cursor: e-resize;
}



</style>