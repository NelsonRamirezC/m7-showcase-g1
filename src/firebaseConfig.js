import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'


const firebaseConfig = {
  apiKey: 'AIzaSyB2AOEH_pVOX_01TgPUa_ro_Q5zqViQlmE',
  authDomain: 'product-showcase-g1.firebaseapp.com',
  projectId: 'product-showcase-g1',
  storageBucket: 'product-showcase-g1.firebasestorage.app',
  messagingSenderId: '684231590976',
  appId: '1:684231590976:web:2f84ea20e0873e9f320ba5',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }
