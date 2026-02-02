import { useState, useMemo } from "react";
import { useHabits } from "@/context/HabitContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Smile, Frown, Meh, Zap, Brain } from "lucide-react";
import { format, parseISO, subDays, subMonths, isAfter, isValid } from "date-fns";

const MOOD_ICONS = {
    1: { icon: Frown, label: "Bad", color: "text-red-500", bg: "bg-red-500/10" },
    2: { icon: Frown, label: "Low", color: "text-orange-500", bg: "bg-orange-500/10" },
    3: { icon: Meh, label: "Okay", color: "text-yellow-500", bg: "bg-yellow-500/10" },
    4: { icon: Smile, label: "Good", color: "text-lime-500", bg: "bg-lime-500/10" },
    5: { icon: Smile, label: "Great", color: "text-green-500", bg: "bg-green-500/10" },
};

export function MoodHistory({ isOpen, onClose }) {
    const { dailyLogs } = useHabits();
    const [filter, setFilter] = useState("week"); // week, month, all

    // Get sorted log entries
    const sortedLogs = useMemo(() => {
        if (!dailyLogs) return [];

        const entries = Object.entries(dailyLogs)
            .map(([date, log]) => ({ date, ...log }))
            .filter(item => item && item.date)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        const today = new Date();
        const weekAgo = subDays(today, 7);
        const monthAgo = subMonths(today, 1);

        if (filter === "week") {
            return entries.filter(log => {
                const logDate = parseISO(log.date);
                return isValid(logDate) && isAfter(logDate, weekAgo);
            });
        }
        if (filter === "month") {
            return entries.filter(log => {
                const logDate = parseISO(log.date);
                return isValid(logDate) && isAfter(logDate, monthAgo);
            });
        }
        return entries;
    }, [dailyLogs, filter]);

    if (!isOpen) return null;

    return (
        <Card className="border-none shadow-lg bg-card/95 backdrop-blur-sm mt-4 animate-in slide-in-from-top duration-300">
            <CardHeader className="pb-3 pt-4 px-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <History className="h-4 w-4 text-primary" />
                        Mood History
                    </CardTitle>
                    <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
                        <Button
                            variant={filter === "week" ? "secondary" : "ghost"}
                            size="sm"
                            className="h-6 text-xs px-2"
                            onClick={() => setFilter("week")}
                        >
                            Week
                        </Button>
                        <Button
                            variant={filter === "month" ? "secondary" : "ghost"}
                            size="sm"
                            className="h-6 text-xs px-2"
                            onClick={() => setFilter("month")}
                        >
                            Month
                        </Button>
                        <Button
                            variant={filter === "all" ? "secondary" : "ghost"}
                            size="sm"
                            className="h-6 text-xs px-2"
                            onClick={() => setFilter("all")}
                        >
                            All
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                {sortedLogs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No mood logs found for this period.</p>
                    </div>
                ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {sortedLogs.map((log) => {
                            const moodData = MOOD_ICONS[log.mood] || MOOD_ICONS[3];
                            const MoodIcon = moodData.icon;
                            let dateDisplay = "Invalid Date";
                            try {
                                dateDisplay = format(parseISO(log.date), "EEE, MMM d");
                            } catch (e) {
                                console.error("Invalid date:", log.date);
                            }

                            return (
                                <div
                                    key={log.date}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/80 transition-colors border border-transparent hover:border-border"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${moodData.bg} shrink-0`}>
                                            <MoodIcon className={`h-4 w-4 ${moodData.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{dateDisplay}</p>
                                            <p className="text-xs text-muted-foreground">{moodData.label}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-medium">
                                        <div className="flex flex-col items-end gap-0.5">
                                            <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500">
                                                <Zap className="h-3 w-3" />
                                                <span>{log.energy}%</span>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Energy</span>
                                        </div>
                                        <div className="w-px h-6 bg-border" />
                                        <div className="flex flex-col items-end gap-0.5">
                                            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-500">
                                                <span>😵‍💫</span>
                                                <span>{log.stress}%</span>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Stress</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
