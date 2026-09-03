import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Settings } from 'lucide-react';
import posService from '../../api/posService';

export default function RestaurantFloorPlan({ config, onTableSelect, onBack }) {
  const [floors, setFloors] = useState([]);
  const [tables, setTables] = useState([]);
  const [activeFloor, setActiveFloor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!config) return;
    
    posService.getFloors({ config: config.id })
      .then(res => {
        const fList = Array.isArray(res) ? res : res.results || [];
        setFloors(fList);
        if (fList.length > 0) setActiveFloor(fList[0]);
      })
      .finally(() => setLoading(false));
  }, [config]);

  useEffect(() => {
    if (!activeFloor) return;
    
    posService.getTables({ floor: activeFloor.id })
      .then(res => {
        const tList = Array.isArray(res) ? res : res.results || [];
        setTables(tList);
      });
  }, [activeFloor]);

  if (loading) {
    return <div className="h-full flex items-center justify-center text-slate-500">Loading Floor Plan...</div>;
  }

  if (floors.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
          <Settings className="w-12 h-12 text-slate-400" />
        </div>
        <p>No floors configured for this restaurant yet.</p>
        <button onClick={onBack} className="px-4 py-2 bg-emerald-500 text-white rounded-lg">Go Back</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-900 overflow-hidden relative">
      {/* Top Navbar */}
      <div className="h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="font-bold text-xl text-emerald-600 dark:text-emerald-400">{config.name} Floor Plan</div>
        </div>
        
        {/* Floor Switcher */}
        <div className="flex space-x-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
          {floors.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFloor(f)}
              className={`px-4 py-1.5 rounded-md font-medium text-sm transition-colors ${activeFloor?.id === f.id ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Floor Canvas */}
      <div 
        className="flex-1 relative overflow-auto" 
        style={{ backgroundColor: activeFloor?.background_color || '#ebecf0' }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        {tables.map(table => (
          <div
            key={table.id}
            onClick={() => onTableSelect(table)}
            className={`absolute flex flex-col items-center justify-center cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all
              ${table.shape === 'round' ? 'rounded-full' : 'rounded-xl'}
              bg-white text-slate-800 border-2 border-emerald-500
            `}
            style={{
              left: table.position_x,
              top: table.position_y,
              width: table.width,
              height: table.height
            }}
          >
            <span className="font-bold text-lg">{table.name}</span>
            <span className="text-xs text-slate-500 font-medium">{table.seats} seats</span>
          </div>
        ))}
      </div>
    </div>
  );
}
