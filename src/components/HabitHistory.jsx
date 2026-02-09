import { useMemo } from "react";
import { Check, X, Flame } from "lucide-react";
import { formatDateLocal } from "@/lib/utils";

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
            const dateStr = formatDateLocal(date);
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
            const dateStr = formatDateLocal(date);
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
                <div className="grid grid-cols-7 gap-2">
                    {historyEntries.map((entry) => (
                        <div
                            key={entry.date}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl text-xs transition-all ${entry.completed
                                ? "bg-emerald-500/20 border border-emerald-500/30"
                                : "bg-muted/80 border border-transparent"
                                }`}
                            title={`${entry.date}: ${entry.completed ? "Completed" : "Not completed"}`}
                        >
                            {entry.completed ? (
                                <Check className="h-5 w-5 text-emerald-500 mb-1" />
                            ) : (
                                <X className="h-5 w-5 text-muted-foreground/50 mb-1" />
                            )}
                            <span className="text-xs text-muted-foreground font-medium">
                                {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
