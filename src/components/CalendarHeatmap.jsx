import { useMemo } from "react";
import { useHabits } from "@/context/HabitContext";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Mon", "", "Wed", "", "Fri", "", ""];

function getIntensityClass(count, max) {
    if (count === 0) return "bg-muted/50";
    const ratio = count / max;
    if (ratio < 0.25) return "bg-primary/20";
    if (ratio < 0.5) return "bg-primary/40";
    if (ratio < 0.75) return "bg-primary/70";
    return "bg-primary";
}

function generateYearData() {
    const data = [];
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // Start from the first Sunday after oneYearAgo
    const startDate = new Date(oneYearAgo);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
        data.push(new Date(d).toISOString().split("T")[0]);
    }
    return data;
}

function groupByWeek(dates) {
    const weeks = [];
    let currentWeek = [];
    dates.forEach((date, i) => {
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

    const yearDates = useMemo(() => generateYearData(), []);
    const weeks = useMemo(() => groupByWeek(yearDates), [yearDates]);

    const maxCount = Math.max(1, ...Object.values(completions));

    // Calculate month labels
    const monthLabels = useMemo(() => {
        const labels = [];
        let lastMonth = -1;
        weeks.forEach((week, weekIndex) => {
            const firstDay = new Date(week[0]);
            const month = firstDay.getMonth();
            if (month !== lastMonth) {
                labels.push({ weekIndex, month });
                lastMonth = month;
            }
        });
        return labels;
    }, [weeks]);

    return (
        <div className="w-full overflow-x-auto pb-2">
            <div className="min-w-[800px]">
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
                                    return (
                                        <div
                                            key={date}
                                            title={`${date}: ${count} habit${count !== 1 ? "s" : ""} completed`}
                                            className={`w-3 h-3 rounded-sm ${getIntensityClass(count, maxCount)} transition-colors hover:ring-2 hover:ring-primary/50`}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end gap-1 mt-2 text-xs text-muted-foreground">
                    <span>Less</span>
                    <div className="w-3 h-3 rounded-sm bg-muted/50" />
                    <div className="w-3 h-3 rounded-sm bg-primary/20" />
                    <div className="w-3 h-3 rounded-sm bg-primary/40" />
                    <div className="w-3 h-3 rounded-sm bg-primary/70" />
                    <div className="w-3 h-3 rounded-sm bg-primary" />
                    <span>More</span>
                </div>
            </div>
        </div>
    );
}
