import { ref, watchEffect } from 'vue'
import { projectFirestore } from '../firebase/config'

const getDocument = (collRef, docRef) => {

  const document = ref(null)
  const error = ref(null)


  const unsub = projectFirestore.collection(collRef).doc(docRef).onSnapshot((doc) => {
    
    if(doc.data()){
      let tempDoc = doc.data()
      document.value = tempDoc.list
    }
    error.value = null
  }, err => {
    console.log(err.message)
    document.value = null
    if(err.message == 'Missing or insufficient permissions.'){
      error.value = "Vous n'avez pas le droit d'accès à ces données"
    } else {
      error.value = err.message
    }
    
  })

  watchEffect((onInvalidate) => {
    onInvalidate(() => unsub());
  });

  return { error, document }
}

export default getDocument





