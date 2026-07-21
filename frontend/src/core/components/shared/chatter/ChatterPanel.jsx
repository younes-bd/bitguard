import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Activity, Clock, Paperclip, Send, User, 
  Lock, CheckCircle, Calendar, Plus, Eye, EyeOff 
} from 'lucide-react';
import chatterService from "../../../api/chatterService";
import { toast } from 'react-hot-toast';

export default function ChatterPanel({ model, objectId, className = '' }) {
  const [activeTab, setActiveTab] = useState('messages');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    messages: [],
    activities: [],
    change_log: [],
    followers: [],
    is_following: false
  });
  
  // Message input state
  const [newMessage, setNewMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [postingMessage, setPostingMessage] = useState(false);

  // Activity modal state (simplified inline for now)
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [activityForm, setActivityForm] = useState({
    activity_type: 'todo',
    summary: '',
    due_date: new Date().toISOString().split('T')[0]
  });

  const loadChatter = async () => {
    try {
      setLoading(true);
      const result = await chatterService.getChatter(model, objectId);
      setData(result.data || result);
    } catch (err) {
      console.error('Failed to load chatter:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (model && objectId) {
      loadChatter();
    }
  }, [model, objectId]);

  const handlePostMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      setPostingMessage(true);
      if (isInternal) {
        // Backend should ideally accept 'model' instead of 'content_type' ID
        await chatterService.postMessage({ model, object_id: objectId, body: newMessage, message_type: 'note', is_internal: true });
      } else {
        await chatterService.postMessage({ model, object_id: objectId, body: newMessage, message_type: 'comment', is_internal: false });
      }
      setNewMessage('');
      loadChatter();
      toast.success(isInternal ? 'Internal note logged' : 'Message sent');
    } catch (err) {
      toast.error('Failed to post message');
      console.error(err);
    } finally {
      setPostingMessage(false);
    }
  };

  const handleScheduleActivity = async () => {
    if (!activityForm.summary) {
      toast.error('Summary is required');
      return;
    }
    try {
      await chatterService.scheduleActivity({
        model,
        object_id: objectId,
        ...activityForm
      });
      setShowActivityForm(false);
      setActivityForm({ ...activityForm, summary: '' });
      loadChatter();
      toast.success('Activity scheduled');
    } catch (err) {
      toast.error('Failed to schedule activity');
    }
  };

  const handleMarkDone = async (activityId) => {
    try {
      await chatterService.markActivityDone(activityId);
      loadChatter();
      toast.success('Activity marked as done');
    } catch (err) {
      toast.error('Failed to complete activity');
    }
  };

  const toggleFollow = async () => {
    try {
      if (data.is_following) {
        await chatterService.unfollowRecord(model, objectId);
        toast.success('Unfollowed');
      } else {
        await chatterService.followRecord(model, objectId);
        toast.success('Following');
      }
      loadChatter();
    } catch (err) {
      toast.error('Failed to update follow status');
    }
  };

  if (loading) {
    return (
      <div className={`flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-6 ${className} animate-pulse h-[600px]`}>
        <div className="h-8 bg-slate-800 rounded w-1/3 mb-6"></div>
        <div className="h-24 bg-slate-800 rounded w-full mb-4"></div>
        <div className="h-24 bg-slate-800 rounded w-full"></div>
      </div>
    );
  }

  const renderMessages = () => (
    <div className="space-y-4 overflow-y-auto pr-2 pb-4 max-h-[500px] flex-1 scrollbar-thin scrollbar-thumb-slate-700">
      {/* Input Area */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-sm mb-6">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={isInternal ? "Log an internal note..." : "Send a message..."}
          className={`w-full bg-slate-900 border-none rounded-lg p-3 text-slate-200 focus:ring-1 resize-none h-24 ${isInternal ? 'focus:ring-amber-500' : 'focus:ring-blue-500'}`}
        />
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsInternal(!isInternal)}
              className={`text-sm flex items-center px-3 py-1.5 rounded-md transition-colors ${isInternal ? 'bg-amber-500/10 text-amber-500' : 'hover:bg-slate-700 text-slate-400'}`}
            >
              <Lock className="w-4 h-4 mr-1.5" />
              Log Note
            </button>
            <button className="text-slate-400 hover:text-slate-300 p-1.5 rounded-md hover:bg-slate-700 transition-colors">
              <Paperclip className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={handlePostMessage}
            disabled={postingMessage || !newMessage.trim()}
            className={`px-4 py-2 rounded-lg font-medium flex items-center transition-colors ${isInternal ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} disabled:opacity-50`}
          >
            {postingMessage ? 'Sending...' : 'Send'}
            <Send className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Message Thread */}
      {data.messages?.length === 0 ? (
        <div className="text-center text-slate-500 py-8">No messages yet. Start the conversation!</div>
      ) : (
        data.messages?.map((msg) => (
          <div key={msg.id} className={`p-4 rounded-xl border ${msg.is_internal ? 'bg-amber-900/10 border-amber-500/20 border-l-4 border-l-amber-500' : 'bg-slate-800/50 border-slate-700'}`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-sm font-medium mr-3">
                  {msg.author?.name ? msg.author.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-medium text-slate-200 text-sm flex items-center">
                    {msg.author?.name || 'Unknown User'}
                    {msg.is_internal && <span className="ml-2 text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Internal Note</span>}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(msg.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-slate-300 text-sm whitespace-pre-wrap pl-11">{msg.body}</div>
          </div>
        ))
      )}
    </div>
  );

  const renderActivities = () => (
    <div className="space-y-4 overflow-y-auto pr-2 pb-4 max-h-[500px] flex-1 scrollbar-thin scrollbar-thumb-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-slate-300">Planned Activities</h3>
        <button 
          onClick={() => setShowActivityForm(!showActivityForm)}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md flex items-center transition-colors"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Schedule Activity
        </button>
      </div>

      {showActivityForm && (
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-4 animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Activity Type</label>
              <select 
                value={activityForm.activity_type}
                onChange={e => setActivityForm({...activityForm, activity_type: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-sm text-slate-200"
              >
                <option value="todo">To-Do</option>
                <option value="email">Email</option>
                <option value="call">Call</option>
                <option value="meeting">Meeting</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Due Date</label>
              <input 
                type="date" 
                value={activityForm.due_date}
                onChange={e => setActivityForm({...activityForm, due_date: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-sm text-slate-200 [color-scheme:dark]" 
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">Summary</label>
              <input 
                type="text" 
                placeholder="e.g., Follow up on proposal"
                value={activityForm.summary}
                onChange={e => setActivityForm({...activityForm, summary: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-sm text-slate-200" 
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button onClick={() => setShowActivityForm(false)} className="px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-700 rounded-md">Cancel</button>
            <button onClick={handleScheduleActivity} className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md">Schedule</button>
          </div>
        </div>
      )}

      {data.activities?.length === 0 ? (
        <div className="text-center text-slate-500 py-8">No planned activities.</div>
      ) : (
        data.activities?.map((act) => {
          const isOverdue = new Date(act.due_date) < new Date(new Date().setHours(0,0,0,0));
          return (
            <div key={act.id} className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl flex items-center justify-between group">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg mr-3 ${isOverdue ? 'bg-red-500/10 text-red-400' : 'bg-slate-700 text-slate-300'}`}>
                  {act.activity_type === 'call' ? <Activity className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-medium text-slate-200 text-sm">{act.summary}</div>
                  <div className={`text-xs mt-0.5 ${isOverdue ? 'text-red-400 font-medium' : 'text-slate-500'}`}>
                    Due: {new Date(act.due_date).toLocaleDateString()} · {act.assigned_to?.name || 'Unassigned'}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleMarkDone(act.id)}
                title="Mark as done"
                className="text-slate-500 hover:text-green-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          );
        })
      )}
    </div>
  );

  const renderLog = () => (
    <div className="space-y-4 overflow-y-auto pr-2 pb-4 max-h-[500px] flex-1 scrollbar-thin scrollbar-thumb-slate-700 relative">
      <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-800"></div>
      
      {data.change_log?.length === 0 ? (
        <div className="text-center text-slate-500 py-8">No changes recorded yet.</div>
      ) : (
        data.change_log?.map((log, idx) => (
          <div key={log.id || idx} className="relative pl-10">
            <div className="absolute left-[11px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-600 border-2 border-slate-900"></div>
            <div className="text-sm text-slate-300">
              <span className="font-medium text-slate-200">{log.field_label || log.field_name}</span> changed
              {log.old_value && <span className="text-slate-500"> from {log.old_value}</span>}
              {log.new_value && <span> to <span className="font-medium text-slate-200">{log.new_value}</span></span>}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(log.created_at).toLocaleString()} · by {log.changed_by?.name || 'System'}
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className={`flex flex-col bg-slate-950 border-l border-slate-800 h-full ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex space-x-6">
          <button 
            onClick={() => setActiveTab('messages')}
            className={`text-sm font-medium pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'messages' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <div className="flex items-center"><MessageSquare className="w-4 h-4 mr-2" /> Messages</div>
          </button>
          <button 
            onClick={() => setActiveTab('activities')}
            className={`text-sm font-medium pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'activities' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <div className="flex items-center"><Activity className="w-4 h-4 mr-2" /> Activities</div>
          </button>
          <button 
            onClick={() => setActiveTab('log')}
            className={`text-sm font-medium pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'log' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <div className="flex items-center"><Clock className="w-4 h-4 mr-2" /> Log</div>
          </button>
        </div>
        
        <button 
          onClick={toggleFollow}
          className={`flex items-center text-xs px-2.5 py-1.5 rounded-md font-medium transition-colors ${data.is_following ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
          {data.is_following ? <Eye className="w-3.5 h-3.5 mr-1.5" /> : <EyeOff className="w-3.5 h-3.5 mr-1.5" />}
          {data.followers?.length || 0} Followers
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 overflow-hidden flex flex-col bg-slate-900/20">
        {activeTab === 'messages' && renderMessages()}
        {activeTab === 'activities' && renderActivities()}
        {activeTab === 'log' && renderLog()}
      </div>
    </div>
  );
}
