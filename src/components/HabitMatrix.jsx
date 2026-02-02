import { useState, useMemo } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, isToday, isSameDay, subWeeks, addWeeks, subMonths, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useHabits } from "@/context/HabitContext";
import { cn } from "@/lib/utils";

export function HabitMatrix({ habits, mode = "week" }) {
    const { toggleHabitCompletion } = useHabits();
    const [currentDate, setCurrentDate] = useState(new Date());

    // Calculate details for the visible range
    const { days, rangeLabel } = useMemo(() => {
        let start, end, label;

        if (mode === "week") {
            start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
            end = endOfWeek(currentDate, { weekStartsOn: 1 });
            label = `Week of ${format(start, "MMM d, yyyy")}`;
        } else {
            start = startOfMonth(currentDate);
            end = endOfMonth(currentDate);
            label = format(currentDate, "MMMM yyyy");
        }

        const daysArr = eachDayOfInterval({ start, end });
        return { days: daysArr, rangeLabel: label };
    }, [currentDate, mode]);

    const handlePrev = () => {
        if (mode === "week") setCurrentDate(subWeeks(currentDate, 1));
        else setCurrentDate(subMonths(currentDate, 1));
    };

    const handleNext = () => {
        if (mode === "week") setCurrentDate(addWeeks(currentDate, 1));
        else setCurrentDate(addMonths(currentDate, 1));
    };

    return (
        <div className="bg-white/5 rounded-2xl border border-white/5 p-4 md:p-6 overflow-hidden">
            {/* Header / Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <h3 className="text-xl font-semibold text-white">{rangeLabel}</h3>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={handlePrev} className="hover:bg-white/10 text-slate-400 hover:text-white">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setCurrentDate(new Date())} className="text-xs hover:bg-white/10 text-slate-400 hover:text-white">
                        Today
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleNext} className="hover:bg-white/10 text-slate-400 hover:text-white">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Matrix Container - Scrollable on mobile */}
            <div className="overflow-x-auto pb-4">
                <div className="min-w-[800px]"> {/* Ensure minimum width for matrix readability */}

                    {/* Header Row (Dates) */}
                    <div className="flex border-b border-white/10 pb-4 mb-4">
                        <div className="w-1/4 min-w-[200px] shrink-0 font-medium text-slate-400 pl-4">Habit</div>
                        <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}>
                            {days.map(day => {
                                const isTod = isToday(day);
                                return (
                                    <div key={day.toISOString()} className={cn("text-center text-xs sm:text-sm flex flex-col items-center gap-1", isTod ? "text-primary font-bold" : "text-slate-500")}>
                                        <span>{format(day, "eeeee")}</span>
                                        <span className={cn("w-6 h-6 flex items-center justify-center rounded-full", isTod && "bg-primary text-primary-foreground")}>
                                            {format(day, "d")}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Habit Rows */}
                    <div className="space-y-4">
                        {habits.map(habit => (
                            <div key={habit.id} className="flex items-center group hover:bg-white/5 p-2 rounded-xl transition-colors">

                                {/* Habit Info Column */}
                                <div className="w-1/4 min-w-[200px] shrink-0 pl-2">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-lg">
                                            {habit.icon}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white line-clamp-1">{habit.name}</p>
                                            <p className="text-xs text-slate-500 capitalize">{habit.frequency}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Days Grid for this Habit */}
                                <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}>
                                    {days.map(day => {
                                        const dateStr = format(day, "yyyy-MM-dd");
                                        const isCompleted = habit.history?.[dateStr];
                                        const isFuture = day > new Date(); // Simple future check

                                        // Determine interaction
                                        const handleClick = () => {
                                            if (isFuture) return; // Prevent logging future?
                                            toggleHabitCompletion(habit.id, dateStr);
                                        };

                                        return (
                                            <div key={`${habit.id}-${dateStr}`} className="flex justify-center items-center h-full">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={handleClick}
                                                                disabled={isFuture}
                                                                className={cn(
                                                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
                                                                    isCompleted
                                                                        ? "bg-emerald-500 text-white shadow-[0_0_10px_-3px_rgba(16,185,129,0.5)]"
                                                                        : "bg-white/5 text-transparent hover:bg-white/10",
                                                                    isFuture && "opacity-20 cursor-not-allowed hover:bg-transparent"
                                                                )}
                                                            >
                                                                <Check className={cn("h-4 w-4", !isCompleted && "opacity-0")} />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-slate-900 border-white/10 text-white text-xs">
                                                            <p>{isCompleted ? "Completed" : "Incomplete"}</p>
                                                            <p className="text-slate-400">{format(day, "MMM d")}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {habits.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                No habits found. Add one to see your history!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
