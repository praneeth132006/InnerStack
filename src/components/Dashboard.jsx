import { useState, useMemo } from "react";
import { useHabits } from "@/context/HabitContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddHabitDialog } from "./AddHabitDialog";
import { HabitList } from "./HabitList";
import { MoodTracker } from "./MoodTracker";
import { CalendarHeatmap } from "./CalendarHeatmap";
import { Target, Calendar, TrendingUp } from "lucide-react";

function getToday() {
    return new Date().toISOString().split("T")[0];
}

function getWeekDates() {
    const dates = [];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);

    for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
}

function getMonthDates() {
    const dates = [];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        dates.push(new Date(year, month, i).toISOString().split("T")[0]);
    }
    return dates;
}

export function Dashboard({ user }) {
    const { habits, getTodaysHabits, getHabitsForDate } = useHabits();
    const [view, setView] = useState("today");
    const today = getToday();

    const todaysHabits = useMemo(() => getTodaysHabits(), [habits]);

    const weekHabits = useMemo(() => {
        const weekDates = getWeekDates();
        const habitSet = new Map();
        weekDates.forEach((date) => {
            getHabitsForDate(date).forEach((h) => {
                if (!habitSet.has(h.id)) habitSet.set(h.id, h);
            });
        });
        return Array.from(habitSet.values());
    }, [habits]);

    const monthHabits = useMemo(() => {
        const monthDates = getMonthDates();
        const habitSet = new Map();
        monthDates.forEach((date) => {
            getHabitsForDate(date).forEach((h) => {
                if (!habitSet.has(h.id)) habitSet.set(h.id, h);
            });
        });
        return Array.from(habitSet.values());
    }, [habits]);

    const completedToday = todaysHabits.filter((h) => h.history && h.history[today]).length;
    const totalToday = todaysHabits.length;
    const progressPercent = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold">
                        Welcome back, <span className="text-primary">{user?.name || "User"}</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </p>
                </div>
                <AddHabitDialog />
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card className="border-none shadow-sm bg-gradient-to-br from-primary/10 to-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Today's Progress</CardTitle>
                        <Target className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{progressPercent}%</div>
                        <p className="text-xs text-muted-foreground">{completedToday} of {totalToday} habits</p>
                        <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Habits</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{habits.length}</div>
                        <p className="text-xs text-muted-foreground">Active habits</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Streak</CardTitle>
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-500">🔥</div>
                        <p className="text-xs text-muted-foreground">Keep it up!</p>
                    </CardContent>
                </Card>
            </div>

            {/* Heatmap */}
            <Card className="border-none shadow-md mb-8 overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-lg">Your Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <CalendarHeatmap />
                </CardContent>
            </Card>

            {/* Main Content - Two Column Layout */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Habits Section */}
                <div className="lg:col-span-2">
                    <Tabs value={view} onValueChange={setView} className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="today">Today</TabsTrigger>
                            <TabsTrigger value="week">This Week</TabsTrigger>
                            <TabsTrigger value="month">This Month</TabsTrigger>
                            <TabsTrigger value="all">All</TabsTrigger>
                        </TabsList>

                        <TabsContent value="today">
                            <HabitList habits={todaysHabits} date={today} />
                        </TabsContent>

                        <TabsContent value="week">
                            <HabitList habits={weekHabits} date={today} />
                        </TabsContent>

                        <TabsContent value="month">
                            <HabitList habits={monthHabits} date={today} />
                        </TabsContent>

                        <TabsContent value="all">
                            <HabitList habits={habits} date={today} />
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar - Mood Tracker */}
                <div className="space-y-6">
                    <MoodTracker />
                </div>
            </div>
        </div>
    );
}
