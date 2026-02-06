import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import client from '../shared/core/services/client';
import { User, LogOut, Settings, LayoutDashboard, Home, Users } from 'lucide-react';
import AccountsSidebar from './AccountsSidebar';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(error, errorInfo) { console.error("Uncaught error:", error, errorInfo); }
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-red-500 bg-slate-900 h-full flex flex-col items-center justify-center min-h-[50vh]">
                    <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
                    <pre className="bg-slate-950 p-4 rounded text-sm overflow-auto max-w-full whitespace-pre-wrap">
                        {this.state.error?.toString()}
                    </pre>
                </div>
            );
        }
        return this.props.children;
    }
}

const AccountsLayout = () => {
    const [user, setUser] = useState({ first_name: 'User', email: '', avatar: null });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await client.get('accounts/me/');
                setUser(res.data);
            } catch (err) {
                console.error("Failed to fetch user", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Loading account...</div>;
    }

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
            {/* Simple Account Header */}
            <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 lg:px-8">
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-[12px] no-underline group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                            <img src="/assets/logo/logo.png" alt="BitGuard" className="relative h-[30px] w-auto brightness-0 invert drop-shadow-[0_0_5px_rgba(56,189,248,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.6)] transition-all duration-300" onError={(e) => e.target.style.display = 'none'} />
                        </div>
                        <span className="text-white text-[24px] font-semibold font-[Oswald] tracking-[2px] leading-none inline-block mt-[-4px] scale-y-[1.4] origin-left drop-shadow-[0_0_5px_rgba(56,189,248,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.8)] transition-all">BITGUARD</span>
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400 tracking-wider uppercase border border-slate-700">Account</span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {/* Return to Home Link */}
                    <Link to="/" className="hidden md:flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors px-4 py-2 rounded-lg hover:bg-slate-900">
                        <Home size={16} />
                        <span>Go to Home</span>
                    </Link>

                    {/* User Dropdown (Exact Match to Public Layout) */}
                    <div className="group relative">
                        <button className="flex items-center bg-transparent border-none p-0 cursor-pointer group hover:opacity-100 transition-opacity">
                            <div className="w-9 h-9 relative">
                                {user.avatar ? (
                                    <img src={user.avatar} alt="User" className="w-full h-full object-cover rounded-full border border-slate-700 relative z-10" />
                                ) : (
                                    <div className="w-full h-full rounded-full border border-slate-700 relative z-10 bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                                        {(user.first_name?.[0] || 'U').toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        <div className="hidden group-hover:block absolute right-0 top-full pt-2 w-[240px] z-[1000]">
                            <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden">
                                {/* User Header */}
                                <div className="px-4 py-3 border-b border-slate-800">
                                    <div className="font-semibold text-white text-sm">{user.first_name || 'User'}</div>
                                    <div className="text-xs text-slate-400 truncate">{user.email}</div>
                                </div>

                                {/* Menu Items */}
                                <div className="py-1">
                                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors no-underline">
                                        <LayoutDashboard size={16} />
                                        <span>Dashboard</span>
                                    </Link>
                                    <Link to="/crm" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors no-underline">
                                        <Users size={16} />
                                        <span>Staff Portal</span>
                                    </Link>

                                    <div className="h-px bg-slate-800 my-1 mx-2"></div>

                                    <Link to="/account/personal-info" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors no-underline">
                                        <User size={16} />
                                        <span>Personal Info</span>
                                    </Link>
                                    <Link to="/account/security" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors no-underline">
                                        <Settings size={16} />
                                        <span>Security</span>
                                    </Link>

                                    <div className="h-px bg-slate-800 my-1 mx-2"></div>

                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors bg-transparent border-none cursor-pointer text-left">
                                        <LogOut size={16} />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Layout Body with Sidebar */}
            <div className="flex">
                <AccountsSidebar />
                {/* Main Content Area - Shifted Right */}
                <main className="flex-1 w-full min-h-[calc(100vh-64px)] ml-0 md:ml-[280px] p-6 md:p-12 max-w-5xl">
                    <ErrorBoundary>
                        <Outlet />
                    </ErrorBoundary>
                </main>
            </div>
        </div>
    );
};

export default AccountsLayout;
