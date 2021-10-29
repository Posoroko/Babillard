import  firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import { getFunctions } from 'firebase/functions'
import { initializeApp } from 'firebase/app'
  
  const firebaseConfig = {
    apiKey: "AIzaSyBFR6Oo8xYEdXH_BjaS3yw7BzTmwh7No54",
    authDomain: "babillard-3e33a.firebaseapp.com",
    projectId: "babillard-3e33a",
    storageBucket: "babillard-3e33a.appspot.com",
    messagingSenderId: "163792851456",
    appId: "1:163792851456:web:8c6d948a38229a3760bee5",
    measurementId: "G-XMCBMMGG63"
  
  };
  
  // init firebase
  firebase.initializeApp(firebaseConfig)
  const firebaseApp = initializeApp(firebaseConfig)
  
  // init services
  const projectFirestore = firebase.firestore()
  const projectAuth = firebase.auth()
  const projectStorage = firebase.storage()
  const projectFunctions = getFunctions(firebaseApp)
  
  // timestamp
  const timestamp = firebase.firestore.FieldValue.serverTimestamp
  
  export { projectFirestore, projectAuth, projectStorage, timestamp,
            firebaseApp, projectFunctions }