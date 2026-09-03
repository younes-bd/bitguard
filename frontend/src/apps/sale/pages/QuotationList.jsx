import React, { useState, useEffect } from 'react';
import { salesService } from '../api/salesService';

export default function QuotationList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data
    setLoading(false);
  }, []);

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">{page_name}</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-gray-600">This is the {page_name} page.</p>
        {/* Implementation details will go here */}
      </div>
    </div>
  );
}
