// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estatestack-mern.firebaseapp.com",
  projectId: "estatestack-mern",
  storageBucket: "estatestack-mern.firebasestorage.app",   
  messagingSenderId: "118747022033",
  appId: "1:118747022033:web:17ed7588c47c4227ef3bf0",
  measurementId: "G-1YZP4D73ZL",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Load analytics only in production to avoid adblocker errors in dev
if (import.meta.env.PROD) {
  import("firebase/analytics")
    .then(({ getAnalytics }) => {
      getAnalytics(app);
    })
    .catch((err) => {
      console.warn("Failed to load Firebase Analytics:", err);
    });
}
