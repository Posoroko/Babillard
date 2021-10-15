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
            
            <div class="babi-box" v-for="babi in document" :key="babi.id">
                <router-link class="babi full lift pointer" :to="{ name: 'Babillard', params: { id: babi.id} }">
                    <div class="full background" :style="babi.miniStyles"></div>
                    <h3>{{ babi.title }}</h3>
                    <p>{{ babi.description }}</p>
                </router-link>
            </div>
          
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
import projectFirestore from '@/firebase/config'
import getDocument from '@/composables/getDocument'

export default {
  components: { NewBab },
  setup(){
    const { user } = getUser()
    const nom = ref('')
    const component = ref('home')
    const babOpened = ref(false)
    const { document, error } = getDocument('users/' + user.value.uid + '/userData', 'babiList')
    
    // const { documents, error } = getCollection('users/' + user.value.uid + '/babillards')
    // const { documents } = await getCollection('users/' + user.value.uid + '/babillards')
    // const documents = ref(JSON.parse(sessionStorage.getItem('babillards')))
    

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

// watch(() => {
//       emit('window-width-changed', width)
//     })




    return { user, nom, component, goToNewBab,  babOpened, document, error, goBack  }
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


.babi-box .add-one{
  font-size: 100px;
  color: white;
  display: grid;
  place-items: center;
}

</style>