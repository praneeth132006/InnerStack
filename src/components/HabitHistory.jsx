import { useMemo } from "react";
import { Check, X, Flame } from "lucide-react";

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function HabitHistory({ habit, isOpen }) {
    // Get completion history as sorted array
    const historyEntries = useMemo(() => {
        if (!habit.history) return [];

        const entries = [];
        const today = new Date();

        // Get last 30 days
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];
            entries.push({
                date: dateStr,
                completed: habit.history[dateStr] || false,
            });
        }

        return entries;
    }, [habit.history]);

    // Calculate current streak
    const currentStreak = useMemo(() => {
        let streak = 0;
        let date = new Date();

        for (let i = 0; i < 365; i++) {
            const dateStr = date.toISOString().split("T")[0];
            if (habit.history?.[dateStr]) {
                streak++;
                date.setDate(date.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    }, [habit.history]);

    if (!isOpen) return null;

    return (
        <div className="mt-3 pt-3 border-t border-muted animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-muted-foreground">Completion History (Last 30 Days)</p>
                {currentStreak > 0 && (
                    <div className="flex items-center gap-1 text-sm text-orange-500 font-medium">
                        <Flame className="h-4 w-4" />
                        {currentStreak} day streak
                    </div>
                )}
            </div>

            {historyEntries.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">
                    No completion history yet.
                </p>
            ) : (
                <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 max-h-[200px] overflow-y-auto">
                    {historyEntries.map((entry) => (
                        <div
                            key={entry.date}
                            className={`flex flex-col items-center p-2 rounded-lg text-xs transition-colors ${entry.completed
                                    ? "bg-emerald-500/10 text-emerald-600"
                                    : "bg-muted/50 text-muted-foreground"
                                }`}
                            title={`${entry.date}: ${entry.completed ? "Completed" : "Not completed"}`}
                        >
                            {entry.completed ? (
                                <Check className="h-4 w-4 mb-1" />
                            ) : (
                                <X className="h-4 w-4 mb-1 opacity-40" />
                            )}
                            <span className="text-[10px]">
                                {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
