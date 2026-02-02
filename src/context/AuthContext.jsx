import { createContext, useContext, useState, useEffect } from "react";
import {
    signUp,
    signIn,
    signInWithGoogle,
    logOut,
    subscribeToAuthChanges,
} from "@/lib/authService";
import { isFirebaseConfigured } from "@/lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const firebaseEnabled = isFirebaseConfigured();

    useEffect(() => {
        if (!firebaseEnabled) {
            // In offline mode, check localStorage for demo user
            const savedUser = localStorage.getItem("innerstack-demo-user");
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
            setLoading(false);
            return;
        }

        // Subscribe to Firebase auth state
        const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
                    photoURL: firebaseUser.photoURL,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [firebaseEnabled]);

    const handleSignUp = async (email, password, name) => {
        setError(null);
        try {
            await signUp(email, password, name);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const handleSignIn = async (email, password) => {
        setError(null);
        try {
            await signIn(email, password);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const handleGoogleSignIn = async () => {
        setError(null);
        try {
            await signInWithGoogle();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const handleLogout = async () => {
        setError(null);
        try {
            if (firebaseEnabled) {
                await logOut();
            } else {
                localStorage.removeItem("innerstack-demo-user");
                setUser(null);
            }
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Demo login for offline/development mode
    const handleDemoLogin = () => {
        const demoUser = {
            uid: "demo-user",
            email: "demo@innerstack.app",
            name: "Demo User",
            photoURL: null,
        };
        localStorage.setItem("innerstack-demo-user", JSON.stringify(demoUser));
        setUser(demoUser);
    };

    const value = {
        user,
        loading,
        error,
        firebaseEnabled,
        signUp: handleSignUp,
        signIn: handleSignIn,
        signInWithGoogle: handleGoogleSignIn,
        logout: handleLogout,
        demoLogin: handleDemoLogin,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
