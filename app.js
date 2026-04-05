// 1. Import the Firebase tools
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. Your specific configuration
const firebaseConfig = {
    apiKey: "AIzaSyCUkJrQ3iBexCoviCHlVoITpGDLD6G0GfQ",
    authDomain: "localdealsai-tkic9.firebaseapp.com",
    projectId: "localdealsai-tkic9",
    storageBucket: "localdealsai-tkic9.firebasestorage.app",
    messagingSenderId: "860537516405",
    appId: "1:860537516405:web:34bb646c88bd251d96a33c"
};

// 3. Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("DineLab: Connected to localdealsai database! 🔥");

// 4. Function to add a new deal row in the form UI
document.getElementById('add-deal-row').addEventListener('click', () => {
    const container = document.getElementById('deal-container');
    const newRow = document.createElement('div');
    newRow.className = 'deal-entry';
    newRow.innerHTML = `
        <input type="text" class="deal-title" placeholder="e.g. $5 Margaritas">
        <input type="text" class="deal-details" placeholder="Details (Bar Only, etc.)">
    `;
    container.appendChild(newRow);
});

// 5. The "Save to Firestore" Logic
document.getElementById('entry-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevents the page from refreshing

    // Grab the main details
    const name = document.getElementById('res-name').value;
    const cuisine = document.getElementById('res-cuisine').value;
    const zip = document.getElementById('res-zip').value;

    // Grab all deal rows and turn them into an array of objects
    const dealRows = document.querySelectorAll('.deal-entry');
    const deals = [];
    
    dealRows.forEach(row => {
        const title = row.querySelector('.deal-title').value;
        const details = row.querySelector('.deal-details').value;
        if (title) { // Only add if there's a title
            deals.push({ title, details });
        }
    });

    try {
        // 'addDoc' creates a new document in the 'happyHours' collection
        const docRef = await addDoc(collection(db, "happyHours"), {
            name: name,
            cuisine: cuisine,
            zip: zip,
            deals: deals,
            lastUpdated: serverTimestamp() // Adds a real-world timestamp
        });

        console.log("Document written with ID: ", docRef.id);
        alert("Deal Saved to the Lab! 🧪");
        
        // Reset the form for the next entry
        document.getElementById('entry-form').reset();
        
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Error saving! Check the console.");
    }
});