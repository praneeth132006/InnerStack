import { motion } from "framer-motion"
import { Button } from "./ui/button"

export function Hero() {
    return (
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
                    <Button size="lg" className="h-12 px-8 text-lg">Start for Free</Button>
                    <Button size="lg" variant="outline" className="h-12 px-8 text-lg">View Demo</Button>
                </motion.div>
            </div>

            {/* Visual element / Abstract shapes */}
            <div className="absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
        </section>
    )
}
