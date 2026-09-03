import React from 'react';
import { ShoppingBag, FileText, CreditCard } from 'lucide-react';
import { useSettings } from '../../../system/hooks/useSettings';

const Card = ({ children, className }) => <div className={`border rounded-xl shadow-sm ${className}`}>{children}</div>;
const CardHeader = ({ children }) => <div className="p-6 border-b border-slate-800">{children}</div>;
const CardTitle = ({ children, className }) => <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
const CardContent = ({ children, className }) => <div className={`p-6 ${className}`}>{children}</div>;
const Label = ({ children, className }) => <label className={`font-medium ${className}`}>{children}</label>;
const Button = ({ children, className, ...props }) => <button className={`px-4 py-2 rounded-xl font-bold transition-colors ${className}`} {...props}>{children}</button>;

const Switch = ({ checked, onCheckedChange, disabled }) => (
    <button 
        type="button"
        onClick={() => !disabled && onCheckedChange(!checked)}
        disabled={disabled}
        className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-emerald-600' : 'bg-slate-700'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
);


const SettingRow = ({ title, description, children }) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
        <div className="space-y-0.5 pr-8">
            <Label className="text-base text-white">{title}</Label>
            <p className="text-sm text-slate-400">{description}</p>
        </div>
        <div>
            {children}
        </div>
    </div>
);

const SalesSettings = () => {
    const { settings, updateSetting, loading } = useSettings();

    const settingRows = [
        { key: 'sales_online_signature', label: 'Online Signatures', desc: 'Allow customers to sign quotations online.' },
        { key: 'sales_online_payment', label: 'Online Payments', desc: 'Allow customers to pay quotations online.' },
        { key: 'sales_lock_confirmed_orders', label: 'Lock Confirmed Orders', desc: 'No longer edit orders once confirmed.' },
        { key: 'sales_quotation_validity_days', label: 'Quotation Validity', desc: 'Default validity days for quotations (number).' },
        { key: 'sales_send_invoice_auto', label: 'Auto Send Invoice', desc: 'Send invoice automatically when payment is confirmed.' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto animate-fade-in-up">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Oswald'] uppercase mb-2">Sales Settings</h1>
                    <p className="text-slate-400">Configure Quotations, Pricing, and Invoicing</p>
                </div>
            </div>

            <div className="grid gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <ShoppingBag size={18} className="text-blue-500" />
                            General Sales Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {settingRows.map(row => (
                            <SettingRow key={row.key} title={row.label} description={row.desc}>
                                <Switch
                                    checked={settings[row.key] === 'true'}
                                    onCheckedChange={(val) => updateSetting(row.key, val)}
                                    disabled={loading}
                                />
                            </SettingRow>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SalesSettings;
