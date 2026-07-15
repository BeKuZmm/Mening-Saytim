import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase konfiguratsiyasi
const firebaseConfig = {
    apiKey: "AIzaSyAAQDaOaitTgWTzU8JJFM5DMnATk51Y6Gg",
    authDomain: "bekuz-71f59.firebaseapp.com",
    projectId: "bekuz-71f59",
    storageBucket: "bekuz-71f59.firebasestorage.app",
    messagingSenderId: "293061459272",
    appId: "1:293061459272:web:200875e7c4863c4e7e077d"
};

// Tizimlarni ishga tushirish
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Boshqa fayllar ishlata olishi uchun eksport qilamiz
export { app, auth, db };