import { useHabits } from "@/context/HabitContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Link2, Flame } from "lucide-react";

export function HabitList({ habits, date }) {
    const { toggleHabitCompletion, deleteHabit, getStreak, getAffectedByBreak } = useHabits();

    if (habits.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed rounded-xl border-muted">
                <p className="text-muted-foreground text-lg">No habits for this period.</p>
                <p className="text-sm text-muted-foreground mt-1">Add a new habit to get started!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {habits.map((habit) => {
                const isCompleted = habit.history && habit.history[date];
                const streak = getStreak(habit.id);
                const affected = !isCompleted ? getAffectedByBreak(habit.id, date) : [];

                return (
                    <Card
                        key={habit.id}
                        className={`transition-all ${isCompleted ? "opacity-70" : ""} border-none shadow-sm hover:shadow-md group`}
                    >
                        <CardContent className="flex items-center gap-4 p-4">
                            <Checkbox
                                checked={isCompleted}
                                onCheckedChange={() => toggleHabitCompletion(habit.id, date)}
                                className="w-6 h-6 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-primary/50"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{habit.icon}</span>
                                    <span
                                        className={`font-medium text-lg truncate ${isCompleted ? "line-through text-muted-foreground" : ""
                                            }`}
                                    >
                                        {habit.name}
                                    </span>
                                    {habit.chainFromId && (
                                        <Link2 className="h-4 w-4 text-muted-foreground" title="Chained from another habit" />
                                    )}
                                </div>
                                {habit.description && (
                                    <p className="text-sm text-muted-foreground truncate">{habit.description}</p>
                                )}
                                {affected.length > 0 && (
                                    <p className="text-xs text-destructive mt-1">
                                        ⚠️ Breaking this affects: {affected.map((a) => a.name).join(", ")}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                {streak > 0 && (
                                    <div className="flex items-center gap-1 text-sm text-orange-500 font-medium" title={`${streak} day streak`}>
                                        <Flame className="h-4 w-4" />
                                        {streak}
                                    </div>
                                )}
                                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground capitalize">
                                    {habit.frequency}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteHabit(habit.id)}
                                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
