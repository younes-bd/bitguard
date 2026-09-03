import React, { useState } from 'react';
import { MessageSquare, Clock, Users, Activity, Send } from 'lucide-react';

const ChatterPanel = ({ recordId, model }) => {
  const [activeTab, setActiveTab] = useState('messages');
  const [newMessage, setNewMessage] = useState('');

  const tabs = [
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'activities', icon: Clock, label: 'Activities' },
    { id: 'followers', icon: Users, label: 'Followers' },
    { id: 'changelog', icon: Activity, label: 'Changelog' }
  ];

  return (
    <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col h-full h-screen sticky top-0">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 p-3 text-center flex flex-col items-center justify-center transition-colors ${
              activeTab === tab.id 
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-white dark:bg-gray-800' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title={tab.label}
          >
            <tab.icon className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-semibold uppercase">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-500 text-center py-4">No messages yet. Start the conversation!</div>
          </div>
        )}
        {activeTab === 'activities' && (
          <div className="space-y-4">
             <div className="text-sm text-gray-500 text-center py-4">No pending activities.</div>
          </div>
        )}
        {activeTab === 'changelog' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-500 text-center py-4">Audit log is empty.</div>
          </div>
        )}
      </div>

      {activeTab === 'messages' && (
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="relative">
            <textarea
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 pr-12 text-sm bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 resize-none h-20"
              placeholder="Log a note or send a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button className="absolute right-2 bottom-2 p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatterPanel;
