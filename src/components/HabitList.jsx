import { useState } from "react";
import { useHabits } from "@/context/HabitContext";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Link2, Flame, AlertCircle } from "lucide-react";
import { TaskDetailDialog } from "./TaskDetailDialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function HabitList({ habits, date }) {
    const { toggleHabitCompletion, getStreak, getAffectedByBreak, habits: allHabits, isRestrictedDay } = useHabits();
    const [selectedHabit, setSelectedHabit] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingToggle, setPendingToggle] = useState(null);

    // Get parent habit name for chained habits
    const getParentHabitName = (chainFromId) => {
        const parent = allHabits.find(h => h.id === chainFromId);
        return parent ? parent.name : null;
    };

    const handleToggle = (habitId, dateStr) => {
        const habit = habits.find(h => h.id === habitId);
        if (!habit) return;

        const isCompleted = habit.history && habit.history[dateStr];

        // Only show confirmation when checking (logging), not when unchecking
        if (!isCompleted && isRestrictedDay(habit, dateStr)) {
            setPendingToggle({ id: habitId, date: dateStr });
            setConfirmOpen(true);
        } else {
            toggleHabitCompletion(habitId, dateStr);
        }
    };

    const confirmToggle = () => {
        if (pendingToggle) {
            toggleHabitCompletion(pendingToggle.id, pendingToggle.date);
            setPendingToggle(null);
        }
        setConfirmOpen(false);
    };

    if (habits.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed rounded-xl border-muted/50 bg-muted/20">
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
                const parentName = habit.chainFromId ? getParentHabitName(habit.chainFromId) : null;

                return (
                    <Card
                        key={habit.id}
                        className={`transition-all border-none bg-accent/20 hover:bg-accent/40 shadow-sm cursor-pointer group`}
                        onClick={() => setSelectedHabit(habit)}
                    >
                        <CardContent className="p-4 flex items-center gap-4">
                            <div onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                    checked={isCompleted}
                                    onCheckedChange={() => handleToggle(habit.id, date)}
                                    className="w-6 h-6 rounded-full data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-muted-foreground/50 transition-all"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl opacity-90">{habit.icon}</span>
                                    <span
                                        className={`font-medium text-lg truncate transition-colors ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                                            }`}
                                    >
                                        {habit.name}
                                    </span>
                                    {habit.chainFromId && (
                                        <div className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full" title={`Linked to: ${parentName}`}>
                                            <Link2 className="h-3 w-3" />
                                            <span className="max-w-[100px] truncate hidden sm:inline">{parentName}</span>
                                        </div>
                                    )}
                                </div>
                                {habit.description && !isCompleted && (
                                    <p className="text-sm text-muted-foreground truncate pl-1">{habit.description}</p>
                                )}
                                {affected.length > 0 && (
                                    <p className="text-xs text-orange-500 mt-1 pl-1 font-medium">
                                        ⚠️ Breaks chain for: {affected.map((a) => a.name).join(", ")}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                {streak > 0 && (
                                    <div className="flex items-center gap-1 text-sm text-orange-500 font-bold bg-orange-500/10 px-2 py-1 rounded-full">
                                        <Flame className="h-4 w-4 fill-orange-500" />
                                        {streak}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}

            {/* Confirmation Dialog for Restricted Day Logging */}
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                            Unscheduled Logging
                        </DialogTitle>
                        <DialogDescription className="pt-2 text-foreground">
                            You did not fix the frequency for this day. Are you sure you still want to log the activity?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                        <Button variant="default" onClick={confirmToggle}>Confirm Log</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <TaskDetailDialog
                habit={selectedHabit}
                open={!!selectedHabit}
                onOpenChange={(open) => !open && setSelectedHabit(null)}
            />
        </div>
    );
}

