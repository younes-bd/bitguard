import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Play, Pause, RefreshCw } from 'lucide-react';

const SLIDES = [
    {
        image: '/assets/images/solutions/slide1.png',
        title: 'Global Mesh Infrastructure',
        description: 'Military-grade connectivity powered by edge-optimized routing and zero-trust protocol enforcement.'
    },
    {
        image: '/assets/images/solutions/slide2.png',
        title: 'AI Sentinel Defense',
        description: 'Next-generation behavioral analysis identifying and neutralizing threats in milliseconds.'
    },
    {
        image: '/assets/images/solutions/slide3.png',
        title: 'Quantum-Safe Cloud Vault',
        description: 'End-to-end encrypted storage architecture designed for absolute data sovereignty and resilience.'
    },
    {
        image: '/assets/images/solutions/slide4.png',
        title: 'Automated Compliance',
        description: 'Real-time audit-ready posture for SOC2, HIPAA, and GDPR with autonomous reporting.'
    }
];

const SolutionReveal = ({ onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);

    const DURATION = 5000; // 5 seconds per slide

    useEffect(() => {
        let timer;
        if (isPlaying) {
            timer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        nextSlide();
                        return 0;
                    }
                    return prev + (100 / (DURATION / 60)); // ~60fps smooth progress
                });
            }, 60);
        }
        return () => clearInterval(timer);
    }, [isPlaying, currentSlide]);

    const nextSlide = () => {
        setProgress(0);
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    };

    const prevSlide = () => {
        setProgress(0);
        setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    };

    const restart = () => {
        setProgress(0);
        setCurrentSlide(0);
        setIsPlaying(true);
    };

    return (
        <div className="fixed inset-0 z-[110] bg-slate-950 flex flex-col items-center justify-center p-4 md:p-12 overflow-hidden animate-in fade-in duration-500">
            {/* Header / Brand */}
            <div className="absolute top-8 left-8 flex items-center gap-3 z-20">
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden p-1 border border-white/10">
                    <img src="/assets/logo/logo.png" alt="BitGuard" className="w-full h-full object-contain" />
                </div>
                <div>
                    <h3 className="text-white font-bold tracking-tight">BitGuard Solutions</h3>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest leading-none">Platform Tour • v4.0</p>
                </div>
            </div>

            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/10 bg-white/5 hover:bg-red-500 hover:border-red-500 text-white flex items-center justify-center transition-all duration-300 z-20 group"
            >
                <X size={24} className="group-hover:scale-110 transition-transform" />
            </button>

            {/* Main Content Area */}
            <div className="relative w-full max-w-6xl aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-slate-900 group">
                {/* Slide Image */}
                {SLIDES.map((slide, index) => (
                    <div 
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        <img 
                            src={slide.image} 
                            alt={slide.title}
                            className="w-full h-full object-cover scale-105 animate-slow-zoom"
                        />
                        {/* Gradient Overlays */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-slate-950/60 to-transparent"></div>
                    </div>
                ))}

                {/* Text Overlay */}
                <div className="absolute bottom-12 left-12 right-12 z-20 pointer-events-none">
                    <div className="overflow-hidden">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-in slide-in-from-bottom-full duration-700">
                            {SLIDES[currentSlide].title}
                        </h2>
                    </div>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                        {SLIDES[currentSlide].description}
                    </p>
                </div>

                {/* Controls Overlay (Hidden by default, shown on hover/touch) */}
                <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                    <button onClick={prevSlide} className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                        <ChevronLeft size={32} />
                    </button>
                    <button onClick={nextSlide} className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                        <ChevronRight size={32} />
                    </button>
                </div>

                {/* Video-style Progress Bar */}
                <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10 z-30">
                    <div 
                        className="h-full bg-white transition-all duration-75 ease-linear"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Bottom Toolbar */}
            <div className="mt-8 flex items-center gap-6 z-20">
                <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white hover:text-slate-950 font-bold transition-all duration-300"
                >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    {isPlaying ? 'PAUSE' : 'RESUME'}
                </button>
                <button 
                    onClick={restart}
                    className="flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
                >
                    <RefreshCw size={18} className={isPlaying ? '' : 'animate-spin'} />
                    REPLAY
                </button>
                <div className="h-6 w-px bg-white/10 mx-2"></div>
                <div className="text-slate-500 font-bold text-sm tracking-widest">
                    {String(currentSlide + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
                </div>
            </div>

            {/* Custom Animations */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes slow-zoom {
                    from { transform: scale(1); }
                    to { transform: scale(1.15); }
                }
                .animate-slow-zoom {
                    animation: slow-zoom 10s linear infinite alternate;
                }
            `}} />
        </div>
    );
};

export default SolutionReveal;
