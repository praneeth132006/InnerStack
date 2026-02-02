import {
    ref,
    set,
    get,
    update,
    remove,
    onValue,
    push,
    serverTimestamp,
} from "firebase/database";
import { database, isFirebaseConfigured } from "./firebase";

/**
 * Get all habits for a user
 */
export async function getHabits(userId) {
    if (!isFirebaseConfigured() || !userId) return [];

    const habitsRef = ref(database, `users/${userId}/habits`);
    const snapshot = await get(habitsRef);
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    return Object.keys(data).map((id) => ({ id, ...data[id] }));
}

/**
 * Add a new habit
 */
export async function addHabit(userId, habit) {
    if (!isFirebaseConfigured() || !userId) return null;

    const habitsRef = ref(database, `users/${userId}/habits`);
    const newHabitRef = push(habitsRef);
    const habitData = {
        ...habit,
        id: newHabitRef.key,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
    await set(newHabitRef, habitData);
    return habitData;
}

/**
 * Update a habit
 */
export async function updateHabit(userId, habitId, updates) {
    if (!isFirebaseConfigured() || !userId) return;

    const habitRef = ref(database, `users/${userId}/habits/${habitId}`);
    await update(habitRef, {
        ...updates,
        updatedAt: Date.now(),
    });
}

/**
 * Delete a habit
 */
export async function deleteHabitFromDb(userId, habitId) {
    if (!isFirebaseConfigured() || !userId) return;

    const habitRef = ref(database, `users/${userId}/habits/${habitId}`);
    await remove(habitRef);
}

/**
 * Subscribe to habits changes (real-time)
 */
export function subscribeToHabits(userId, callback) {
    if (!isFirebaseConfigured() || !userId) {
        callback([]);
        return () => { };
    }

    const habitsRef = ref(database, `users/${userId}/habits`);
    const unsubscribe = onValue(habitsRef, (snapshot) => {
        if (!snapshot.exists()) {
            callback([]);
            return;
        }
        const data = snapshot.val();
        const habits = Object.keys(data).map((id) => ({ id, ...data[id] }));
        callback(habits);
    });

    return unsubscribe;
}

/**
 * Get daily logs for a user
 */
export async function getDailyLogs(userId) {
    if (!isFirebaseConfigured() || !userId) return {};

    const logsRef = ref(database, `users/${userId}/dailyLogs`);
    const snapshot = await get(logsRef);
    return snapshot.exists() ? snapshot.val() : {};
}

/**
 * Save a daily log
 */
export async function saveDailyLog(userId, date, logData) {
    if (!isFirebaseConfigured() || !userId) return;

    const logRef = ref(database, `users/${userId}/dailyLogs/${date}`);
    await set(logRef, {
        ...logData,
        date,
        updatedAt: Date.now(),
    });
}

/**
 * Subscribe to daily logs changes (real-time)
 */
export function subscribeToDailyLogs(userId, callback) {
    if (!isFirebaseConfigured() || !userId) {
        callback({});
        return () => { };
    }

    const logsRef = ref(database, `users/${userId}/dailyLogs`);
    const unsubscribe = onValue(logsRef, (snapshot) => {
        callback(snapshot.exists() ? snapshot.val() : {});
    });

    return unsubscribe;
}

/**
 * Save user profile data
 */
export async function saveUserProfile(userId, profileData) {
    if (!isFirebaseConfigured() || !userId) return;

    const profileRef = ref(database, `users/${userId}/profile`);
    await set(profileRef, {
        ...profileData,
        updatedAt: Date.now(),
    });
}

/**
 * Get user profile data
 */
export async function getUserProfile(userId) {
    if (!isFirebaseConfigured() || !userId) return null;

    const profileRef = ref(database, `users/${userId}/profile`);
    const snapshot = await get(profileRef);
    return snapshot.exists() ? snapshot.val() : null;
}
