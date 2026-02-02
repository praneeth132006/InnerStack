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

export function CalendarHeatmap() {
    const { getAllCompletionDates } = useHabits();
    const completions = getAllCompletionDates();
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const yearDates = useMemo(() => generateYearData(selectedYear), [selectedYear]);
    const weeks = useMemo(() => groupByWeek(yearDates), [yearDates]);

    const maxCount = Math.max(1, ...Object.values(completions));

    // Calculate month labels
    const monthLabels = useMemo(() => {
        const labels = [];
        let lastMonth = -1;
        weeks.forEach((week, weekIndex) => {
            const firstDay = new Date(week[0]);
            const month = firstDay.getMonth();
            if (month !== lastMonth && firstDay.getFullYear() === selectedYear) {
                labels.push({ weekIndex, month });
                lastMonth = month;
            }
        });
        return labels;
    }, [weeks, selectedYear]);

    // Calculate stats for the year
    const yearStats = useMemo(() => {
        let totalCompletions = 0;
        let activeDays = 0;
        yearDates.forEach(date => {
            const count = completions[date] || 0;
            if (count > 0) {
                totalCompletions += count;
                activeDays++;
            }
        });
        return { totalCompletions, activeDays };
    }, [yearDates, completions]);

    return (
        <div className="w-full">
            {/* Header with stats on left, year selector on right */}
            <div className="flex items-start justify-between mb-4">
                {/* Stats on the left */}
                <div className="flex gap-4 text-sm text-muted-foreground">
                    <span><strong className="text-foreground">{yearStats.totalCompletions}</strong> completions</span>
                    <span><strong className="text-foreground">{yearStats.activeDays}</strong> active days</span>
                </div>
            </div>

            <div className="flex gap-4">
                {/* Heatmap grid */}
                <div className="flex-1 overflow-x-auto pb-2">
                    <div className="min-w-[700px]">
                        {/* Month labels */}
                        <div className="flex ml-8 mb-1 text-xs text-muted-foreground">
                            {weeks.map((_, weekIndex) => {
                                const label = monthLabels.find((l) => l.weekIndex === weekIndex);
                                return (
                                    <div key={weekIndex} className="w-3 mr-[2px] text-center">
                                        {label ? MONTHS[label.month] : ""}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex">
                            {/* Day labels */}
                            <div className="flex flex-col mr-2 text-xs text-muted-foreground justify-around h-[84px]">
                                {DAYS.map((day, i) => (
                                    <span key={i} className="h-3 leading-3">{day}</span>
                                ))}
                            </div>

                            {/* Grid */}
                            <div className="flex gap-[2px]">
                                {weeks.map((week, weekIndex) => (
                                    <div key={weekIndex} className="flex flex-col gap-[2px]">
                                        {week.map((date) => {
                                            const count = completions[date] || 0;
                                            const dateObj = new Date(date);
                                            const isCurrentYear = dateObj.getFullYear() === selectedYear;
                                            const isFuture = dateObj > new Date();
                                            return (
                                                <div
                                                    key={date}
                                                    title={isCurrentYear ? `${date}: ${count} habit${count !== 1 ? "s" : ""} completed` : ""}
                                                    className={`w-3 h-3 rounded-sm transition-colors ${!isCurrentYear || isFuture
                                                        ? "opacity-0"
                                                        : `${getIntensityClass(count, maxCount)} hover:ring-2 hover:ring-primary/50`
                                                        }`}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center justify-end gap-1 mt-3 text-xs text-muted-foreground">
                            <span>Less</span>
                            <div className="w-3 h-3 rounded-sm bg-muted/50" />
                            <div className="w-3 h-3 rounded-sm bg-emerald-500/30" />
                            <div className="w-3 h-3 rounded-sm bg-emerald-500/50" />
                            <div className="w-3 h-3 rounded-sm bg-emerald-500/70" />
                            <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                            <span>More</span>
                        </div>
                    </div>
                </div>

                {/* Year Selector - Vertical layout on the right */}
                <div className="flex flex-col items-center justify-center gap-1 min-w-[60px]">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-muted"
                        onClick={() => setSelectedYear(y => y + 1)}
                        disabled={selectedYear >= currentYear}
                    >
                        <ChevronUp className="h-5 w-5" />
                    </Button>
                    <span className="text-lg font-bold py-1">{selectedYear}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-muted"
                        onClick={() => setSelectedYear(y => y - 1)}
                        disabled={selectedYear <= 2020}
                    >
                        <ChevronDown className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
