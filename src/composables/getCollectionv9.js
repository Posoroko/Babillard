import { collection, get, orderBy, onSnapshot, getFirestore } from 'firebase/firestore'
import { firebaseApp, projectDb } from '@/firebase/config'

const getCollection = (collName) => {

    const documents = ref(null)
    const error = ref(null)
    
    const unsub = onSnapshot(collection(projectDb, collName))


















    return { error, documents }
}

export default getCollection