import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCvgTSDmUOMu715O2TZ-ZU0-ZO7uOlBCHE",
  authDomain: "nexus-957bc.firebaseapp.com",
  projectId: "nexus-957bc",
  storageBucket: "nexus-957bc.firebasestorage.app",
  messagingSenderId: "256865452474",
  appId: "1:256865452474:web:742993bcc8b362f5f51d83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and db
export const auth = getAuth(app);
export const db = getFirestore(app);
