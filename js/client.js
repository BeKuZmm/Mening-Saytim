import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection, addDoc, query, where, onSnapshot, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let currentUser = null;

// 1. Tizimga kirgan foydalanuvchini tekshirish
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        document.getElementById('userNameDisplay').innerText = `Mijoz: ${user.email}`;
        loadMyOrders(); // Foydalanuvchi tasdiqlangach, uning e'lonlarini yuklaymiz
    } else {
        // Agar tizimga kirmagan bo'lsa, orqaga (login sahifasiga) qaytarib yuboramiz
        window.location.href = '../index.html';
    }
});

// 2. Tizimdan chiqish
document.getElementById('btnLogout').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = '../index.html';
    });
});

// 3. E'lonni bazaga qo'shish
document.getElementById('formOrder').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const from = document.getElementById('orderFrom').value;
    const to = document.getElementById('orderTo').value;
    const desc = document.getElementById('orderDesc').value;
    const price = document.getElementById('orderPrice').value;

    try {
        // "orders" (buyurtmalar) degan yangi papkaga (kolleksiyaga) saqlaymiz
        await addDoc(collection(db, "orders"), {
            clientId: currentUser.uid,
            clientEmail: currentUser.email,
            from: from,
            to: to,
            description: desc,
            price: Number(price),
            status: "kutilmoqda", // E'lonning holati
            createdAt: new Date().toISOString()
        });

        // Formani tozalash
        document.getElementById('formOrder').reset();
        alert("E'lon muvaffaqiyatli joylandi!");

    } catch (error) {
        alert("Xatolik yuz berdi: " + error.message);
    }
});

// 4. Mening e'lonlarimni ekranga chiqarish (Real-time)
function loadMyOrders() {
    // Faqat o'zimning (clientId) e'lonlarimni va eng yangilarini birinchi qilib tortib olish
    const q = query(
        collection(db, "orders"), 
        where("clientId", "==", currentUser.uid)
    );

    // onSnapshot bazadagi o'zgarishlarni real vaqtda kuzatib turadi
    onSnapshot(q, (snapshot) => {
        const ordersList = document.getElementById('ordersList');
        ordersList.innerHTML = ''; // Avvalgi ro'yxatni tozalaymiz

        if (snapshot.empty) {
            ordersList.innerHTML = `<p style="color: #999; font-size: 14px;">Hozircha e'lonlar yo'q...</p>`;
            return;
        }

        snapshot.forEach((doc) => {
            const order = doc.data();
            // HTML struktura yaratib ekranga qo'shamiz
            const orderHTML = `
                <div class="order-item">
                    <div class="order-info">
                        <h3>📍 ${order.from} ➔ ${order.to}</h3>
                        <p>📦 ${order.description}</p>
                        <span class="status-badge">${order.status.toUpperCase()}</span>
                    </div>
                    <div class="order-price">
                        ${order.price.toLocaleString()} so'm
                    </div>
                </div>
            `;
            ordersList.innerHTML += orderHTML;
        });
    });
}