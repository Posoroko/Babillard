<template>
    
    <div class="form">
        <div class="page main">

            <div class="full" v-if="page==='info'">
                <input type="text" required placeholder="Titre"  v-model="title">
                <textarea name="description" id="description" cols="30" rows="3" placeholder="Description du babillard" v-model="description"></textarea>
                <div class="nav-btn-box"><span class="nav-btn" @click="nextPage">arrow_forward</span></div>
            </div>

            <div class="full" v-if="page==='type'">
                <div class="choose-type">
                <h3>Quel type de babillard voulez-vous créer?</h3>
                <div class="type-box">
                    <div class="small-tile lift type pointer" @click="type='toile'">classique</div>
                    <div class="small-tile lift type pointer" @click="type='toile'">liste</div>
                </div>
                <div class="nav-btn-box"><span class="nav-btn" @click="nextPage">arrow_forward</span></div>
            </div>
            </div>
            <div class="full" v-if="page === 'couleurs'">
                <div><span class="nav-btn" @click="page='image'">arrow_back</span></div>
                <h3>Choisissez une couleur</h3>
                <div class="background-box">
                    <div    class="color-sample small-tile lift pointer" 
                            v-for="color in colorSamples" 
                            :id="color" 
                            :key="color" 
                            :style="{backgroundColor: color }"
                            @click="chooseColor">
                    </div>
                    
                </div>
            </div>
            <div class="full" v-if="page === 'images'">
                <div><span class="nav-btn" @click="page='image'">arrow_back</span></div>
                <h3>Choisissez une image</h3>
                <div class="background-box">
                    <div    class="wallpaper-sample small-tile lift pointer" 
                            v-for="image in wallpaperSamples" 
                            :id="image.title" 
                            :key="image.title" 
                            :data-url="image.adress"
                            @click="chooseColor">
                            <img :src="image.miniature" :alt="image.title" class="width">
                    </div>
                    
                </div>
            </div>

            <div class="full" v-if="page==='image'">
                <h3>images et couleurs</h3>
                <div class="option-box width lift pointer" id="couleurs" @click="page='couleurs'">
                    <h1 class="option-title">couleurs unies</h1>
                    <span class="nav-btn auto-left">folder_open navigate_next</span>
                </div>


                <div class="option-box width lift pointer" id="images" @click="page='images'">
                    <h1 class="option-title">images</h1>
                    <span class="nav-btn auto-left">folder_open navigate_next</span>
                </div>
                


                <div v-if="formError" class="error width flex"><span class="auto-left">{{ formError }}</span></div>
                <div class="nav-btn-box flex">
                    <span v-if="isPending" class="nav-btn auto-left">loop</span>
                    <span v-else class="nav-btn auto-left" @click="createBab">save</span>
                </div>
            </div>




            
        </div>
        <div class="page wallpaper" v-if="page=='color'">
                
        </div>
        





    </div>
</template>
    

<script>
import { useRouter } from 'vue-router'
import { ref, onMounted } from '@vue/reactivity'
import useCollection from '@/composables/useCollection'
import getUser from '@/composables/getUser'
import { timestamp } from '@/firebase/config'
import { projectFirestore } from '@/firebase/config'



export default {
    setup(){
        const title = ref('')
        const description = ref('')
        const type = ref('')
        const wallpaper = ref('')
        const color = ref('')
        const isPublic = ref(false)

        const formError = ref(null)
        const { user } = getUser()
        const { addDoc, error } = useCollection('users/' + user.value.uid + '/babillards')
        const router = useRouter()
        const isPending = ref(false)
        const wallpaperSamples = ref(null)
        const colorSamples = ref(null)
        const page = ref('info')

        const nextPage = (e) => {
            console.log(colorSamples.value)
            if(page.value === 'info' && title.value){
                page.value = 'type'
            } else if (page.value == 'type' && type.value) {
                page.value = 'image'
            }
        }
        const chooseColor = (e) => {
            color.value = e.currentTarget.id
        }
        const chooseWallpaper = (e) => {
            wallpaper.value = e.currentTarget.id
        }
       
        
        projectFirestore.collection('appData').doc('wallPapers').get().then((doc) => {
            if(doc.data()){
               wallpaperSamples.value = doc.data().wallPaperList
           }
        })
        projectFirestore.collection('appData').doc('wallPapers').get().then((doc) => {
            if(doc.data()){
                colorSamples.value = doc.data().colors
            }
        })

        const createBab = async () => {
   
            if(title.value){
                const babToBeAdded = 
                isPending.value = true
                let time = Date.now().toString()
                await projectFirestore.collection('users/' + user.value.uid + '/babillards').doc(time).set({
                    title: title.value,
                    description: description.value,
                    type: type.value,
                    user: user.value.uid,
                    userName: user.value.displayName,
                    content: {

                    },
                    createdAt: timestamp(),
                    id: time
                })
                getAndModifyBabiList(time, {
                    title: title.value,
                    description: description.value,
                    id: time
                })
                
                isPending.value = false
                if(!error.value){
                    console.log('babillard ajouté!!')
                    title.value = ''
                    description.value = ''
                    error.value= null
                    router.push( { name: 'EspacePerso'} )
                }
                
            } else{
                formError.value = 'Veuillez saisir un titre'
            }

        }
        const getAndModifyBabiList = async (id, inputBab) => {
            
            let tempDoc = null;
            projectFirestore.collection('users/' + user.value.uid + '/userData').doc('babiList').get().then((doc) => {
                
                tempDoc = doc.data()
                if(doc.exists){
                    tempDoc.list.push(inputBab)
                    projectFirestore.collection('users/' + user.value.uid + '/userData').doc('babiList').set({list: tempDoc.list})
                } else{
                    let newArr = new Array(inputBab)
                    projectFirestore.collection('users/' + user.value.uid + '/userData').doc('babiList').set({list: newArr})
                }
  
                })
        }
        




        return { createBab, title, description, formError, type, isPending, page, nextPage, wallpaperSamples, colorSamples, chooseColor, chooseWallpaper, wallpaper }
    }
}
</script>

<style scoped>
.form{
    width: min(100%, 600px);
    padding: 3vw;
    margin: 5vh auto;
}
.page{
    width: 100%;
}
.nav-btn-box{
    width: 100%;
    display: flex;
}
.nav-btn{
    margin-left: auto;
    
}
.option-box{
    border: 1px solid red;
    border-radius: 15px;
    margin: 10px;
    display: flex;
    align-items: center;
}
.option-title{
    padding: 20px;
}
.background-box, .type-box{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
.wallpaper-sample{
    background-size: contain;
    background-position: center;
    display: grid;
    place-items: center;
    overflow: hidden;
}

.type{
  background-color: var(--secondary);
  display: grid;
  place-items: center;
}
.type-tile:hover{
    cursor: pointer;
}
h3{
    padding: 20px;
}

input, textarea, .choose-type{
    margin: auto;
}
</style>