import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// PASTE YOUR CONFIG HERE
const firebaseConfig = {
    apiKey: "AIzaSyCUkJrQ3iBexCoviCHlVoITpGDLD6G0GfQ",
    authDomain: "localdealsai-tkic9.firebaseapp.com",
    projectId: "localdealsai-tkic9",
    storageBucket: "localdealsai-tkic9.firebasestorage.app",
    messagingSenderId: "860537516405",
    appId: "1:860537516405:web:34bb646c88bd251d96a33c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("DineLab: Logic Core Online! 🧪");

// UI: Add dynamic deal rows
document.getElementById('add-deal-row').addEventListener('click', () => {
    const container = document.getElementById('deal-container');
    const newRow = document.createElement('div');
    newRow.className = 'deal-entry';
    newRow.innerHTML = `
        <input type="text" class="deal-title" placeholder="Deal Item" style="margin-bottom:5px">
        <input type="text" class="deal-details" placeholder="Details (e.g. 1/2 off)">
    `;
    container.appendChild(newRow);
});

// SUBMIT: Save to Firestore
document.getElementById('entry-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Basic Info
    const name = document.getElementById('res-name').value;
    const city = document.getElementById('res-city').value;
    const zip = document.getElementById('res-zip').value;
    
    // 2. Cuisine Array (Splits "Pizza, Italian" into ["Pizza", "Italian"])
    const cuisines = document.getElementById('res-cuisine').value.split(',').map(c => c.trim());

    // 3. Days Array
    const activeDays = [];
    document.querySelectorAll('.day-check:checked').forEach(cb => activeDays.push(cb.value));

    // 4. Time Window
    const timing = {
        start: document.getElementById('time-start').value,
        end: document.getElementById('time-end').value
    };

    // 5. Deals Array
    const dealRows = document.querySelectorAll('.deal-entry');
    const deals = [];
    dealRows.forEach(row => {
        const title = row.querySelector('.deal-title').value;
        const details = row.querySelector('.deal-details').value;
        if(title) deals.push({ title, details });
    });

    try {
        await addDoc(collection(db, "happyHours"), {
            name,
            location: { city, zip },
            cuisines,
            activeDays,
            timing,
            deals,
            lastVerified: serverTimestamp()
        });
        alert(`Success! ${name} added to the Lab.`);
        location.reload(); // Refresh to clear form
    } catch (err) {
        console.error(err);
        alert("Check console - Error saving data.");
    }
});