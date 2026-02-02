import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { AuthDialog } from "./AuthDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Check, Target, TrendingUp, Calendar, Bell, Zap, Shield, Users, Star, GitFork, Heart, ExternalLink, ArrowRight, ChevronLeft, ChevronRight, Twitter, Linkedin, Github } from "lucide-react";

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
        <>
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl mb-6">
                            Build Habits That <span className="text-primary">Stick</span>.
                        </h1>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
                            InnerStack helps you track, analyze, and optimize your daily routines with a beautiful, distraction-free interface.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex justify-center gap-4"
                    >
                        <Button size="lg" className="h-12 px-8 text-lg" onClick={() => onNavigate("auth")}>
                            Start for Free
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-lg" onClick={() => onNavigate("auth")}>
                            Sign In
                        </Button>
                    </motion.div>
                </div>

                <div className="absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] opacity-50 pointer-events-none" />
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Powerful features designed to help you build lasting habits and achieve your goals.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <feature.icon className="h-10 w-10 text-primary mb-2" />
                                        <CardTitle>{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base">{feature.description}</CardDescription>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Start free. Upgrade when you're ready.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {PRICING.map((plan, i) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className={`h-full relative ${plan.popular ? "border-primary shadow-lg scale-105" : "border-none shadow-sm"}`}>
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                                            Most Popular
                                        </div>
                                    )}
                                    <CardHeader className="text-center">
                                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                                        <div className="mt-4">
                                            <span className="text-4xl font-bold">{plan.price}</span>
                                            {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                                        </div>
                                        <CardDescription>{plan.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <ul className="space-y-2">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-center gap-2 text-sm">
                                                    <Check className="h-4 w-4 text-primary shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <AuthDialog>
                                            <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                                                {plan.cta}
                                            </Button>
                                        </AuthDialog>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4">Loved by Thousands</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Join the community of people building better habits every day.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {TESTIMONIALS.map((testimonial, i) => (
                            <motion.div
                                key={testimonial.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="h-full border-none shadow-sm">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-1 mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                            ))}
                                        </div>
                                        <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                                                {testimonial.avatar}
                                            </div>
                                            <div>
                                                <p className="font-medium">{testimonial.name}</p>
                                                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
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
            <section className="py-20 bg-slate-900 text-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid lg:grid-cols-2 gap-12 items-center"
                    >
                        {/* Dashboard Preview Cards */}
                        <div className="relative h-[400px]">
                            {/* Ratings Card */}
                            <motion.div
                                initial={{ x: -20, y: 0 }}
                                whileInView={{ x: 0, y: 0 }}
                                viewport={{ once: true }}
                                className="absolute top-0 left-0 bg-slate-800/90 backdrop-blur rounded-2xl p-4 shadow-2xl border border-slate-700 w-48"
                            >
                                <div className="text-xs text-slate-400 mb-1">Ratings</div>
                                <div className="flex items-center gap-2 text-[10px] text-emerald-400 mb-2">
                                    <span className="bg-emerald-500/20 px-2 py-0.5 rounded">Last 6 months</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold">8.14k</span>
                                    <span className="text-emerald-400 text-xs">+18.2%</span>
                                </div>
                            </motion.div>

                            {/* Calendar Card */}
                            <motion.div
                                initial={{ x: 0, y: 20 }}
                                whileInView={{ x: 0, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="absolute top-16 left-32 bg-slate-800/90 backdrop-blur rounded-2xl p-4 shadow-2xl border border-slate-700 w-56"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <ChevronLeft className="h-4 w-4 text-slate-400" />
                                    <span className="text-sm font-medium">January 2026</span>
                                    <ChevronRight className="h-4 w-4 text-slate-400" />
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-[10px] text-center mb-2">
                                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                                        <div key={d} className="text-slate-500">{d}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-xs text-center">
                                    {[...Array(31)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-6 h-6 flex items-center justify-center rounded-full ${i === 12 ? "bg-emerald-500 text-white" :
                                                i === 10 ? "ring-2 ring-emerald-500" :
                                                    "hover:bg-slate-700"
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
                                className="absolute top-4 right-0 bg-slate-800/90 backdrop-blur rounded-2xl p-4 shadow-2xl border border-slate-700 w-52"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium">Habit Status</span>
                                </div>
                                <div className="space-y-2">
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
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                                Let's skip the chatter and start building!
                            </h2>
                            <p className="text-slate-400 text-lg mb-8 max-w-lg">
                                With a variety of powerful features, you can effortlessly track your habits without any friction. Build your perfect routine with ease.
                            </p>
                            <Button
                                size="lg"
                                variant="secondary"
                                className="h-12 px-8 text-lg gap-2 bg-white text-slate-900 hover:bg-slate-100"
                                onClick={() => onNavigate("auth")}
                            >
                                Let's Started <ArrowRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Open Source Section */}
            <section id="open-source" className="py-20 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <Heart className="h-4 w-4" />
                            Open Source
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Built in the Open</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                            InnerStack is open source. Explore the code, contribute features, or fork it to make it your own.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            <a
                                href="https://github.com/praneeth132006/InnerStack"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button size="lg" className="gap-2">
                                    <Star className="h-5 w-5" />
                                    Star on GitHub
                                </Button>
                            </a>
                            <a
                                href="https://github.com/praneeth132006/InnerStack/fork"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button size="lg" variant="outline" className="gap-2">
                                    <GitFork className="h-5 w-5" />
                                    Fork Repository
                                </Button>
                            </a>
                            <a
                                href="https://github.com/praneeth132006/InnerStack/blob/main/CONTRIBUTING.md"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button size="lg" variant="outline" className="gap-2">
                                    <ExternalLink className="h-5 w-5" />
                                    Contribute
                                </Button>
                            </a>
                        </div>

                        <div className="flex justify-center gap-8 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                JavaScript
                            </div>
                            <div>MIT License</div>
                            <div>Built with React + Vite</div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Habits?</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                            Join thousands of users who are already building better habits with InnerStack.
                        </p>
                        <AuthDialog defaultTab="signup">
                            <Button size="lg" className="h-12 px-8 text-lg">Get Started Free</Button>
                        </AuthDialog>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-300 py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        {/* Brand Column */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-white">InnerStack</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Building better habits together. Open source, privacy-focused, and designed for your growth.
                            </p>
                            <div className="flex gap-4 pt-2">
                                <a href="#" className="hover:text-white transition"><Twitter className="h-5 w-5" /></a>
                                <a href="#" className="hover:text-white transition"><Github className="h-5 w-5" /></a>
                                <a href="#" className="hover:text-white transition"><Linkedin className="h-5 w-5" /></a>
                            </div>
                        </div>

                        {/* Resources */}
                        <div>
                            <h4 className="text-white font-semibold mb-6">Resources</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition">Community</a></li>
                                <li><a href="#" className="hover:text-white transition">Habit Guide</a></li>
                                <li><a href="#" className="hover:text-white transition">Open Source</a></li>
                            </ul>
                        </div>

                        {/* Help & Support */}
                        <div>
                            <h4 className="text-white font-semibold mb-6">Help & Support</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white transition">Feature Request</a></li>
                                <li><a href="#" className="hover:text-white transition">Report a Bug</a></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="text-white font-semibold mb-6">Legal</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
                                <li><a href="#" className="hover:text-white transition">Licenses</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                        <p>© 2026 InnerStack. All rights reserved.</p>
                        <p className="flex items-center gap-1">
                            Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by Praneeth
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}
