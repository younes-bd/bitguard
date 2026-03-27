import React from 'react';
import { useTheme } from '../context/ThemeProvider';

/**
 * SectionDivider — Professional transition between dark/light sections.
 * 
 * @param {string} variant - 'wave' | 'angle' | 'gradient'
 * @param {string} from - 'dark' | 'light' (background color of above section)
 * @param {string} to - 'dark' | 'light' (background color of below section)
 * @param {boolean} flip - Flip the SVG horizontally
 */
const SectionDivider = ({ variant = 'wave', from = 'dark', to = 'light', flip = false }) => {
    const { isDark } = useTheme();

    // Resolve actual colors based on theme
    const getColor = (type) => {
        if (type === 'dark') return isDark ? '#020617' : '#f8fafc'; // slate-950 / slate-50
        return isDark ? '#0f172a' : '#ffffff'; // slate-900 / white
    };

    const fromColor = getColor(from);
    const toColor = getColor(to);

    if (variant === 'wave' || variant === 'angle') {
        return (
            <div className="relative w-full overflow-hidden leading-[0] -my-px">
                <svg className="relative block w-full" style={{ height: 'clamp(20px, 3vw, 40px)' }} viewBox="0 0 1200 40" preserveAspectRatio="none">
                    <polygon points="0,0 1200,40 0,40" fill={fromColor}></polygon>
                    <polygon points="1200,0 1200,40 0,0" fill={toColor}></polygon>
                </svg>
            </div>
        );
    }

    if (variant === 'gradient') {
        return (
            <div
                className="w-full -my-px relative"
                style={{
                    height: 'clamp(40px, 5vw, 80px)',
                    background: `linear-gradient(180deg, ${fromColor} 0%, ${toColor} 100%)`
                }}
            >
                <div className="absolute top-0 left-0 w-full h-px opacity-30" style={{ background: `linear-gradient(90deg, transparent, ${isDark ? '#3b82f6' : '#94a3b8'}, transparent)` }} />
            </div>
        );
    }

    return null;
};

export default SectionDivider;
