/**
 * @file activityLogger.js
 * @description Advanced, optimized utility for tracking user activity in Local Storage.
 * Maintains a rolling buffer of the latest 50 records.
 */

const STORAGE_KEY = "activity_logs";
const MAX_RECORDS = 50;
const EVENT_NAME = "activityLogUpdated";

/**
 * Retrieves the current list of activity logs from Local Storage.
 * @returns {Array} Array of log objects.
 */
export const getLogs = () => {
    try {
        const storedLogs = localStorage.getItem(STORAGE_KEY);
        return storedLogs ? JSON.parse(storedLogs) : [];
    } catch (error) {
        console.error("Error reading activity logs:", error);
        return [];
    }
};

/**
 * Logs a new activity action with the current date and time.
 * Automatically limits the storage to the latest 50 records.
 * Dispatches a custom event for real-time UI updates.
 * 
 * @param {string} actionName - The description of the action (e.g., "Sil Buz Pressed").
 */
export const logActivity = (actionName) => {
    if (!actionName || typeof actionName !== "string") {
        console.warn("Invalid action name provided to logActivity.");
        return;
    }

    try {
        const logs = getLogs();
        const now = new Date();

        const newEntry = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2), // Unique ID
            action: actionName.trim(),
            date: now.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }),
            time: now.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
        };

        // Add to the beginning (latest first)
        logs.unshift(newEntry);

        // Enforce the 50-record limit
        if (logs.length > MAX_RECORDS) {
            logs.length = MAX_RECORDS; // efficient truncation
        }

        // Save optimized result
        localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));

        // Trigger real-time update in all listening components
        window.dispatchEvent(new Event(EVENT_NAME));

    } catch (error) {
        console.error("Error saving activity log:", error);
    }
};

/**
 * Subscribes a callback function to activity log updates.
 * Useful for React components to stay in sync.
 * @param {Function} callback - Function to run when logs update.
 * @returns {Function} Unsubscribe function.
 */
export const subscribeToLogs = (callback) => {
    const handler = () => callback(getLogs());
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
};
