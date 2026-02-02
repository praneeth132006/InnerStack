import { useState, useMemo } from "react";
import { useHabits } from "@/context/HabitContext";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Mon", "", "Wed", "", "Fri", "", ""];

function getIntensityClass(count, max) {
    if (count === 0) return "bg-muted/50";
    const ratio = count / max;
    if (ratio < 0.25) return "bg-emerald-500/30";
    if (ratio < 0.5) return "bg-emerald-500/50";
    if (ratio < 0.75) return "bg-emerald-500/70";
    return "bg-emerald-500";
}

function generateYearData(year) {
    const data = [];
    const startDate = new Date(year, 0, 1);
    // Adjust to start on a Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const endDate = new Date(year, 11, 31);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        data.push(new Date(d).toISOString().split("T")[0]);
    }
    return data;
}

function groupByWeek(dates) {
    const weeks = [];
    let currentWeek = [];
    dates.forEach((date) => {
        currentWeek.push(date);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }
    return weeks;
}

export function CalendarHeatmap({ specificHabitId = null }) {
    const { habits } = useHabits();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Calculate completion data
    const data = useMemo(() => {
        const counts = new Map();
        let maxCount = 0;
        let totalActiveDays = 0;
        let currentStreak = 0;
        let longestStreak = 0;

        // Helper to check if a specific habit is completed on a date
        const checkHabitCompletion = (habit, dateStr) => {
            if (!habit.completedDates) return false;
            return habit.completedDates.includes(dateStr);
        };

        const today = new Date();
        const start = startOfYear(new Date(selectedYear, 0, 1));
        const end = endOfYear(new Date(selectedYear, 0, 1));
        const days = eachDayOfInterval({ start, end });

        days.forEach(day => {
            const dateStr = format(day, "yyyy-MM-dd");
            let count = 0;

            if (specificHabitId) {
                // Single habit mode
                const habit = habits.find(h => h.id === specificHabitId);
                if (habit && checkHabitCompletion(habit, dateStr)) {
                    count = 1;
                }
                // For single habit, max is always 1
                maxCount = 1;
            } else {
                // Aggregate mode
                habits.forEach(habit => {
                    if (checkHabitCompletion(habit, dateStr)) {
                        count++;
                    }
                });
                if (count > maxCount) maxCount = count;
            }

            if (count > 0) {
                counts.set(dateStr, count);
                if (isBefore(day, today) || isSameDay(day, today)) {
                    totalActiveDays++;
                }
            }
        });

        return { counts, maxCount, totalActiveDays };
    }, [habits, selectedYear, specificHabitId]);

    const months = useMemo(() => {
        const start = startOfYear(new Date(selectedYear, 0, 1));
        return Array.from({ length: 12 }, (_, i) => {
            const date = new Date(selectedYear, i, 1);
            return {
                name: format(date, "MMM"),
                days: eachDayOfInterval({
                    start: date,
                    end: new Date(selectedYear, i + 1, 0)
                })
            };
        });
    }, [selectedYear]);

    function getIntensityClass(count, max) {
        if (!count || count === 0) return "bg-white/5"; // Empty state for black theme

        // If specific habit, it's binary
        if (specificHabitId) {
            return "bg-emerald-500";
        }

        const ratio = count / max;
        if (ratio <= 0.25) return "bg-emerald-500/20";
        if (ratio <= 0.50) return "bg-emerald-500/40";
        if (ratio <= 0.75) return "bg-emerald-500/70";
        return "bg-emerald-500"; // Solid for high completion
    }

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-white">
                        {specificHabitId ? "Habit Level Consistency" : "Yearly Activity"}
                    </h3>
                    <div className="flex items-center bg-white/5 rounded-lg border border-white/5 p-1 text-sm">
                        <button
                            onClick={() => setSelectedYear(y => y - 1)}
                            className="p-1 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="px-3 font-medium text-slate-200">{selectedYear}</span>
                        <button
                            onClick={() => setSelectedYear(y => y + 1)}
                            className="p-1 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white"
                            disabled={selectedYear >= new Date().getFullYear()}
                        >
                            <ChevronRight className={`h-4 w-4 ${selectedYear >= new Date().getFullYear() ? 'opacity-30' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Less</span>
                    <div className="w-3 h-3 bg-white/5 rounded-sm" />
                    <div className="w-3 h-3 bg-emerald-500/20 rounded-sm" />
                    <div className="w-3 h-3 bg-emerald-500/40 rounded-sm" />
                    <div className="w-3 h-3 bg-emerald-500/70 rounded-sm" />
                    <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
                    <span>More</span>
                </div>
            </div>

            <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <AnimatePresence mode="popLayout">
                        {months.map((month, i) => (
                            <motion.div
                                key={`${selectedYear}-${month.name}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white/5 rounded-xl p-4 border border-white/5"
                            >
                                <div className="text-sm font-medium text-slate-400 mb-3">{month.name}</div>
                                <div className="grid grid-cols-7 gap-1">
                                    {["S", "M", "T", "W", "T", "F", "S"].map(d => (
                                        <div key={d} className="text-[10px] text-slate-600 text-center">{d}</div>
                                    ))}
                                    {/* Offset for first day using grid column start */}
                                    {Array.from({ length: getDay(month.days[0]) }).map((_, i) => (
                                        <div key={`offset-${i}`} />
                                    ))}
                                    {month.days.map(day => {
                                        const dateStr = format(day, "yyyy-MM-dd");
                                        const count = data.counts.get(dateStr) || 0;
                                        const intensity = getIntensityClass(count, data.maxCount);

                                        return (
                                            <TooltipProvider key={dateStr}>
                                                <Tooltip delayDuration={0}>
                                                    <TooltipTrigger asChild>
                                                        <div
                                                            className={`aspect-square rounded-sm ${intensity} transition-colors hover:ring-2 hover:ring-emerald-500/50 hover:ring-offset-1 hover:ring-offset-black cursor-pointer`}
                                                        />
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-slate-900 border-white/10 text-white text-xs">
                                                        <p className="font-medium">{format(day, "MMM d, yyyy")}</p>
                                                        <p className="text-emerald-400">
                                                            {specificHabitId
                                                                ? (count > 0 ? "Completed" : "Missed")
                                                                : `${count} habit${count !== 1 ? 's' : ''} completed`
                                                            }
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Yearly Stats Summary */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                {[
                    { label: "Total Active Days", value: data.totalActiveDays },
                    { label: "Total Completions", value: Array.from(data.counts.values()).reduce((a, b) => a + b, 0) },
                    { label: "Completion Rate", value: Math.round((data.totalActiveDays / 365) * 100) + "%" }
                ].map(stat => (
                    <div key={stat.label} className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
