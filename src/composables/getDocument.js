import { ref, watchEffect } from 'vue'
import { projectFirestore } from '../firebase/config'

const getDocument = (collRef, docRef) => {

  const document = ref(null)
  const error = ref(null)


//   const unsub = projectFirestore.collection(collRef).doc(docRef).get().then((doc) => {
//     let tempDoc = doc.data()

//         console.log(tempDoc.list)



//     document.value = tempDoc.list









    

  const unsub = projectFirestore.collection(collRef).doc(docRef).onSnapshot((doc) => {
 
    
    let tempDoc = doc.data()

    console.log(tempDoc.list)



    document.value = tempDoc.list






    
    console.log(document.value.list)
    error.value = null
  }, err => {
    console.log(err.message)
    document.value = null
    error.value = 'could not fetch the data'
  })

  watchEffect((onInvalidate) => {
    onInvalidate(() => unsub());
  });

  return { error, document }
}

export default getDocument





