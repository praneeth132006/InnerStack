import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Mail, Lock, User, Loader2, ArrowLeft, Sparkles } from "lucide-react";

export function AuthDialog({ children, defaultTab = "login" }) {
    const { signIn, signUp, signInWithGoogle, firebaseEnabled, demoLogin, error } = useAuth();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState("");
    const [mode, setMode] = useState(defaultTab); // "login", "signup", "forgot"

    // Login form state
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Signup form state
    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupConfirm, setSignupConfirm] = useState("");

    // Forgot password state
    const [resetEmail, setResetEmail] = useState("");
    const [resetSent, setResetSent] = useState(false);

    const resetForm = () => {
        setLoginEmail("");
        setLoginPassword("");
        setSignupName("");
        setSignupEmail("");
        setSignupPassword("");
        setSignupConfirm("");
        setLocalError("");
        setResetSent(false);
        setMode(defaultTab);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!firebaseEnabled) {
            demoLogin();
            setOpen(false);
            return;
        }

        setLoading(true);
        setLocalError("");
        try {
            await signIn(loginEmail, loginPassword);
            setOpen(false);
            resetForm();
        } catch (err) {
            setLocalError(err.message || "Failed to sign in");
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (signupPassword !== signupConfirm) {
            setLocalError("Passwords do not match");
            return;
        }
        if (signupPassword.length < 6) {
            setLocalError("Password must be at least 6 characters");
            return;
        }

        if (!firebaseEnabled) {
            demoLogin();
            setOpen(false);
            return;
        }

        setLoading(true);
        setLocalError("");
        try {
            await signUp(signupEmail, signupPassword, signupName);
            setOpen(false);
            resetForm();
        } catch (err) {
            setLocalError(err.message || "Failed to sign up");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        if (!firebaseEnabled) {
            demoLogin();
            setOpen(false);
            return;
        }

        setLoading(true);
        setLocalError("");
        try {
            await signInWithGoogle();
            setOpen(false);
            resetForm();
        } catch (err) {
            setLocalError(err.message || "Failed to sign in with Google");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setResetSent(true);
    };

    return (
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none bg-background/95 backdrop-blur-xl shadow-2xl">
                {/* Enhanced Gradient Header with animated glow */}
                <div className="relative bg-gradient-to-br from-primary/30 via-primary/15 to-transparent p-6 pb-4 border-b border-primary/10">
                    {/* Animated glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-50 animate-pulse" />
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 rounded-lg bg-primary/20 backdrop-blur-sm">
                                <Sparkles className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm font-semibold text-primary tracking-wide">InnerStack</span>
                        </div>
                        <DialogTitle className="text-2xl font-bold">
                            {mode === "login" && "Welcome back"}
                            {mode === "signup" && "Create account"}
                            {mode === "forgot" && "Reset password"}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            {mode === "login" && "Sign in to continue building habits"}
                            {mode === "signup" && "Start your journey to better habits"}
                            {mode === "forgot" && (resetSent ? "Check your email for reset link" : "Enter your email to reset password")}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6">
                    {/* Forgot Password Mode */}
                    {mode === "forgot" && (
                        <>
                            {!resetSent ? (
                                <form onSubmit={handleForgotPassword} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="reset-email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="reset-email"
                                                type="email"
                                                placeholder="you@example.com"
                                                className="pl-10 h-11"
                                                value={resetEmail}
                                                onChange={(e) => setResetEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button type="button" variant="outline" onClick={() => setMode("login")} className="flex-1">
                                            <ArrowLeft className="h-4 w-4 mr-2" /> Back
                                        </Button>
                                        <Button type="submit" className="flex-1">
                                            Send Link
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <Button onClick={() => setMode("login")} className="w-full">
                                    Back to Login
                                </Button>
                            )}
                        </>
                    )}

                    {/* Login Mode */}
                    {mode === "login" && (
                        <div className="space-y-4">
                            {/* Google Sign In - Prominent */}
                            <Button
                                variant="outline"
                                className="w-full h-11 gap-3 font-medium hover:bg-muted"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="bg-background px-3 text-muted-foreground">or</span>
                                </div>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="login-email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="login-email"
                                            type="email"
                                            placeholder="you@example.com"
                                            className="pl-10 h-11"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            required={firebaseEnabled}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="login-password">Password</Label>
                                        <button
                                            type="button"
                                            onClick={() => setMode("forgot")}
                                            className="text-xs text-primary hover:underline"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="login-password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 h-11"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            required={firebaseEnabled}
                                        />
                                    </div>
                                </div>

                                {localError && (
                                    <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{localError}</p>
                                )}

                                <Button type="submit" className="w-full h-11" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {firebaseEnabled ? "Sign In" : "Demo Login"}
                                </Button>
                            </form>

                            <p className="text-center text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setMode("signup")}
                                    className="text-primary font-medium hover:underline"
                                >
                                    Sign up
                                </button>
                            </p>
                        </div>
                    )}

                    {/* Signup Mode */}
                    {mode === "signup" && (
                        <div className="space-y-4">
                            <Button
                                variant="outline"
                                className="w-full h-11 gap-3 font-medium hover:bg-muted"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="bg-background px-3 text-muted-foreground">or</span>
                                </div>
                            </div>

                            <form onSubmit={handleSignup} className="space-y-3">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-name">Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="signup-name"
                                            type="text"
                                            placeholder="Your name"
                                            className="pl-10 h-11"
                                            value={signupName}
                                            onChange={(e) => setSignupName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="signup-email"
                                            type="email"
                                            placeholder="you@example.com"
                                            className="pl-10 h-11"
                                            value={signupEmail}
                                            onChange={(e) => setSignupEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="signup-password"
                                                type="password"
                                                placeholder="••••••"
                                                className="pl-10 h-11"
                                                value={signupPassword}
                                                onChange={(e) => setSignupPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-confirm">Confirm</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="signup-confirm"
                                                type="password"
                                                placeholder="••••••"
                                                className="pl-10 h-11"
                                                value={signupConfirm}
                                                onChange={(e) => setSignupConfirm(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {localError && (
                                    <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{localError}</p>
                                )}

                                <Button type="submit" className="w-full h-11" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {firebaseEnabled ? "Create Account" : "Demo Login"}
                                </Button>
                            </form>

                            <p className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setMode("login")}
                                    className="text-primary font-medium hover:underline"
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
