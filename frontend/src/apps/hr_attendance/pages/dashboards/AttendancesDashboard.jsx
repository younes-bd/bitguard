import React from 'react';
import { UserCheck, Clock, Calendar, LogIn, LogOut } from 'lucide-react';

const HrAttendanceDashboard = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-400 dark:from-orange-400 dark:to-orange-300">
            HrAttendance
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Manage employee time tracking and presence.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 dark:bg-orange-500/10 rounded-xl">
                <LogIn className="w-6 h-6 text-orange-500 dark:text-orange-400" />
              </div>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Check In</h3>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">Start Work</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 dark:bg-orange-500/10 rounded-xl">
                <LogOut className="w-6 h-6 text-orange-500 dark:text-orange-400" />
              </div>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Check Out</h3>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">End Work</p>
          </div>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl h-96 flex items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-900/20"></div>
        <div className="relative text-center space-y-4 max-w-md px-6">
          <div className="w-20 h-20 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
            <UserCheck className="w-10 h-10 text-orange-500 dark:text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Workspace Ready</h2>
          <p className="text-slate-500 dark:text-slate-400">
            This module has been structurally wired to the Django backend. You can now build out the data tables and forms for HrAttendance.
          </p>
        </div>
      </div>

    </div>
  );
};

export default HrAttendanceDashboard;
