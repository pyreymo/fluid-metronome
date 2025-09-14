import { useRef, useCallback } from 'react';

const MAX_TAPS = 4; // Number of recent taps to average for a stable BPM.
const RESET_TIMEOUT_MS = 2000; // Reset tap history after 2 seconds of inactivity.

/**
 * A custom React hook that calculates BPM based on user tap inputs.
 * It averages the time between recent taps to determine the tempo.
 *
 * @param {(bpm: number) => void} onBpmChange - A callback function to be invoked with the new calculated BPM.
 * @returns {{tap: () => void}} An object containing the tap function to be called on each user tap.
 */
export const useTapTempo = (onBpmChange: (bpm: number) => void): { tap: () => void; } => {
    const tapTimestamps = useRef<number[]>([]);
    const timeoutRef = useRef<number | null>(null);

    const tap = useCallback(() => {
        const now = Date.now();
        tapTimestamps.current.push(now);

        // Keep only the last few taps to average.
        if (tapTimestamps.current.length > MAX_TAPS) {
            tapTimestamps.current.shift();
        }

        // Calculate BPM if we have at least two taps.
        if (tapTimestamps.current.length > 1) {
            const intervals = [];
            for (let i = 1; i < tapTimestamps.current.length; i++) {
                intervals.push(tapTimestamps.current[i] - tapTimestamps.current[i - 1]);
            }
            const averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            if (averageInterval > 0) {
                const bpm = Math.round(60000 / averageInterval);
                onBpmChange(bpm);
            }
        }

        // Reset the tap history after a period of inactivity.
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
            tapTimestamps.current = [];
        }, RESET_TIMEOUT_MS);

    }, [onBpmChange]);

    return { tap };
};