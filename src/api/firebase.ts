import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPNWrPUBaH1_cdV3Km8wtA2EVfGwlSRj0",
  authDomain: "expense-tracker-codestormx.firebaseapp.com",
  projectId: "expense-tracker-codestormx",
  storageBucket: "expense-tracker-codestormx.firebasestorage.app",
  messagingSenderId: "961743678336",
  appId: "1:961743678336:web:29e47be934416c64cdaf65"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
