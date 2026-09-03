import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Repeat, Plus, Play, Pause, Calendar, Building2, Search, Zap } from 'lucide-react';
import { accountingService } from '../../api/accountingService';
import { crmService } from '../../../crm/api/crmService';
import { toast } from 'react-hot-toast';

const RecurringInvoices = () => {
    const navigate = useNavigate();
    const [schedules, setSchedules] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        client: '',
        frequency: 'monthly',
        next_run: new Date().toISOString().split('T')[0],
        notes: '',
        items: [
            { description: '', quantity: 1, unit_price: 0, tax_rate: 0 }
        ]
    });

    const fetchData = async () => {
        try {
            const [schedulesData, clientsData] = await Promise.all([
                accountingService.getRecurringInvoices(),
                crmService.getClients()
            ]);
            setSchedules(schedulesData || []);
            setClients(clientsData || []);
        } catch (err) {
            console.error("Failed to load data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await accountingService.createRecurringInvoice(formData);
            toast.success("Recurring schedule created successfully!");
            setShowModal(false);
            setFormData({
                name: '',
                client: '',
                frequency: 'monthly',
                next_run: new Date().toISOString().split('T')[0],
                notes: '',
                items: [{ description: '', quantity: 1, unit_price: 0, tax_rate: 0 }]
            });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create schedule");
        } finally {
            setSaving(false);
        }
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { description: '', quantity: 1, unit_price: 0, tax_rate: 0 }]
        });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData({ ...formData, items: newItems });
    };

    const handleToggle = async (id) => {
        try {
            await accountingService.toggleRecurring(id);
            toast.success('Schedule status updated');
            fetchSchedules();
        } catch (err) {
            toast.error('Failed to update schedule');
        }
    };

    const handleRunNow = async (id) => {
        try {
            await accountingService.runRecurringNow(id);
            toast.success('Invoice generated successfully from schedule');
            // We could navigate to the newly created invoice if the backend returns it
        } catch (err) {
            toast.error('Failed to generate invoice');
        }
    };

    const filtered = schedules.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Repeat className="text-purple-500" />
                        Recurring Invoices
                    </h1>
                    <p className="text-sm text-slate-400">Manage automated billing schedules for retainers and subscriptions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-500 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search schedules..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 text-white w-64 transition-all"
                        />
                    </div>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20"
                    >
                        <Plus size={18} />
                        <span>New Schedule</span>
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((schedule) => (
                    <div key={schedule.id} className="glass-panel rounded-2xl border border-slate-800 p-6 flex flex-col relative overflow-hidden group">
                        {/* Status Bar */}
                        <div className={`absolute top-0 left-0 w-full h-1 ${schedule.is_active ? 'bg-purple-500' : 'bg-slate-600'}`} />
                        
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">{schedule.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                                    <Building2 size={14} /> {schedule.client_name}
                                </div>
                            </div>
                            <button 
                                onClick={() => handleToggle(schedule.id)}
                                className={`p-2 rounded-lg transition-colors ${
                                    schedule.is_active 
                                    ? 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20' 
                                    : 'bg-slate-800 text-slate-500 hover:text-white hover:bg-slate-700'
                                }`}
                                title={schedule.is_active ? "Pause Schedule" : "Activate Schedule"}
                            >
                                {schedule.is_active ? <Pause size={18} /> : <Play size={18} />}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 my-6">
                            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Frequency</div>
                                <div className="text-sm font-bold text-white capitalize">{schedule.frequency}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Next Run</div>
                                <div className="text-sm font-bold text-white flex items-center gap-1">
                                    <Calendar size={14} className="text-purple-400" />
                                    {schedule.next_run}
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between items-center">
                            <div className="text-xs font-bold px-2 py-1 rounded bg-slate-800 text-slate-400">
                                {schedule.is_active ? 'Active' : 'Paused'}
                            </div>
                            <button 
                                onClick={() => handleRunNow(schedule.id)}
                                className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                            >
                                <Zap size={14} /> Force Run Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 flex flex-col items-center">
                    <div className="p-4 rounded-full bg-slate-900 border border-slate-800 text-slate-500 mb-4">
                        <Repeat size={48} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">No Recurring Invoices</h3>
                    <p className="text-slate-400 max-w-md mx-auto mb-6">Automate your billing cycle for retainers and subscriptions.</p>
                </div>
            )}

            {/* Recurring Template Creation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">New Recurring Schedule</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Schedule Name</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. Monthly SEO Retainer"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Client / Vendor</label>
                                        <select
                                            required
                                            value={formData.client}
                                            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 outline-none appearance-none"
                                        >
                                            <option value="">Select...</option>
                                            {clients.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Frequency</label>
                                            <select
                                                value={formData.frequency}
                                                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 outline-none appearance-none"
                                            >
                                                <option value="weekly">Weekly</option>
                                                <option value="monthly">Monthly</option>
                                                <option value="quarterly">Quarterly</option>
                                                <option value="annually">Annually</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Next Run Date</label>
                                            <input
                                                required
                                                type="date"
                                                value={formData.next_run}
                                                onChange={(e) => setFormData({ ...formData, next_run: e.target.value })}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Notes</label>
                                        <input
                                            type="text"
                                            placeholder="Notes for generated invoices"
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Template Line Items</h3>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-500/10 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <Plus size={14} /> Add Item
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {formData.items.map((item, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-3 items-end bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                                            <div className="col-span-5">
                                                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Description</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={item.description}
                                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Qty</label>
                                                <input
                                                    required
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none text-center"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Price</label>
                                                <input
                                                    required
                                                    type="number"
                                                    value={item.unit_price}
                                                    onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none text-right"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Tax %</label>
                                                <input
                                                    type="number"
                                                    value={item.tax_rate}
                                                    onChange={(e) => handleItemChange(index, 'tax_rate', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none text-center"
                                                />
                                            </div>
                                            <div className="col-span-1 text-center pb-2">
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    className="text-slate-500 hover:text-rose-500 transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 transition-colors disabled:opacity-50"
                                >
                                    {saving ? 'Creating...' : 'Create Schedule'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecurringInvoices;
