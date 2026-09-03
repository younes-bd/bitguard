import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Globe } from 'lucide-react';
import client from '@/core/api/client';
import toast from 'react-hot-toast';

export default function WebhooksList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  const [form, setForm] = useState({
      name: '',
      url: '',
      events: '[]',
      is_active: true
  });

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      const response = await client.get('system/webhooks/');
      setData(response.data?.data || response.data?.results || response.data || []);
    } catch (error) {
      toast.error('Failed to load webhooks');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setForm({ name: '', url: '', events: '["*"]', is_active: true });
    setIsModalVisible(true);
  };

  const handleOk = async (e) => {
    e.preventDefault();
    if (!form.name || !form.url) {
        toast.error('Please provide name and URL');
        return;
    }
    
    let parsedEvents;
    try {
        parsedEvents = JSON.parse(form.events);
    } catch(e) {
        parsedEvents = [form.events];
    }

    try {
        await client.post('system/webhooks/', {
            ...form,
            events: parsedEvents
        });
        toast.success('Webhook created successfully');
        setIsModalVisible(false);
        fetchWebhooks();
    } catch (error) {
        toast.error('Failed to create webhook');
    }
  };

  const handleDelete = async (id) => {
    try {
        await client.delete(`system/webhooks/${id}/`);
        toast.success('Webhook deleted');
        fetchWebhooks();
    } catch (error) {
        toast.error('Failed to delete webhook');
    }
  };

  const filteredData = data.filter(item => 
    item.name?.toLowerCase().includes(searchText.toLowerCase()) || 
    item.url?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <Globe className="text-blue-500" size={28} />
                    Webhook Endpoints
                </h1>
                <p className="text-slate-500 text-sm mt-1">Manage webhooks to send events to external systems.</p>
            </div>
            <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-2">
                <Plus size={18} /> New Webhook
            </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search webhooks..." 
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full bg-white border border-slate-300 text-slate-900 pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                            <th className="p-4 font-semibold">Name</th>
                            <th className="p-4 font-semibold">Endpoint URL</th>
                            <th className="p-4 font-semibold">Events</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-500">
                                    <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
                                    Loading webhooks...
                                </td>
                            </tr>
                        ) : filteredData.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-12 text-center text-slate-500">
                                    <Globe size={32} className="mx-auto mb-3 text-slate-300" />
                                    No webhooks found.
                                </td>
                            </tr>
                        ) : (
                            filteredData.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 font-medium text-slate-800">{item.name}</td>
                                    <td className="p-4 text-slate-500 font-mono text-sm max-w-[200px] truncate">{item.url}</td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-mono truncate max-w-[150px]">
                                            {Array.isArray(item.events) ? item.events.join(', ') : item.events}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            item.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {item.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {isModalVisible && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800">New Webhook Endpoint</h2>
                    </div>
                    <form onSubmit={handleOk} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                            <input 
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({...form, name: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-2 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="e.g. Zapier Trigger"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Endpoint URL</label>
                            <input 
                                type="url"
                                value={form.url}
                                onChange={(e) => setForm({...form, url: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-2 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="https://api.example.com/webhook"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Events (JSON list or comma separated)</label>
                            <input 
                                type="text"
                                value={form.events}
                                onChange={(e) => setForm({...form, events: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-2 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                                placeholder='["*"]'
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox"
                                id="is_active"
                                checked={form.is_active}
                                onChange={(e) => setForm({...form, is_active: e.target.checked})}
                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                            />
                            <label htmlFor="is_active" className="text-sm font-medium text-slate-700">Active</label>
                        </div>
                        
                        <div className="pt-4 flex justify-end gap-3">
                            <button 
                                type="button"
                                onClick={() => setIsModalVisible(false)}
                                className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold transition-colors"
                            >
                                Create Webhook
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}
