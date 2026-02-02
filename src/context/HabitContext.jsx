import { createContext, useContext, useState, useEffect } from "react";

const HabitContext = createContext(null);

const getToday = () => new Date().toISOString().split("T")[0];

const getDayOfWeek = (dateStr) => {
    const d = new Date(dateStr);
    return d.getDay(); // 0 = Sunday, 1 = Monday, etc.
};

const isHabitDueOnDate = (habit, dateStr) => {
    if (habit.frequency === "daily") return true;
    if (habit.frequency === "one-time") {
        return habit.targetDate === dateStr && !habit.history[dateStr];
    }
    if (habit.frequency === "weekly") {
        // Due any day of the week, user completes targetCount times
        return true;
    }
    if (habit.frequency === "custom") {
        const dayOfWeek = getDayOfWeek(dateStr);
        return habit.customDays?.includes(dayOfWeek);
    }
    return false;
};

export function HabitProvider({ children }) {
    const [habits, setHabits] = useState(() => {
        const saved = localStorage.getItem("innerstack-habits-v2");
        return saved ? JSON.parse(saved) : [];
    });

    const [dailyLogs, setDailyLogs] = useState(() => {
        const saved = localStorage.getItem("innerstack-daily-logs");
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem("innerstack-habits-v2", JSON.stringify(habits));
    }, [habits]);

    useEffect(() => {
        localStorage.setItem("innerstack-daily-logs", JSON.stringify(dailyLogs));
    }, [dailyLogs]);

    const addHabit = (habit) => {
        const newHabit = {
            id: Date.now().toString(),
            name: habit.name,
            description: habit.description || "",
            icon: habit.icon || "🎯",
            frequency: habit.frequency || "daily",
            customDays: habit.customDays || [],
            targetCount: habit.targetCount || 1, // For weekly habits
            targetDate: habit.targetDate || null, // For one-time habits
            chainFromId: habit.chainFromId || null,
            category: habit.category || "general",
            history: {},
            createdAt: new Date().toISOString(),
        };
        setHabits((prev) => [...prev, newHabit]);
        return newHabit;
    };

    const updateHabit = (id, updates) => {
        setHabits((prev) =>
            prev.map((h) => (h.id === id ? { ...h, ...updates } : h))
        );
    };

    const deleteHabit = (id) => {
        setHabits((prev) => prev.filter((h) => h.id !== id));
    };

    const toggleHabitCompletion = (id, date = getToday()) => {
        setHabits((prev) =>
            prev.map((h) => {
                if (h.id === id) {
                    const newHistory = { ...h.history };
                    if (newHistory[date]) {
                        delete newHistory[date];
                    } else {
                        newHistory[date] = true;
                    }
                    return { ...h, history: newHistory };
                }
                return h;
            })
        );
    };

    const getHabitsForDate = (dateStr) => {
        return habits.filter((h) => isHabitDueOnDate(h, dateStr));
    };

    const getTodaysHabits = () => getHabitsForDate(getToday());

    const getStreak = (habitId) => {
        const habit = habits.find((h) => h.id === habitId);
        if (!habit) return 0;

        let streak = 0;
        let date = new Date();

        while (true) {
            const dateStr = date.toISOString().split("T")[0];
            if (!isHabitDueOnDate(habit, dateStr)) {
                date.setDate(date.getDate() - 1);
                continue;
            }
            if (habit.history[dateStr]) {
                streak++;
                date.setDate(date.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    };

    const getChainedHabits = (habitId) => {
        return habits.filter((h) => h.chainFromId === habitId);
    };

    const getAffectedByBreak = (habitId, dateStr = getToday()) => {
        const habit = habits.find((h) => h.id === habitId);
        if (!habit || habit.history[dateStr]) return [];

        // Find all habits that chain from this one
        const affected = [];
        const findChained = (id) => {
            const chained = habits.filter((h) => h.chainFromId === id);
            chained.forEach((h) => {
                affected.push(h);
                findChained(h.id);
            });
        };
        findChained(habitId);
        return affected;
    };

    const logDailyStats = (date, stats) => {
        setDailyLogs((prev) => ({
            ...prev,
            [date]: { ...prev[date], ...stats, date },
        }));
    };

    const getDailyLog = (date) => {
        return dailyLogs[date] || null;
    };

    const getAllCompletionDates = () => {
        const dates = {};
        habits.forEach((habit) => {
            Object.keys(habit.history).forEach((date) => {
                if (habit.history[date]) {
                    dates[date] = (dates[date] || 0) + 1;
                }
            });
        });
        return dates;
    };

    const value = {
        habits,
        dailyLogs,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitCompletion,
        getHabitsForDate,
        getTodaysHabits,
        getStreak,
        getChainedHabits,
        getAffectedByBreak,
        logDailyStats,
        getDailyLog,
        getAllCompletionDates,
    };

    return (
        <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
    );
}

export const useHabits = () => {
    const context = useContext(HabitContext);
    if (!context) {
        throw new Error("useHabits must be used within a HabitProvider");
    }
    return context;
};
