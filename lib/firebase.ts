import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAUizp21n_30vDfZaWN00kcLPfkNBeOUi0",
    authDomain: "fresha-88ed3.firebaseapp.com",
    projectId: "fresha-88ed3",
    storageBucket: "fresha-88ed3.firebasestorage.app",
    messagingSenderId: "409630568642",
    appId: "1:409630568642:web:79d3abc0cd2e459a4bcb5b",
    measurementId: "G-1KJQQH6GJR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
