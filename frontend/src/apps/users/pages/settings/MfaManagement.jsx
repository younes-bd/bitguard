import React, { useState, useEffect } from 'react';
import { ShieldCheck, Key, RefreshCw, CheckCircle, AlertTriangle, Loader2, Smartphone, Copy } from 'lucide-react';
import { usersService } from '../../api/usersService';
import { toast } from 'react-hot-toast';

const MfaManagement = () => {
    const [setupData, setSetupData] = useState(null);
    const [verificationToken, setVerificationToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('loading'); // 'loading', 'disabled', 'verifying', 'enabled'

    useEffect(() => {
        const checkMfaStatus = async () => {
            try {
                const response = await usersService.getUsers({ me: true });
                const me = Array.isArray(response) ? response[0] : response;
                if (me?.mfa_enabled) {
                    setStatus('enabled');
                } else {
                    setStatus('disabled');
                }
            } catch (error) {
                console.error("Failed to check MFA status", error);
                setStatus('disabled');
            } finally {
                setLoading(false);
            }
        };
        checkMfaStatus();
    }, []);

    const handleStartSetup = async () => {
        setLoading(true);
        try {
            const data = await usersService.setupMfa();
            setSetupData(data);
            setStatus('verifying');
        } catch (error) {
            toast.error("Failed to initiate MFA setup");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (verificationToken.length !== 6) {
            toast.error("Please enter a 6-digit token");
            return;
        }
        setLoading(true);
        try {
            await usersService.verifyMfa(verificationToken);
            toast.success("MFA Enabled Successfully");
            setStatus('enabled');
        } catch (error) {
            toast.error("Invalid token. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDisable = async () => {
        if (!window.confirm("WARNING: Disabling MFA will significantly reduce your account security. Proceed?")) return;
        setLoading(true);
        try {
            // Assume we have an endpoint or use updateMe
            await usersService.updateMe({ mfa_enabled: false });
            toast.success("MFA Protection Disabled");
            setStatus('disabled');
        } catch (error) {
            toast.error("Failed to disable MFA");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Secret copied to clipboard");
    };

    return (
        <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl">
                    <Smartphone size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight font-['Outfit']">Multi-Factor Authentication</h1>
                    <p className="text-slate-400 text-sm mt-1">Add an extra layer of security to your BitGuard account.</p>
                </div>
            </div>

            {status === 'disabled' && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-10 text-center space-y-6 backdrop-blur-xl">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                        <ShieldCheck size={40} className="text-slate-500" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white">MFA is currently disabled</h2>
                        <p className="text-slate-400 max-w-md mx-auto">
                            Protect your account from unauthorized access by requiring a dynamic security code during login.
                        </p>
                    </div>
                    <button
                        onClick={handleStartSetup}
                        disabled={loading}
                        className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2 mx-auto"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Key size={18} />}
                        Set Up Authenticator
                    </button>
                </div>
            )}

            {status === 'verifying' && setupData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-3xl flex flex-col items-center justify-center space-y-4">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(setupData.qr_uri)}`}
                            alt="MFA QR Code"
                            className="w-48 h-48 border-4 border-slate-100 rounded-xl"
                        />
                        <p className="text-[10px] text-slate-400 font-mono text-center uppercase tracking-widest">Scan with Google Authenticator or Authy</p>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-white font-bold text-lg">Verify Setup</h3>
                            <p className="text-slate-400 text-sm">Enter the 6-digit code from your app to confirm setup.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Secret Key (Manual Entry)</label>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 font-mono text-purple-400 text-sm flex items-center overflow-hidden">
                                        {setupData.secret}
                                    </div>
                                    <button 
                                        onClick={() => copyToClipboard(setupData.secret)}
                                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl transition-colors"
                                    >
                                        <Copy size={18} />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Verification Code</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="000000"
                                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-4 text-center text-3xl font-bold tracking-[0.5em] focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all"
                                    value={verificationToken}
                                    onChange={(e) => setVerificationToken(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>

                            <button
                                onClick={handleVerify}
                                disabled={loading || verificationToken.length !== 6}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <CheckCircle size={18} />}
                                Complete Setup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {status === 'enabled' && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-10 text-center space-y-6 backdrop-blur-xl">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                        <CheckCircle size={40} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white">MFA is fully active</h2>
                        <p className="text-emerald-400/80 max-w-md mx-auto">
                            Your account is protected. You will be prompted for a security code during every login session.
                        </p>
                    </div>
                    <div className="flex justify-center gap-4">
                        <button className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-all border border-slate-700">
                            Download Recovery Codes
                        </button>
                        <button 
                            onClick={handleDisable}
                            disabled={loading}
                            className="px-6 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-sm font-bold transition-all border border-rose-500/20 disabled:opacity-50"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Disable Protection'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MfaManagement;
