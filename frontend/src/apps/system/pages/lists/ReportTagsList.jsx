import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Tag } from 'lucide-react';
import client from '@/core/api/client';
import toast from 'react-hot-toast';

export default function ReportTagsList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  const [form, setForm] = useState({
      name: '',
      color: '#000000',
      active: true
  });

  const fetchTags = async () => {
      setLoading(true);
      try {
          const res = await client.get('system/report-tags/');
          setData(res.data.results || res.data);
      } catch {
          toast.error('Failed to load report tags');
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchTags();
  }, []);

  const handleAdd = () => {
    setForm({ name: '', color: '#000000', active: true });
    setIsModalVisible(true);
  };

  const handleEdit = (tag) => {
    setForm(tag);
    setIsModalVisible(true);
  };

  const handleOk = async (e) => {
    e.preventDefault();
    if (!form.name || !form.color) {
        toast.error('Please fill in all required fields');
        return;
    }
    try {
        if (form.id) {
            await client.patch(`system/report-tags/${form.id}/`, form);
            toast.success('Report tag updated successfully');
        } else {
            await client.post('system/report-tags/', form);
            toast.success('Report tag added successfully');
        }
        setIsModalVisible(false);
        fetchTags();
    } catch {
        toast.error('Failed to save report tag');
    }
  };

  const handleDelete = async (id) => {
    try {
        await client.delete(`system/report-tags/${id}/`);
        toast.success('Report tag deleted');
        fetchTags();
    } catch {
        toast.error('Failed to delete report tag');
    }
  };

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <Tag className="text-blue-500" size={28} />
                    Report Tags
                </h1>
                <p className="text-slate-500 text-sm mt-1">Manage report tags for financial and analytical reports.</p>
            </div>
            <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-2">
                <Plus size={18} /> New Tag
            </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search tags..." 
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
                            <th className="p-4 font-semibold">Tag Name</th>
                            <th className="p-4 font-semibold">Color</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-slate-500">
                                    <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
                                    Loading tags...
                                </td>
                            </tr>
                        ) : filteredData.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-slate-500">
                                    No tags found.
                                </td>
                            </tr>
                        ) : (
                            filteredData.map(tag => (
                                <tr key={tag.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-semibold text-blue-600">{tag.name}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium" style={{ backgroundColor: tag.color + '33', color: tag.color }}>
                                            {tag.color}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {tag.active ? (
                                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Active</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">Archived</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleEdit(tag)}
                                                className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(tag.id)}
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
                        <h2 className="text-lg font-bold text-slate-800">Create Report Tag</h2>
                    </div>
                    <form onSubmit={handleOk}>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tag Name *</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="e.g. Operating Activities"
                                    value={form.name}
                                    onChange={e => setForm({...form, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Color *</label>
                                <input 
                                    type="color" 
                                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-10"
                                    value={form.color}
                                    onChange={e => setForm({...form, color: e.target.value})}
                                />
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
