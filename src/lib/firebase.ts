// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBp3ukSANB6kAaXpnK5LgHxMhtyYSpVwvw",
  authDomain: "dr-mindset.firebaseapp.com",
  databaseURL: "https://dr-mindset-default-rtdb.firebaseio.com",
  projectId: "dr-mindset",
  storageBucket: "dr-mindset.appspot.com",
  messagingSenderId: "16123595851",
  appId: "1:16123595851:web:042ef90c28f364233911ce",
  measurementId: "G-GYEPM3NEDR"
};


// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
