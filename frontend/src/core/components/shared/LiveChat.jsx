import React, { useState } from 'react';

const LiveChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, sender: 'agent', text: 'Hi there! 👋 How can we help you today?' }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newMsg = { id: Date.now(), sender: 'user', text: message };
        setMessages(prev => [...prev, newMsg]);
        setMessage('');
        setIsTyping(true);

        // Simulate agent response
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'agent',
                text: 'Thanks for reaching out! A security expert will be with you shortly. If this is an emergency, please use our 15-minute response SLA support ticket.'
            }]);
        }, 2000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white dark:bg-slate-900 w-80 sm:w-96 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 mb-4 overflow-hidden animate-fade-in-up flex flex-col h-[500px] max-h-[80vh]">
                    {/* Header */}
                    <div className="bg-blue-600 p-4 flex items-center justify-between text-white shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <i className="bi bi-shield-fill-check text-xl"></i>
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-blue-600 rounded-full"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm m-0 leading-tight">BitGuard Sales & Support</h3>
                                <p className="text-[10px] text-blue-100 uppercase tracking-widest m-0 mt-1 font-semibold">Replies typically in under 5m</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-blue-100 hover:text-white bg-transparent border-none cursor-pointer transition-colors p-1"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-950 flex flex-col gap-4">
                        <div className="text-center">
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full">
                                Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                                    msg.sender === 'user' 
                                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-700 rounded-tl-sm shadow-sm'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
                        <form onSubmit={handleSend} className="flex items-center gap-2 relative">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full py-2.5 pl-4 pr-12 text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
                            />
                            <button 
                                type="submit"
                                disabled={!message.trim() || isTyping}
                                className="absolute right-1 top-1 w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors border-none cursor-pointer shadow-sm"
                            >
                                <i className="bi bi-send-fill text-xs ml-0.5"></i>
                            </button>
                        </form>
                        <div className="text-center mt-3">
                            <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                                <i className="bi bi-lock-fill"></i> SSL Secured & Encrypted
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30 transition-all duration-300 border-none cursor-pointer ${
                    isOpen ? 'bg-slate-800 hover:bg-slate-700 rotate-90 scale-90' : 'bg-blue-600 hover:bg-blue-500 hover:scale-105'
                }`}
                aria-label="Toggle Live Chat"
            >
                <i className={`bi text-2xl transition-transform duration-300 ${isOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'}`}></i>
            </button>
        </div>
    );
};

export default LiveChat;
