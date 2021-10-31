<template>
  <section class="babillard-section">
    

    <header>
      <h1>Bonjour {{ nom }}! Ca gazouille?</h1>
    </header>
    <div class="tool-bar" v-if="!babOpened">
        <div class="tool-box" v-if="component == 'home'">
         <button @click="goToNewBab">Créer un babillard</button>
        </div >
          <h1 class="tool-box" v-if="component == 'new'"><span class="nav-btn" @click="component = 'home'">arrow_back</span></h1>
      </div>

    <section class="work-area" v-if="component == 'home'">
       
        <div v-if="error" class="error">{{error}}</div>
        <div v-if="document" class="babillard-box parent3d">
            
<!-- liste de babillard  -->

            <div class="babi-box lift" v-for="babi in document" :key="babi.id">
                <router-link class="babi full pointer" :to="{ name: 'Babillard', params: { id: babi.id} }">

                    <div class="full background" :style="babi.miniStyles"></div>
                    
                    <h3>{{ babi.title }}</h3>
                    
                    
                    
                </router-link>
            <transition name="slide">  
                <div class="babi-menu" v-if="openedMenu == babi.id">
                      <h4 class="menu-item flex pubflex-row-centered pointer" :name="babi.id"  @click="togglePublic">publique
                        <span class="pointer icon pub-btn auto-left pointer">radio_button_unchecked</span>
                        <span class="pointer icon pub-btn auto-left pointer"  @click="togglePublic ">task_alt</span>
                      </h4>
                      <h4 class="flex menu-item pointer" :name="babi.id"  @click="deleteBabi">supprimer
                        <span class="pointer icon pub-btn auto-left">delete</span>
                      </h4>
                </div>
           </transition>  
                <span class="pointer babi-settings-btn" :name="babi.id"  @click="openBabiMenu">more_vert</span>
            </div>

<!-- ajouter un babillard  -->
            <div class=" pointer babi-box lift" >
              <div class="full babi add-one" @click="goToNewBab">
                +
              </div>
              
            </div>
        </div>
        <div class="width flex-row-centered" v-else>
        <div class="babi-box pointer lift " >
            <div class="full babi add-one" @click="goToNewBab">
                +
            </div>
              
        </div>
    </div>
    </section>
    
    
    <div v-if="component == 'new'" >
      <NewBab @goBack="goBack" />
    </div>
    



  </section>
  
</template>

<script>
import NewBab from '@/components/NewBab'
import getUser from '@/composables/getUser'
import { ref, onMounted, onUpdated } from 'vue'
import { projectFirestore } from '@/firebase/config'
import getBabiList from '@/composables/getBabiList'

export default {
  components: { NewBab },
  setup(){
    const { user } = getUser()
    const nom = ref('')
    const component = ref('home')
    const babOpened = ref(false)
    const { document, error } = getBabiList('users/' + user.value.uid + '/userData', 'babiList')
    const openedMenu = ref(null)
    const isPending = ref(false)
    
    const togglePublic = async (e) => {
      if(!isPending.value) {
        let babId = e.currentTarget.getAttribute('name')
        error.value = null
        isPending.value = true
        let pos = document.value.findIndex( f => (f.id == babId))
        document.value[pos].isPublic = !document.value[pos].isPublic
        await projectFirestore.collection('users/' + user.value.uid + '/userData').doc('babiList')
        .update({ list: document.value})
        .then(() => { 
            projectFirestore.collection('users/' + user.value.uid + '/babillards').doc(babId).update({
              isPublic: document.value[pos].isPublic
            }).then(() => {
              isPending.value = false
            }).catch((err) => {
              error.value = err.message
              isPending.value = false
            })
        }).catch((er) => {
          error.value = er.message
          isPending.value = false
        })
      } else {
        error.value = " une demande est déjà en cours"
      }
      
    }

   



    const goToNewBab = () => {
      component.value = 'new'
    }
    const goBack = (pack) => {
      component.value = pack
    }

   onMounted(()=>{
     if(user.value){
       nom.value = user.value.displayName
     }
   })
   
    const openBabiMenu = (e) => {
      
      if(!openedMenu.value || openedMenu.value != e.target.getAttribute('name')){
        openedMenu.value = e.target.getAttribute('name')
        console.log(openedMenu.value)

      } else {
        openedMenu.value = null
      } 

    }


    const getIndexOfBabi = (jim) => {
        const obj = document.value.filter((f) => {      //filter to find the two adresses
                  return f.id === jim
        })
        return document.value.indexOf(obj[0])
    }

    const deleteBabi = (e) => {
        if(!isPending.value) {
          isPending.value = true
          error.value = false
          let id = e.currentTarget.getAttribute('name')
          
          let index = getIndexOfBabi(e.currentTarget.getAttribute('name'))

          //delete from  collection(babillards)
              projectFirestore.collection('users/' + user.value.uid + '/babillards').doc(id).delete().then(()=> {

                //delete from babiList
                projectFirestore.collection('users/' + user.value.uid + '/userData').doc('babiList').get().then((doc) => {    //get babiList
                  let temp = doc.data()
                  temp.list.splice(index, 1)

                //send back the new babiList
                projectFirestore.collection('users/' + user.value.uid + '/userData').doc('babiList').set({
                    list: temp.list
                }).then(() => {
                    console.log('all seems fine!!')
                }).catch((error) => {
                  error.value = error
                })

            }).catch((error) => {
                error.value = error.message
            })

        }).catch((error) => {
            error.value = error.message
        })
        }
        isPending.value = false
    }
    
    




    return { user, nom, component, goToNewBab,  babOpened, document, error, goBack, deleteBabi, openBabiMenu, openedMenu, togglePublic  }
  }
}
</script>

<style scoped>
.babillard-section{
  width: 100%;
}

header, .tool-bar{
  background-color: white;
  padding-left: 5vw;
}

.tool-box{
  padding: 3vh 0 3vh 0;
}
.babillard-box{
  width: min(1200px, 100vw);
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  
}

.babi-box{
  width: 250px;
  height: 200px;
  position: relative;
  margin: 20px;
  border-radius: 25px;
  overflow: hidden;
}
.babi-settings-btn{
  font-family: 'Material Icons';
  font-size: 25px;
  color: var(--funky);
  padding: 5px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
}
.babi{
  background-color: var(--primary);
  border-radius: 25px;
  display: inline-block;
  overflow: hidden;
  position: relative;
}
.babi h3{
  color: white;
  font-weight: 400;
  position: absolute;
  top: 20%;
  left: 20%;
}


.babi-box .add-one{
  font-size: 100px;
  color: white;
  display: grid;
  place-items: center;
}
.babi-menu{
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