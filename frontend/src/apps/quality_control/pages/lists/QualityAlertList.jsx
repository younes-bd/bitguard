import apiClient from '../../../../core/api/client';
import client from '@/core/api/client';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import quality_controlService from '../../api/qualityService';
import { Plus, Search, Edit2, Trash2, LayoutDashboard } from 'lucide-react';

const QualityAlertList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    qualityService.getQualityAlerts ? qualityService.getQualityAlerts().then(res => {
      setData(Array.isArray(res) ? res : res.results || []);
      setLoading(false);
    }) : apiClient.get(`/api/quality_control/qualityalerts/`).then(r => r.data).then(res => {
      setData(Array.isArray(res) ? res : res.results || []);
      setLoading(false);
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      apiClient.delete(`/api/quality_control/qualityalerts/${id}/`).then(() => fetchData());
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center">
          <LayoutDashboard className="w-6 h-6 mr-3 text-slate-500" />
          Quality Alerts
        </h1>
        <button 
          onClick={() => navigate(`/admin/quality_control/qualityalerts/new`)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New QualityAlert
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-medium text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No data found.</td></tr>
              ) : data.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">#{item.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{item.name}</td>
                  <td className="px-6 py-4">{item.state}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => navigate(`/admin/quality_control/qualityalerts/${item.id}`)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QualityAlertList;
