import React, { useState, useEffect } from 'react';
import { platformService } from '../../../shared/core/services/platformService';
import {
    ComputerDesktopIcon,
    PlusIcon,
    VideoCameraIcon,
    XMarkIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const RemoteSupport = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const data = await platformService.getRemoteSessions();
            setSessions(data);
        } catch (error) {
            console.error("Failed to fetch remote sessions", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleCreateSession = async () => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        try {
            await platformService.createRemoteSession({
                session_code: code,
                status: 'active'
            });
            fetchSessions();
        } catch (error) {
            console.error("Failed to create session", error);
            alert("Failed to create session. Please try again.");
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Remote Support</h1>
                    <p className="text-slate-400">Manage remote assistance sessions.</p>
                </div>
                <button
                    onClick={handleCreateSession}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    New Session
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.length === 0 ? (
                    <div className="col-span-full p-12 text-center border-2 border-dashed border-slate-700 rounded-xl text-slate-500">
                        <ComputerDesktopIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No active support sessions</p>
                    </div>
                ) : (
                    sessions.map(session => (
                        <div key={session.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-indigo-500/10 rounded-lg">
                                        <ComputerDesktopIcon className="w-6 h-6 text-indigo-500" />
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full border ${session.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
                                        {session.status}
                                    </span>
                                </div>
                                <h3 className="text-3xl font-mono font-bold text-white tracking-wider mb-2">{session.session_code}</h3>
                                <p className="text-sm text-slate-400">Created: {new Date(session.created_at).toLocaleString()}</p>
                            </div>

                            <div className="mt-6 flex gap-2">
                                <button className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2">
                                    <VideoCameraIcon className="w-4 h-4" /> Connect
                                </button>
                                <button className="p-2 border border-slate-600 hover:bg-slate-700 text-slate-400 rounded-lg transition-colors">
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RemoteSupport;
