import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

export default function Chatter({ model, recordId }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { id: Date.now(), text: input, user: 'Current User', time: 'Just now' }]);
        setInput('');
        // TODO: Wire up to real API
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-slate-800 flex items-center gap-2">
                <MessageSquare className="text-emerald-500" size={20} />
                <h3 className="text-white font-bold">Internal Notes</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.length === 0 && <p className="text-slate-500 text-sm text-center">No notes yet.</p>}
                {messages.map(m => (
                    <div key={m.id} className="bg-slate-800/50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-emerald-400">{m.user}</span>
                            <span className="text-xs text-slate-500">{m.time}</span>
                        </div>
                        <p className="text-sm text-slate-300">{m.text}</p>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-slate-800 flex gap-2">
                <input 
                    type="text" 
                    value={input} 
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    placeholder="Log a note..." 
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
                <button onClick={handleSend} className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition-colors">
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}
