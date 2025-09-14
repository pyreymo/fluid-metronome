import React, { useCallback } from 'react';
import { Rhythm } from '../types';

/** Props for the Controls component. */
interface ControlsProps {
    bpm: number;
    minBpm: number;
    maxBpm: number;
    onBpmChange: (bpm: number) => void;
    isPlaying: boolean;
    onTogglePlay: () => void;
    activeRhythm: Rhythm;
    rhythms: Rhythm[];
    onRhythmChange: (rhythm: Rhythm) => void;
    onTap: () => void;
}

/**
 * Gets the traditional Italian tempo marking for a given BPM.
 * @param {number} bpm - The beats per minute.
 * @returns {string} The tempo marking (e.g., "Allegro").
 */
const getTempoMarking = (bpm: number): string => {
    if (bpm < 60) return 'Largo';
    if (bpm < 66) return 'Larghetto';
    if (bpm < 76) return 'Adagio';
    if (bpm < 108) return 'Andante';
    if (bpm < 120) return 'Moderato';
    if (bpm < 168) return 'Allegro';
    if (bpm < 200) return 'Presto';
    return 'Prestissimo';
};


/**
 * The main user interface panel for controlling the metronome.
 * It includes controls for BPM, play/stop, tap tempo, and beats per measure.
 */
const Controls: React.FC<ControlsProps> = ({
    bpm,
    minBpm,
    maxBpm,
    onBpmChange,
    isPlaying,
    onTogglePlay,
    activeRhythm,
    rhythms,
    onRhythmChange,
    onTap
}) => {
    const handleSliderChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onBpmChange(Number(event.target.value));
    }, [onBpmChange]);

    const currentIndex = rhythms.findIndex(r => r.label === activeRhythm.label);
    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex < rhythms.length - 1;

    const handlePrevRhythm = useCallback(() => {
        if (canGoPrev) {
            onRhythmChange(rhythms[currentIndex - 1]);
        }
    }, [canGoPrev, currentIndex, onRhythmChange, rhythms]);

    const handleNextRhythm = useCallback(() => {
        if (canGoNext) {
            onRhythmChange(rhythms[currentIndex + 1]);
        }
    }, [canGoNext, currentIndex, onRhythmChange, rhythms]);

    return (
        <div className="bg-slate-800/50 rounded-2xl p-6 md:p-8 w-full max-w-md backdrop-blur-sm border border-slate-700/50">
            <div className="flex flex-col items-center justify-center gap-6">

                {/* BPM Display */}
                <div className="flex flex-col items-center">
                    <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">BPM</span>
                    <span className="text-7xl md:text-8xl font-bold tracking-tighter text-white -my-2">{bpm}</span>
                    <span className="text-lg text-slate-300">{getTempoMarking(bpm)}</span>
                </div>

                {/* BPM Slider */}
                <div className="w-full flex items-center gap-4">
                    <button
                        onClick={() => onBpmChange(bpm - 1)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700/50 text-2xl text-slate-300 transition-colors hover:bg-slate-700 active:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                        aria-label="Decrement BPM"
                    >
                        -
                    </button>
                    <input
                        type="range"
                        min={minBpm}
                        max={maxBpm}
                        value={bpm}
                        onChange={handleSliderChange}
                        className="w-full"
                        aria-label="BPM Slider"
                    />
                    <button
                        onClick={() => onBpmChange(bpm + 1)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700/50 text-2xl text-slate-300 transition-colors hover:bg-slate-700 active:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                        aria-label="Increment BPM"
                    >
                        +
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="w-full grid grid-cols-2 gap-4">
                    <button
                        onClick={onTogglePlay}
                        className={`py-3 px-6 rounded-lg text-lg font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 focus-visible:ring-white
                        ${isPlaying
                                ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/30'
                                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30'
                            }`}
                    >
                        {isPlaying ? 'Stop' : 'Start'}
                    </button>
                    <button
                        onClick={onTap}
                        className="py-3 px-6 rounded-lg text-lg font-semibold bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 hover:text-teal-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 focus-visible:ring-teal-400"
                    >
                        Tap Tempo
                    </button>
                </div>

                <hr className="w-full border-slate-700 my-2" />

                {/* Beats Control */}
                <div className="w-full flex justify-between items-center">
                    <span className="text-lg text-slate-300">Beats per measure</span>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handlePrevRhythm}
                            disabled={!canGoPrev}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700/50 text-xl text-slate-300 transition-colors hover:bg-slate-700 active:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Previous beats per measure"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-xl font-semibold w-12 text-center text-white tabular-nums">{activeRhythm.beatsPerMeasure}</span>
                        <button
                            onClick={handleNextRhythm}
                            disabled={!canGoNext}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700/50 text-xl text-slate-300 transition-colors hover:bg-slate-700 active:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Next beats per measure"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default React.memo(Controls);