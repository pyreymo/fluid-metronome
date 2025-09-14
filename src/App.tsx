import React, { useState, useCallback } from 'react';
import { useMetronome } from './hooks/useMetronome';
import { useTapTempo } from './hooks/useTapTempo';
import Visualizer from './components/Visualizer';
import Controls from './components/Controls';
import { Rhythm } from './types';


// Defines the available rhythm patterns for the metronome.
const RHYTHMS: Rhythm[] = [
    { label: '2/4', beatsPerMeasure: 2 },
    { label: '3/4', beatsPerMeasure: 3 },
    { label: '4/4', beatsPerMeasure: 4 },
    { label: '6/8', beatsPerMeasure: 6 },
];

// Defines the operational range for the BPM slider.
const MIN_BPM = 40;
const MAX_BPM = 240;

/**
 * The main application component for the Fluid Metronome.
 * It manages the core state of the metronome such as BPM, rhythm, and playback status,
 * and orchestrates the interaction between the controls and the visualizer.
 */
const App: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [bpm, setBpm] = useState<number>(120);
    const [activeRhythm, setActiveRhythm] = useState<Rhythm>(RHYTHMS[2]); // Default to 4/4

    const { currentBeat } = useMetronome({
        isPlaying,
        bpm,
        beatsPerMeasure: activeRhythm.beatsPerMeasure,
    });

    const handleBpmChange = useCallback((newBpm: number) => {
        // Clamp the BPM value within the allowed min/max range.
        setBpm(Math.max(MIN_BPM, Math.min(MAX_BPM, Math.round(newBpm))));
    }, []);

    const { tap } = useTapTempo(handleBpmChange);

    const handleTogglePlay = useCallback(() => {
        setIsPlaying(prev => !prev);
    }, []);

    const handleRhythmChange = useCallback((rhythm: Rhythm) => {
        setActiveRhythm(rhythm);
    }, []);

    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-transparent text-slate-200 select-none overflow-hidden p-4 md:p-8">
            <main className="flex flex-col items-center justify-center gap-4 w-full max-w-md">
                <Visualizer
                    currentBeat={currentBeat}
                    isPlaying={isPlaying}
                />
                <Controls
                    bpm={bpm}
                    minBpm={MIN_BPM}
                    maxBpm={MAX_BPM}
                    onBpmChange={handleBpmChange}
                    isPlaying={isPlaying}
                    onTogglePlay={handleTogglePlay}
                    activeRhythm={activeRhythm}
                    rhythms={RHYTHMS}
                    onRhythmChange={handleRhythmChange}
                    onTap={tap}
                />
            </main>
        </div>
    );
};

export default App;