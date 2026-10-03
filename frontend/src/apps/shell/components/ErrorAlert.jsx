import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorAlert({ message }) {
    if (!message) return null;
    return (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-lg flex items-start gap-3">
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
}
