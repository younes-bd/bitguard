import React, { useState } from 'react';
import { MessageSquare, Users, Settings, Search, Plus, Send, Hash, Lock } from 'lucide-react';

const DiscussDashboard = () => {
  const [activeChannel, setActiveChannel] = useState('general');

  const channels = [
    { id: 'general', name: 'General', type: 'public', unread: 0 },
    { id: 'announcements', name: 'Announcements', type: 'public', unread: 2 },
    { id: 'management', name: 'Management', type: 'private', unread: 0 },
  ];

  const messages = [
    { id: 1, sender: 'System', time: '09:00 AM', content: 'Welcome to Discuss! Start chatting with your team.' },
  ];

  return (
    <div className="flex h-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-indigo-500" />
            Discuss
          </h2>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-2 px-2">Channels</div>
          {channels.map(channel => (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel.id)}
              className={`w-full flex items-center px-2 py-2 rounded-lg text-sm transition-colors ${
                activeChannel === channel.id 
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 font-medium' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {channel.type === 'private' ? <Lock className="w-4 h-4 mr-2 opacity-70" /> : <Hash className="w-4 h-4 mr-2 opacity-70" />}
              {channel.name}
              {channel.unread > 0 && (
                <span className="ml-auto bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {channel.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
        {/* Chat Header */}
        <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white dark:bg-slate-900">
          <div className="flex items-center">
            <Hash className="w-5 h-5 text-slate-400 mr-2" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{activeChannel}</h3>
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <Search className="w-5 h-5 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors" />
            <Users className="w-5 h-5 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors" />
            <Settings className="w-5 h-5 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="flex space-x-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{msg.sender.charAt(0)}</span>
              </div>
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{msg.sender}</span>
                  <span className="text-xs text-slate-400">{msg.time}</span>
                </div>
                <div className="text-slate-600 dark:text-slate-300 mt-1 text-sm bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl rounded-tl-none inline-block">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              placeholder={`Message #${activeChannel}...`} 
              className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 dark:text-slate-200 placeholder-slate-400 px-4 text-sm"
            />
            <button className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors shadow-sm">
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussDashboard;
