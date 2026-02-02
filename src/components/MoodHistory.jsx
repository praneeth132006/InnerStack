import { useState, useMemo } from "react";
import { useHabits } from "@/context/HabitContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Calendar, Smile, Frown, Meh, Zap, ChevronDown, ChevronUp } from "lucide-react";

const MOOD_ICONS = {
    1: { icon: Frown, label: "Bad", color: "text-red-500", bg: "bg-red-500/10" },
    2: { icon: Frown, label: "Low", color: "text-orange-500", bg: "bg-orange-500/10" },
    3: { icon: Meh, label: "Okay", color: "text-yellow-500", bg: "bg-yellow-500/10" },
    4: { icon: Smile, label: "Good", color: "text-lime-500", bg: "bg-lime-500/10" },
    5: { icon: Smile, label: "Great", color: "text-green-500", bg: "bg-green-500/10" },
};

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function MoodHistory({ isOpen, onClose }) {
    const { dailyLogs } = useHabits();
    const [filter, setFilter] = useState("week"); // week, month, all

    // Get sorted log entries
    const sortedLogs = useMemo(() => {
        const entries = Object.entries(dailyLogs)
            .map(([date, log]) => ({ date, ...log }))
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);

        if (filter === "week") {
            return entries.filter(log => new Date(log.date) >= weekAgo);
        }
        if (filter === "month") {
            return entries.filter(log => new Date(log.date) >= monthAgo);
        }
        return entries;
    }, [dailyLogs, filter]);

    if (!isOpen) return null;

    return (
        <Card className="border-none shadow-lg bg-card/80 backdrop-blur-sm mt-4 animate-in slide-in-from-top duration-300">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <History className="h-4 w-4 text-primary" />
                        Mood History
                    </CardTitle>
                    <div className="flex items-center gap-1">
                        <Button
                            variant={filter === "week" ? "secondary" : "ghost"}
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => setFilter("week")}
                        >
                            Week
                        </Button>
                        <Button
                            variant={filter === "month" ? "secondary" : "ghost"}
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => setFilter("month")}
                        >
                            Month
                        </Button>
                        <Button
                            variant={filter === "all" ? "secondary" : "ghost"}
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => setFilter("all")}
                        >
                            All
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {sortedLogs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        No mood logs yet. Start tracking your mood above!
                    </p>
                ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                        {sortedLogs.map((log) => {
                            const moodData = MOOD_ICONS[log.mood] || MOOD_ICONS[3];
                            const MoodIcon = moodData.icon;
                            return (
                                <div
                                    key={log.date}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${moodData.bg}`}>
                                            <MoodIcon className={`h-4 w-4 ${moodData.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{formatDate(log.date)}</p>
                                            <p className="text-xs text-muted-foreground">{moodData.label}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs">
                                        <div className="flex items-center gap-1">
                                            <Zap className="h-3 w-3 text-yellow-500" />
                                            <span>{log.energy}%</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>😵‍💫</span>
                                            <span>{log.stress}%</span>
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
