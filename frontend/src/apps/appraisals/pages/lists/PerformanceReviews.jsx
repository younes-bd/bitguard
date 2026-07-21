import React, { useState, useEffect } from 'react';
import DataTable from '../../../../core/components/shared/views/DataTable';
import { hrmService } from '../../../../core/api/hrmService';
import { Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PerformanceReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await hrmService.getPerformanceReviews();
      setReviews(res.results || res || []);
    } catch (err) {
      toast.error('Failed to fetch performance reviews');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'employee', label: 'Employee ID' },
    { key: 'review_period', label: 'Review Period', sortable: true },
    { 
      key: 'overall_rating', 
      label: 'Rating',
      render: (val) => (
        <span className="flex items-center text-amber-400">
          {val || '-'} <Star className="w-4 h-4 ml-1" />
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span className={`text-xs px-2 py-1 rounded-full ${
          val === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
          val === 'in_review' ? 'bg-blue-500/10 text-blue-400' :
          'bg-slate-700/50 text-slate-400'
        }`}>
          {val ? val.replace('_', ' ').toUpperCase() : 'DRAFT'}
        </span>
      )
    },
    { key: 'due_date', label: 'Due Date', render: (val) => val ? new Date(val).toLocaleDateString() : '-' }
  ];

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col bg-slate-950">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Star className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Performance Reviews</h1>
            <p className="text-sm text-slate-400">Employee evaluation and goal tracking</p>
          </div>
        </div>
        <button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium px-4 py-2 rounded-lg transition-colors">
          New Review
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <DataTable 
          columns={columns}
          data={reviews}
          isLoading={loading}
          emptyMessage="No performance reviews found."
        />
      </div>
    </div>
  );
}
