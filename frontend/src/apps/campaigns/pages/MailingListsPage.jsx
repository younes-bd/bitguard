import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignsService } from '../api/campaignsService';
import { toast } from 'react-hot-toast';
import { Plus, List, Users } from 'lucide-react';

const MailingListsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    campaignsService.getLists()
      .then(res => setData(Array.isArray(res.data?.results || res.data) ? (res.data?.results || res.data) : []))
      .catch(e => toast.error('Failed to load mailing lists'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-slate-400">Loading mailing lists...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mailing Lists</h1>
          <p className="text-slate-400">Manage your subscription lists and audiences.</p>
        </div>
        <button 
          onClick={() => navigate('new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-500/20 transition-all font-medium"
        >
          <Plus size={18} />
          Create List
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-slate-900 border border-slate-800 border-dashed rounded-2xl text-slate-500">
            <List className="mx-auto h-12 w-12 text-slate-700 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No lists found</h3>
            <p>Create your first mailing list to start collecting subscribers.</p>
          </div>
        ) : (
          data.map((item) => (
            <div 
              key={item.id} 
              onClick={() => navigate(item.id.toString())}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 cursor-pointer hover:border-slate-700 hover:bg-slate-800/50 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">{item.name}</h3>
                {!item.active && (
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-800 text-slate-400">
                    Archived
                  </span>
                )}
              </div>
              <div className="space-y-3">
                <p className="text-sm flex items-center gap-2 text-slate-400">
                  <Users size={16} /> 
                  {item.contact_count || 0} Contacts
                </p>
                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${item.is_public ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {item.is_public ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MailingListsPage;
