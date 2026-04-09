import React, { useState, useEffect } from 'react';
import { Users, Loader2 } from 'lucide-react';
import client from '../../../../core/api/client';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get('users/')
            .then(res => {
                let data = res.data.data;
                if (data && Array.isArray(data.results)) data = data.results;
                
                setUsers(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                console.error("Failed to load users:", err);
                setUsers([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden animate-in fade-in">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h2 className="text-xl text-white font-['Oswald'] uppercase flex items-center gap-2">
                    <Users className="text-blue-400" /> Identity Users
                </h2>
                <div className="text-slate-400 text-sm">{users.length} Total</div>
            </div>
            {loading ? (
                <div className="py-20 text-center text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-500" />
                    Loading identities...
                </div>
            ) : (
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            <th className="px-6 py-4 text-left font-semibold text-slate-500 uppercase">Email</th>
                            <th className="px-6 py-4 text-left font-semibold text-slate-500 uppercase">Role</th>
                            <th className="px-6 py-4 text-left font-semibold text-slate-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-slate-800/30">
                                <td className="px-6 py-4 text-white">{u.email}</td>
                                <td className="px-6 py-4 text-slate-400 font-mono">{u.role || 'user'}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase">Active</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
export default UserList;
