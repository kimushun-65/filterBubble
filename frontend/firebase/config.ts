// firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebaseコンソールで確認できるプロジェクト設定
const firebaseConfig = {
  apiKey: "AIzaSyBO0GwNeQxB_nSXYWeuSvkl-k3FMpjiqgc",
  authDomain: "filterbubble-65dd2.firebaseapp.com",
  projectId: "filterbubble-65dd2",
  storageBucket: "filterbubble-65dd2.firebasestorage.app",
  messagingSenderId: "232732181649",
  appId: "1:232732181649:web:193132732d06e4e9ca2b30",
  measurementId: "G-RPM5WPBLD2",
};

const app = initializeApp(firebaseConfig);

// Firebase Authentication を利用するため、authをエクスポート
export const auth = getAuth(app);
export const db = getFirestore(app);
