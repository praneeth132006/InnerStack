import { Button } from "@/components/ui/button";
import { Home, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export function ErrorPage({ onNavigate }) {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
            >
                <Card className="border-slate-800 bg-slate-900 overflow-hidden shadow-2xl">
                    <CardContent className="pt-12 pb-12 px-8 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6">
                            <span className="text-3xl">😕</span>
                        </div>

                        <h1 className="text-4xl font-bold text-white mb-2">Page Not Found</h1>
                        <p className="text-slate-400 mb-8 max-w-xs mx-auto">
                            The page you are looking for doesn't exist or has been moved.
                        </p>

                        <div className="bg-slate-800/50 rounded-lg p-4 w-full mb-8 border border-slate-700/50">
                            <div className="flex items-center gap-3 text-sm text-slate-300 font-mono">
                                <span className="text-red-400">Error 404:</span>
                                <span>/page-not-found</span>
                            </div>
                        </div>

                        <Button
                            className="w-full h-11 bg-white hover:bg-slate-200 text-slate-900 font-medium"
                            onClick={() => onNavigate?.("dashboard")}
                        >
                            Back to Home
                        </Button>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center text-sm text-slate-500">
                    <p>Need help? <button className="text-primary hover:underline">Contact Support</button></p>
                </div>
            </motion.div>
        </div>
    );
}
