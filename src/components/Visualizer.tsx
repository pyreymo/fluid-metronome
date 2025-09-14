import React from 'react';

interface VisualizerProps {
    currentBeat: number;
    isPlaying: boolean;
}

/**
 * A presentational component that renders the animated waveform visual for each metronome beat.
 * The animation differs for accented (first beat of the measure) and regular beats.
 * @param {VisualizerProps} props The props for the component.
 */
const Visualizer: React.FC<VisualizerProps> = ({ currentBeat, isPlaying }: VisualizerProps) => {
    const isAccent = currentBeat === 1;
    const isBeatActive = currentBeat > 0;
    // A unique key is used to re-trigger the CSS animation on every beat.
    const animationKey = `${currentBeat}-${Date.now()}`;

    return (
        <>
            <style>
                {`
                @keyframes strong-wave {
                    0% { d: path("M0,50 C150,50 350,50 500,50"); opacity: 1; }
                    20% { d: path("M0,50 C150,0 350,0 500,50"); opacity: 1; }
                    100% { d: path("M0,50 C150,50 350,50 500,50"); opacity: 0; }
                }
                @keyframes weak-wave {
                    0% { d: path("M0,50 C150,50 350,50 500,50"); opacity: 1; }
                    20% { d: path("M0,50 C150,30 350,30 500,50"); opacity: 1; }
                    100% { d: path("M0,50 C150,50 350,50 500,50"); opacity: 0; }
                }
                .animate-strong-wave { animation: strong-wave 600ms cubic-bezier(0.16, 1, 0.3, 1); }
                .animate-weak-wave { animation: weak-wave 600ms cubic-bezier(0.16, 1, 0.3, 1); }
                `}
            </style>
            <div className="relative w-full h-24" aria-label="Metronome beat visualizer">
                <svg viewBox="0 0 500 100" className="w-full h-full pointer-events-none" preserveAspectRatio="none">
                    {/* Base static line */}
                    <path
                        d="M0,50 C150,50 350,50 500,50"
                        stroke={isPlaying ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)"}
                        strokeWidth="2"
                        fill="none"
                        className="transition-all duration-300"
                    />

                    {/* Animated beat wave */}
                    {isBeatActive && (
                        <path
                            key={animationKey}
                            stroke="#0D9488"
                            strokeWidth="3"
                            fill="none"
                            className={isAccent ? 'animate-strong-wave' : 'animate-weak-wave'}
                            style={{ filter: 'drop-shadow(0 0 8px rgba(13, 148, 136, 0.8))' }}
                        />
                    )}
                </svg>
            </div>
        </>
    );
};

export default React.memo(Visualizer);