import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignsService } from '../api/campaignsService';
import { toast } from 'react-hot-toast';
import { Plus, Users } from 'lucide-react';

const MailingContactsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    campaignsService.getContacts()
      .then(res => setData(Array.isArray(res.data?.results || res.data) ? (res.data?.results || res.data) : []))
      .catch(e => toast.error('Failed to load contacts'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-slate-400">Loading contacts...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mailing Contacts</h1>
          <p className="text-slate-400">Manage individual contacts and subscribers.</p>
        </div>
        <button 
          onClick={() => navigate('new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-500/20 transition-all font-medium"
        >
          <Plus size={18} />
          Create Contact
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {data.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <Users className="mx-auto h-12 w-12 text-slate-700 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No contacts found</h3>
            <p>Add subscribers to your mailing lists manually or via import.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950/50 text-slate-300 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data.map((contact) => (
                <tr 
                  key={contact.id} 
                  onClick={() => navigate(contact.id.toString())}
                  className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 text-white font-medium">{contact.email}</td>
                  <td className="px-6 py-4">{contact.name || '-'}</td>
                  <td className="px-6 py-4">
                    {contact.opt_out ? (
                      <span className="px-2 py-1 rounded bg-red-500/10 text-red-500 text-xs font-medium">Opted Out</span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-xs font-medium">Subscribed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MailingContactsPage;
