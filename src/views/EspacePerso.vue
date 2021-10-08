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
        <div v-if="documents" class="babillard-box">
            
            <div class="babi-tile pointer" v-for="babi in documents" :key="babi.id">
                <router-link class="full babi-link" :to="{ name: 'Babillard', params: { id: babi.id} }">
                    <h3>{{ babi.title }}</h3>
                    <p>{{ babi.description }}</p>
                </router-link>
            </div>
          
            <div class="babi-tile add-one pointer" @click="goToNewBab">
              +
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
import getCollection from '@/composables/getCollection'

export default {
  components: { NewBab },
  setup(){
    const { user } = getUser()
    const nom = ref('')
    const component = ref('home')
    const babOpened = ref(false)
    const { documents, error } = getCollection('users/' + user.value.uid + '/babillards')
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




    return { user, nom, component, goToNewBab,  babOpened, documents, error  }
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
  transform-style: preserve-3d;
}

.babi-link:hover{
  box-shadow: 1px 2px 5px rgba(50,50,50,0.5);
  transform: translateZ(1px);
}
.babi-link{
  width: 250px;
  height: 200px;
  background-color: var(--secondary);
  padding: 20px;
  border-radius: 25px;
  margin: 10px;
  transition: all ease 300ms;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.add-one{
  font-size: 100px;
  color: white;
  display: grid;
  place-items: center;
}
tool-bar h1{
    padding: 20px 0 20px 5vw;
}
.close-btn{
    font-family: 'Material Icons';
    font-size: 30px;
}

.close-btn:hover{
    cursor: pointer;
}
</style>