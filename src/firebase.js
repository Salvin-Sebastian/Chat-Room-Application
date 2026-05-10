import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot, doc, getDoc, where } from "firebase/firestore";

// Your web app's Firebase configuration
// Replace these with your actual config from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

console.log("Firebase Config loaded! API Key starts with:", firebaseConfig.apiKey.substring(0, 5));

// Initialize Firebase only if we have a config (or let it fail with a clear error so the user knows)
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginAnonymously = () => signInAnonymously(auth);
export const logout = () => signOut(auth);

// Helper for references
export const roomsRef = collection(db, "rooms");
export const messagesRef = (roomId) => collection(db, "rooms", roomId, "messages");
export const getRoomRef = (roomId) => doc(db, "rooms", roomId);
export { doc, getDoc, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, where };
