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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, User, Chrome, Loader2 } from "lucide-react";

export function AuthDialog({ children, defaultTab = "login" }) {
    const { signIn, signUp, signInWithGoogle, firebaseEnabled, demoLogin, error } = useAuth();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState("");

    // Login form state
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Signup form state
    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupConfirm, setSignupConfirm] = useState("");

    // Forgot password state
    const [showForgotPassword, setShowForgotPassword] = useState(false);
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
        setShowForgotPassword(false);
        setResetSent(false);
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
        // In a real app, you'd call Firebase's sendPasswordResetEmail
        setResetSent(true);
    };

    return (
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                {showForgotPassword ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Reset Password</DialogTitle>
                            <DialogDescription>
                                {resetSent
                                    ? "Check your email for a password reset link."
                                    : "Enter your email to receive a password reset link."}
                            </DialogDescription>
                        </DialogHeader>
                        {!resetSent ? (
                            <form onSubmit={handleForgotPassword} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="reset-email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="reset-email"
                                            type="email"
                                            placeholder="you@example.com"
                                            className="pl-10"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" onClick={() => setShowForgotPassword(false)} className="flex-1">
                                        Back
                                    </Button>
                                    <Button type="submit" className="flex-1">
                                        Send Reset Link
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <Button onClick={() => setShowForgotPassword(false)} className="w-full mt-4">
                                Back to Login
                            </Button>
                        )}
                    </>
                ) : (
                    <Tabs defaultValue={defaultTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login" className="space-y-4 pt-4">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="login-email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="login-email"
                                            type="email"
                                            placeholder="you@example.com"
                                            className="pl-10"
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
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            required={firebaseEnabled}
                                        />
                                    </div>
                                </div>

                                {localError && (
                                    <p className="text-sm text-destructive">{localError}</p>
                                )}

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {firebaseEnabled ? "Sign In" : "Demo Login"}
                                </Button>
                            </form>

                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="text-sm text-muted-foreground hover:text-primary transition w-full text-center"
                            >
                                Forgot password?
                            </button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
                                <Chrome className="mr-2 h-4 w-4" />
                                Google
                            </Button>
                        </TabsContent>

                        <TabsContent value="signup" className="space-y-4 pt-4">
                            <form onSubmit={handleSignup} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-name">Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="signup-name"
                                            type="text"
                                            placeholder="Your name"
                                            className="pl-10"
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
                                            className="pl-10"
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
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10"
                                            value={signupPassword}
                                            onChange={(e) => setSignupPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="signup-confirm"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10"
                                            value={signupConfirm}
                                            onChange={(e) => setSignupConfirm(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {localError && (
                                    <p className="text-sm text-destructive">{localError}</p>
                                )}

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {firebaseEnabled ? "Create Account" : "Demo Login"}
                                </Button>
                            </form>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
                                <Chrome className="mr-2 h-4 w-4" />
                                Google
                            </Button>
                        </TabsContent>
                    </Tabs>
                )}
            </DialogContent>
        </Dialog>
    );
}
