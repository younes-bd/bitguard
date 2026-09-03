import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Users, Plus, LayoutDashboard } from 'lucide-react';
import { planningService } from '../../api/planningService';

const PlanningDashboard = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await planningService.getShifts();
        let shiftsData = [];
        if (Array.isArray(response)) {
          shiftsData = response;
        } else if (response && Array.isArray(response.results)) {
          shiftsData = response.results;
        } else if (response && Array.isArray(response.data)) {
          shiftsData = response.data;
        }
        setShifts(shiftsData);
      } catch (error) {
        console.error('Error fetching shifts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShifts();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300">
            Planning
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Manage employee schedules, shifts, and resource planning.
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 font-medium">
          <Plus className="w-5 h-5 mr-2" />
          New Shift
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
              <CalendarIcon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Total Shifts</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">{shifts.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl">
              <Clock className="w-6 h-6 text-amber-500 dark:text-amber-400" />
            </div>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Open Shifts</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">
            {shifts.filter(s => !s.assigned_to).length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
              <Users className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
            </div>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Assigned Resources</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">
            {new Set(shifts.filter(s => s.assigned_to).map(s => s.assigned_to)).size}
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Upcoming Shifts</h2>
        </div>
        <div className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading shifts...</div>
          ) : shifts.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <LayoutDashboard className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">No shifts scheduled</h3>
              <p className="text-slate-500 mt-2">Publish your first shift to get started.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="p-4 font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">Title</th>
                  <th className="p-4 font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">Time</th>
                  <th className="p-4 font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">Assigned To</th>
                  <th className="p-4 font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">Status</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map(shift => (
                  <tr key={shift.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{shift.title || 'Shift'}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {shift.start_time ? new Date(shift.start_time).toLocaleString() : 'TBD'}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {shift.assigned_to ? `User ${shift.assigned_to}` : <span className="text-amber-500 text-sm">Open</span>}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${shift.status === 'published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                        {shift.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
};

export default PlanningDashboard;
