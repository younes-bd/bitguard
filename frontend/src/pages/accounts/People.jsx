import React, { useState, useEffect } from 'react';
import client from '../../shared/core/services/client';
import { Users, Share2, Plus, Search, UserPlus, Check, X, File, Folder, X as CloseIcon } from 'lucide-react';

const People = () => {
    const [activeTab, setActiveTab] = useState('people');
    const [connections, setConnections] = useState([]);
    const [sharedResources, setSharedResources] = useState([]);
    const [loading, setLoading] = useState(true);

    // Invite Modal State
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteLoading, setInviteLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            // Keep loading indicators local if possible to avoid flicker, but here global loading on tab switch is fine
            if (loading) setLoading(true);
            try {
                if (activeTab === 'people') {
                    const res = await client.get('accounts/connections/');
                    setConnections(res.data);
                } else {
                    const res = await client.get('accounts/shared-resources/');
                    setSharedResources(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeTab]);

    const handleAccept = async (id) => {
        try {
            await client.post(`accounts/connections/${id}/accept/`);
            // Refresh
            const res = await client.get('accounts/connections/');
            setConnections(res.data);
        } catch (err) {
            console.error("Failed to accept", err);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        setInviteLoading(true);
        try {
            await client.post('accounts/connections/', { email: inviteEmail });
            alert("Invite sent!");
            setShowInviteModal(false);
            setInviteEmail('');
            // Refresh list
            const res = await client.get('accounts/connections/');
            setConnections(res.data);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Failed to send invite");
        } finally {
            setInviteLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 relative">
            {/* Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl relative">
                        <button
                            onClick={() => setShowInviteModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            <CloseIcon size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-white mb-2">Invite People</h2>
                        <p className="text-slate-400 text-sm mb-6">Enter an email address to invite a colleague or friend.</p>

                        <form onSubmit={handleInvite} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="friend@example.com"
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>
                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={inviteLoading}
                                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {inviteLoading ? 'Sending...' : 'Send Invite'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            <h1 className="text-2xl font-bold text-white mb-6 font-[Oswald] tracking-wide">People & Sharing</h1>

            {/* Tab Navigation */}
            <div className="flex items-center gap-4 border-b border-slate-800 mb-6">
                <button
                    onClick={() => setActiveTab('people')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'people' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
                >
                    <Users size={16} /> People
                </button>
                <button
                    onClick={() => setActiveTab('sharing')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'sharing' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
                >
                    <Share2 size={16} /> Sharing
                </button>
            </div>

            {loading ? (
                <div className="p-12 text-center text-slate-500">Loading...</div>
            ) : (
                <>
                    {activeTab === 'people' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search people..."
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <button
                                    onClick={() => setShowInviteModal(true)}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                                >
                                    <UserPlus size={16} /> Invite
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {connections.length > 0 ? connections.map(conn => {
                                    // Identify the other user
                                    const otherUser = conn.user_details || {};
                                    const isPending = conn.status === 'pending';

                                    return (
                                        <div key={conn.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4 hover:border-slate-700 transition-colors">
                                            <div className="w-12 h-12 rounded-full bg-slate-800 overflow-hidden flex-shrink-0">
                                                {otherUser.photo ? (
                                                    <img src={otherUser.photo} alt={otherUser.username} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-lg">
                                                        {otherUser.username ? otherUser.username.charAt(0).toUpperCase() : '?'}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-medium truncate">{otherUser.username || 'Unknown User'}</h3>
                                                <p className="text-slate-500 text-xs truncate">{otherUser.email}</p>
                                                {isPending && <span className="text-yellow-500 text-xs italic">Pending Request</span>}
                                            </div>
                                            {isPending && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleAccept(conn.id)} className="p-2 bg-emerald-500/10 text-emerald-500 rounded-full hover:bg-emerald-500/20">
                                                        <Check size={16} />
                                                    </button>
                                                    <button className="p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500/20">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }) : (
                                    <div className="col-span-full py-12 text-center text-slate-500">
                                        No connections found. Start inviting people!
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'sharing' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {sharedResources.length > 0 ? sharedResources.map(res => (
                                    <div key={res.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl hover:border-purple-500/30 transition-colors group">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg">
                                                {res.resource_type === 'folder' ? <Folder size={20} /> : <File size={20} />}
                                            </div>
                                            <span className="text-xs text-slate-500 bg-slate-950 px-2 py-1 rounded">
                                                {res.permission}
                                            </span>
                                        </div>
                                        <h3 className="text-white font-medium mb-1 group-hover:text-purple-400 transition-colors">{res.resource_name}</h3>
                                        <p className="text-xs text-slate-500">
                                            Shared with: {res.shared_with_email}
                                        </p>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-12 text-center text-slate-500">
                                        You haven't shared any resources yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default People;
