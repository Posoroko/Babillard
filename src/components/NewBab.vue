<template>
    
    <div class="form">
        
        <input type="text" required placeholder="Titre"  v-model="title">
        <textarea name="description" id="description" cols="30" rows="10" placeholder="Description du babillard" v-model="description"></textarea>
        <div class="choose-type">
            <h3>Quel type de babillard voulez-vous créer?</h3>
            <div class="type-tile" @click="type='toile'">
                <h1 class="toile" id="toile">Toile</h1>
            </div>
            <div v-if="formError" class="error">{{ formError }}</div>
            <button v-if="isPending" disabled>patientez...</button>
            <button v-else @click="createBab">créer</button>
        </div>
    </div>
</template>
    

<script>
import { useRouter } from 'vue-router'
import { ref } from '@vue/reactivity'
import useCollection from '@/composables/useCollection'
import getUser from '@/composables/getUser'
import { timestamp } from '@/firebase/config'
import { projectFirestore } from '@/firebase/config'

export default {
    setup(){
        const title = ref('')
        const description = ref('')
        const type = ref('')
        const formError = ref(null)
        const { user } = getUser()
        const { addDoc, error } = useCollection('users/' + user.value.uid + '/babillards')
        const router = useRouter()
        const isPending = ref(false)
        

        const createBab = async () => {
            
            
            if(title.value){
                isPending.value = true
                let time = Date.now().toString()
                console.log(time)
                await projectFirestore.collection('users/' + user.value.uid + '/babillards').doc(time).set(
                        {title: title.value,
                    description: description.value,
                    type: type.value,
                    user: user.value.uid,
                    userName: user.value.displayName,
                    content: {

                    },
                    createdAt: timestamp()
                }        

                )





                // var newBabRef = await projectFirestore.collection('users/' + user.value.uid + '/babillards').doc()
                // let temp = newBabRef.path.split('/')
                // console.log(temp[temp.length - 1])
                // await newBabRef.set(
                //     {title: title.value,
                //     description: description.value,
                //     type: type.value,
                //     user: user.value.uid,
                //     userName: user.value.displayName,
                //     content: {

                //     },
                //     createdAt: timestamp()
                // })





                // await addDoc(
                //     {title: title.value,
                //     description: description.value,
                //     type: type.value,
                //     user: user.value.uid,
                //     userName: user.value.displayName,
                //     content: {

                //     },
                //     createdAt: timestamp()
                // })
                isPending.value = false
                if(!error.value){
                    console.log('babillard ajouté!!')
                    title.value = ''
                    description.value = ''
                    error.value= null
                    router.push( { name: 'Home'} )
                }
                
            } else{
                formError.value = 'Veuillez saisir un titre'
            }


            
            
        }


        return { createBab, title, description, formError, type, isPending }
    }
}
</script>

<style scoped>

.type-tile{
  width: 250px;
  height: 200px;
  background-color: var(--secondary);
  border-radius: 25px;
  margin: 10px;
  display: grid;
  place-items: center;
}
.type-tile:hover{
    cursor: pointer;
}
h3{
    padding: 20px;
}
.form{
    width: min(100%, 600px);
    padding: 3vw;
    margin: 5vh auto;
}
input, textarea, .choose-type{
    margin: auto;
}
</style>