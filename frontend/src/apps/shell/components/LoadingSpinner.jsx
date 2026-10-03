import React from 'react';

export default function LoadingSpinner({ message = "Loading..." }) {
    return (
        <div className="flex flex-col items-center justify-center p-12">
            <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-4" />
            <p className="text-slate-400 font-medium">{message}</p>
        </div>
    );
}
