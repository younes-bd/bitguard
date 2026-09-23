import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignsService } from '../api/campaignsService';
import { toast } from 'react-hot-toast';
import { Plus, Mail, Calendar, Send } from 'lucide-react';

const CampaignsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await campaignsService.getItems();
      setData(Array.isArray(res.data?.results || res.data) ? (res.data?.results || res.data) : []);
    } catch (e) {
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'draft': return 'bg-slate-800 text-slate-300 border border-slate-700';
      case 'scheduled': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'sending': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'sent': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      default: return 'bg-slate-800 text-slate-400';
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading campaigns...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Campaigns</h1>
          <p className="text-slate-400">Design, schedule, and send email marketing campaigns.</p>
        </div>
        <button 
          onClick={() => navigate('new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-200 font-medium"
        >
          <Plus size={18} />
          Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-slate-900 border border-slate-800 border-dashed rounded-2xl text-slate-500">
            <Mail className="mx-auto h-12 w-12 text-slate-700 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No campaigns yet</h3>
            <p>Get started by creating your first email marketing campaign.</p>
          </div>
        ) : (
          data.map((item) => (
            <div 
              key={item.id} 
              onClick={() => navigate(item.id.toString())}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 cursor-pointer hover:border-slate-700 hover:bg-slate-800/50 transition-all group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">{item.name}</h3>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(item.state)} capitalize`}>
                  {item.state}
                </span>
              </div>
              
              <div className="space-y-3 mb-6">
                <p className="text-sm text-slate-400 line-clamp-2">
                  <span className="text-slate-500 font-medium">Subject:</span> {item.subject || 'No subject set'}
                </p>
                {item.state === 'scheduled' && (
                  <p className="text-sm flex items-center gap-2 text-amber-400/80">
                    <Calendar size={14} /> 
                    {new Date(item.schedule_date).toLocaleDateString()}
                  </p>
                )}
                {item.state === 'sent' && (
                  <p className="text-sm flex items-center gap-2 text-emerald-400/80">
                    <Send size={14} /> 
                    {item.sent_count} recipients
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CampaignsPage;
