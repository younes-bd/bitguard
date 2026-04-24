import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * EmergencyModal — Full-screen overlay for "Under Attack?" emergency CTA.
 * Matches enterprise cybersecurity industry standard (CrowdStrike breach services pattern).
 */
const EmergencyModal = ({ isOpen, onClose }) => {
    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200]">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl transition-opacity" onClick={onClose}></div>

            {/* Scrollable Modal Container */}
            <div className="fixed inset-0 z-10 overflow-y-auto" onClick={onClose}>
                <div className="flex min-h-full items-center justify-center p-4 py-12 relative">
                    {/* Modal Content */}
                    <div
                        className="relative w-full max-w-2xl bg-slate-900 border border-red-500/30 rounded-3xl shadow-[0_0_80px_rgba(239,68,68,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                {/* Red urgency bar */}
                <div className="h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600"></div>

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-red-500 hover:border-red-500 text-white flex items-center justify-center transition-all z-10 cursor-pointer"
                >
                    <i className="bi bi-x-lg"></i>
                </button>

                <div className="p-8 md:p-12">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                            <i className="bi bi-exclamation-triangle-fill text-red-500 text-3xl"></i>
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Cyber Emergency Response</h2>
                            <p className="text-red-400 text-sm font-bold uppercase tracking-widest">Immediate Assistance Available 24/7</p>
                        </div>
                    </div>

                    {/* Emergency Number */}
                    <a
                        href="tel:+13124452124"
                        className="flex items-center justify-center gap-4 p-6 bg-red-600 hover:bg-red-500 rounded-2xl mb-8 transition-all shadow-lg shadow-red-600/30 no-underline group"
                    >
                        <i className="bi bi-telephone-fill text-white text-2xl group-hover:animate-bounce"></i>
                        <div className="text-center">
                            <div className="text-white text-xs font-bold uppercase tracking-widest mb-1">Call Our Emergency Hotline</div>
                            <div className="text-white text-3xl md:text-4xl font-bold tracking-tight">(312) 445-2124</div>
                        </div>
                    </a>

                    {/* Immediate Steps */}
                    <div className="mb-8">
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                            <i className="bi bi-shield-check text-emerald-500"></i>
                            Immediate Steps While You Wait
                        </h3>
                        <div className="space-y-3">
                            {[
                                { step: '1', text: 'Do NOT power off affected systems — isolate them from the network instead', icon: 'bi-hdd-network' },
                                { step: '2', text: 'Do NOT pay any ransom demand — contact us first', icon: 'bi-x-octagon' },
                                { step: '3', text: 'Document everything — screenshots, error messages, timestamps', icon: 'bi-camera' },
                                { step: '4', text: 'Preserve system logs — do not delete or clear any logs', icon: 'bi-file-text' },
                            ].map((item) => (
                                <div key={item.step} className="flex items-start gap-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                    <div className="w-8 h-8 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm border border-red-500/20">
                                        {item.step}
                                    </div>
                                    <span className="text-slate-300 text-sm leading-relaxed">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Secondary Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href="mailto:emergency@bitguard.com?subject=URGENT: Security Incident"
                            className="flex-1 py-3 px-6 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm text-center transition-colors border border-slate-700 no-underline flex items-center justify-center gap-2"
                        >
                            <i className="bi bi-envelope-fill"></i> Email Emergency Team
                        </a>
                        <Link
                            to="/support"
                            onClick={onClose}
                            className="flex-1 py-3 px-6 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm text-center transition-colors border border-slate-700 no-underline flex items-center justify-center gap-2"
                        >
                            <i className="bi bi-ticket-detailed-fill"></i> Submit Critical Ticket
                        </Link>
                    </div>

                    <p className="text-slate-500 text-xs text-center mt-6">
                        Average response time for critical incidents: <span className="text-white font-bold">&lt; 15 minutes</span>
                    </p>
                </div>
            </div>
        </div>
        </div>
        </div>
    );
};

export default EmergencyModal;
