import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyCIevS-f_JboeGmIm5Y31oNTo9aLf7InAs',
  authDomain: 'planning-poker-b9012.firebaseapp.com',
  databaseURL:
    'https://planning-poker-b9012-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'planning-poker-b9012',
  storageBucket: 'planning-poker-b9012.firebasestorage.app',
  messagingSenderId: '309817071181',
  appId: '1:309817071181:web:eeed8868d3cb726097ae04',
}

const app = initializeApp(firebaseConfig)

/**
 * Pass the database URL explicitly so the client always uses the regional RTDB
 * instance from config (not a wrong default instance).
 */
export const db = getDatabase(app, firebaseConfig.databaseURL)
