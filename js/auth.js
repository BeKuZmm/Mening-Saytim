import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const googleProvider = new GoogleAuthProvider();

const loginBox = document.getElementById('loginForm');
const registerBox = document.getElementById('registerForm');

// Oynalarni almashtirish
document.getElementById('goToRegister').addEventListener('click', () => {
    loginBox.classList.add('hidden'); registerBox.classList.remove('hidden');
});
document.getElementById('goToLogin').addEventListener('click', () => {
    registerBox.classList.add('hidden'); loginBox.classList.remove('hidden');
});

// FOYDALANUVCHI HOLATINI KUZATISH VA YO'NALTIRISH
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Tizimga kirgach, ekranni bloklab turamiz
        document.body.innerHTML = "<h2 style='text-align:center; margin-top: 50px;'>Tizimga kirilmoqda...</h2>";
        
        // Firestore'dan foydalanuvchining rolini qidirish
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            // Roliga qarab tegishli papkaga jo'natamiz
            if (userData.role === 'haydovchi') {
                window.location.href = './pages/driver.html';
            } else if (userData.role === 'admin') {
                window.location.href = './pages/admin.html';
            } else {
                window.location.href = './pages/client.html';
            }
        } else {
            // Agar Google orqali birinchi marta kirgan bo'lsa va bazada yo'q bo'lsa
            // Uni avtomatik "mijoz" deb ro'yxatga olamiz
            await setDoc(docRef, {
                name: user.displayName || user.email,
                email: user.email,
                role: 'mijoz',
                createdAt: new Date().toISOString()
            });
            window.location.href = './pages/client.html';
        }
    }
});

// RO'YXATDAN O'TISH
document.getElementById('formRegister').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    // Qaysi rol tanlanganini aniqlaymiz
    const role = document.querySelector('input[name="userRole"]:checked').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Firestore bazasiga 'users' kolleksiyasi ichiga ma'lumotlarni saqlaymiz
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            role: role,
            createdAt: new Date().toISOString()
        });
        
    } catch (error) {
        alert("Xatolik: " + error.message);
    }
});

// TIZIMGA KIRISH
document.getElementById('formLogin').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    signInWithEmailAndPassword(auth, email, password)
        .catch((error) => alert("Xatolik: Email yoki parol noto'g'ri!"));
});

// GOOGLE ORQALI KIRISH
const googleBtns = document.querySelectorAll('.google-auth-btn');
googleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        signInWithPopup(auth, googleProvider)
            .catch((error) => alert("Google orqali kirishda xatolik: " + error.message));
    });
});