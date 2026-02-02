import { useState, useMemo } from "react";
import { useHabits } from "@/context/HabitContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AddHabitDialog } from "./AddHabitDialog";
import { HabitList } from "./HabitList";
import { CalendarHeatmap } from "./CalendarHeatmap";
import { Calendar } from "lucide-react";

function getToday() {
    return new Date().toISOString().split("T")[0];
}

const VIEW_OPTIONS = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "all", label: "All Habits" },
];

export function Dashboard({ user }) {
    const { habits, getTodaysHabits } = useHabits();
    const [view, setView] = useState("today");
    const today = getToday();

    // Data filtering
    const todaysHabits = useMemo(() => getTodaysHabits(), [habits]);

    // For 'Week' view, currently we just show all active habits (future: specific weekly schedule)
    const activeHabits = habits;

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-background">
            <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">
                            Hello, <span className="text-primary">{user?.name || "Builder"}</span>
                        </h1>
                        <p className="text-muted-foreground text-lg flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        </p>
                    </div>
                    <AddHabitDialog />
                </div>

                {/* Main Content Area */}
                <div className="space-y-8">
                    {/* Centered View Switcher */}
                    <div className="flex justify-center mb-8">
                        <Tabs value={view} onValueChange={setView} className="w-full max-w-md">
                            <TabsList className="grid w-full grid-cols-4 h-12 bg-muted/50 p-1 rounded-full">
                                {VIEW_OPTIONS.map((option) => (
                                    <TabsTrigger
                                        key={option.value}
                                        value={option.value}
                                        className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                                    >
                                        {option.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Content Views */}
                    <div className="min-h-[400px]">
                        {view === "today" && (
                            <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">Today's Tasks</h2>
                                    <span className="text-muted-foreground text-sm">{todaysHabits.length} tasks</span>
                                </div>
                                <HabitList habits={todaysHabits} date={today} />
                            </div>
                        )}

                        {view === "week" && (
                            <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
                                <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-muted">
                                    <h3 className="text-lg font-medium">Weekly Overview</h3>
                                    <p className="text-muted-foreground mb-6">Here are all your active habits for the week.</p>
                                    <HabitList habits={activeHabits} date={today} />
                                </div>
                            </div>
                        )}

                        {view === "month" && (
                            <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
                                <div className="bg-muted/10 p-6 rounded-2xl border border-muted/20">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold mb-1">Monthly Activity</h2>
                                        <p className="text-muted-foreground">Visualize your consistency over time.</p>
                                    </div>
                                    <CalendarHeatmap />
                                </div>
                            </div>
                        )}

                        {view === "all" && (
                            <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">All Habits</h2>
                                    <span className="text-muted-foreground text-sm">{habits.length} total</span>
                                </div>
                                <HabitList habits={habits} date={today} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
