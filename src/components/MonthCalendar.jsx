import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths, isToday } from "date-fns";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function MonthCalendar({ habits }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth)
    });

    const startDay = getDay(startOfMonth(currentMonth)); // 0 = Sunday

    // Calculate completions for each day
    const getDayStatus = (date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        let completedCount = 0;
        let totalDue = 0;

        habits.forEach(habit => {
            // Simplified "due" logic: checks if completed. 
            // Real logic needs complex "isDue" check, but for visualization:
            if (habit.history?.[dateStr]) {
                completedCount++;
            }
            // Assume if completed, it was due. If not, maybe?
            // For now, we mainly visualize successes.
        });

        return { completedCount };
    };

    return (
        <div className="bg-muted/10 rounded-2xl border border-muted/20 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    {format(currentMonth, "MMMM yyyy")}
                </h2>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-y-4 gap-x-2">
                {/* Weekday headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="text-center text-sm text-muted-foreground font-medium py-2">
                        {day}
                    </div>
                ))}

                {/* Empty slots for start of month */}
                {Array.from({ length: startDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {/* Days */}
                {daysInMonth.map(day => {
                    const status = getDayStatus(day);
                    const isTodayDate = isToday(day);

                    return (
                        <div key={day.toString()} className="flex flex-col items-center gap-1 min-h-[80px] group relative p-2 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                            <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isTodayDate ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                                {format(day, "d")}
                            </span>

                            {/* Habit dots */}
                            <div className="flex flex-wrap justify-center gap-1 max-w-[40px]">
                                {status.completedCount > 0 && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <div className="flex items-center justify-center w-full h-full">
                                                    {/* If many habits, show dots. If few, show icons? Dots are cleaner for aggregated view */}
                                                    {status.completedCount === 1 ? (
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                    ) : (
                                                        <div className="flex gap-0.5">
                                                            {[...Array(Math.min(4, status.completedCount))].map((_, i) => (
                                                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                            ))}
                                                            {status.completedCount > 4 && <span className="text-[8px] text-emerald-500">+</span>}
                                                        </div>
                                                    )}
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-slate-900 text-white border-white/10">
                                                <p>{status.completedCount} habits completed</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
