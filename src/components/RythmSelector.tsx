import React from 'react';
import { Rhythm } from '../types';

interface RhythmSelectorProps {
    rhythms: Rhythm[];
    activeRhythm: Rhythm;
    onRhythmChange: (rhythm: Rhythm) => void;
}

const RhythmSelector: React.FC<RhythmSelectorProps> = ({ rhythms, activeRhythm, onRhythmChange }) => {
    return (
        <nav className="flex justify-center items-center gap-6 md:gap-8">
            {rhythms.map((rhythm) => {
                const isActive = activeRhythm.label === rhythm.label;
                return (
                    <button
                        key={rhythm.label}
                        onClick={() => onRhythmChange(rhythm)}
                        className={`
                            relative flex justify-center items-center w-16 h-16 rounded-full font-light text-lg transition-all duration-200 ease-in-out
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-4 focus-visible:ring-offset-gray-900
                        `}
                        aria-pressed={isActive}
                    >
                        <span
                            className={`
                                absolute inset-0 rounded-full transition-all duration-200
                                ${isActive ? 'bg-teal-600 scale-100' : 'bg-transparent scale-0'}
                            `}
                        ></span>
                        <span className={`
                            relative z-10 transition-colors duration-200
                            ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-100'}
                        `}>
                            {rhythm.label}
                        </span>
                    </button>
                )
            })}
        </nav>
    );
};

export default RhythmSelector;