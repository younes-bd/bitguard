import React, { useState, useEffect } from 'react';
import client from '@/core/api/client';
import { toast } from 'react-hot-toast';

const CourseCatalogPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    client.get('/elearning/')
      .then(res => setData(res.data.results || res.data))
      .catch(e => {
        const msg = e.response?.data?.detail || 'Failed to load';
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-400">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-bold text-white mb-6">Course Catalog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.length === 0 ? (
          <div className="text-slate-500">No records found.</div>
        ) : (
          data.map((item, i) => (
            <div key={item.id || i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <pre className="text-xs text-slate-300 overflow-hidden">{JSON.stringify(item, null, 2)}</pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseCatalogPage;
