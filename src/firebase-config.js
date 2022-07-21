import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyA7zJlhxKJCH3tODV5YDoq3j8adgjSumbo",
  authDomain: "internship-a1312.firebaseapp.com",
  projectId: "internship-a1312",
  storageBucket: "internship-a1312.appspot.com",
  messagingSenderId: "1009020917714",
  appId: "1:1009020917714:web:b51b998946ee8738659a0b",
  measurementId: "G-FCS8E01WH0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);