import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, Loader2, AlertCircle } from 'lucide-react';
import client from '../../../core/api/client';
import { toast } from 'react-hot-toast';

const MfaSetup = ({ onEnabled }) => {
    const [step, setStep] = useState('initial'); // initial, verify, success
    const [setupData, setSetupData] = useState(null);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const initiateSetup = async () => {
        setLoading(true);
        try {
            const res = await client.post('iam/mfa_setup/');
            setSetupData(res.data.data);
            setStep('verify');
        } catch (error) {
            toast.error("Failed to initiate MFA setup");
        } finally {
            setLoading(false);
        }
    };

    const verifySetup = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await client.post('iam/mfa_verify/', { token });
            toast.success("Multi-factor authentication enabled!");
            setStep('success');
            if (onEnabled) onEnabled();
        } catch (error) {
            toast.error("Invalid token. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const copySecret = () => {
        navigator.clipboard.writeText(setupData.secret);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Secret copied to clipboard");
    };

    if (step === 'initial') {
        return (
            <div className="glass-panel p-8 rounded-2xl border border-slate-700/50 text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400">
                    <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Secure Your Account</h3>
                <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto">
                    Add an extra layer of security to your BitGuard account by enabling Multi-Factor Authentication.
                </p>
                <button
                    onClick={initiateSetup}
                    disabled={loading}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" /> : "Enable MFA Now"}
                </button>
            </div>
        );
    }

    if (step === 'verify') {
        return (
            <div className="glass-panel p-8 rounded-2xl border border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-6">Setup Authentication</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-6">
                        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">1. Scan QR Code</p>
                            <div className="bg-white p-3 rounded-lg w-fit mx-auto mb-4">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(setupData.qr_uri)}`} 
                                    alt="MFA QR Code"
                                    className="w-[180px] h-[180px]"
                                />
                            </div>
                            <p className="text-[10px] text-slate-500 text-center">Scan this with Google Authenticator or Authy</p>
                        </div>

                        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Or enter secret manually</p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 bg-slate-950 p-2 rounded border border-slate-800 text-blue-400 font-mono text-sm break-all">
                                    {setupData.secret}
                                </code>
                                <button onClick={copySecret} className="p-2 text-slate-400 hover:text-white transition-colors">
                                    {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                            <div className="flex gap-3">
                                <AlertCircle className="text-blue-400 shrink-0" size={20} />
                                <p className="text-xs text-blue-300 leading-relaxed">
                                    Enter the 6-digit verification code from your app to complete the setup.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={verifySetup} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">2. Verify Token</label>
                                <input
                                    type="text"
                                    maxLength="6"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    placeholder="000000"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white text-center text-3xl font-bold tracking-[0.5em] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || token.length !== 6}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin mx-auto" /> : "Verify & Enable"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep('initial')}
                                className="w-full text-xs text-slate-500 hover:text-slate-300 transition-colors py-2"
                            >
                                Cancel Setup
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400">
                <Check size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">MFA is Active</h3>
            <p className="text-slate-400 text-sm mb-6">
                Your account is protected with 2-step verification.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                <ShieldCheck size={12} /> Protected
            </div>
        </div>
    );
};

export default MfaSetup;
