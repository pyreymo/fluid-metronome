import React, { useCallback } from 'react';

interface BpmSliderProps {
    bpm: number;
    minBpm: number;
    maxBpm: number;
    onBpmChange: (bpm: number) => void;
}

const BpmSlider: React.FC<BpmSliderProps> = ({ bpm, minBpm, maxBpm, onBpmChange }) => {

    const handleSliderChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onBpmChange(Number(event.target.value));
    }, [onBpmChange]);

    const decrementBpm = useCallback(() => {
        onBpmChange(bpm - 1);
    }, [bpm, onBpmChange]);

    const incrementBpm = useCallback(() => {
        onBpmChange(bpm + 1);
    }, [bpm, onBpmChange]);

    return (
        <div className="w-full flex items-center gap-4 px-2">
            <button
                onClick={decrementBpm}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-transparent text-2xl text-slate-400 transition-colors hover:bg-slate-800/50 active:bg-slate-700/50"
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
                onClick={incrementBpm}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-transparent text-2xl text-slate-400 transition-colors hover:bg-slate-800/50 active:bg-slate-700/50"
                aria-label="Increment BPM"
            >
                +
            </button>
        </div>
    );
};

export default BpmSlider;