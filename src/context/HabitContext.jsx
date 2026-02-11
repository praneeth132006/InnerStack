import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
    subscribeToHabits,
    addHabit as addHabitToDb,
    updateHabit as updateHabitInDb,
    deleteHabitFromDb,
} from "@/lib/databaseService";
import { formatDateLocal } from "@/lib/utils";

const HabitContext = createContext(null);

const getToday = () => formatDateLocal();

const getDayOfWeek = (dateStr) => {
    const d = new Date(dateStr);
    return d.getDay();
};

const isHabitDueOnDate = (habit, dateStr) => {
    // 1. Check if habit has ended
    if (habit.endsOption === "on" && habit.endsDate && dateStr > habit.endsDate) return false;
    if (habit.endsOption === "after" && habit.endsAfterCount) {
        const completions = Object.values(habit.history || {}).filter(Boolean).length;
        if (completions >= habit.endsAfterCount && !habit.history?.[dateStr]) return false;
    }

    // 2. Check if habit is in a repeat interval week (for custom/daily/weekly)
    if (habit.repeatInterval && habit.repeatInterval > 1 && habit.createdAt) {
        const start = new Date(habit.createdAt);
        start.setHours(0, 0, 0, 0);
        const current = new Date(dateStr);
        current.setHours(0, 0, 0, 0);

        // Calculate weeks since creation
        const msPerDay = 24 * 60 * 60 * 1000;
        const diffDays = Math.floor((current - start) / msPerDay);
        const weeksSince = Math.floor(diffDays / 7);

        if (weeksSince % habit.repeatInterval !== 0) return false;
    }

    // 3. Check frequency specific logic
    if (habit.frequency === "daily") return true;
    if (habit.frequency === "rest-day") return true; // Act like daily, streak logic handles the rest
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

const isRestrictedDay = (habit, dateStr) => {
    // A restricted day is one where the habit is NOT due according to its frequency settings
    // But we still allow viewing/logging with confirmation
    if (habit.frequency === "daily" || habit.frequency === "rest-day" || habit.frequency === "weekly") return false;
    if (habit.frequency === "one-time") return habit.targetDate !== dateStr;
    if (habit.frequency === "custom") {
        const isDue = isHabitDueOnDate(habit, dateStr);
        return !isDue;
    }
    return false;
};

export function HabitProvider({ children }) {
    const { user } = useAuth();
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const firebaseEnabled = isFirebaseConfigured();

    // Load data on user change
    useEffect(() => {
        if (!user) {
            setHabits([]);
            setLoading(false);
            return;
        }

        if (firebaseEnabled) {
            // Subscribe to Firebase Realtime Database
            const unsubHabits = subscribeToHabits(user.uid, (data) => {
                setHabits(data);
                setLoading(false);
            });
            return () => {
                unsubHabits();
            };
        } else {
            // Offline mode - use localStorage
            try {
                const savedHabits = localStorage.getItem(`innerstack-habits-${user.uid}`);
                setHabits(savedHabits ? JSON.parse(savedHabits) : []);
            } catch (err) {
                console.error("Error loading offline data:", err);
                setHabits([]);
            }
            setLoading(false);
        }
    }, [user, firebaseEnabled]);

    // Persist to localStorage in offline mode
    useEffect(() => {
        if (!firebaseEnabled && user) {
            localStorage.setItem(`innerstack-habits-${user.uid}`, JSON.stringify(habits));
        }
    }, [habits, user, firebaseEnabled]);

    const addHabit = useCallback(async (habit) => {
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
            repeatInterval: habit.repeatInterval || 1,
            endsOption: habit.endsOption || "never",
            endsDate: habit.endsDate || null,
            endsAfterCount: habit.endsAfterCount || 0,
            restDaysPerWeek: habit.restDaysPerWeek || 0,
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
    }, [firebaseEnabled, user]);

    const updateHabit = useCallback(async (id, updates) => {
        if (firebaseEnabled && user) {
            await updateHabitInDb(user.uid, id, updates);
        } else {
            setHabits((prev) =>
                prev.map((h) => (h.id === id ? { ...h, ...updates } : h))
            );
        }
    }, [firebaseEnabled, user]);

    const deleteHabit = useCallback(async (id) => {
        if (firebaseEnabled && user) {
            await deleteHabitFromDb(user.uid, id);
        } else {
            setHabits((prev) => prev.filter((h) => h.id !== id));
        }
    }, [firebaseEnabled, user]);

    const toggleHabitCompletion = useCallback(async (id, date = getToday()) => {
        const habit = habits.find((h) => h.id === id);
        if (!habit) return;

        const newHistory = { ...(habit.history || {}) };
        if (newHistory[date]) {
            delete newHistory[date];
        } else {
            newHistory[date] = true;
        }

        if (firebaseEnabled && user) {
            await updateHabitInDb(user.uid, id, { history: newHistory });
        } else {
            setHabits((prev) =>
                prev.map((h) => (h.id === id ? { ...h, history: newHistory } : h))
            );
        }
    }, [habits, firebaseEnabled, user]);

    const getHabitsForDate = useCallback((dateStr) => {
        return habits.filter((h) => isHabitDueOnDate(h, dateStr));
    }, [habits]);

    const getTodaysHabits = useCallback(() => getHabitsForDate(getToday()), [getHabitsForDate]);

    const getStreak = useCallback((habitId) => {
        const habit = habits.find((h) => h.id === habitId);
        if (!habit) return 0;

        let streak = 0;
        let date = new Date();
        let missesInCurrentWeek = 0;
        let daysInCurrentWindow = 0;

        for (let i = 0; i < 365; i++) {
            const dateStr = formatDateLocal(date);
            const isDue = isHabitDueOnDate(habit, dateStr);

            if (!isDue) {
                date.setDate(date.getDate() - 1);
                continue;
            }

            if (habit.history?.[dateStr]) {
                streak++;
                daysInCurrentWindow++;
                date.setDate(date.getDate() - 1);
            } else {
                // Handle Rest Day logic: allow 1 miss per 7 due-days window
                if (habit.frequency === "rest-day" && missesInCurrentWeek < (habit.restDaysPerWeek || 1)) {
                    missesInCurrentWeek++;
                    daysInCurrentWindow++;
                    date.setDate(date.getDate() - 1);
                    // Reset week counter every 7 check-points
                    if (daysInCurrentWindow >= 7) {
                        missesInCurrentWeek = 0;
                        daysInCurrentWindow = 0;
                    }
                    continue;
                }
                break;
            }

            if (daysInCurrentWindow >= 7) {
                missesInCurrentWeek = 0;
                daysInCurrentWindow = 0;
            }
        }
        return streak;
    }, [habits]);

    const getChainedHabits = useCallback((habitId) => {
        return habits.filter((h) => h.chainFromId === habitId);
    }, [habits]);

    const getAffectedByBreak = useCallback((habitId, dateStr = getToday()) => {
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
    }, [habits]);

    const getDailyLog = useCallback((date) => null, []); // Placeholder removed logic

    const getAllCompletionDates = useCallback(() => {
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
    }, [habits]);

    const value = {
        habits,
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
        getAllCompletionDates,
        isRestrictedDay,
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
