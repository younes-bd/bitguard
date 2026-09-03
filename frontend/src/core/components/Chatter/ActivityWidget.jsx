import React from 'react';
import { Clock, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const ActivityWidget = ({ activities = [] }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
        <Clock className="w-8 h-8 text-gray-400 mb-2" />
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No planned activities</p>
        <button className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
          Schedule Activity
        </button>
      </div>
    );
  }

  const getStatusColor = (date) => {
    const today = new Date();
    const activityDate = new Date(date);
    if (activityDate < today) return 'text-red-600 bg-red-50 dark:bg-red-900/20';
    if (activityDate.toDateString() === today.toDateString()) return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20';
    return 'text-green-600 bg-green-50 dark:bg-green-900/20';
  };

  return (
    <div className="space-y-3">
      {activities.map((activity, idx) => (
        <div key={idx} className="flex items-start p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <div className={`p-2 rounded-full mr-3 ${getStatusColor(activity.deadline)}`}>
            {activity.type === 'call' ? <AlertCircle className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{activity.summary}</h4>
            <p className="text-xs text-gray-500 mt-1">Due: {new Date(activity.deadline).toLocaleDateString()}</p>
          </div>
          <button className="text-gray-400 hover:text-green-500 transition-colors" title="Mark as done">
            <CheckCircle className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ActivityWidget;
