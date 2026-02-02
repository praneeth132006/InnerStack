import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase is configured
const isFirebaseConfigured = () => {
    return (
        firebaseConfig.apiKey &&
        firebaseConfig.apiKey !== "your_api_key_here" &&
        firebaseConfig.databaseURL &&
        firebaseConfig.projectId
    );
};

// Initialize Firebase only if configured
let app = null;
let auth = null;
let database = null;

if (isFirebaseConfigured()) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    database = getDatabase(app);
    console.log("✅ Firebase initialized successfully");
} else {
    console.warn(
        "⚠️ Firebase is not configured. Running in offline mode. " +
        "Copy .env.example to .env.local and add your credentials."
    );
}

export { app, auth, database, isFirebaseConfigured };
