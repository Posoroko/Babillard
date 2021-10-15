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

            <div class="babi-box" v-for="babi in document" :key="babi.id">
                <router-link class="babi full lift pointer" :to="{ name: 'Babillard', params: { id: babi.id} }">

                    <div class="full background" :style="babi.miniStyles"></div>
                    <span class="pointer babi-settings-btn"  @click="openBabiSetting">more_vert</span>
                    <h3>{{ babi.title }}</h3>
                    
                    
                    
                </router-link>
                <div class="babi-menu">
                      <h4 class="menu-item flex pubflex-row-centered">publique
                        <span class="pointer icon pub-btn auto-left"  v-if="!babi.isPublic" :name="babi.id"  @click="togglePublic">radio_button_unchecked</span>
                        <span class="pointer icon pub-btn auto-left" v-if="babi.isPublic" :name="babi.id"  @click="togglePublic ">task_alt</span>
                      </h4>
                      <h4 class="flex menu-item">supprimer
                        <span class="pointer icon pub-btn auto-left" :name="babi.id"  @click="deleteBabi ">delete</span>
                      </h4>
                    </div>
            </div>

<!-- ajouter un babillard  -->
            <div class=" pointer babi-box" >
              <div class="full babi add-one lift" @click="goToNewBab">
                +
              </div>
              
            </div>
        </div>
        <div class="width flex-row-centered" v-else>
        <div class="babi-box pointer " >
            <div class="full babi add-one lift" @click="goToNewBab">
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
import getDocument from '@/composables/getDocument'

export default {
  components: { NewBab },
  setup(){
    const { user } = getUser()
    const nom = ref('')
    const component = ref('home')
    const babOpened = ref(false)
    const { document, error } = getDocument('users/' + user.value.uid + '/userData', 'babiList')
    
    

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



    const getIndexOfBabi = (jim) => {
        const obj = document.value.filter((f) => {      //filter to find the two adresses
                  return f.id === jim
        })
        return document.value.indexOf(obj[0])
    }

    const deleteBabi = (e) => {
        let id = e.target.getAttribute('name')
        let index = getIndexOfBabi(e.target.getAttribute('name'))
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
    
    




    return { user, nom, component, goToNewBab,  babOpened, document, error, goBack, deleteBabi  }
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
}
.babi h3{
  color: white;
  font-weight: 400;
  position: absolute;
  top: 20%;
  left: 20%;
}
.babi-menu{
  background-color: white;
  padding: 40px 25px 20px 20px;
  border-radius: 0 25px 0 25px;
  position: absolute;
  top: 0;
  right: 0;
}
.menu-item{
  padding: 6px 0;
}
.pub-btn{
  padding-left: 5px;
}

.babi-box .add-one{
  font-size: 100px;
  color: white;
  display: grid;
  place-items: center;
}

</style>