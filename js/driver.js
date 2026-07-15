import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection, query, where, onSnapshot, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let currentUser = null;

// 1. Tizimga kirgan foydalanuvchini tekshirish
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        document.getElementById('userNameDisplay').innerText = `Haydovchi: ${user.email}`;
        loadAvailableOrders(); // Haydovchi tasdiqlangach, yangi e'lonlarni yuklaymiz
    } else {
        window.location.href = '../index.html';
    }
});

// 2. Tizimdan chiqish
document.getElementById('btnLogout').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = '../index.html';
    });
});

// 3. Faqat bo'sh (kutilmoqda) e'lonlarni ekranga chiqarish (Real-time)
function loadAvailableOrders() {
    const q = query(
        collection(db, "orders"), 
        where("status", "==", "kutilmoqda") // Faqat kutilayotganlarini olamiz
    );

    onSnapshot(q, (snapshot) => {
        const ordersList = document.getElementById('ordersList');
        ordersList.innerHTML = ''; 

        if (snapshot.empty) {
            ordersList.innerHTML = `<p style="color: #999; font-size: 14px;">Hozircha yangi e'lonlar yo'q...</p>`;
            return;
        }

        snapshot.forEach((doc) => {
            const order = doc.data();
            const orderId = doc.id; // Har bir e'lonning maxsus ID si

            const orderHTML = `
                <div class="order-item">
                    <div class="order-info">
                        <h3>📍 ${order.from} ➔ ${order.to}</h3>
                        <p>📦 ${order.description}</p>
                        <p style="font-size: 12px; color: #888; margin-top: 5px;">Mijoz: ${order.clientEmail}</p>
                    </div>
                    <div style="text-align: right;">
                        <div class="order-price" style="margin-bottom: 10px;">
                            ${order.price.toLocaleString()} so'm
                        </div>
                        <button class="btn-primary btn-accept" data-id="${orderId}">Qabul qilish</button>
                    </div>
                </div>
            `;
            ordersList.innerHTML += orderHTML;
        });
    });
}

// 4. Buyurtmani qabul qilish tugmasi bosilganda
document.getElementById('ordersList').addEventListener('click', async (e) => {
    // Agar bosilgan element "btn-accept" klassiga ega bo'lsa
    if (e.target.classList.contains('btn-accept')) {
        const orderId = e.target.getAttribute('data-id'); // HTML dan ID ni olamiz
        
        // Tasdiqlash oynasi
        const isConfirmed = confirm("Bu buyurtmani rostdan ham qabul qilasizmi?");
        if (!isConfirmed) return;

        try {
            // Firestore'dagi e'lonni topib, uning statusini o'zgartiramiz
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, {
                status: "qabul_qilindi", // Status o'zgaradi
                driverId: currentUser.uid, // Haydovchi ID si yoziladi
                driverEmail: currentUser.email // Haydovchi emaili yoziladi
            });

            alert("Buyurtma muvaffaqiyatli qabul qilindi!");
            
            // E'lon statusi o'zgargani uchun, u onSnapshot tufayli bu ro'yxatdan avtomatik g'oyib bo'ladi.

        } catch (error) {
            alert("Xatolik yuz berdi: " + error.message);
        }
    }
});