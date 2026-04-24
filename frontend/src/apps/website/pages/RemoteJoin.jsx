import React, { useState } from 'react';
import client from '../../../core/api/client';
import PageMeta from '../../../core/components/shared/PageMeta';
import { MonitorPlay, ShieldCheck, Loader2, AlertCircle, CheckCircle2, Lock } from 'lucide-react';

const RemoteJoin = () => {
    const [pin, setPin] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const [joinStatus, setJoinStatus] = useState(null); // 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');
    const [sessionData, setSessionData] = useState(null);

    const handlePinChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setPin(value);
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        if (pin.length !== 6) {
            setJoinStatus('error');
            setErrorMessage('Please enter a valid 6-digit session PIN.');
            return;
        }

        setIsJoining(true);
        setJoinStatus(null);
        setErrorMessage('');

        try {
            const response = await client.post('home/support/session/join/', { session_code: pin });
            setJoinStatus('success');
            setSessionData(response.data);
        } catch (error) {
            console.error('Session Join Error:', error);
            setJoinStatus('error');
            setErrorMessage(
                error.response?.data?.error || 'Failed to connect. The session PIN may be invalid or expired.'
            );
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
            <PageMeta title="Remote Support" description="Join a secure remote support session with a BitGuard technician." />
            {/* Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none"></div>

            <div className="w-full max-w-lg relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                        <MonitorPlay className="w-12 h-12 text-blue-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Remote Support</h1>
                    <p className="text-slate-400 text-lg">Enter your 6-digit PIN to establish a secure connection with a Tier-3 technician.</p>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                    {/* Top Security Banner */}
                    <div className="absolute top-0 left-0 right-0 py-2 bg-gradient-to-r from-emerald-600/20 via-emerald-500/20 to-emerald-600/20 border-b border-emerald-500/20 flex justify-center items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">E2E Encrypted Session</span>
                    </div>

                    <div className="mt-8">
                        {joinStatus === 'success' ? (
                            <div className="text-center animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Connection Established</h2>
                                <p className="text-slate-400 mb-6">You are now securely connected to your technician.</p>
                                
                                <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 text-left space-y-3">
                                    <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                                        <span className="text-slate-500 font-medium text-sm">Session Status:</span>
                                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg uppercase tracking-wider border border-emerald-500/20">Active</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                                        <span className="text-slate-500 font-medium text-sm">Technician:</span>
                                        <span className="text-white font-bold">{sessionData?.technician || 'Assigned'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 font-medium text-sm">Session ID:</span>
                                        <span className="text-slate-300 font-mono text-sm">{sessionData?.session_id}</span>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-500 mt-6 flex items-center justify-center gap-1.5">
                                    <Lock className="w-3 h-3" /> Please follow the technician's instructions on your screen.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleJoin} className="space-y-8">
                                {joinStatus === 'error' && (
                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-4 animate-in fade-in slide-in-from-top-4">
                                        <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-bold text-red-500 mb-1">Connection Failed</h4>
                                            <p className="text-sm text-red-400">{errorMessage}</p>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Session PIN</label>
                                    <input 
                                        type="text" 
                                        value={pin}
                                        onChange={handlePinChange}
                                        disabled={isJoining}
                                        className="w-full bg-slate-900/50 border-2 border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-2xl text-center text-5xl font-mono text-white tracking-[0.25em] py-6 outline-none transition-all disabled:opacity-50"
                                        placeholder="000000"
                                        maxLength="6"
                                        required
                                    />
                                    <div className="flex justify-between px-2 mt-3 text-xs text-slate-500">
                                        <span>Provided by your technician</span>
                                        <span>{pin.length}/6 digits</span>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isJoining || pin.length !== 6} 
                                    className="w-full flex justify-center items-center py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-[0_10px_30px_rgba(37,99,235,0.3)] transform active:scale-[0.98] transition-all uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                                >
                                    {isJoining ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                            Authenticating Session...
                                        </>
                                    ) : (
                                        'Secure Connect'
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Download Support Tools */}
            <div className="w-full max-w-lg relative z-10 mt-10">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                        <i className="bi bi-download text-blue-400"></i>
                        Download Support Tools
                    </h3>
                    <p className="text-slate-400 text-xs mb-4">Your technician may ask you to download one of these tools to your device:</p>
                    <div className="grid grid-cols-2 gap-3">
                        <a href="https://screenconnect.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-700/50 rounded-xl hover:border-blue-500/30 hover:bg-slate-800/50 transition-all no-underline">
                            <i className="bi bi-display text-blue-400 text-lg"></i>
                            <span className="text-white text-sm font-bold">ScreenConnect</span>
                        </a>
                        <a href="https://anydesk.com/download" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-700/50 rounded-xl hover:border-blue-500/30 hover:bg-slate-800/50 transition-all no-underline">
                            <i className="bi bi-laptop text-emerald-400 text-lg"></i>
                            <span className="text-white text-sm font-bold">AnyDesk</span>
                        </a>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-4 flex items-center gap-1.5">
                        <Lock className="w-3 h-3" /> Only download tools when instructed by a verified BitGuard technician.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RemoteJoin;
