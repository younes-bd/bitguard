import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import payrollService from '../../api/payrollService';
import { FileText, Plus, Search, Edit2, Trash2 } from 'lucide-react';

const PayslipList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    payrollService.getPayslips().then(res => {
      setData(Array.isArray(res) ? res : res.results || []);
      setLoading(false);
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      payrollService.deletePayslip(id).then(() => fetchData());
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center">
          <FileText className="w-6 h-6 mr-3 text-slate-500" />
          Payslips
        </h1>
        <button 
          onClick={() => navigate(`/admin/payroll/payslips/new`)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Payslip
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-medium text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Employee ID</th>
                <th className="px-6 py-3">Period</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No payslips found.</td></tr>
              ) : data.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">#{item.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">Employee #{item.employee}</td>
                  <td className="px-6 py-4">Period #{item.period}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                      item.status === 'draft' ? 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => navigate(`/admin/payroll/payslips/${item.id}`)}
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

export default PayslipList;
