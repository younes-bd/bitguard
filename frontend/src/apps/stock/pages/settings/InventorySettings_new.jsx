import React from 'react';
import { Box, Truck, Map, Layers, Save } from 'lucide-react';
import { useSettings } from '../../../system/hooks/useSettings';
import { toast } from 'react-hot-toast';

const OdooSettingBlock = ({ title, description, checked, onChange, disabled }) => (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-800/30 transition-colors border border-transparent hover:border-slate-800/50">
        <div className="pt-0.5">
            <button 
                type="button"
                onClick={() => !disabled && onChange(!checked)}
                disabled={disabled}
                className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${checked ? 'bg-indigo-600' : 'bg-slate-700'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`} />
            </button>
        </div>
        <div className="flex-1">
            <label className="text-sm font-semibold text-white cursor-pointer block" onClick={() => !disabled && onChange(!checked)}>
                {title}
            </label>
            <p className="text-xs text-slate-400 mt-1">{description}</p>
        </div>
    </div>
);

const InventorySettings = () => {
    const { settings, updateSetting, loading } = useSettings();

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto animate-fade-in">
            <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Box className="text-indigo-500" size={32} />
                        Inventory Settings
                    </h1>
                    <p className="text-slate-400 mt-2">Configure Warehouse, Routes, and Logistics.</p>
                </div>
                <button 
                    onClick={() => toast.success('Settings saved successfully')}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <Save size={16} /> Save Changes
                </button>
            </div>

            <div className="space-y-8">
                {/* Warehouse Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-slate-950/50 p-4 border-b border-slate-800 flex items-center gap-2">
                        <Map size={18} className="text-slate-400" />
                        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Warehouse & Location</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <OdooSettingBlock
                                title="Multi-Warehouse"
                                description="Manage multiple warehouse locations and transfers between them."
                                checked={settings['inventory.multi_warehouse'] === 'true'}
                                onChange={(val) => updateSetting('inventory.multi_warehouse', val)}
                            />
                            <OdooSettingBlock
                                title="Multi-Step Routes"
                                description="Use multi-step routes to process receipts or deliveries."
                                checked={settings['inventory.multi_step_routes'] === 'true'}
                                onChange={(val) => updateSetting('inventory.multi_step_routes', val)}
                            />
                        </div>
                    </div>
                </div>

                {/* Traceability Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-slate-950/50 p-4 border-b border-slate-800 flex items-center gap-2">
                        <Layers size={18} className="text-slate-400" />
                        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Traceability</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <OdooSettingBlock
                                title="Lots & Serial Numbers"
                                description="Track items by lot or serial number for full traceability."
                                checked={settings['inventory.lots_serial'] === 'true'}
                                onChange={(val) => updateSetting('inventory.lots_serial', val)}
                            />
                            <OdooSettingBlock
                                title="Expiration Dates"
                                description="Track expiration dates on lots and serial numbers."
                                checked={settings['inventory.expiration_dates'] === 'true'}
                                onChange={(val) => updateSetting('inventory.expiration_dates', val)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventorySettings;
