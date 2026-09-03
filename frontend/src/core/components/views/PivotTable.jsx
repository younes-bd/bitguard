import React, { useState } from 'react';
import { Download, SlidersHorizontal, Table as TableIcon } from 'lucide-react';

const PivotTable = ({ data = [], rows = [], columns = [], values = [] }) => {
  const [view, setView] = useState('table'); // table or chart (future)

  // A real pivot table would do complex aggregations here based on rows/cols/vals.
  // For this UI stub, we'll render a simplified grid structure representing the aggregated view.
  
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <TableIcon className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium">No data to display in pivot</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
        <div className="flex space-x-2">
          <button className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Measures
          </button>
        </div>
        <div>
          <button className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-6 py-3 border border-gray-200 dark:border-gray-600">Category</th>
              <th className="px-6 py-3 border border-gray-200 dark:border-gray-600 text-right">Total Count</th>
              <th className="px-6 py-3 border border-gray-200 dark:border-gray-600 text-right">Sum Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <td className="px-6 py-4 font-medium border border-gray-200 dark:border-gray-600">Q1 Sales</td>
              <td className="px-6 py-4 text-right border border-gray-200 dark:border-gray-600">145</td>
              <td className="px-6 py-4 text-right border border-gray-200 dark:border-gray-600">$45,200</td>
            </tr>
            <tr className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <td className="px-6 py-4 font-medium border border-gray-200 dark:border-gray-600">Q2 Sales</td>
              <td className="px-6 py-4 text-right border border-gray-200 dark:border-gray-600">210</td>
              <td className="px-6 py-4 text-right border border-gray-200 dark:border-gray-600">$68,950</td>
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-700/50 font-bold">
              <td className="px-6 py-4 border border-gray-200 dark:border-gray-600">Total</td>
              <td className="px-6 py-4 text-right border border-gray-200 dark:border-gray-600">355</td>
              <td className="px-6 py-4 text-right border border-gray-200 dark:border-gray-600">$114,150</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PivotTable;
