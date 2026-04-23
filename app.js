import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. Firebase Configuration
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

// 2. FILTER LOGIC (Searching for deals)
document.getElementById('search-btn').addEventListener('click', async () => {
    const day = document.getElementById('filter-day').value;
    const city = document.getElementById('filter-city').value;
    const container = document.getElementById('results-container');
    container.innerHTML = "Searching...";

    try {
        let q = collection(db, "happyHours");
        const conditions = [];

        // If user provided a city, add filter
        if (city) conditions.push(where("location.city", "==", city));
        // If user provided a day, add filter (using array-contains for the activeDays list)
        if (day) conditions.push(where("activeDays", "array-contains", day));

        const querySnapshot = await getDocs(query(q, ...conditions));
        
        container.innerHTML = ""; // Clear loader
        
        if (querySnapshot.empty) {
            container.innerHTML = "<p>No deals found for these filters.</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const card = document.createElement('div');
            card.className = 'glass-card';
            
            // Displaying Name and City (You can add more details here later)
            card.innerHTML = `
                <h3>${data.name}</h3>
                <p>📍 ${data.location.city}</p>
                <p>🕒 ${data.timing.start} - ${data.timing.end}</p>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error("Query Error:", err);
        container.innerHTML = "<p>Error fetching data. Check console for index link.</p>";
    }
});

// 3. UI LOGIC: Add dynamic deal rows in the form
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

// 4. SUBMIT LOGIC: Save new deals to Firestore
document.getElementById('entry-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('res-name').value;
    const city = document.getElementById('res-city').value;
    const zip = document.getElementById('res-zip').value;
    
    // Convert string "Pizza, Wings" into ["Pizza", "Wings"]
    const cuisines = document.getElementById('res-cuisine').value.split(',').map(c => c.trim());
    
    const activeDays = [];
    document.querySelectorAll('.day-check:checked').forEach(cb => activeDays.push(cb.value));

    const timing = {
        start: document.getElementById('time-start').value,
        end: document.getElementById('time-end').value
    };

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
        alert(`Success! ${name} added.`);
        location.reload();
    } catch (err) {
        console.error("Save Error:", err);
        alert("Check console - Error saving data.");
    }
});
