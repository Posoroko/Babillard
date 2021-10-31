<template>
    <div class="tool-box">
      <div class="nav-btn_box">
          <span class="nav-btn nav-btn-on pointer"  @click="goBack">arrow_back</span>
      </div>
        <h1>{{title}}</h1>
        <button @click="requestNewCard">créer une nouvelle carte</button>
        <h6>{{error}}</h6>
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
        <a v-if="card.type == 'link'" :href="card.linkData.url" target="_blank" class="linkATag full">
          <img v-if="card.linkData.image" :src="card.linkData.image" class="linkImg">
          <img v-else  :src="card.linkData.favicon" class="linkIcon">
        </a>
        <div class="card-top-bar width flex JC-space-between"> 
          <h3 v-if="card.linkData.title" class=" card-title">{{ card.linkData.title.substring(0,25) }}</h3>
          <h3 v-if="card.title" class=" card-title">{{ card.title }}</h3>
          <span class="pointer card-settings auto-left" :name="card.id "  @click="openCardMenu">more_vert</span>
        </div>
        <transition name="slide">  
            <div class="card-menu" v-if="openedMenu == card.id">
                <h4 class="flex menu-item pointer" :name="card.id"  @click="deleteCard">supprimer
                    <span class="pointer icon pub-btn auto-left" >delete</span>
                </h4>
            </div>
        </transition>

        
        
        <p v-if="card.type == 'note'" class="full  note-content">{{ card.content }}</p>   
        <p v-if="card.type == 'import'" class=" image-description">{{ card.content }}</p>
        <p v-if="card.linkData.description" class=" image-description">{{ card.linkData.description.substring(0,25) }}</p>
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


    const openedMenu = ref(null)
    const openCardMenu = (e) => {
      console.log(openedMenu.value)
      console.log(e.target.getAttribute('name'))
      if(!openedMenu.value || openedMenu.value != e.target.getAttribute('name')){
        openedMenu.value = e.target.getAttribute('name')
        console.log(openedMenu.value)
      } else {
        openedMenu.value = null
      } 
    }
    const deleteCard = (e) => {
      isPending.value = true
      projectFirestore.collection('users/' + user.value.uid + '/babillards').doc(id.value).get()
      .then((doc) => {
        let temp = doc.data().cardList
        console.log(temp)
        for(let i = 0; i < temp.length - 1; i++ ){
          console.log(i)
          if(temp[i].id == e.target.getAttribute('name')) {
            temp.splice(i, 1)
            break
          }
        }

        projectFirestore.collection('users/' + user.value.uid + '/babillards').doc(id.value).update({ cardList: temp})
        .then(() => {
          isPending.value = false
        })
        .catch((err) => {
          error.value = err.message
          isPending.value = false
        })


      }) .catch((err) => {
        console.log(err.message)
        isPending.value = false
      })
    }

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
            console.log('0')
            error.value = null
            var tempDoc = doc.data().cardList;
            tempDoc.push(newCard)
            console.log(tempDoc)
            projectFirestore.collection('users/' + user.value.uid + '/babillards').doc(id.value).update({ cardList: tempDoc})
            .then(()=> { cardBundle.value = tempDoc
              console.log('1')
            }).catch((err) => {
                console.log('2')
                error.value = "couldn't update data: " + err.message
            })

            } else {
            let newArr = new Array(newCard)
            projectFirestore.collection('users/' + user.value.uid + '/babillards').doc(id.value).update({cardList: newArr})
            .then(() => {
              console.log('3')

            }).catch((err) => {
              error.value = "couldn't update data after creating new Array: " + err.message
              console.log('4')
            })
            cardBundle.value = newArr
          }
          isPending.value = false
        }).catch((err) => {
          console.log('5')
          error.value = "couldn't fetch data: "  + err.message
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
              posY: posY.value
          }

        console.log('all good 01')
        // console.log(newCard.linkData)
        getAndModifyField(newCard)

        }
    }


    

    return { document, title, goBack, requestNewCard, requestPanelIsOn, 
    posX, posY, newCardTitle, createNewCard, newCardType, newCardContent, 
    cardBundle, page, wallpaper, miniature, color, type, babi_div, babiHeight,
    createImageCard, goToTypePage, imageUrl, miniUrl, storageError, filePath, 
    uploadImage, isPending, babiStyles, error, createLinkCard, openCardMenu, openedMenu, deleteCard }
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
  /* aspect-ratio: 5/4; */
  border-radius: 15px;
  margin: 10px;
  background-color: white;
  position: relative;
  padding: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px black;
}
.card:active{
  cursor: grabbing;
}

.card-title {
  max-width: 80%;
  font-size: 14px;
  font-weight: 300;
  background-color: rgb(230, 230, 230);
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
  background-color: rgb(230, 230, 230);
  padding: 3px 5px;
  border-radius: 0 0 0 10px;
  z-index: 1000;
}
.card-mini{
  object-fit: cover;
}
.image-description{
  max-width: 100%;
  font-size: 14px;
  background-color: rgb(230, 230, 230);
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
  background-color: transparent;
  position: absolute;
  top: 0;
  right: 0;
}
.handle:hover{
  cursor: e-resize;
}
.linkATag{
  min-height: 200px;
  display: grid;
  place-items: center;
  overflow: hidden;
}
.linkATag .linkImg{
  width: 100%;
}
.card-menu{
  background-color: white;
  padding: 40px 25px 20px 20px;
  border: 1px solid white;
  border-radius: 0 0px 0 25px;
  position: absolute;
  top: 0;
  right: 0;
  box-shadow: -2px 2px 10px rgb(12, 12, 12);
}
.menu-item{
  padding: 6px 0;
}

.slide-enter-from{
  transform: translate(100%, -100%)
}
.slide-enter-to{
  transform: translate(0%, 0%)
}
.slide-enter-active{
  transition: transform 300ms ease;
}

.slide-leave-from{
  transform: translate(0%, 0%)
}
.slide-leave-to{
  transform: translate(100%, -100%)
}
.slide-leave-active{
  transition: transform 300ms ease;
}


</style>