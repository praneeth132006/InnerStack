import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Loader2, Eye, EyeOff, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export function AuthPage({ onNavigate }) {
    const { signIn, signUp, signInWithGoogle, firebaseEnabled, demoLogin } = useAuth();
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Form states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = async (e, type) => {
        e.preventDefault();
        setLocalError("");

        if (!firebaseEnabled) {
            demoLogin();
            onNavigate("dashboard");
            return;
        }

        setLoading(true);
        try {
            if (type === "login") {
                await signIn(email, password);
            } else {
                if (password.length < 6) throw new Error("Password must be at least 6 characters");
                await signUp(email, password, name);
            }
            onNavigate("dashboard");
        } catch (err) {
            setLocalError(err.message);
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
        try {
            await signInWithGoogle();
            onNavigate("dashboard");
        } catch (err) {
            setLocalError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden text-white">
            {/* Radial gradient background effect similar to reference */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-sm relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-white mb-4">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-semibold mb-2">Welcome to InnerStack</h1>
                    <p className="text-zinc-400 text-sm">Build better habits, one day at a time.</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-1 overflow-hidden shadow-2xl">
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-transparent h-12 p-1">
                            <TabsTrigger
                                value="login"
                                className="rounded-xl data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 h-full"
                            >
                                Login
                            </TabsTrigger>
                            <TabsTrigger
                                value="signup"
                                className="rounded-xl data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 h-full"
                            >
                                Sign Up
                            </TabsTrigger>
                        </TabsList>

                        <div className="p-5">
                            {localError && (
                                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
                                    {localError}
                                </div>
                            )}

                            <TabsContent value="login" className="mt-2 space-y-4">
                                <form onSubmit={(e) => handleSubmit(e, "login")} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-zinc-400 ml-1">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                            <Input
                                                type="email"
                                                placeholder="hello@example.com"
                                                className="bg-zinc-950/50 border-zinc-800 text-white pl-10 h-10 rounded-lg focus-visible:ring-offset-0 focus-visible:ring-zinc-700"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between px-1">
                                            <Label className="text-xs text-zinc-400">Password</Label>
                                            <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300">Forgot password?</button>
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="bg-zinc-950/50 border-zinc-800 text-white pl-10 pr-10 h-10 rounded-lg focus-visible:ring-offset-0 focus-visible:ring-zinc-700"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <Button className="w-full bg-white text-black hover:bg-zinc-200 h-10 rounded-lg font-medium" type="submit" disabled={loading}>
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="signup" className="mt-2 space-y-4">
                                <form onSubmit={(e) => handleSubmit(e, "signup")} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-zinc-400 ml-1">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                            <Input
                                                placeholder="John Doe"
                                                className="bg-zinc-950/50 border-zinc-800 text-white pl-10 h-10 rounded-lg focus-visible:ring-offset-0 focus-visible:ring-zinc-700"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-zinc-400 ml-1">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                            <Input
                                                type="email"
                                                placeholder="hello@example.com"
                                                className="bg-zinc-950/50 border-zinc-800 text-white pl-10 h-10 rounded-lg focus-visible:ring-offset-0 focus-visible:ring-zinc-700"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-zinc-400 ml-1">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="bg-zinc-950/50 border-zinc-800 text-white pl-10 pr-10 h-10 rounded-lg focus-visible:ring-offset-0 focus-visible:ring-zinc-700"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <Button className="w-full bg-white text-black hover:bg-zinc-200 h-10 rounded-lg font-medium" type="submit" disabled={loading}>
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
                                    </Button>
                                </form>
                            </TabsContent>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800" /></div>
                                <div className="relative flex justify-center text-[10px] uppercase font-medium"><span className="bg-zinc-900 px-2 text-zinc-500">Or continue with</span></div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full gap-2 bg-transparent border-zinc-700 text-white hover:bg-zinc-800 hover:text-white h-10 rounded-lg"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </Button>
                        </div>
                    </Tabs>
                </div>
                <div className="mt-8 text-center text-xs text-zinc-500">
                    <button onClick={() => onNavigate("home")} className="hover:text-white transition flex items-center justify-center gap-1 mx-auto">
                        Back to Home
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
