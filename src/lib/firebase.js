import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.trim(),
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim(),
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL?.trim(),
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim(),
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim(),
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim(),
    appId: import.meta.env.VITE_FIREBASE_APP_ID?.trim(),
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID?.trim(),
};

// Check if Firebase is configured
const checkFirebaseConfig = () => {
    const requiredFields = ['apiKey', 'authDomain', 'databaseURL', 'projectId', 'appId'];
    const missingFields = requiredFields.filter(field => !firebaseConfig[field] || firebaseConfig[field] === "your_api_key_here");

    if (missingFields.length > 0) {
        return { configured: false, missingFields };
    }
    return { configured: true };
};

// Initialize Firebase only if configured
let app = null;
let auth = null;
let database = null;
let analytics = null;

const configStatus = checkFirebaseConfig();

if (configStatus.configured) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    database = getDatabase(app);

    // Initialize analytics if measurementId is present
    if (firebaseConfig.measurementId) {
        isSupported().then(yes => {
            if (yes) analytics = getAnalytics(app);
        });
    }

    console.log("✅ Firebase initialized successfully");
} else {
    console.warn(
        `⚠️ Firebase is not fully configured. Missing: ${configStatus.missingFields.join(", ")}. ` +
        "Running in offline mode. Please check your .env.local file."
    );
}

const isFirebaseConfigured = () => configStatus.configured;
export { app, auth, database, analytics, isFirebaseConfigured };
