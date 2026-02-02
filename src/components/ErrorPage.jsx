import { Button } from "@/components/ui/button";
import { Home, AlertTriangle } from "lucide-react";

export function ErrorPage({ onNavigate }) {
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4">
            {/* 404 with Cat Illustration */}
            <div className="relative flex items-center justify-center mb-8">
                {/* Large 404 Text */}
                <h1 className="text-[150px] md:text-[200px] font-bold text-slate-700/50 tracking-tight select-none">
                    404
                </h1>

                {/* Cat SVG Illustration */}
                <svg
                    className="absolute w-32 h-40 md:w-40 md:h-48"
                    viewBox="0 0 100 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Cat Body */}
                    <ellipse cx="50" cy="75" rx="25" ry="30" className="fill-slate-800 stroke-slate-600" strokeWidth="2" />

                    {/* Cat Head */}
                    <circle cx="50" cy="35" r="20" className="fill-slate-800 stroke-slate-600" strokeWidth="2" />

                    {/* Left Ear */}
                    <path d="M32 20 L38 35 L28 35 Z" className="fill-slate-800 stroke-slate-600" strokeWidth="2" />
                    <path d="M33 23 L36 32 L30 32 Z" className="fill-emerald-500/50" />

                    {/* Right Ear */}
                    <path d="M68 20 L72 35 L62 35 Z" className="fill-slate-800 stroke-slate-600" strokeWidth="2" />
                    <path d="M67 23 L70 32 L64 32 Z" className="fill-emerald-500/50" />

                    {/* Eyes */}
                    <ellipse cx="42" cy="32" rx="4" ry="3" className="fill-white" />
                    <ellipse cx="58" cy="32" rx="4" ry="3" className="fill-white" />
                    <circle cx="42" cy="32" r="2" className="fill-slate-900" />
                    <circle cx="58" cy="32" r="2" className="fill-slate-900" />

                    {/* Nose */}
                    <path d="M50 38 L48 42 L52 42 Z" className="fill-pink-400" />

                    {/* Whiskers */}
                    <path d="M35 40 L20 38" className="stroke-slate-600" strokeWidth="1" />
                    <path d="M35 42 L20 44" className="stroke-slate-600" strokeWidth="1" />
                    <path d="M65 40 L80 38" className="stroke-slate-600" strokeWidth="1" />
                    <path d="M65 42 L80 44" className="stroke-slate-600" strokeWidth="1" />

                    {/* Tail */}
                    <path d="M75 75 Q 90 60 85 45" className="stroke-slate-600 fill-none" strokeWidth="6" strokeLinecap="round" />
                    <path d="M85 45 Q 83 40 80 42" className="stroke-emerald-500 fill-none" strokeWidth="4" strokeLinecap="round" />

                    {/* Paws */}
                    <ellipse cx="35" cy="100" rx="8" ry="5" className="fill-slate-700 stroke-slate-600" strokeWidth="2" />
                    <ellipse cx="65" cy="100" rx="8" ry="5" className="fill-slate-700 stroke-slate-600" strokeWidth="2" />

                    {/* Stripes on body */}
                    <path d="M40 60 Q 50 55 60 60" className="stroke-emerald-500/30 fill-none" strokeWidth="2" />
                    <path d="M38 70 Q 50 65 62 70" className="stroke-emerald-500/30 fill-none" strokeWidth="2" />
                </svg>

                {/* Plant */}
                <svg
                    className="absolute right-[-30px] md:right-[-40px] bottom-0 w-16 h-20 md:w-20 md:h-24"
                    viewBox="0 0 50 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Pot */}
                    <path d="M15 45 L20 60 L30 60 L35 45 Z" className="fill-slate-600" />
                    <rect x="12" y="43" width="26" height="4" rx="1" className="fill-slate-500" />

                    {/* Leaves */}
                    <path d="M25 45 Q 20 35 15 25 Q 20 30 25 35" className="fill-slate-500" />
                    <path d="M25 40 Q 30 30 35 20 Q 30 28 25 35" className="fill-slate-500" />
                    <path d="M25 35 Q 22 22 18 12 Q 23 20 25 30" className="fill-slate-500" />
                    <path d="M25 32 Q 28 18 32 8 Q 27 18 25 28" className="fill-slate-400" />
                </svg>

                {/* Yarn Ball */}
                <svg
                    className="absolute left-[-20px] md:left-[-30px] bottom-[-10px] w-12 h-12 md:w-14 md:h-14"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="20" cy="20" r="15" className="fill-slate-700 stroke-slate-600" strokeWidth="1" />
                    <path d="M10 15 Q 20 10 30 15" className="stroke-slate-500 fill-none" strokeWidth="1" />
                    <path d="M8 22 Q 20 18 32 22" className="stroke-slate-500 fill-none" strokeWidth="1" />
                    <path d="M12 28 Q 20 25 28 28" className="stroke-slate-500 fill-none" strokeWidth="1" />
                    {/* String trailing */}
                    <path d="M35 20 Q 50 25 60 15 Q 55 30 40 35" className="stroke-slate-600 fill-none" strokeWidth="1" />
                </svg>
            </div>

            {/* Message */}
            <div className="text-center">
                <h2 className="text-xl md:text-2xl font-semibold text-white flex items-center justify-center gap-2 mb-3">
                    Page Not Found <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </h2>
                <p className="text-slate-400 mb-8">
                    We couldn't find the page you are looking for
                </p>
                <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                    onClick={() => onNavigate?.("dashboard")}
                >
                    <Home className="h-5 w-5" />
                    Back to Home
                </Button>
            </div>
        </div>
    );
}
