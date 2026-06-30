import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
    set,
    onValue
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBRvy5BT6QxSuT5MUCfLeWi51P_9Fkxa3c",
    authDomain: "safia-schedule.firebaseapp.com",
    databaseURL: "https://safia-schedule-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "safia-schedule",
    storageBucket: "safia-schedule.firebasestorage.app",
    messagingSenderId: "125156028704",
    appId: "1:125156028704:web:0b26fdf8e73f6fad362745"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

window.firebaseDB = db;
window.firebaseRef = ref;
window.firebaseSet = set;
window.firebaseGet = get;
window.firebaseOnValue = onValue;
