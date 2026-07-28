const firebaseConfig = {
  apiKey: "AIzaSyBRvy5BT6QxSuT5MUCfLeWi51P_9Fkxa3c",
  authDomain: "safia-schedule.firebaseapp.com",
  databaseURL: "https://safia-schedule-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "safia-schedule",
  storageBucket: "safia-schedule.firebasestorage.app",
  messagingSenderId: "125156028704",
  appId: "1:125156028704:web:0b26fdf8e73f6fad362745"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
window.db = firebase.database();
window.SAFIA_PATH = "safia_schedule/sergeli";
window.CLIENT_ID = localStorage.getItem("safiaClientId") || `client_${Date.now()}_${Math.random().toString(36).slice(2)}`;
localStorage.setItem("safiaClientId", window.CLIENT_ID);
