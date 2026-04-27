import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDNkxHAm3Ann9Pf3FT2L3wdPTNDYArk4wM",
  authDomain: "smart-bin-4d0e6.firebaseapp.com",
  projectId: "smart-bin-4d0e6",
  storageBucket: "smart-bin-4d0e6.firebasestorage.app",
  messagingSenderId: "1083585227275",
  appId: "1:1083585227275:web:e98b5e9d4158738581b50e",
  measurementId: "G-QXRW76NNYL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
