// src/firebase.config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBBaVYC5RRskB6VoWPYZS350OFCgpt3wSA",
  authDomain: "restaurant-management-91579.firebaseapp.com",
  projectId: "restaurant-management-91579",
  storageBucket: "restaurant-management-91579.appspot.com",
  messagingSenderId: "511004679990",
  appId: "1:511004679990:web:043d8a006c0f2700b85d97"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
