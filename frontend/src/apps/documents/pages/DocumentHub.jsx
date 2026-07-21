import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Receipt, FileCheck, Truck, ShoppingCart,
  FileMinus, Plus, ArrowRight, TrendingUp, Clock, AlertCircle
} from 'lucide-react';
import { erpService } from '../../../core/api/erpService';

const documentTypes = [
  {
    id: 'invoices',
    label: 'Facture',
    sublabel: 'Invoice',
    description: 'Bill clients for services rendered. The core revenue document.',
    icon: FileText,
    color: 'blue',
    gradient: 'from-blue-600/20 to-blue-500/5',
    border: 'border-blue-500/30',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    listPath: '/admin/accounting/invoices',
    createPath: '/admin/accounting/invoices/create',
    accentColor: '#3b82f6',
  },
  {
    id: 'quotations',
    label: 'Devis',
    sublabel: 'Quotation',
    description: 'Send price estimates to prospects. Convert accepted quotes to invoices.',
    icon: FileCheck,
    color: 'purple',
    gradient: 'from-purple-600/20 to-purple-500/5',
    border: 'border-purple-500/30',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
    listPath: '/admin/sales/quotations',
    createPath: '/admin/sales/quotations/create',
    accentColor: '#a855f7',
  },
  {
    id: 'receipts',
    label: 'Reçu',
    sublabel: 'Receipt',
    description: 'Official proof of payment issued to clients after payment received.',
    icon: Receipt,
    color: 'emerald',
    gradient: 'from-emerald-600/20 to-emerald-500/5',
    border: 'border-emerald-500/30',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    listPath: '/admin/accounting/receipts',
    createPath: '/admin/accounting/receipts/create',
    accentColor: '#10b981',
  },
  {
    id: 'proformas',
    label: 'Facture Proforma',
    sublabel: 'Proforma Invoice',
    description: 'Pre-invoice sent before work begins. Not a legal tax document.',
    icon: FileText,
    color: 'orange',
    gradient: 'from-orange-600/20 to-orange-500/5',
    border: 'border-orange-500/30',
    iconBg: 'bg-orange-500/20',
    iconColor: 'text-orange-400',
    listPath: '/admin/accounting/invoices?type=proforma',
    createPath: '/admin/accounting/invoices/create?type=proforma',
    accentColor: '#f97316',
  },
  {
    id: 'delivery',
    label: 'Bon de Livraison',
    sublabel: 'Delivery Note',
    description: 'Confirms delivery of goods or services to the client.',
    icon: Truck,
    color: 'cyan',
    gradient: 'from-cyan-600/20 to-cyan-500/5',
    border: 'border-cyan-500/30',
    iconBg: 'bg-cyan-500/20',
    iconColor: 'text-cyan-400',
    listPath: '/admin/inventory/deliveries',
    createPath: '/admin/inventory/deliveries/create',
    accentColor: '#06b6d4',
  },
  {
    id: 'purchase-orders',
    label: 'Bon de Commande',
    sublabel: 'Purchase Order',
    description: 'Formal order sent to your vendors/suppliers for goods or services.',
    icon: ShoppingCart,
    color: 'yellow',
    gradient: 'from-yellow-600/20 to-yellow-500/5',
    border: 'border-yellow-500/30',
    iconBg: 'bg-yellow-500/20',
    iconColor: 'text-yellow-400',
    listPath: '/admin/purchase/orders',
    createPath: '/admin/purchase/orders/create',
    accentColor: '#eab308',
  },
  {
    id: 'credit-notes',
    label: 'Avoir',
    sublabel: 'Credit Note',
    description: 'Issue credits to clients for refunds, billing errors, or returned services.',
    icon: FileMinus,
    color: 'red',
    gradient: 'from-red-600/20 to-red-500/5',
    border: 'border-red-500/30',
    iconBg: 'bg-red-500/20',
    iconColor: 'text-red-400',
    listPath: '/admin/accounting/credit-notes',
    createPath: '/admin/accounting/credit-notes/create',
    accentColor: '#ef4444',
  },
];

const DocumentHub = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total_invoices: 0, outstanding: 0, overdue_count: 0 });

  useEffect(() => {
    erpService.getDashboardStats().then(data => {
      if (data) setStats(data);
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
          <FileText size={12} className="text-blue-400" />
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Document Center</span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">Business Documents</h1>
        <p className="text-slate-400 mt-2 text-lg">All your company documents in one place. Professional. Fast. Enterprise-grade.</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl"><TrendingUp size={22} className="text-blue-400" /></div>
          <div>
            <div className="text-2xl font-black text-white">{stats.total_invoices || 0}</div>
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Invoices</div>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 flex items-center gap-4">
          <div className="p-3 bg-orange-500/10 rounded-xl"><Clock size={22} className="text-orange-400" /></div>
          <div>
            <div className="text-2xl font-black text-white">${(stats.total_outstanding || 0).toLocaleString()}</div>
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Outstanding A/R</div>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-xl"><AlertCircle size={22} className="text-red-400" /></div>
          <div>
            <div className="text-2xl font-black text-white">{stats.overdue_count || 0}</div>
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Overdue</div>
          </div>
        </div>
      </div>

      {/* Document Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {documentTypes.map((doc) => {
          const Icon = doc.icon;
          return (
            <div
              key={doc.id}
              className={`glass-panel rounded-3xl border ${doc.border} bg-gradient-to-br ${doc.gradient} p-8 flex flex-col gap-6 group hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden`}
              style={{ boxShadow: `0 0 40px -15px ${doc.accentColor}40` }}
            >
              {/* Background decoration */}
              <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon size={120} />
              </div>

              <div className="flex items-start justify-between relative z-10">
                <div className={`p-3 ${doc.iconBg} rounded-2xl`}>
                  <Icon size={24} className={doc.iconColor} />
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(doc.createPath); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${doc.iconBg} ${doc.iconColor} border ${doc.border} hover:opacity-80 transition-all`}
                >
                  <Plus size={12} /> New
                </button>
              </div>

              <div className="relative z-10" onClick={() => navigate(doc.listPath)}>
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="text-2xl font-black text-white">{doc.label}</h3>
                </div>
                <div className={`text-xs font-bold uppercase tracking-widest ${doc.iconColor} mb-3`}>{doc.sublabel}</div>
                <p className="text-sm text-slate-400 leading-relaxed">{doc.description}</p>
              </div>

              <div className="flex items-center justify-between relative z-10">
                <button
                  onClick={() => navigate(doc.listPath)}
                  className={`flex items-center gap-2 text-sm font-bold ${doc.iconColor} hover:gap-3 transition-all group/btn`}
                >
                  View All
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentHub;
