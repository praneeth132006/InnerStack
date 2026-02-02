import { HabitTracker } from "./HabitTracker"

export function Dashboard({ user }) {
    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
                Welcome back, <span className="text-primary">{user?.name || "User"}</span>
            </h1>
            <p className="text-center text-muted-foreground mb-8 text-lg">
                Ready to crush your goals today?
            </p>
            <HabitTracker />
        </div>
    )
}
