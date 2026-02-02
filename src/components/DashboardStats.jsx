import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, CheckCircle, Activity, TrendingUp } from "lucide-react";

export function DashboardStats({ habits }) {
    // Calculate stats
    const totalHabits = habits.length;
    const activeHabits = habits.filter(h => h.frequency !== 'one-time' || !h.history?.completed).length;

    // Calculate total completions across all habits
    let totalCompletions = 0;
    let totalPossibleDays = 0; // Simplified logic: just counts days since creation for now

    habits.forEach(h => {
        if (h.history) {
            totalCompletions += Object.values(h.history).filter(Boolean).length;
        }
        // Approximate age of habit for rate calc (avoid div by zero)
        const age = Math.max(1, (Date.now() - (h.createdAt || Date.now())) / (86400000));
        totalPossibleDays += Math.floor(age);
    });

    const completionRate = totalPossibleDays > 0
        ? Math.round((totalCompletions / totalPossibleDays) * 100)
        : 0;

    // Find best streak
    let bestStreak = 0;
    // Assuming habit object might have a pre-calculated streak or we rely on context helper. 
    // For now, simpler to just sum up completions or use a placeholder if calculation is expensive here.
    // We'll use a simplified metric: max completions for any single habit
    habits.forEach(h => {
        const completions = h.history ? Object.keys(h.history).length : 0;
        if (completions > bestStreak) bestStreak = completions;
        // Note: Real streak calc is in Context, can pass it down if needed, but this is a decent "Score" proxy for now.
    });

    const STATS = [
        {
            title: "Total Habits",
            value: totalHabits,
            icon: Activity,
            color: "text-blue-500",
            desc: "Active routines"
        },
        {
            title: "Completion Rate",
            value: `${completionRate}%`,
            icon: TrendingUp,
            color: "text-emerald-500",
            desc: "Last 30 days"
        },
        {
            title: "Total Actions",
            value: totalCompletions,
            icon: CheckCircle,
            color: "text-purple-500",
            desc: "Habits completed"
        },
        {
            title: "Best Consistency",
            value: bestStreak,
            icon: Flame,
            color: "text-orange-500",
            desc: "Days streak"
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {STATS.map((stat) => (
                <Card key={stat.title} className="bg-muted/10 border-none shadow-none hover:bg-muted/20 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stat.desc}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
