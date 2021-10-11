<template>
  <section class="babillard-section">
    

    <header>
      <h1>Bonjour {{ nom }}!<br>Ca gazouille?</h1>
    </header>
    <div class="tool-bar" v-if="!babOpened">
        <div class="tool-box" v-if="component == 'home'">
         <button @click="goToNewBab">Créer un babillard</button>
        </div >
          <h1 class="tool-box" v-if="component == 'new'"><span class="close-btn" @click="component = 'home'">arrow_back</span></h1>
      </div>

    <section class="work-area" v-if="component == 'home'">
       
        <div v-if="error" class="error">Nous n'avons pas pu récupérer vos babillards... Il semble y avoir un problème de connexion</div>
        <div v-if="document" class="babillard-box parent3d">
            
            <div class="tile pointer lift" v-for="babi in document" :key="babi.id">
                <router-link class="full babi-link " :to="{ name: 'Babillard', params: { id: babi.id} }">
                    <h3>{{ babi.title }}</h3>
                    <p>{{ babi.description }}</p>
                </router-link>
            </div>
          
            <div class="add-one pointer tile lift" >
              <div class="full" @click="goToNewBab">
                +
              </div>
              
            </div>
        </div>
    </section>
    <div v-if="component == 'new'" >
      <NewBab />
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

   onMounted(()=>{
     if(user.value){
       nom.value = user.value.displayName
     }
   })

// watch(() => {
//       emit('window-width-changed', width)
//     })




    return { user, nom, component, goToNewBab,  babOpened, document, error  }
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
.tile{
   width: 250px;
  height: 200px;
  border-radius: 25px;
  margin: 10px;
}

.babi-link{
  width: 100%;
  height: 100%;
  background-color: var(--secondary);
  padding: 20px;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.add-one div{
  width: 250px;
  height: 200px;
  background-color: var(--secondary);
  border-radius: 25px;
  transition: all ease 300ms;
  font-size: 100px;
  color: white;
  display: grid;
  place-items: center;
}

</style>