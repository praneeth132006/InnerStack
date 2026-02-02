import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
    subscribeToHabits,
    addHabit as addHabitToDb,
    updateHabit as updateHabitInDb,
    deleteHabitFromDb,
    subscribeToDailyLogs,
    saveDailyLog,
} from "@/lib/databaseService";

const HabitContext = createContext(null);

const getToday = () => new Date().toISOString().split("T")[0];

const getDayOfWeek = (dateStr) => {
    const d = new Date(dateStr);
    return d.getDay();
};

const isHabitDueOnDate = (habit, dateStr) => {
    if (habit.frequency === "daily") return true;
    if (habit.frequency === "one-time") {
        return habit.targetDate === dateStr && !habit.history?.[dateStr];
    }
    if (habit.frequency === "weekly") return true;
    if (habit.frequency === "custom") {
        const dayOfWeek = getDayOfWeek(dateStr);
        return habit.customDays?.includes(dayOfWeek);
    }
    return false;
};

export function HabitProvider({ children }) {
    const { user } = useAuth();
    const [habits, setHabits] = useState([]);
    const [dailyLogs, setDailyLogs] = useState({});
    const [loading, setLoading] = useState(true);
    const firebaseEnabled = isFirebaseConfigured();

    // Load data on user change
    useEffect(() => {
        if (!user) {
            setHabits([]);
            setDailyLogs({});
            setLoading(false);
            return;
        }

        if (firebaseEnabled) {
            // Subscribe to Firebase Realtime Database
            const unsubHabits = subscribeToHabits(user.uid, (data) => {
                setHabits(data);
                setLoading(false);
            });
            const unsubLogs = subscribeToDailyLogs(user.uid, setDailyLogs);
            return () => {
                unsubHabits();
                unsubLogs();
            };
        } else {
            // Offline mode - use localStorage
            const savedHabits = localStorage.getItem(`innerstack-habits-${user.uid}`);
            const savedLogs = localStorage.getItem(`innerstack-logs-${user.uid}`);
            setHabits(savedHabits ? JSON.parse(savedHabits) : []);
            setDailyLogs(savedLogs ? JSON.parse(savedLogs) : {});
            setLoading(false);
        }
    }, [user, firebaseEnabled]);

    // Persist to localStorage in offline mode
    useEffect(() => {
        if (!firebaseEnabled && user) {
            localStorage.setItem(`innerstack-habits-${user.uid}`, JSON.stringify(habits));
        }
    }, [habits, user, firebaseEnabled]);

    useEffect(() => {
        if (!firebaseEnabled && user) {
            localStorage.setItem(`innerstack-logs-${user.uid}`, JSON.stringify(dailyLogs));
        }
    }, [dailyLogs, user, firebaseEnabled]);

    const addHabit = async (habit) => {
        const newHabit = {
            name: habit.name,
            description: habit.description || "",
            icon: habit.icon || "🎯",
            frequency: habit.frequency || "daily",
            customDays: habit.customDays || [],
            targetCount: habit.targetCount || 1,
            targetDate: habit.targetDate || null,
            chainFromId: habit.chainFromId || null,
            category: habit.category || "general",
            history: {},
        };

        if (firebaseEnabled && user) {
            await addHabitToDb(user.uid, newHabit);
        } else {
            const localHabit = {
                ...newHabit,
                id: Date.now().toString(),
                createdAt: Date.now(),
            };
            setHabits((prev) => [...prev, localHabit]);
        }
    };

    const updateHabit = async (id, updates) => {
        if (firebaseEnabled && user) {
            await updateHabitInDb(user.uid, id, updates);
        } else {
            setHabits((prev) =>
                prev.map((h) => (h.id === id ? { ...h, ...updates } : h))
            );
        }
    };

    const deleteHabit = async (id) => {
        if (firebaseEnabled && user) {
            await deleteHabitFromDb(user.uid, id);
        } else {
            setHabits((prev) => prev.filter((h) => h.id !== id));
        }
    };

    const toggleHabitCompletion = async (id, date = getToday()) => {
        const habit = habits.find((h) => h.id === id);
        if (!habit) return;

        const newHistory = { ...(habit.history || {}) };
        if (newHistory[date]) {
            delete newHistory[date];
        } else {
            newHistory[date] = true;
        }

        await updateHabit(id, { history: newHistory });
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

        for (let i = 0; i < 365; i++) {
            const dateStr = date.toISOString().split("T")[0];
            if (!isHabitDueOnDate(habit, dateStr)) {
                date.setDate(date.getDate() - 1);
                continue;
            }
            if (habit.history?.[dateStr]) {
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
        if (!habit || habit.history?.[dateStr]) return [];

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

    const logDailyStats = async (date, stats) => {
        if (firebaseEnabled && user) {
            await saveDailyLog(user.uid, date, stats);
        } else {
            setDailyLogs((prev) => ({
                ...prev,
                [date]: { ...prev[date], ...stats, date },
            }));
        }
    };

    const getDailyLog = (date) => dailyLogs[date] || null;

    const getAllCompletionDates = () => {
        const dates = {};
        habits.forEach((habit) => {
            if (habit.history) {
                Object.keys(habit.history).forEach((date) => {
                    if (habit.history[date]) {
                        dates[date] = (dates[date] || 0) + 1;
                    }
                });
            }
        });
        return dates;
    };

    const value = {
        habits,
        dailyLogs,
        loading,
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
