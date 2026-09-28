import React, { useState, useEffect } from 'react';
import { Building2, DollarSign, Plus, Edit2, Trash2 } from 'lucide-react';
import { currencyService } from '../../../core/api/currencyService';
import { bankAccountService } from '../../../core/api/bankAccountService';
import toast from 'react-hot-toast';

// Dumb Component: Currency Manager
const CurrencyManager = ({ currencies, fetchCurrencies }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-white">Active Currencies</h3>
          <p className="text-sm text-slate-400">Manage global currencies and base rates.</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
          <Plus size={16} />
          <span>Add Currency</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-950/50">
            <tr>
              <th className="px-6 py-4 text-sm font-medium text-slate-400">Currency</th>
              <th className="px-6 py-4 text-sm font-medium text-slate-400">Code</th>
              <th className="px-6 py-4 text-sm font-medium text-slate-400">Status</th>
              <th className="px-6 py-4 text-sm font-medium text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {currencies.map((currency) => (
              <tr key={currency.id} className="hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                      {currency.symbol}
                    </div>
                    <span className="font-medium text-white">{currency.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-300">{currency.code}</td>
                <td className="px-6 py-4">
                  {currency.is_base_currency ? (
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-xs">Base</span>
                  ) : (
                    <span className="px-2 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded text-xs">Active</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3 text-slate-400">
                    <button className="hover:text-white transition-colors"><Edit2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {currencies.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                  No currencies configured.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Dumb Component: Bank Account Manager
const BankAccountManager = ({ bankAccounts, fetchBankAccounts }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-white">Bank Accounts</h3>
          <p className="text-sm text-slate-400">Configure global checking and payroll accounts.</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
          <Plus size={16} />
          <span>Add Account</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-950/50">
            <tr>
              <th className="px-6 py-4 text-sm font-medium text-slate-400">Bank & Account</th>
              <th className="px-6 py-4 text-sm font-medium text-slate-400">Balance</th>
              <th className="px-6 py-4 text-sm font-medium text-slate-400">Status</th>
              <th className="px-6 py-4 text-sm font-medium text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {bankAccounts.map((account) => (
              <tr key={account.id} className="hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-white">{account.name}</span>
                    <span className="text-sm text-slate-500">{account.account_number}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {account.current_balance} {account.currency}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-xs">Connected</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3 text-slate-400">
                    <button className="hover:text-white transition-colors"><Edit2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {bankAccounts.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                  No bank accounts connected.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Smart Container: Financial Settings Page
export default function FinancialSettingsPage() {
  const [activeTab, setActiveTab] = useState('currencies');
  const [currencies, setCurrencies] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMasterData = async () => {
    setIsLoading(true);
    // Rule: Parallel Data Fetching (The Promise.all Law) with catch handlers
    await Promise.allSettled([
      currencyService.getAll().then(res => setCurrencies(res.data.results || res.data)),
      bankAccountService.getAll().then(res => setBankAccounts(res.data.results || res.data))
    ]).catch(err => {
      console.error(err);
      toast.error('Failed to load some financial settings');
    });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-white">Financial & Banking</h1>
        <p className="mt-2 text-slate-400">Manage foundational financial data and company localized currency defaults.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('currencies')}
          className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'currencies'
              ? 'text-blue-400 border-blue-500 bg-blue-500/5'
              : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <DollarSign size={18} />
          <span>Currencies</span>
        </button>
        <button
          onClick={() => setActiveTab('banks')}
          className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'banks'
              ? 'text-blue-400 border-blue-500 bg-blue-500/5'
              : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Building2 size={18} />
          <span>Bank Accounts</span>
        </button>
      </div>

      {/* Content */}
      <div className="animate-in fade-in duration-300">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 'currencies' && (
              <CurrencyManager currencies={currencies} fetchCurrencies={fetchMasterData} />
            )}
            {activeTab === 'banks' && (
              <BankAccountManager bankAccounts={bankAccounts} fetchBankAccounts={fetchMasterData} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
