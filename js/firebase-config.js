import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { initializeFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAAQDaOaitTgWTzU8JJFM5DMnATk51Y6Gg",
    authDomain: "bekuz-71f59.firebaseapp.com",
    projectId: "bekuz-71f59",
    storageBucket: "bekuz-71f59.firebasestorage.app",
    messagingSenderId: "293061459272",
    appId: "1:293061459272:web:200875e7c4863c4e7e077d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// CODESPACES VA ANTIVIRUSLAR BLOKIROVKASINI YORIB O'TISH UCHUN MAXSUS SOZLAMALAR
const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    useFetchStreams: false 
});

export { app, auth, db };