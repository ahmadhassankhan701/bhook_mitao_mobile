import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

export const app = initializeApp(firebaseConfig, "bhook-mita");
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const database = getDatabase(app);
