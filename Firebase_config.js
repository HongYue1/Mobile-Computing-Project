// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCku1eCLPP0S-pA0dKiM9OJwieloXuO2bw",
  authDomain: "hh-ng-5eacd.firebaseapp.com",
  projectId: "hh-ng-5eacd",
  storageBucket: "hh-ng-5eacd.firebasestorage.app",
  messagingSenderId: "509817102773",
  appId: "1:509817102773:web:5652ba5003b92298ca79fc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const authentication = getAuth(app);
const database = getFirestore();

export { authentication, database };
