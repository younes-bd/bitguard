import React from 'react';

const AuthLoader = () => {
    return (
        <div 
            className="fixed inset-0 flex flex-col items-center justify-center bg-slate-950 z-50"
            role="status"
            aria-label="Loading application"
        >
            <div className="relative flex items-center justify-center w-16 h-16">
                <svg className="animate-spin text-blue-500 w-12 h-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
            <p className="mt-4 text-sm font-medium text-slate-400 tracking-wide">
                Verifying session...
            </p>
        </div>
    );
};

export default AuthLoader;
