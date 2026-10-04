import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB6IqkXpPxfVyLnlmJN9AlE3pKbtotlYpQ",
  authDomain: "paidtowork.firebaseapp.com",
  projectId: "paidtowork",
  storageBucket: "paidtowork.firebasestorage.app",
  messagingSenderId: "566934747235",
  appId: "1:566934747235:web:6a264c5dcec79fd67e6056",
  measurementId: "G-883ELFPWQN"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
