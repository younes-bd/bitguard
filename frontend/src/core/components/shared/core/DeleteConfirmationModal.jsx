import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, itemParams }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-w-sm w-full animate-fade-in-up">
                <div className="p-6 text-center">
                    <div className="bg-red-500/10 text-red-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle size={32} />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{title || 'Confirm Deletion'}</h3>
                    <p className="text-slate-400 text-sm mb-6">
                        {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
                        {itemParams && <span className="block mt-2 font-mono text-xs bg-slate-900 p-1 rounded">{itemParams}</span>}
                    </p>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold shadow-lg shadow-red-600/20 transition-all hover:scale-105"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
