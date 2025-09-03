import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnlMs9Mfg_qEF5u9L6WHzLieAk7n4WcZo",
  authDomain: "personal-blog-f9a04.firebaseapp.com",
  projectId: "personal-blog-f9a04",
  storageBucket: "personal-blog-f9a04.firebasestorage.appspot.com",
  messagingSenderId: "98080344884",
  appId: "1:98080344884:web:d3f0d79291ce8272933361",
  measurementId: "G-HS3FR0C1QR"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
