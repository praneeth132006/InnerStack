import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { AuthDialog } from "./AuthDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Check, Target, TrendingUp, Calendar, Bell, Zap, Shield, Heart, ExternalLink, ArrowRight, ChevronLeft, ChevronRight, Twitter, Linkedin, Github, Star, GitFork } from "lucide-react";

const FEATURES = [
    {
        icon: Target,
        title: "Smart Habit Tracking",
        description: "Track daily, weekly, and custom habits with intelligent scheduling.",
    },
    {
        icon: TrendingUp,
        title: "Streak Analytics",
        description: "Visualize your progress with GitHub-style heatmaps and streak counters.",
    },
    {
        icon: Calendar,
        title: "Flexible Scheduling",
        description: "Set habits for specific days, weekly targets, or one-time goals.",
    },
    {
        icon: Bell,
        title: "Smart Reminders",
        description: "Never miss a habit with customizable push notifications.",
    },
    {
        icon: Zap,
        title: "Habit Chains",
        description: "Link habits together to build powerful routines.",
    },
    {
        icon: Shield,
        title: "Private & Secure",
        description: "Your data stays yours. End-to-end encrypted sync.",
    },
];

const PRICING = [
    {
        name: "Free",
        price: "$0",
        description: "Perfect for getting started",
        features: [
            "Up to 5 habits",
            "Basic analytics",
            "7-day history",
            "Mobile & web access",
        ],
        cta: "Start Free",
        popular: false,
    },
    {
        name: "Pro",
        price: "$4.99",
        period: "/month",
        description: "For serious habit builders",
        features: [
            "Unlimited habits",
            "Advanced analytics",
            "Unlimited history",
            "Habit chains",
            "Mood tracking",
            "Priority support",
        ],
        cta: "Go Pro",
        popular: true,
    },
    {
        name: "Lifetime",
        price: "$49",
        description: "One-time payment, forever access",
        features: [
            "Everything in Pro",
            "Lifetime updates",
            "Early access to features",
            "Exclusive badge",
        ],
        cta: "Get Lifetime",
        popular: false,
    },
];

const TESTIMONIALS = [
    {
        name: "Sarah Chen",
        role: "Product Manager",
        content: "InnerStack transformed my morning routine. The streak feature keeps me motivated every single day.",
        avatar: "SC",
    },
    {
        name: "Marcus Johnson",
        role: "Software Engineer",
        content: "Finally, a habit tracker that doesn't get in the way. Clean design, powerful features.",
        avatar: "MJ",
    },
    {
        name: "Emily Rodriguez",
        role: "Fitness Coach",
        content: "I recommend InnerStack to all my clients. The mood tracking feature is a game-changer.",
        avatar: "ER",
    },
];

export function Hero({ onNavigate }) {
    return (
        <div className="bg-black text-white selection:bg-primary/30">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl mb-8">
                            Build Habits That <span className="text-primary">Stick</span>.
                        </h1>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <p className="mx-auto max-w-2xl text-xl text-slate-400 mb-10 leading-relaxed">
                            InnerStack helps you track, analyze, and optimize your daily routines with a beautiful, distraction-free interface.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex justify-center gap-5"
                    >
                        <Button size="lg" className="h-14 px-10 text-lg rounded-full" onClick={() => onNavigate("auth")}>
                            Start for Free
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full border-slate-800 hover:bg-slate-900 text-white" onClick={() => onNavigate("auth")}>
                            Sign In
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Powerful features designed to help you build lasting habits and achieve your goals.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {FEATURES.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="h-full bg-white/5 border-none shadow-none hover:bg-white/10 transition-colors">
                                    <CardHeader>
                                        <feature.icon className="h-10 w-10 text-primary mb-4" />
                                        <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base text-slate-400">{feature.description}</CardDescription>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Start free. Upgrade when you're ready.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {PRICING.map((plan, i) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className={`h-full relative bg-white/5 border-none shadow-none ${plan.popular ? "ring-2 ring-primary bg-white/10" : ""}`}>
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                                            Most Popular
                                        </div>
                                    )}
                                    <CardHeader className="text-center">
                                        <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                                        <div className="mt-4 mb-2">
                                            <span className="text-5xl font-bold text-white">{plan.price}</span>
                                            {plan.period && <span className="text-slate-400">{plan.period}</span>}
                                        </div>
                                        <CardDescription className="text-slate-400">{plan.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <ul className="space-y-3">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                                                    <Check className="h-5 w-5 text-primary shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <Button className={`w-full h-12 rounded-full text-base ${plan.popular ? "" : "bg-white/10 hover:bg-white/20 text-white border-none"}`} variant={plan.popular ? "default" : "outline"} onClick={() => onNavigate("auth")}>
                                            {plan.cta}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4">Loved by Thousands</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Join the community of people building better habits every day.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {TESTIMONIALS.map((testimonial, i) => (
                            <motion.div
                                key={testimonial.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="h-full bg-white/5 border-none shadow-none hover:bg-white/10 transition-colors">
                                    <CardContent className="pt-8">
                                        <div className="flex items-center gap-1 mb-6">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                            ))}
                                        </div>
                                        <p className="text-slate-300 mb-6 text-lg">"{testimonial.content}"</p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
                                                {testimonial.avatar}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{testimonial.name}</p>
                                                <p className="text-sm text-slate-400">{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dashboard Preview CTA Section */}
            <section className="py-24 overflow-hidden">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid lg:grid-cols-2 gap-16 items-center"
                    >
                        {/* Dashboard Preview Cards - Glassmorphism optimized for black */}
                        <div className="relative h-[400px]">
                            {/* Ratings Card */}
                            <motion.div
                                initial={{ x: -20, y: 0 }}
                                whileInView={{ x: 0, y: 0 }}
                                viewport={{ once: true }}
                                className="absolute top-0 left-0 bg-slate-900/90 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-white/5 w-52"
                            >
                                <div className="text-xs text-slate-400 mb-1">Ratings</div>
                                <div className="flex items-center gap-2 text-[10px] text-emerald-400 mb-2">
                                    <span className="bg-emerald-500/10 px-2 py-0.5 rounded">Last 6 months</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-white">8.14k</span>
                                    <span className="text-emerald-400 text-xs">+18.2%</span>
                                </div>
                            </motion.div>

                            {/* Calendar Card */}
                            <motion.div
                                initial={{ x: 0, y: 20 }}
                                whileInView={{ x: 0, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="absolute top-16 left-32 bg-slate-900/90 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-white/5 w-60"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <ChevronLeft className="h-4 w-4 text-slate-500" />
                                    <span className="text-sm font-medium text-white">January 2026</span>
                                    <ChevronRight className="h-4 w-4 text-slate-500" />
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-[10px] text-center mb-2">
                                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                                        <div key={d} className="text-slate-600">{d}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-xs text-center">
                                    {[...Array(31)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-6 h-6 flex items-center justify-center rounded-full ${i === 12 ? "bg-primary text-white" :
                                                i === 10 ? "ring-1 ring-primary text-primary" :
                                                    "text-slate-400 hover:bg-white/5"
                                                }`}
                                        >
                                            {i + 1}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Stats Card */}
                            <motion.div
                                initial={{ x: 20, y: 0 }}
                                whileInView={{ x: 0, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="absolute top-4 left-[280px] bg-slate-900/90 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-white/5 w-56 z-10"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-medium text-white">Habit Status</span>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { label: "Excellent", pct: "55%", color: "bg-emerald-500", change: "+25%" },
                                        { label: "Good", pct: "20%", color: "bg-blue-500", change: "+30%" },
                                        { label: "Average", pct: "12%", color: "bg-yellow-500", change: "-15%" },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                                <span className="text-slate-300">{item.label}</span>
                                            </div>
                                            <span className={item.change.startsWith("+") ? "text-emerald-400" : "text-red-400"}>
                                                {item.change}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* CTA Text */}
                        <div className="text-center lg:text-left">
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
                                Let's skip the chatter and start building!
                            </h2>
                            <p className="text-slate-400 text-lg mb-8 max-w-lg">
                                With a variety of powerful features, you can effortlessly track your habits without any friction. Build your perfect routine with ease.
                            </p>
                            <Button
                                size="lg"
                                className="h-14 px-10 text-lg gap-2 rounded-full bg-white text-black hover:bg-slate-200"
                                onClick={() => onNavigate("auth")}
                            >
                                Let's Get Started <ArrowRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-slate-400 py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
                        {/* Brand Column */}
                        <div className="col-span-2 lg:col-span-2 space-y-6">
                            <h3 className="text-2xl font-bold text-white tracking-tight">InnerStack</h3>
                            <p className="text-sm leading-relaxed max-w-sm text-slate-500">
                                Empowering your personal growth through data-driven habit tracking.
                                Open source, privacy-first, and designed for humans.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition">
                                    <Twitter className="h-4 w-4" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition">
                                    <Github className="h-4 w-4" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition">
                                    <Linkedin className="h-4 w-4" />
                                </a>
                            </div>
                        </div>

                        {/* Links */}
                        <div className="space-y-4">
                            <h4 className="text-white font-medium">Product</h4>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><a href="#" className="hover:text-white transition">Features</a></li>
                                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition">Changelog</a></li>
                                <li><a href="#" className="hover:text-white transition">Roadmap</a></li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-white font-medium">Community</h4>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><a href="#" className="hover:text-white transition">Discord</a></li>
                                <li><a href="#" className="hover:text-white transition">GitHub</a></li>
                                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-white font-medium">Legal</h4>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                                <li><a href="#" className="hover:text-white transition">Security</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
                        <p>© 2026 InnerStack. All rights reserved.</p>
                        <p className="flex items-center gap-1">
                            Crafted with <Heart className="h-3 w-3 text-red-900 fill-red-900" /> by Praneeth
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
