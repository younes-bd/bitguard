import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Mail } from 'lucide-react';
import client from '@/core/api/client';
import toast from 'react-hot-toast';

export default function MailAliasesList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  const [form, setForm] = useState({
      alias_name: '',
      alias_domain: '',
      alias_model: 'crm.Lead',
      is_active: true
  });

  const fetchAliases = async () => {
      setLoading(true);
      try {
          const res = await client.get('system/mail-aliases/');
          setData(res.data.results || res.data);
      } catch {
          toast.error('Failed to load mail aliases');
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchAliases();
  }, []);

  const handleAdd = () => {
    setForm({ alias_name: '', alias_domain: '', alias_model: 'crm.Lead', is_active: true });
    setIsModalVisible(true);
  };

  const handleEdit = (alias) => {
    setForm(alias);
    setIsModalVisible(true);
  };

  const handleOk = async (e) => {
    e.preventDefault();
    if (!form.alias_name || !form.alias_model) {
        toast.error('Please fill in all required fields');
        return;
    }
    try {
        if (form.id) {
            await client.patch(`system/mail-aliases/${form.id}/`, form);
            toast.success('Mail alias updated successfully');
        } else {
            await client.post('system/mail-aliases/', form);
            toast.success('Mail alias added successfully');
        }
        setIsModalVisible(false);
        fetchAliases();
    } catch {
        toast.error('Failed to save mail alias');
    }
  };

  const handleDelete = async (id) => {
    try {
        await client.delete(`system/mail-aliases/${id}/`);
        toast.success('Mail alias deleted');
        fetchAliases();
    } catch {
        toast.error('Failed to delete mail alias');
    }
  };

  const filteredData = data.filter(item => 
    (item.alias_name || '').toLowerCase().includes(searchText.toLowerCase()) || 
    (item.alias_model || '').toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <Mail className="text-blue-500" size={28} />
                    Mail Aliases
                </h1>
                <p className="text-slate-500 text-sm mt-1">Manage inbound email addresses and routing rules.</p>
            </div>
            <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-2">
                <Plus size={18} /> New Alias
            </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search aliases or models..." 
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
                            <th className="p-4 font-semibold">Alias Address</th>
                            <th className="p-4 font-semibold">Target Model</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-slate-500">
                                    <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
                                    Loading aliases...
                                </td>
                            </tr>
                        ) : filteredData.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-slate-500">
                                    No aliases found.
                                </td>
                            </tr>
                        ) : (
                            filteredData.map(alias => (
                                <tr key={alias.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-semibold text-blue-600 flex items-center gap-2">
                                        <Mail size={14} className="text-blue-400" />
                                        {alias.alias_name}
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs border border-slate-200 font-mono">
                                            {alias.alias_model}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {alias.is_active ? (
                                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Active</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">Archived</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleEdit(alias)}
                                                className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(alias.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
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
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800">Create Mail Alias</h2>
                    </div>
                    <form onSubmit={handleOk}>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Alias Address *</label>
                                <input 
                                    type="email" 
                                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="e.g. support@yourcompany.com"
                                    value={form.alias_name || ''}
                                    onChange={e => setForm({...form, alias_name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Alias Domain *</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="mail.yourdomain.com"
                                    value={form.alias_domain || ''}
                                    onChange={e => setForm({...form, alias_domain: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Target Model *</label>
                                <select
                                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                                    value={form.alias_model || ''}
                                    onChange={e => setForm({...form, alias_model: e.target.value})}
                                >
                                    <option value="crm.Lead">crm.Lead</option>
                                    <option value="helpdesk.Ticket">helpdesk.Ticket</option>
                                    <option value="hr.Applicant">hr.Applicant</option>
                                    <option value="project.Task">project.Task</option>
                                    <option value="accounting.Invoice">accounting.Invoice</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
                            <button 
                                type="button"
                                onClick={() => setIsModalVisible(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}
