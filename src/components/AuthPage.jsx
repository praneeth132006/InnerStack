import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, User, Loader2, Eye, EyeOff, ArrowLeft, Sparkles } from "lucide-react";

export function AuthPage({ onNavigate }) {
    const { signIn, signUp, signInWithGoogle, firebaseEnabled, demoLogin, sendPasswordReset } = useAuth();
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState("");
    const [mode, setMode] = useState("login"); // "login", "signup", "forgot"
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Login form state
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Signup form state
    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");

    // Forgot password state
    const [resetEmail, setResetEmail] = useState("");
    const [resetSent, setResetSent] = useState(false);

    const resetForm = () => {
        setLoginEmail("");
        setLoginPassword("");
        setSignupName("");
        setSignupEmail("");
        setSignupPassword("");
        setLocalError("");
        setResetSent(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!firebaseEnabled) {
            demoLogin();
            onNavigate("dashboard");
            return;
        }

        setLoading(true);
        setLocalError("");
        try {
            await signIn(loginEmail, loginPassword);
            onNavigate("dashboard");
        } catch (err) {
            setLocalError(err.message || "Failed to sign in");
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (signupPassword.length < 6) {
            setLocalError("Password must be at least 6 characters");
            return;
        }

        if (!firebaseEnabled) {
            demoLogin();
            onNavigate("dashboard");
            return;
        }

        setLoading(true);
        setLocalError("");
        try {
            await signUp(signupEmail, signupPassword, signupName);
            onNavigate("dashboard");
        } catch (err) {
            setLocalError(err.message || "Failed to sign up");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        if (!firebaseEnabled) {
            demoLogin();
            onNavigate("dashboard");
            return;
        }

        setLoading(true);
        setLocalError("");
        try {
            await signInWithGoogle();
            onNavigate("dashboard");
        } catch (err) {
            setLocalError(err.message || "Failed to sign in with Google");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!resetEmail) {
            setLocalError("Please enter your email");
            return;
        }

        setLoading(true);
        setLocalError("");
        try {
            if (sendPasswordReset) {
                await sendPasswordReset(resetEmail);
            }
            setResetSent(true);
        } catch (err) {
            setLocalError(err.message || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Hero/Preview */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-8 flex-col justify-between relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full"
                        style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-white mb-8">
                        <Sparkles className="h-6 w-6" />
                        <span className="text-xl font-bold">InnerStack</span>
                    </div>

                    <div className="mt-12">
                        <h1 className="text-4xl font-bold text-white mb-4">
                            {mode === "login" && "Welcome back! Please sign in to your InnerStack account"}
                            {mode === "signup" && "Join InnerStack and start building better habits today"}
                            {mode === "forgot" && "Reset your password"}
                        </h1>
                        <p className="text-white/80 text-lg">
                            {mode === "login" && "Track your habits, visualize your progress, and achieve your goals."}
                            {mode === "signup" && "Thousands of users trust InnerStack to build lasting habits."}
                            {mode === "forgot" && "We'll send you a link to reset your password."}
                        </p>
                    </div>
                </div>

                {/* Dashboard Preview Card */}
                <div className="relative z-10 mt-8">
                    <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/10 max-w-md">
                        <div className="flex gap-2 mb-3">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <div className="flex gap-4 text-xs text-slate-400 mb-4">
                            <span className="text-white border-b-2 border-emerald-500 pb-1">Dashboard</span>
                            <span>Habits</span>
                            <span>Analytics</span>
                            <span>Settings</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 mb-4">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="h-6 rounded bg-slate-800 flex items-center justify-center">
                                    {i < 3 && <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-blue-500' : 'bg-orange-500'}`} />}
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1 h-16 bg-slate-800 rounded-lg p-2">
                                <div className="text-[10px] text-slate-400 mb-1">Current Streak</div>
                                <div className="text-lg font-bold text-emerald-500">21 days</div>
                            </div>
                            <div className="flex-1 h-16 bg-slate-800 rounded-lg p-2">
                                <div className="text-[10px] text-slate-400 mb-1">Completion</div>
                                <div className="text-lg font-bold text-blue-500">87%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-2 text-primary mb-8">
                        <Sparkles className="h-6 w-6" />
                        <span className="text-xl font-bold">InnerStack</span>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2">
                            {mode === "login" && "Welcome Back 👋"}
                            {mode === "signup" && "Create Account 🚀"}
                            {mode === "forgot" && "Reset Password 🔐"}
                        </h2>
                        <p className="text-muted-foreground">
                            {mode === "login" && "Let's get started with your 30 days free trial"}
                            {mode === "signup" && "Start building better habits today"}
                            {mode === "forgot" && (resetSent ? "Check your email for reset link" : "Enter your email address")}
                        </p>
                    </div>

                    {/* Error Display */}
                    {localError && (
                        <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                            {localError}
                        </div>
                    )}

                    {/* Forgot Password Form */}
                    {mode === "forgot" && (
                        <>
                            {!resetSent ? (
                                <form onSubmit={handleForgotPassword} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="reset-email">Email address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="reset-email"
                                                type="email"
                                                placeholder="Enter your email address"
                                                className="pl-10 h-11"
                                                value={resetEmail}
                                                onChange={(e) => setResetEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full h-11" disabled={loading}>
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="w-full"
                                        onClick={() => { setMode("login"); resetForm(); }}
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
                                    </Button>
                                </form>
                            ) : (
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <Mail className="h-8 w-8 text-emerald-500" />
                                    </div>
                                    <p className="text-muted-foreground">
                                        We've sent a password reset link to <span className="font-medium text-foreground">{resetEmail}</span>
                                    </p>
                                    <Button
                                        className="w-full"
                                        onClick={() => { setMode("login"); resetForm(); }}
                                    >
                                        Back to Login
                                    </Button>
                                </div>
                            )}
                        </>
                    )}

                    {/* Login Form */}
                    {mode === "login" && (
                        <div className="space-y-4">
                            {/* Social Login */}
                            <Button
                                variant="outline"
                                className="w-full h-11 gap-3 font-medium"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Login with Google
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="bg-background px-3 text-muted-foreground">Or</span>
                                </div>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="login-email">Email address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="login-email"
                                            type="email"
                                            placeholder="Enter your email address"
                                            className="pl-10 h-11"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            required={firebaseEnabled}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="login-password">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="login-password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••••••••"
                                            className="pl-10 pr-10 h-11"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            required={firebaseEnabled}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="remember"
                                            checked={rememberMe}
                                            onCheckedChange={setRememberMe}
                                        />
                                        <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                                            Remember Me
                                        </Label>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setMode("forgot")}
                                        className="text-sm text-primary hover:underline font-medium"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>

                                <Button type="submit" className="w-full h-11 bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in to InnerStack"}
                                </Button>
                            </form>

                            <p className="text-center text-sm text-muted-foreground">
                                Don't have an account yet?{" "}
                                <button
                                    onClick={() => { setMode("signup"); resetForm(); }}
                                    className="text-foreground font-semibold hover:underline"
                                >
                                    Sign Up
                                </button>
                            </p>
                        </div>
                    )}

                    {/* Signup Form */}
                    {mode === "signup" && (
                        <div className="space-y-4">
                            <Button
                                variant="outline"
                                className="w-full h-11 gap-3 font-medium"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Sign up with Google
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="bg-background px-3 text-muted-foreground">Or</span>
                                </div>
                            </div>

                            <form onSubmit={handleSignup} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-name">Your name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="signup-name"
                                            type="text"
                                            placeholder="Enter your name"
                                            className="pl-10 h-11"
                                            value={signupName}
                                            onChange={(e) => setSignupName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">Email address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="signup-email"
                                            type="email"
                                            placeholder="Enter your email address"
                                            className="pl-10 h-11"
                                            value={signupEmail}
                                            onChange={(e) => setSignupEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="signup-password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••••••••"
                                            className="pl-10 pr-10 h-11"
                                            value={signupPassword}
                                            onChange={(e) => setSignupPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-11 bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
                                </Button>
                            </form>

                            <p className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <button
                                    onClick={() => { setMode("login"); resetForm(); }}
                                    className="text-foreground font-semibold hover:underline"
                                >
                                    Sign In
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
