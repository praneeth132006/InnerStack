import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase";

const googleProvider = new GoogleAuthProvider();

/**
 * Sign up with email and password
 */
export async function signUp(email, password, displayName) {
    if (!isFirebaseConfigured()) {
        throw new Error("Firebase is not configured");
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
        await updateProfile(userCredential.user, { displayName });
    }
    return userCredential.user;
}

/**
 * Sign in with email and password
 */
export async function signIn(email, password) {
    if (!isFirebaseConfigured()) {
        throw new Error("Firebase is not configured");
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
    if (!isFirebaseConfigured()) {
        throw new Error("Firebase is not configured");
    }
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
}

/**
 * Sign out
 */
export async function logOut() {
    if (!isFirebaseConfigured()) {
        throw new Error("Firebase is not configured");
    }
    await signOut(auth);
}

/**
 * Subscribe to auth state changes
 * @param {function} callback - Called with user object or null
 * @returns {function} Unsubscribe function
 */
export function subscribeToAuthChanges(callback) {
    if (!isFirebaseConfigured()) {
        // Return a no-op unsubscribe function
        callback(null);
        return () => { };
    }
    return onAuthStateChanged(auth, callback);
}

/**
 * Get current user
 */
export function getCurrentUser() {
    if (!isFirebaseConfigured()) {
        return null;
    }
    return auth?.currentUser || null;
}
