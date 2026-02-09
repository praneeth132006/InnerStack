import { useState, useMemo } from "react";
import { useHabits } from "@/context/HabitContext";
import { startOfYear, endOfYear, eachDayOfInterval, format, isBefore, isSameDay, getDay, startOfWeek, endOfWeek, eachWeekOfInterval, addDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function CalendarHeatmap({ specificHabitId = null, variant = "full" }) {
    const { habits } = useHabits();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const isCompact = variant === "compact";

    // Calculate completion data
    const data = useMemo(() => {
        const counts = new Map();
        let maxCount = 0;
        let totalActiveDays = 0;

        // Helper to check if a specific habit is completed on a date
        const checkHabitCompletion = (habit, dateStr) => {
            if (!habit.history) return false;
            return !!habit.history[dateStr];
        };

        const today = new Date();
        const start = startOfYear(new Date(selectedYear, 0, 1));
        const end = endOfYear(new Date(selectedYear, 0, 1));
        const days = eachDayOfInterval({ start, end });

        days.forEach(day => {
            const dateStr = format(day, "yyyy-MM-dd");
            let count = 0;

            if (specificHabitId) {
                const habit = habits.find(h => h.id === specificHabitId);
                if (habit && checkHabitCompletion(habit, dateStr)) {
                    count = 1;
                }
                maxCount = 1;
            } else {
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

    // Generate grid data: weeks (columns) x days (rows)
    const weeks = useMemo(() => {
        const start = startOfYear(new Date(selectedYear, 0, 1));
        const end = endOfYear(new Date(selectedYear, 0, 1));

        // Ensure we cover the full range of weeks that overlap with the year
        const weekStart = startOfWeek(start, { weekStartsOn: 0 }); // Sunday start
        const weekEnd = endOfWeek(end, { weekStartsOn: 0 });

        const weeksArr = eachWeekOfInterval({ start: weekStart, end: weekEnd }, { weekStartsOn: 0 });

        return weeksArr.map(wStart => Array.from({ length: 7 }, (_, i) => addDays(wStart, i)));
    }, [selectedYear]);

    function getIntensityClass(count, max) {
        if (!count || count === 0) return "bg-white/[0.03]";
        if (specificHabitId) return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]";

        const ratio = count / max;
        if (ratio <= 0.25) return "bg-emerald-500/20";
        if (ratio <= 0.50) return "bg-emerald-500/40";
        if (ratio <= 0.75) return "bg-emerald-500/70";
        return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]";
    }

    if (isCompact) {
        return (
            <div className="w-full">
                <div className="overflow-x-auto custom-scrollbar pb-1">
                    <div className="inline-flex gap-[2px]">
                        {weeks.map((week, weekIdx) => (
                            <div key={`week-${weekIdx}`} className="flex flex-col gap-[2px] flex-shrink-0">
                                {week.map((day, dayIdx) => {
                                    const dateStr = format(day, "yyyy-MM-dd");
                                    const isInYear = day.getFullYear() === selectedYear;
                                    const count = data.counts.get(dateStr) || 0;
                                    const intensity = getIntensityClass(count, data.maxCount);

                                    if (!isInYear) return <div key={dateStr} className="w-2 h-2 bg-transparent" />;

                                    return (
                                        <TooltipProvider key={dateStr}>
                                            <Tooltip delayDuration={0}>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        className={`w-2 h-2 rounded-[1px] ${intensity} transition-all duration-300 hover:scale-150 hover:z-10 cursor-pointer`}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-slate-900 border-white/10 text-white text-[10px] p-2 rounded-lg shadow-xl backdrop-blur-md">
                                                    <p className="font-bold opacity-50 mb-1">{format(day, "MMM d")}</p>
                                                    <p className="text-emerald-400 font-semibold">
                                                        {specificHabitId
                                                            ? (count > 0 ? "Goal Achieved" : "No Activity")
                                                            : `${count} goal${count !== 1 ? 's' : ''} completed`
                                                        }
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                        {specificHabitId ? "Habit Consistency" : "Yearly Activity"}
                    </h3>
                    <div className="flex items-center bg-white/5 rounded-full border border-white/10 p-1 text-xs">
                        <button
                            onClick={() => setSelectedYear(y => y - 1)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        >
                            <ChevronLeft className="h-3 w-3" />
                        </button>
                        <span className="px-2 font-semibold text-slate-200">{selectedYear}</span>
                        <button
                            onClick={() => setSelectedYear(y => y + 1)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                            disabled={selectedYear >= new Date().getFullYear()}
                        >
                            <ChevronRight className={`h-3 w-3 ${selectedYear >= new Date().getFullYear() ? 'opacity-20' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                    <span>Less</span>
                    <div className="flex gap-[2px]">
                        {[0.03, 0.2, 0.4, 0.7, 1].map((lvl, i) => (
                            <div
                                key={lvl}
                                className={`w-2.5 h-2.5 rounded-sm ${i === 0 ? 'bg-white/[0.03]' : i === 4 ? 'bg-emerald-500' : `bg-emerald-500/${lvl * 100}`}`}
                            />
                        ))}
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div className="bg-[#0a0a0c] rounded-2xl p-8 border border-white/[0.05] shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar pb-2">
                    <div className="inline-flex flex-col min-w-full">
                        {/* Month labels */}
                        <div className="flex h-5 items-end mb-2 ml-10 relative">
                            {weeks.map((week, i) => {
                                const firstDay = week[0];
                                const isMonthStart = i === 0 || format(firstDay, "MMM") !== format(weeks[i - 1][0], "MMM");
                                return (
                                    <div key={`month-${i}`} className="flex-shrink-0 w-[15px]">
                                        {isMonthStart && (
                                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter absolute">
                                                {format(firstDay, "MMM")}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Grid with day labels */}
                        <div className="flex gap-[3px]">
                            {/* Day labels column */}
                            <div className="flex flex-col gap-[3px] pr-4 pt-0">
                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                                    <div key={day} className="h-3 text-[9px] font-bold flex items-center leading-none text-slate-700 uppercase">
                                        {[1, 3, 5].includes(i) ? day[0] : ""}
                                    </div>
                                ))}
                            </div>

                            {/* Activity Grid */}
                            {weeks.map((week, weekIdx) => (
                                <div key={`week-${weekIdx}`} className="flex flex-col gap-[3px] flex-shrink-0">
                                    {week.map((day, dayIdx) => {
                                        const dateStr = format(day, "yyyy-MM-dd");
                                        const isInYear = day.getFullYear() === selectedYear;
                                        const count = data.counts.get(dateStr) || 0;
                                        const intensity = getIntensityClass(count, data.maxCount);

                                        if (!isInYear) return <div key={dateStr} className="w-3 h-3 bg-transparent" />;

                                        return (
                                            <TooltipProvider key={dateStr}>
                                                <Tooltip delayDuration={0}>
                                                    <TooltipTrigger asChild>
                                                        <div
                                                            className={`w-3 h-3 rounded-[2px] ${intensity} transition-all duration-300 hover:scale-125 hover:z-10 cursor-pointer`}
                                                        />
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-slate-900 border-white/10 text-white text-[10px] p-2 rounded-lg shadow-xl backdrop-blur-md">
                                                        <p className="font-bold opacity-50 mb-1">{format(day, "EEEE, MMM d")}</p>
                                                        <p className="text-emerald-400 font-semibold">
                                                            {specificHabitId
                                                                ? (count > 0 ? "Goal Achieved" : "No Activity")
                                                                : `${count} goal${count !== 1 ? 's' : ''} completed`
                                                            }
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Summary Panel */}
            <div className="grid grid-cols-3 gap-6">
                {[
                    { label: "Active Days", value: data.totalActiveDays, color: "text-emerald-400" },
                    { label: "Total Goals", value: Array.from(data.counts.values()).reduce((a, b) => a + b, 0), color: "text-blue-400" },
                    { label: "Success Rate", value: Math.round((data.totalActiveDays / 365) * 100) + "%", color: "text-purple-400" }
                ].map(stat => (
                    <div key={stat.label} className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 flex flex-col items-center justify-center">
                        <div className={`text-xl font-black mb-1 ${stat.color}`}>{stat.value}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
