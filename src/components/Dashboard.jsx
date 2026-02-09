import { useState, useMemo } from "react";
import { useHabits } from "@/context/HabitContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AddHabitDialog } from "./AddHabitDialog";
import { HabitList } from "./HabitList";
import { CalendarHeatmap } from "./CalendarHeatmap";
import { DashboardStats } from "./DashboardStats";
import { HabitMatrix } from "./HabitMatrix"; // Replaces MonthCalendar and List view for history
import { Calendar, LayoutGrid, List } from "lucide-react";
import { formatDateLocal } from "@/lib/utils";

function getToday() {
    return formatDateLocal();
}

const VIEW_OPTIONS = [
    { value: "today", label: "Today" },
    // Week view removed as per request
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
    { value: "all", label: "All" },
];

export function Dashboard({ user }) {
    const { habits, getTodaysHabits } = useHabits();
    const [view, setView] = useState("today");
    const today = getToday();

    // Data filtering
    const todaysHabits = useMemo(() => getTodaysHabits(), [habits]);

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-black text-white selection:bg-primary/30">
            <div className="container mx-auto px-4 py-8 max-w-5xl animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">
                            Welcome back, <span className="text-primary">{user?.name || "Builder"}</span>
                        </h1>
                        <p className="text-slate-400 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        </p>
                    </div>
                    <AddHabitDialog />
                </div>

                {/* Yearly Activity Section (replacing red region) */}
                <div className="mb-8 p-6 rounded-2xl border border-white/10 bg-white/5 shadow-2xl animate-in slide-in-from-top-4 duration-700">
                    <CalendarHeatmap
                        title="Yearly Activity"
                        description="Your long-term consistency visualization."
                    />
                </div>

                {/* Stats Overview */}
                <div className="animate-in slide-in-from-bottom-2 duration-500 delay-100">
                    <DashboardStats habits={habits} />
                </div>

                {/* Main Content Area */}
                <div className="space-y-6 mt-8">
                    {/* View Switcher */}
                    <div className="flex items-center justify-between mb-6">
                        <Tabs value={view} onValueChange={setView} className="w-full">
                            <TabsList className="bg-white/5 border border-white/5 p-1 rounded-full h-12 w-full max-w-lg mx-auto md:mx-0">
                                {VIEW_OPTIONS.map((option) => (
                                    <TabsTrigger
                                        key={option.value}
                                        value={option.value}
                                        className="rounded-full data-[state=active]:bg-white/10 data-[state=active]:text-white text-slate-400 transition-all flex-1"
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
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <List className="h-5 w-5 text-primary" />
                                        Today's Tasks
                                    </h2>
                                    <span className="text-slate-400 text-sm">{todaysHabits.length} tasks</span>
                                </div>
                                <HabitList habits={todaysHabits} date={today} />
                            </div>
                        )}

                        {view === "month" && (
                            <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
                                <HabitMatrix habits={habits} mode="month" />
                            </div>
                        )}

                        {view === "year" && (
                            <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in space-y-8">
                                {habits.map((habit) => (
                                    <div key={habit.id} className="bg-white/5 p-6 rounded-2xl border border-white/5 shadow-xl hover:shadow-primary/5 transition-shadow duration-500">
                                        <CalendarHeatmap
                                            specificHabitId={habit.id}
                                            title={habit.name}
                                            description={`Consistency visualization for ${habit.name}.`}
                                        />
                                    </div>
                                ))}
                                {habits.length === 0 && (
                                    <div className="bg-white/5 p-12 rounded-2xl border border-white/5 text-center text-slate-500">
                                        No habits found. Start tracking to see yearly data!
                                    </div>
                                )}
                            </div>
                        )}

                        {view === "all" && (
                            <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <LayoutGrid className="h-5 w-5 text-primary" />
                                        All Habits
                                    </h2>
                                    <span className="text-slate-400 text-sm">{habits.length} total</span>
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
