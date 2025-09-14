import { useState, useEffect, useRef } from 'react';

interface MetronomeProps {
    isPlaying: boolean;
    bpm: number;
    beatsPerMeasure: number;
}

// How often the scheduler function runs to queue up new beats.
const SCHEDULER_INTERVAL_MS = 25;
// How far ahead of time to schedule audio events to prevent glitches.
const SCHEDULE_AHEAD_TIME_S = 0.1;

/**
 * A custom React hook that provides a precise metronome engine using the Web Audio API.
 * It handles scheduling of audio beats and provides visual feedback for the current beat.
 *
 * @param {MetronomeProps} props - The properties to configure the metronome.
 * @param {boolean} props.isPlaying - Whether the metronome should be playing.
 * @param {number} props.bpm - The tempo in beats per minute.
 * @param {number} props.beatsPerMeasure - The number of beats in a measure.
 * @returns {{currentBeat: number}} An object containing the current active beat number for UI display.
 */
export const useMetronome = ({ isPlaying, bpm, beatsPerMeasure }: MetronomeProps): { currentBeat: number; } => {
    const [currentBeat, setCurrentBeat] = useState<number>(0);
    const audioContextRef = useRef<AudioContext | null>(null);
    const schedulerTimerRef = useRef<number | null>(null);
    const nextBeatTimeRef = useRef<number>(0);
    const beatCounterRef = useRef<number>(1);
    const wasPlayingRef = useRef(false);

    // Schedules a single beat to be played at a precise time.
    const scheduleBeat = (beatNumber: number, time: number) => {
        if (!audioContextRef.current) return;

        const osc = audioContextRef.current.createOscillator();
        const envelope = audioContextRef.current.createGain();

        const isAccent = beatNumber === 1;
        osc.frequency.value = isAccent ? 880.0 : 440.0;
        envelope.gain.setValueAtTime(isAccent ? 1 : 0.5, time);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

        osc.connect(envelope);
        envelope.connect(audioContextRef.current.destination);

        osc.start(time);
        osc.stop(time + 0.05);
    };

    // The scheduler function, which runs on an interval to queue up upcoming beats.
    const scheduler = () => {
        if (!audioContextRef.current) return;

        // Continue scheduling beats as long as we are ahead of the current audio time.
        while (nextBeatTimeRef.current < audioContextRef.current.currentTime + SCHEDULE_AHEAD_TIME_S) {
            scheduleBeat(beatCounterRef.current, nextBeatTimeRef.current);

            // This timeout updates the visual state slightly after the audio has been scheduled.
            const visualBeatTime = (nextBeatTimeRef.current - audioContextRef.current.currentTime) * 1000;
            const beatToSet = beatCounterRef.current;
            setTimeout(() => {
                if (isPlaying) setCurrentBeat(beatToSet);
            }, visualBeatTime);

            const secondsPerBeat = 60.0 / bpm;
            nextBeatTimeRef.current += secondsPerBeat;
            beatCounterRef.current = (beatCounterRef.current % beatsPerMeasure) + 1;
        }
    };

    useEffect(() => {
        if (isPlaying) {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            // Resume AudioContext if it was suspended (e.g., by browser auto-play policy).
            if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }

            // If we are transitioning from a stopped to a playing state, reset the beat count.
            if (!wasPlayingRef.current) {
                beatCounterRef.current = 1;
                nextBeatTimeRef.current = audioContextRef.current.currentTime + 0.1;
            }

            schedulerTimerRef.current = window.setInterval(scheduler, SCHEDULER_INTERVAL_MS);
        } else {
            if (schedulerTimerRef.current) {
                clearInterval(schedulerTimerRef.current);
                schedulerTimerRef.current = null;
            }
            // Reset visual beat when stopped.
            setCurrentBeat(0);
        }

        // Store the current playing state for the next effect run to detect transitions.
        wasPlayingRef.current = isPlaying;

        return () => {
            if (schedulerTimerRef.current) {
                clearInterval(schedulerTimerRef.current);
            }
        };
        // This effect hook re-runs when isPlaying, bpm, or beatsPerMeasure changes.
        // This is the desired behavior, as it ensures the scheduler is always using the latest values.
        // The linter might flag `scheduler` as a missing dependency, but its dependencies (bpm, etc.) are already in the array,
        // making the effect implicitly dependent on a fresh scheduler function on each relevant render.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying, bpm, beatsPerMeasure]);

    return { currentBeat };
};