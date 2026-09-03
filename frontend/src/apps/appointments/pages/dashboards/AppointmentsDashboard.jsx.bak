import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, Users, Settings, Plus, Activity } from 'lucide-react';
import api from '../../../../core/api/client';

const AppointmentsDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/api/appointments/appointments/');
        setAppointments(response.data.results || response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-rose-400 dark:from-rose-400 dark:to-rose-300">
            Appointments
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Manage your schedule and resources.
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all font-medium">
            <Settings className="w-5 h-5 mr-2" />
            Types & Resources
          </button>
          <button className="flex items-center px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-lg shadow-rose-500/30 transition-all hover:scale-105 active:scale-95 font-medium">
            <Plus className="w-5 h-5 mr-2" />
            New Appointment
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-rose-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 rounded-xl">
              <Calendar className="w-6 h-6 text-rose-500 dark:text-rose-400" />
            </div>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Total Appointments</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">{appointments.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
              <Users className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
            </div>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Upcoming Today</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">0</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
              <Activity className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Completion Rate</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">100%</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Recent Appointments</h2>
        </div>
        <div className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">No appointments yet</h3>
              <p className="text-slate-500 mt-2">Create your first appointment to get started.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="p-4 font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">Title</th>
                  <th className="p-4 font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">Date & Time</th>
                  <th className="p-4 font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">Location</th>
                  <th className="p-4 font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{apt.title || 'Untitled'}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {apt.scheduled_time ? new Date(apt.scheduled_time).toLocaleString() : 'Not scheduled'}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{apt.location || '-'}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-medium capitalize">
                        {apt.status}
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

export default AppointmentsDashboard;
