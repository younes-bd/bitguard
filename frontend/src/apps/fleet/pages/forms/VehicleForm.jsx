import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import fleetService from '../../api/fleetService';
import { ArrowLeft, Save } from 'lucide-react';

const VehicleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    license_plate: '',
    state: 'active',
    odometer: 0,
  });

  useEffect(() => {
    if (isEdit) {
      fleetService.getVehicle(id).then(data => {
        setFormData(data);
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = isEdit ? fleetService.updateVehicle(id, formData) : fleetService.createVehicle(formData);
    action.then(() => {
      navigate('/admin/fleet/vehicles');
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/admin/fleet/vehicles')}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            {isEdit ? 'Edit Vehicle' : 'New Vehicle'}
          </h1>
        </div>
        <button 
          onClick={handleSubmit}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Vehicle Name / Model</label>
            <input 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
              placeholder="e.g. Ford Transit"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">License Plate</label>
            <input 
              name="license_plate"
              value={formData.license_plate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
              placeholder="e.g. ABC-123"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
            <select 
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="active">Active</option>
              <option value="in_repair">In Repair</option>
              <option value="retired">Retired</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Odometer</label>
            <input 
              type="number"
              name="odometer"
              value={formData.odometer}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;
