import React, { useState } from 'react';

const FreeTools = () => {
    // ROI Calculator State
    const [employees, setEmployees] = useState(50);
    const [hourlyRate, setHourlyRate] = useState(45);
    const [downtimeHours, setDowntimeHours] = useState(10);

    // Calculation: Cost of downtime = Employees * Rate * Downtime Hours
    // Estimated Savings with Managed IT = Cost of Downtime * 0.60 (60% reduction)
    const downtimeCost = employees * hourlyRate * downtimeHours;
    const potentialSavings = downtimeCost * 0.6;

    // Password Checker State
    const [password, setPassword] = useState('');
    const [strength, setStrength] = useState(0);

    const checkStrength = (pass) => {
        setPassword(pass);
        let s = 0;
        if (pass.length > 7) s += 1;
        if (/[A-Z]/.test(pass)) s += 1;
        if (/[0-9]/.test(pass)) s += 1;
        if (/[^A-Za-z0-9]/.test(pass)) s += 1;
        setStrength(s);
    };

    const getStrengthLabel = () => {
        switch (strength) {
            case 0: return 'Very Weak';
            case 1: return 'Weak';
            case 2: return 'Fair';
            case 3: return 'Good';
            case 4: return 'Strong';
            default: return '';
        }
    };

    const getStrengthColor = () => {
        switch (strength) {
            case 0: return 'bg-red-500';
            case 1: return 'bg-orange-500';
            case 2: return 'bg-yellow-500';
            case 3: return 'bg-blue-500';
            case 4: return 'bg-green-500';
            default: return 'bg-slate-200';
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero */}
            <section className="relative pt-32 pb-20 bg-slate-950 overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
                        <i className="bi bi-tools"></i> Totally Free Resources
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-[Oswald]">
                        IT & Security Tools
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                        Assess your risks and potential savings with our interactive calculators.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* ROI Calculator Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-2xl">
                            <i className="bi bi-calculator-fill"></i>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Downtime Cost Calculator</h2>
                            <p className="text-slate-500 text-sm">Estimate how much IT outages cost your business.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Number of Employees</label>
                            <input
                                type="range" min="5" max="500" step="5"
                                value={employees} onChange={(e) => setEmployees(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <div className="text-right font-mono font-bold text-blue-600 mt-1">{employees} Users</div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Avg. Hourly Employee Cost ($)</label>
                            <input
                                type="number"
                                value={hourlyRate} onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Est. Annual Downtime (Hours)</label>
                            <input
                                type="number"
                                value={downtimeHours} onChange={(e) => setDowntimeHours(parseInt(e.target.value))}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                            />
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-600 font-semibold">Annual Cost of Downtime:</span>
                                <span className="text-2xl font-bold text-red-500">${downtimeCost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center bg-green-50 p-4 rounded-xl border border-green-100">
                                <span className="text-green-800 font-bold">Potential Savings (Managed IT):</span>
                                <span className="text-xl font-bold text-green-600">${potentialSavings.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-4 text-center">Based on industry average of 60% downtime reduction with proactive monitoring.</p>
                        </div>
                    </div>
                </div>

                {/* Password Checker Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl">
                            <i className="bi bi-shield-lock-fill"></i>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Password Strength</h2>
                            <p className="text-slate-500 text-sm">Test your password complexity instantly.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <input
                                type="text"
                                placeholder="Type a password..."
                                value={password}
                                onChange={(e) => checkStrength(e.target.value)}
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-lg"
                            />
                        </div>

                        {password && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-slate-600">Strength:</span>
                                    <span className={`${strength < 2 ? 'text-red-500' : strength < 4 ? 'text-yellow-500' : 'text-green-500'}`}>
                                        {getStrengthLabel()}
                                    </span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${getStrengthColor()}`}
                                        style={{ width: `${(strength / 4) * 100}%` }}
                                    ></div>
                                </div>
                                <ul className="text-xs text-slate-500 mt-4 space-y-1">
                                    <li className={password.length > 7 ? 'text-green-600' : ''}><i className={`bi ${password.length > 7 ? 'bi-check-circle-fill' : 'bi-circle'}`}></i> At least 8 characters</li>
                                    <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}><i className={`bi ${/[A-Z]/.test(password) ? 'bi-check-circle-fill' : 'bi-circle'}`}></i> Uppercase letter</li>
                                    <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}><i className={`bi ${/[0-9]/.test(password) ? 'bi-check-circle-fill' : 'bi-circle'}`}></i> Number</li>
                                    <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : ''}><i className={`bi ${/[^A-Za-z0-9]/.test(password) ? 'bi-check-circle-fill' : 'bi-circle'}`}></i> Special character</li>
                                </ul>
                            </div>
                        )}

                        {!password && (
                            <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-slate-400">
                                <i className="bi bi-keyboard text-3xl mb-2 block"></i>
                                Start typing to test...
                            </div>
                        )}
                    </div>
                </div>

                {/* Speed Test Link Card (Full Width) */}
                <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Network Speed Test</h3>
                        <p className="text-slate-400 max-w-xl">Check your connection speed directly from our preferred partner servers to ensure your network is optimized for cloud applications.</p>
                    </div>
                    <a href="https://www.speedtest.net/" target="_blank" rel="noopener noreferrer"
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-3 transition-colors shadow-lg shadow-blue-600/20">
                        <i className="bi bi-speedometer"></i> Launch Speed Test
                    </a>
                </div>

            </div>
        </div>
    );
};

export default FreeTools;
