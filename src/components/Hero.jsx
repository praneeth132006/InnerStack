import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { AuthDialog } from "./AuthDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Check, Target, TrendingUp, Calendar, Bell, Zap, Shield, Users, Star, GitFork, Heart, ExternalLink } from "lucide-react";

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

export function Hero() {
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
                        <AuthDialog defaultTab="signup">
                            <Button size="lg" className="h-12 px-8 text-lg">Start for Free</Button>
                        </AuthDialog>
                        <AuthDialog defaultTab="login">
                            <Button size="lg" variant="outline" className="h-12 px-8 text-lg">Sign In</Button>
                        </AuthDialog>
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
            <footer className="py-12 border-t">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-xl font-bold">InnerStack</div>
                        <div className="flex gap-6 text-sm text-muted-foreground">
                            <a href="#features" className="hover:text-foreground transition">Features</a>
                            <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
                            <a href="https://github.com/praneeth622/InnerStack" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">GitHub</a>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © 2026 InnerStack. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}
