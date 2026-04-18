import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDgaqZvg85uLW5TxUcOWGfXyFgzx6-LI5E",
  authDomain: "pravaquiz.firebaseapp.com",
  projectId: "pravaquiz",
  storageBucket: "pravaquiz.firebasestorage.app",
  messagingSenderId: "840733117812",
  appId: "1:840733117812:web:f0507b70ed517213853021"
};

// Appni ishga tushirish
const app = initializeApp(firebaseConfig);

// Servislarni sozlash
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Eksport
export { db, auth, googleProvider };