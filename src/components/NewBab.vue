<template>
    
    <div class="form">
        <div class="page main">

<!-- page = title     -->
            <div class="full" v-if="page==='info'">
                <input type="text" required placeholder="Titre"  v-model="title">
                <textarea name="description" id="description" cols="30" rows="3" placeholder="Description du babillard" v-model="description"></textarea>
                <h3>sécurité de votre babillard</h3>
                <div class="type-box">
                    <div class="small-tile lift type pointer access" :class="{ 'selected plus': (isPublic === false)}" id="priv" @click="setAccess"><h3>privé</h3>
                        <p>seulement vous y avez accès</p>
                    </div>
                    <div class="small-tile lift type pointer" :class="{ 'selected plus': (isPublic === true )}" id="pub" @click="setAccess"><h3>publique</h3>
                        <p>accessible à tous </p>
                    </div>
                </div>
                
                <div class="flex width">
                    <div class="nav-btn_box auto-left">
                        <span class="nav-btn pointer" :class="{ 'nav-btn-on': (title), 'nav-btn-off': (!title)}" @click="page='type'">arrow_forward</span>
                    </div>
                </div>
            </div>

<!-- page = type     -->
            

            <div class="full" v-if="page==='type'">
                <div class="flex width">
                <div class="nav-btn_box">
                    <span class="nav-btn nav-btn-on pointer"  @click="page='info'">arrow_back</span>
                </div>
                </div>
                <div class="choose-type">
                <h3>Quel type de babillard voulez-vous créer?</h3>
                <div class="type-box">
                    <div class="small-tile lift type pointer" id="classique" @click="setType" :class="{ 'selected plus': (type === 'classique')}">classique</div>
                    <div class="small-tile lift type pointer" id="liste" @click="setType" :class="{ 'selected plus': (type === 'liste')}">liste</div>
                    <div class="small-tile lift type pointer" id="ordonné" @click="setType" :class="{ 'selected plus': (type === 'ordonné')}">ordonné</div>
                </div>
                
                <div class="flex width">
                    <div class="nav-btn_box auto-left">
                        <span class="nav-btn nav-btn-on pointer"  @click="page='thème'">arrow_forward</span>
                    </div>
                </div>
            </div>
            </div>

<!-- page = thème     -->
            <div class="full" v-if="page==='thème'">
                <div class="flex width">
                    <div class="nav-btn_box">
                        <span class="nav-btn nav-btn-on pointer"  @click="page='type'">arrow_back</span>
                    </div>
                </div>
                <h3>images et couleurs</h3>
                <div class="option-box width lift pointer" id="couleurs" @click="page='couleurs'">
                    <h1 class="option-title">couleurs unies</h1>
                    <span class="nav-btn nav-btn auto-left">folder_open navigate_next</span>
                </div>


                <div class="option-box width lift pointer" id="images" @click="page='images'">
                    <h1 class="option-title">images</h1>
                    <span class="nav-btn nav-btn auto-left">folder_open navigate_next</span>
                </div>
                


                <div v-if="formError" class="error width flex"><span class="auto-left">{{ formError }}</span></div>
                <div class="nav-btn-box flex">
                    <span v-if="isPending" class="nav-btn nav-btn-on auto-left">loop</span>
                </div>
            </div>

<!-- page = couleur     -->
            <div class="full" v-if="page === 'couleurs'">
                <div class="flex width">
                    <div class="nav-btn_box">
                        <span class="nav-btn nav-btn-on pointer"  @click="page='thème'">arrow_back</span>
                    </div>
                </div>
                <h3>Choisissez une couleur</h3>
                <div class="background-box">
                    <div    v-for="col in colorSamples"
                            class="col-sample tiny-tile lift pointer" 
                            :class="{ 'selected plus': (color == col.color)}"
                            :id="col.color" 
                            :key="col.color" 
                            :style="{backgroundColor: col.color }"
                            @click="chooseColor">
                    </div>
                    <div class="flex width">
                        <div class="nav-btn nav-btn_box auto-left">
                                <span class="nav-btn nav-btn-on pointer"  @click="createBab">save navigate_next</span>
                        </div>
                    </div>
                </div>
            </div>

<!-- page = images     -->
            <div class="full" v-if="page === 'images'">
                <div class="flex width">
                    <div class="nav-btn_box">
                        <span class="nav-btn nav-btn-on pointer"  @click="page='thème'">arrow_back</span>
                    </div>
                </div>
                <h3>Choisissez une image</h3>
                <div class="background-box">
                    <div    v-for="image in wallpaperSamples"    
                            class="wallpaper-sample small-tile lift pointer" 
                            :class="{ 'selected plus': (selectedWallpaper == image.title)}"
                            :id="image.title" 
                            :key="image.miniature" 
                            >
                            <img :src="image.miniature" :alt="image.title" class="width" @click="chooseWallpaper">
                    </div>
                    
                </div>
                <div class="flex width">
                        <div class="nav-btn nav-btn_box auto-left">
                                <span class="nav-btn nav-btn-on pointer"  @click="createBab">save navigate_next</span>
                        </div>
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
    setup(props, { emit }){
        const title = ref('')
        const description = ref('')
        const type = ref('')
        const wallpaper = ref('')
        const miniature = ref('')
        const color = ref('')
        const isPublic = ref(false)
        const newBabId = ref('')
        const selectedWallpaper = ref('')


        const formError = ref(null)
        const { user } = getUser()
        const { addDoc, error } = useCollection('users/' + user.value.uid + '/babillards')
        const router = useRouter()
        const isPending = ref(false)
        const wallpaperSamples = ref(null)
        const colorSamples = ref(null)
        const page = ref('info')

        

        const setAccess = (e) => {
            switch(e.currentTarget.id){
                case 'priv': isPublic.value = false
                break
                case 'pub': isPublic.value = true
            }
            console.log(isPublic.value)
        }
        const setType = (e) => {
            type.value = e.currentTarget.id
        }
        const chooseColor = (e) => {
            wallpaper.value = ''
            color.value = e.currentTarget.id
            console.log(color.value === e.currentTarget.id)
        }
        const chooseWallpaper = (e) => {
            color.value = ''
            const obj = wallpaperSamples.value.filter((f) => {      //filter to find the two adresses
                return f.title === e.currentTarget.alt
            })
            selectedWallpaper.value = obj[0].title
            
            wallpaper.value = obj[0].adress
            miniature.value = obj[0].miniature
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
            error.value = null
            isPending.value = true
            // emit('goBack', null)
            let oldBabilist = []

            // check if options are selected
            if(title.value) {
                projectFirestore.collection('users/' + user.value.uid + '/userData').doc('babiList').get().then((doc) => {
                oldBabilist = doc.data().list
                console.log(oldBabilist)
                
                
                }).catch((err) => {
                    oldBabilist = null
                    console.log('babiList is not alive')
                    console.log(err.message)
                })
            } else {
                error.value = "Vous n'avez pas donné de titre à votre babillard"
            }
            let okBabiList = false

            if(oldBabilist.length < 6 || !oldBabilist) {
                 okBabiList = true
            } else if(oldBabilist.length >= 6 ) {
                error.value = 'vous avez atteint le nombre maximum de babillards'
                console.log('maximum number of babs reached')
                return
            } 
            
            if(!error.value && okBabiList){
                // pré-enregistrement des styles pour la miniature  pour simplifier l'import dans l'espace personnel
                let miniStyles = {}
                if(wallpaper.value) {
                    miniStyles = {
                        backgroundImage: 'url(' + miniature.value + ')',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    } 
                } else if (color.value) {
                    miniStyles = {
                    backgroundColor: color.value
                    } 
                }
                
                //createId for new bab
                let time = Date.now().toString()
                newBabId.value = time
                let createdAt = Date().toLocaleString()
                //création du nouveau babillard
                const newBabi = {
                    title: title.value,
                    description: description.value,
                    wallpaper: wallpaper.value,
                    color: color.value,
                    miniature: miniature.value,
                    miniStyles: miniStyles,
                    type: type.value,
                    user: user.value.uid,
                    userName: user.value.displayName,
                    isPublic: isPublic.value,
                    createdAt: createdAt,
                    id: time
                }
              
                //upload du nouveau babillard
                await projectFirestore.collection('users/' + user.value.uid + '/babillards').doc(time).set(newBabi).then(() => {
                    console.log('new babi uploaded')
                    modifyBabiList(oldBabilist, newBabi, time)
                }).catch((er) => {
                    console.log("couldn't upload newBabi")
                    error.value = er.message
                    return
                })
 
            } else{
                
                    formError.value = 'quelque chose ne va pas'
                    isPending.value = false
                    return
         
 
            }
        }
        
        const modifyBabiList = async (oldBabilist, inputBab, idOfNewBabi) => {
                
                if(oldBabilist){
                    let list = oldBabilist
                    list.push(inputBab)
                    await projectFirestore.collection('users/' + user.value.uid + '/userData').doc('babiList').set({ list: list }).then(()=> {
                        console.log('babilist updated')
                    }).catch((er) => {
                        error.value = er.message
                        projectFirestore.collection('users/' + user.value.uid + '/babillards').doc(idOfNewBabi).delete().then(() => {
                            console.log('aborted, newBab deleted')
                            return
                        }).catch((e) => {
                            error.value = e.message
                            console.log("Houston, we have a problem")
                        })
                        
                    })
                } else{
                    let newArr = new Array(inputBab)
                    
                    await projectFirestore.collection('users/' + user.value.uid + '/userData').doc('babiList').set({list: newArr}).then(()=> {
                        console.log('babilist created')
                    }).catch((error) => {
                        error.value = error.message
                        projectFirestore.collection('users/' + user.value.uid + '/babillards').doc(idOfNewBabi).delete()
                        console.log('houston we also have a problem')
                    })
                }
                if(!error.value) {
                    console.log('processus finalisé avec succès')
                    title.value = ''
                    description.value = ''
                    isPending.value = false
                    router.push( { name: 'Babillard', params: { id: newBabId.value} } )
                }
  
               
        }
        




        return { createBab, title, description, formError, type, isPending, 
        page, wallpaperSamples, colorSamples, chooseColor, chooseWallpaper, wallpaper, 
        miniature, color, newBabId, setAccess, setType, color, isPublic, selectedWallpaper }
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

.option-box{
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
    font-size: 16px;
    background-color: var(--secondary);
    display: grid;
    place-items: center;
}
.type:hover{
    cursor: pointer;
}

.access{
    padding: 20px;
}
h3{
    padding: 20px;
}

input, textarea, .choose-type{
    margin: auto;
}
</style>